import { createClient } from '@/lib/supabase/server'
import { predictExamScore } from '@/lib/study/score-predictor'
import { DOMAIN_NAMES, EXAM_PASS_SCORE } from '@/lib/study/constants'
import type { DomainId, DomainProgress, TopicProgress } from '@/types/study'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const [
    { data: profile },
    { data: studyProfile },
    { data: domainProgress },
    { data: topicProgress },
    { data: recentExams },
  ] = await Promise.all([
    supabase.from('profiles').select('full_name, email').eq('id', user.id).single(),
    supabase.from('user_study_profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('domain_progress').select('*').eq('user_id', user.id),
    supabase.from('topic_progress').select('*').eq('user_id', user.id).order('accuracy', { ascending: true }),
    supabase.from('mock_exams').select('score, correct_count, total_questions, completed_at')
      .eq('user_id', user.id).eq('status', 'completed').order('completed_at', { ascending: false }).limit(5),
  ])

  const dp = (domainProgress ?? []) as DomainProgress[]
  const tp = (topicProgress ?? []) as TopicProgress[]
  const prediction = dp.length > 0 ? predictExamScore(dp) : null
  const weakTopics = tp.filter((t) => t.is_weak)
  const strongTopics = tp.filter((t) => t.accuracy >= 0.8 && t.questions_seen >= 5)

  const domains: DomainId[] = ['secure', 'resilient', 'performant', 'cost']
  const generatedAt = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CertForge Exam Readiness Report</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
  h1 { font-size: 24px; margin-bottom: 4px; }
  h2 { font-size: 18px; margin: 28px 0 12px; padding-bottom: 6px; border-bottom: 2px solid #e2e8f0; }
  .subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 16px 0; }
  .stat-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; }
  .stat-value { font-size: 28px; font-weight: 700; }
  .stat-label { font-size: 12px; color: #64748b; margin-top: 4px; }
  .domain-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
  .domain-name { flex: 1; font-size: 14px; }
  .domain-bar { width: 200px; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; }
  .domain-fill { height: 100%; border-radius: 4px; }
  .domain-pct { width: 48px; text-align: right; font-size: 14px; font-weight: 600; font-family: monospace; }
  .topic-list { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0; }
  .topic-tag { padding: 4px 10px; border-radius: 6px; font-size: 12px; }
  .weak { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .strong { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
  .exam-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  .exam-table th, .exam-table td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
  .exam-table th { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; }
  .pass { color: #16a34a; font-weight: 600; }
  .fail { color: #dc2626; font-weight: 600; }
  .prediction-box { text-align: center; padding: 24px; border: 2px solid #e2e8f0; border-radius: 12px; margin: 16px 0; }
  .prediction-score { font-size: 48px; font-weight: 800; }
  .prediction-pass { font-size: 14px; margin-top: 8px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
  @media print {
    body { padding: 20px; }
    .no-print { display: none; }
  }
</style>
</head>
<body>
<div class="no-print" style="margin-bottom:20px;text-align:center">
  <button onclick="window.print()" style="padding:10px 24px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600">
    Download as PDF
  </button>
</div>

<h1>AWS SAA-C03 Exam Readiness Report</h1>
<p class="subtitle">${profile?.full_name || profile?.email || 'Student'} &bull; Generated ${generatedAt}</p>

${prediction ? `
<div class="prediction-box">
  <div class="prediction-score" style="color:${prediction.predicted_score >= EXAM_PASS_SCORE ? '#16a34a' : '#dc2626'}">${prediction.predicted_score}</div>
  <div>Predicted Score (${EXAM_PASS_SCORE} to pass)</div>
  <div class="prediction-pass" style="color:${prediction.pass_likelihood === 'likely' ? '#16a34a' : prediction.pass_likelihood === 'possible' ? '#ca8a04' : '#dc2626'}">
    ${prediction.pass_likelihood === 'likely' ? 'Likely to Pass' : prediction.pass_likelihood === 'possible' ? 'Possible Pass' : 'Needs More Preparation'}
  </div>
  <div style="font-size:12px;color:#94a3b8;margin-top:4px">Confidence: ${Math.round(prediction.confidence * 100)}%</div>
</div>
` : ''}

<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-value">${studyProfile?.total_questions_answered ?? 0}</div>
    <div class="stat-label">Questions Practiced</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">${studyProfile?.total_study_minutes ?? 0}</div>
    <div class="stat-label">Minutes Studied</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">${studyProfile?.study_streak ?? 0}</div>
    <div class="stat-label">Day Streak</div>
  </div>
  <div class="stat-card">
    <div class="stat-value">${recentExams?.length ?? 0}</div>
    <div class="stat-label">Mock Exams Taken</div>
  </div>
</div>

<h2>Domain Breakdown</h2>
${domains.map((id) => {
  const p = dp.find((d) => d.domain_id === id)
  const acc = Math.round((p?.accuracy ?? 0) * 100)
  const color = acc >= 80 ? '#16a34a' : acc >= 60 ? '#ca8a04' : '#dc2626'
  return `<div class="domain-row">
    <span class="domain-name">${DOMAIN_NAMES[id]}</span>
    <span style="font-size:12px;color:#94a3b8">${p?.questions_seen ?? 0} questions</span>
    <div class="domain-bar"><div class="domain-fill" style="width:${acc}%;background:${color}"></div></div>
    <span class="domain-pct">${acc}%</span>
  </div>`
}).join('')}

${weakTopics.length > 0 ? `
<h2>Weak Areas (Need Improvement)</h2>
<div class="topic-list">
${weakTopics.map((t) => `<span class="topic-tag weak">${t.topic_id.replace(/_/g, ' ')} (${Math.round(t.accuracy * 100)}%)</span>`).join('')}
</div>
` : ''}

${strongTopics.length > 0 ? `
<h2>Strong Areas</h2>
<div class="topic-list">
${strongTopics.map((t) => `<span class="topic-tag strong">${t.topic_id.replace(/_/g, ' ')} (${Math.round(t.accuracy * 100)}%)</span>`).join('')}
</div>
` : ''}

${(recentExams ?? []).length > 0 ? `
<h2>Mock Exam History</h2>
<table class="exam-table">
  <thead><tr><th>Date</th><th>Score</th><th>Correct</th><th>Result</th></tr></thead>
  <tbody>
  ${(recentExams ?? []).map((e) => `
    <tr>
      <td>${new Date(e.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
      <td style="font-weight:600;font-family:monospace">${e.score}</td>
      <td>${e.correct_count}/${e.total_questions}</td>
      <td class="${e.score >= EXAM_PASS_SCORE ? 'pass' : 'fail'}">${e.score >= EXAM_PASS_SCORE ? 'PASS' : 'FAIL'}</td>
    </tr>
  `).join('')}
  </tbody>
</table>
` : ''}

<div class="footer">
  CertForge &mdash; AI-Powered AWS SAA-C03 Study Assistant &bull; This report is for personal use only
</div>
</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
