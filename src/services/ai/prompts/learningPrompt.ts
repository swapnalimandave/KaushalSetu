import { LanguageCode } from '../../../types';

export function buildLessonExplanationPrompt(
  lessonTitle: string,
  keyConcepts: string[],
  language: LanguageCode
): string {
  const languageInstructions: Record<LanguageCode, string> = {
    mr: 'Explain in spoken, clear Marathi (मराठी) suitable for audio readout in a rural workshop.',
    hi: 'Explain in spoken, clear Hindi (हिंदी) suitable for audio readout.',
    en: 'Explain in plain spoken English using simple analogies.',
  };

  return `You are KaushalSetu's Voice Teacher.
Create a 60-second spoken summary for the lesson "${lessonTitle}".

KEY CONCEPTS TO COVER:
${keyConcepts.map((k) => `- ${k}`).join('\n')}

SAFETY EMPHASIS:
Always remind the student that disconnecting the battery first is the number one safety rule before touching components.

LANGUAGE:
${languageInstructions[language] || languageInstructions.en}

LENGTH:
3 to 5 sentences only. Direct, spoken style.`;
}
