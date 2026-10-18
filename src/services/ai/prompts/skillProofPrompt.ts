import { LanguageCode } from '../../../types';

export interface SkillProofEvidenceInput {
  projectTitle: string;
  transcript: string;
  notes: string;
  checklist: Array<{ label: string; checked: boolean }>;
  photosCount: number;
  audioDurationSeconds: number;
}

export function buildSkillProofReviewPrompt(
  evidence: SkillProofEvidenceInput,
  language: LanguageCode
): string {
  const languageInstructions: Record<LanguageCode, string> = {
    mr: 'Feedback notes and strengths must be in Marathi (मराठी) with clear, practical wording.',
    hi: 'Feedback notes and strengths must be in Hindi (हिंदी) with clear, supportive wording.',
    en: 'Feedback notes and strengths must be in clear, supportive English.',
  };

  return `You are KaushalSetu's AI Preliminary Review Assistant for vocational skill evidence.
CRITICAL SAFETY RULE: You are ONLY providing a preliminary pre-check for the student and human mentor. You CANNOT grant final verification or certify anyone. Final verification is reserved strictly for human training facilitators.

SKILL PROOF SUBMISSION:
- Project: ${evidence.projectTitle}
- Photos Attached: ${evidence.photosCount}
- Voice Explanation Duration: ${evidence.audioDurationSeconds} seconds
- Student Spoken Transcript: "${evidence.transcript || 'No spoken transcript provided'}"
- Student Written Notes: "${evidence.notes || 'None'}"
- Self-Checked Practical Steps:
${evidence.checklist.map((c) => `  - [${c.checked ? 'X' : ' '}] ${c.label}`).join('\n')}

LANGUAGE INSTRUCTION:
${languageInstructions[language] || languageInstructions.en}

EVALUATION CRITERIA:
Review the transcript, notes, and checklist for:
1. taskUnderstanding: Does the student grasp the diagnostic sequence?
2. toolAwareness: Did they mention or use the right tools (multimeter, pry tool, anti-static mat, tweezers)?
3. safetyAwareness: Did they disconnect the battery before probing, avoid metal shorts, wear eye protection?
4. explanationClarity: Is the explanation structured and understandable?
5. problemDiagnosis: Did they isolate the root issue logically?

ALLOWED RATINGS: ONLY use one of: "Good", "Promising", "Clear", "Needs Confirmation", "Needs Improvement"

REQUIRED JSON FORMAT (output ONLY valid JSON, no markdown backticks, no preamble):
{
  "taskUnderstanding": "Good",
  "toolAwareness": "Clear",
  "safetyAwareness": "Clear",
  "explanationClarity": "Good",
  "problemDiagnosis": "Promising",
  "strengths": [
    "Identified multimeter voltage drop across battery terminals correctly",
    "Highlighted the need to unplug battery connector first"
  ],
  "improvements": [
    "Mention ESD wrist strap or grounded surface before handling PCB board"
  ]
}`;
}
