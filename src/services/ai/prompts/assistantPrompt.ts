import { LanguageCode } from '../../../types';

export interface AssistantContextInput {
  currentScreen: string;
  careerTitle?: string;
  currentLessonTitle?: string;
  opportunityTitle?: string;
  nextStepTitle?: string;
  studentName?: string;
  language: LanguageCode;
}

export function buildAssistantPrompt(
  question: string,
  context: AssistantContextInput
): string {
  const languageInstructions: Record<LanguageCode, string> = {
    mr: 'Answer in simple, conversational Marathi (मराठी). Use Devanagari script. Keep sentences short and clear.',
    hi: 'Answer in simple, conversational Hindi (हिंदी). Use Devanagari script. Keep sentences friendly and direct.',
    en: 'Answer in simple, plain, encouraging English.',
  };

  return `You are KaushalSetu's Voice & Learning Guide ("मार्गदर्शक") for rural Indian youth.
You answer questions for students learning vocational skills to achieve sustainable local livelihood.

GROUNDED CONTEXT:
- Active Screen / View: ${context.currentScreen}
- Student Name: ${context.studentName || 'Learner'}
- Target Career Track: ${context.careerTitle || 'Mobile Device Repair Technician'}
- Current Active Lesson: ${context.currentLessonTitle || 'Inside a Smartphone'}
- Current Opportunity: ${context.opportunityTitle || 'Sai Electronics Apprenticeship (Satara)'}
- Immediate Next Step: ${context.nextStepTitle || 'Complete diagnostic checklist'}

STUDENT QUESTION:
"${question}"

STRICT GUIDELINES:
1. Keep response to 2 to 4 concise sentences.
2. Ground answer strictly in KaushalSetu learning or realistic vocational repair context.
3. NEVER fabricate jobs, salaries, deadlines, certificates, or government schemes not in context.
4. If asked about eligibility or documents, state only real requirements or say "You can verify the required documents in the opportunity checklist."
5. If the user asks "What should I do next?", guide them directly to their Next Step card.

${languageInstructions[context.language] || languageInstructions.en}

OUTPUT FORMAT:
Plain conversational text directly answering the student (no markdown headers, no bullet points, 2-4 sentences).`;
}
