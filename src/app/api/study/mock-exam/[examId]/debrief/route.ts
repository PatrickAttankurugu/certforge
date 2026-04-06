import { streamText, gateway } from 'ai'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkTutorLimit } from '@/lib/study/plan-limits'
import { checkRateLimit } from '@/lib/api/rate-limit'
import { DOMAIN_NAMES } from '@/lib/study/constants'
import type { DomainId, DomainBreakdown, QuestionOption } from '@/types/study'

function buildDebriefPrompt(
  score: number,
  passed: boolean,
  totalQuestions: number,
  correctCount: number,
  domainBreakdown: Record<string, DomainBreakdown>,
  wrongQuestions: { question_text: string; domain_id: DomainId; selected: string[]; correct: string[]; options: QuestionOption[] }[]
): string {
  const domainSummary = (['secure', 'resilient', 'performant', 'cost'] as DomainId[])
    .map((d) => {
      const b = domainBreakdown[d]
      if (!b) return `${DOMAIN_NAMES[d]}: No data`
      return `${DOMAIN_NAMES[d]}: ${b.correct}/${b.total} (${Math.round(b.accuracy * 100)}%)`
    })
    .join('\n')

  const wrongSummary = wrongQuestions.slice(0, 10).map((q, i) => {
    const selectedTexts = q.selected.map(id => q.options.find(o => o.id === id)?.text ?? id).join(', ')
    const correctTexts = q.correct.map(id => q.options.find(o => o.id === id)?.text ?? id).join(', ')
    return `${i + 1}. [${DOMAIN_NAMES[q.domain_id]}] ${q.question_text.slice(0, 150)}...
   Student chose: ${selectedTexts}
   Correct: ${correctTexts}`
  }).join('\n\n')

  return `You are an AWS SAA-C03 exam coach analyzing a student's mock exam results.

RESULTS:
- Score: ${score}/1000 (${passed ? 'PASS' : 'FAIL'}, 720 required)
- Correct: ${correctCount}/${totalQuestions} (${Math.round(correctCount / totalQuestions * 100)}%)

DOMAIN BREAKDOWN:
${domainSummary}

INCORRECT ANSWERS (up to 10):
${wrongSummary || 'None — perfect score!'}

Provide a detailed debrief in this structure:

## Overall Assessment
Brief 2-sentence summary of performance.

## Domain Analysis
For each domain, rate as Strong/Adequate/Weak and give one specific recommendation.

## Error Patterns
Identify 2-3 common patterns in the wrong answers (e.g., "confusing SQS with SNS", "overlooking cost optimization in multi-AZ setups").

## Knowledge Gaps
List specific AWS concepts the student needs to review, ranked by impact.

## Study Recommendations
Provide 3-5 specific, actionable next steps. Be concrete: "Review S3 lifecycle policies" not "Study S3 more".

## Predicted Exam Readiness
Based on this performance, estimate readiness and what score improvement is realistic in the next 1-2 weeks.

Keep the tone encouraging but honest. Use bullet points for readability.`
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  const { examId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rl = checkRateLimit(request, user.id, 'ai')
  if (!rl.allowed) return rl.response

  const usage = await checkTutorLimit(supabase, user.id)
  if (!usage.allowed) return NextResponse.json({ error: usage.message }, { status: 429 })

  // Fetch exam data
  const { data: exam } = await supabase
    .from('mock_exams')
    .select('*')
    .eq('id', examId)
    .eq('user_id', user.id)
    .single()

  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
  if (exam.status !== 'completed') {
    return NextResponse.json({ error: 'Exam not completed yet' }, { status: 400 })
  }

  // Fetch questions for wrong answers
  const questionIds = exam.question_ids as string[]
  const answers = (exam.answers ?? {}) as Record<string, { selected: string[]; time_ms: number }>

  const { data: questions } = await supabase
    .from('questions')
    .select('id, domain_id, question_text, options')
    .in('id', questionIds)

  const questionMap = new Map((questions ?? []).map((q) => [q.id, q]))

  const wrongQuestions = questionIds
    .map((qId) => {
      const q = questionMap.get(qId)
      const a = answers[qId]
      if (!q || !a) return null
      const opts = q.options as QuestionOption[]
      const correctIds = opts.filter((o) => o.is_correct).map((o) => o.id)
      const isCorrect = a.selected.length === correctIds.length && a.selected.every((s) => correctIds.includes(s))
      if (isCorrect) return null
      return {
        question_text: q.question_text,
        domain_id: q.domain_id as DomainId,
        selected: a.selected,
        correct: correctIds,
        options: opts,
      }
    })
    .filter(Boolean) as { question_text: string; domain_id: DomainId; selected: string[]; correct: string[]; options: QuestionOption[] }[]

  const prompt = buildDebriefPrompt(
    exam.score ?? 0,
    !!exam.predicted_pass,
    exam.total_questions,
    exam.correct_count ?? 0,
    (exam.domain_breakdown ?? {}) as Record<string, DomainBreakdown>,
    wrongQuestions
  )

  const result = streamText({
    model: gateway('openai/gpt-5.4-mini'),
    prompt,
    maxOutputTokens: 1500,
  })

  return result.toTextStreamResponse()
}
