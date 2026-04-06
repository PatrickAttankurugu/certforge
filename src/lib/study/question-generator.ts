import type { DomainId } from '@/types/study'
import { DOMAIN_NAMES } from './constants'

export function buildQuestionGenerationPrompt(
  topicName: string,
  domainId: DomainId,
  difficulty: number,
  questionType: 'single' | 'multi',
  userAccuracy: number | null
): string {
  const domainName = DOMAIN_NAMES[domainId]
  const difficultyDesc = {
    1: 'basic recall (simple fact or definition)',
    2: 'comprehension (understanding a concept)',
    3: 'application (applying knowledge to a scenario)',
    4: 'analysis (evaluating options for a complex scenario)',
    5: 'scenario-based (real-world multi-service architecture decision)',
  }[difficulty] ?? 'application'

  const typeInstruction = questionType === 'multi'
    ? 'This is a MULTI-SELECT question. Specify "Select TWO" or "Select THREE" in the question. There must be exactly 2 or 3 correct answers.'
    : 'This is a SINGLE-SELECT question. There must be exactly 1 correct answer.'

  const accuracyContext = userAccuracy !== null
    ? `The student's current accuracy on this topic is ${Math.round(userAccuracy * 100)}%. Calibrate the question to be appropriately challenging.`
    : ''

  return `You are an AWS certification question author for the SAA-C03 exam.
Generate a practice question about "${topicName}" in the "${domainName}" domain.

DIFFICULTY: ${difficulty}/5 (${difficultyDesc})
${typeInstruction}
${accuracyContext}

RULES:
- Follow the real AWS exam format exactly
- For difficulty 4-5, write scenario-based questions with realistic business contexts
- Include 4 answer options (A, B, C, D)
- All distractors must be plausible AWS services or configurations
- The explanation must reference specific AWS documentation concepts
- Tag all AWS services mentioned in the question and answers

OUTPUT FORMAT (JSON):
{
  "question_text": "A company needs to...",
  "question_type": "${questionType}",
  "options": [
    {"id": "A", "text": "Use Amazon S3...", "is_correct": false},
    {"id": "B", "text": "Use Amazon EBS...", "is_correct": true},
    {"id": "C", "text": "Use Amazon EFS...", "is_correct": false},
    {"id": "D", "text": "Use AWS Storage Gateway...", "is_correct": false}
  ],
  "explanation": "Option B is correct because...",
  "wrong_explanations": {
    "A": "S3 is incorrect here because...",
    "C": "EFS would not work because...",
    "D": "Storage Gateway is for hybrid scenarios..."
  },
  "aws_services": ["S3", "EBS", "EFS", "Storage Gateway"],
  "difficulty": ${difficulty}
}

Return ONLY valid JSON. No markdown fences, no commentary.`
}
