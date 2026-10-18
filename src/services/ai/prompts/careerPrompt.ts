import { StudentProfile, CareerOption, LanguageCode } from '../../../types';

export function buildCareerExplanationPrompt(
  profile: StudentProfile,
  topCareer: CareerOption,
  alternatives: CareerOption[],
  language: LanguageCode
): string {
  const languageInstructions: Record<LanguageCode, string> = {
    mr: 'Generate the explanation, strengths, and improvement text in simple, supportive Marathi (मराठी). Keep terminology practical and culturally relatable for rural Maharashtra youth.',
    hi: 'Generate the explanation, strengths, and improvement text in simple, supportive Hindi (हिंदी). Keep language accessible for rural youth.',
    en: 'Generate the explanation, strengths, and improvement text in clear, simple, supportive English suitable for a vocational learner.',
  };

  return `You are KaushalSetu's AI Career Mentor for rural and semi-urban Indian youth.
You are evaluating structured scoring results from our deterministic career engine.
Do NOT invent new hard constraints or contradict the structured scoring.

STUDENT PROFILE:
- Age: ${profile.age}
- Education: ${profile.education}
- State: ${profile.state}
- Expressed Interests: ${profile.interests.join(', ') || 'Practical work'}
- Existing Skills: ${profile.existingSkills.join(', ') || 'Basic hands-on repair'}
- Work Preferences: ${profile.workPreferences.join(', ')}
- Earning Timeline Goal: ${profile.earningTimeline}
- Travel Preference: ${profile.travelPreference}
- Device Access: ${profile.deviceAccess}
- Internet Access: ${profile.internetAccess}
- Learning Modes: ${profile.learningPreferences.join(', ')}

DETERMINISTIC BEST MATCH:
- Career: ${topCareer.title} (${topCareer.titleMr})
- Category: ${topCareer.category}
- Match Score: ${topCareer.matchScore}%
- Training Duration: ${topCareer.trainingDurationWeeks} weeks
- Minimum Education Requirement: ${topCareer.minimumEducation}

ALTERNATIVE CAREERS:
${alternatives.map((alt) => `- ${alt.title} (${alt.matchScore}%)`).join('\n')}

LANGUAGE INSTRUCTION:
${languageInstructions[language] || languageInstructions.en}

TASK:
Generate a personalized, encouraging explanation for this student. Focus on their real strengths, why this specific career fits their timeline and constraints, and 2 concrete practical things they will learn in Week 1-2.

REQUIRED JSON FORMAT (output ONLY valid JSON, no markdown backticks, no preamble):
{
  "strengths": [
    {
      "title": "Short strength title",
      "description": "1-2 sentence explanation connecting student background to practical aptitude."
    },
    {
      "title": "Second strength title",
      "description": "1-2 sentence explanation of practical or interest fit."
    }
  ],
  "mainRecommendationExplanation": "3-4 encouraging, realistic sentences explaining why this career is the best fit for their goal, education, and location constraints.",
  "improvementAreas": [
    "Specific practical skill to practice first",
    "Safety or diagnostic habit to build"
  ],
  "alternativeExplanations": {
    "${alternatives[0]?.id || 'alt1'}": "1 sentence why this is a valid alternative.",
    "${alternatives[1]?.id || 'alt2'}": "1 sentence why this is a valid alternative."
  }
}`;
}
