import type { DomainId, QuestionOption } from '@/types/study'
import { DOMAIN_NAMES } from './constants'

export function buildExplanationPrompt(
  questionText: string,
  options: QuestionOption[],
  selectedAnswer: string[],
  correctAnswer: string[],
  topicName: string,
  domainId: DomainId
): string {
  const selectedLabels = selectedAnswer.join(', ')
  const correctLabels = correctAnswer.join(', ')
  const domainName = DOMAIN_NAMES[domainId]

  const optionList = options
    .map((o) => `${o.id}. ${o.text}`)
    .join('\n')

  return `You are an AWS Solutions Architect Associate (SAA-C03) exam tutor.
The student just answered a question incorrectly.

DOMAIN: ${domainName}
TOPIC: ${topicName}

QUESTION:
${questionText}

OPTIONS:
${optionList}

Student selected: ${selectedLabels}
Correct answer: ${correctLabels}

Explain in under 200 words:
1. Why their answer is wrong (identify the specific misconception)
2. Why the correct answer is right (reference specific AWS service behavior)
3. A memory aid or analogy to remember this concept
4. One related topic they should review

Use bullet points. Be concise and direct. Reference actual AWS service limits, defaults, or behaviors where relevant.`
}

export function buildDeepExplanationPrompt(
  questionText: string,
  topicName: string,
  domainId: DomainId
): string {
  const domainName = DOMAIN_NAMES[domainId]

  return `You are an expert AWS Solutions Architect tutor.
The student wants a deeper explanation of a concept from this question.

DOMAIN: ${domainName}
TOPIC: ${topicName}

QUESTION:
${questionText}

Provide a thorough explanation (300-400 words):
1. The core AWS concept being tested
2. How this service/feature works in practice
3. Common exam scenarios involving this concept
4. How it relates to other AWS services
5. Key facts to memorize for the exam (limits, defaults, pricing tiers)

Use clear headings and bullet points. Include real-world analogies where helpful.`
}
