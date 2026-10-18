import { StudentProfile, CareerOption, LanguageCode } from '../../types';
import { CareerRecommendationRecord } from '../../types/backend';
import { CAREERS_DATABASE } from '../../data/careers';
import { generateCareerExplanation } from '../ai/aiService';

const CACHE_KEY = 'kaushalsetu_cached_recommendation';

export interface RecommendationResult {
  bestMatch: CareerOption;
  alternatives: CareerOption[];
  futurePaths: CareerOption[];
  breakdown: CareerRecommendationRecord['scoreBreakdown'];
  aiExplanation?: {
    strengths: Array<{ title: string; description: string }>;
    mainExplanation: string;
    improvementAreas: string[];
    isFallback: boolean;
  };
}

/**
 * Maps education level to an ordinal integer for strict comparison
 */
function getEducationRank(edu: string): number {
  const normalized = edu.toLowerCase();
  if (normalized.includes('below') || normalized.includes('primary') || normalized.includes('8')) return 1;
  if (normalized.includes('10')) return 2;
  if (normalized.includes('12')) return 3;
  if (normalized.includes('iti') || normalized.includes('diploma')) return 3;
  if (normalized.includes('graduate') || normalized.includes('degree') || normalized.includes('college')) return 4;
  return 2; // Default to Class 10 equivalent
}

export const recommendationService = {
  /**
   * Deterministic scoring engine with hard constraint enforcement
   */
  calculateDeterministicMatches(profile: StudentProfile): {
    bestMatch: CareerOption;
    alternatives: CareerOption[];
    futurePaths: CareerOption[];
    scoreBreakdown: CareerRecommendationRecord['scoreBreakdown'];
  } {
    const studentEduRank = getEducationRank(profile.education || 'Class 10');

    const scoredCareers = CAREERS_DATABASE.map((career) => {
      // 1. Interest alignment (25%)
      const interestMatches = profile.interests.filter((i) =>
        career.interests.some((ci) => ci.toLowerCase().includes(i.toLowerCase().replace('_', ' ')))
      ).length;
      const interestScore = Math.min(25, Math.round((interestMatches / Math.max(1, profile.interests.length)) * 25));

      // 2. Existing skill fit (15%)
      const skillMatches = profile.existingSkills.filter((s) =>
        career.skills.some((cs) => cs.toLowerCase().includes(s.toLowerCase().replace('_', ' ')))
      ).length;
      const skillScore = Math.min(15, Math.round((skillMatches / Math.max(1, profile.existingSkills.length)) * 15));

      // 3. Work preference fit (15%)
      const workMatches = profile.workPreferences.filter((w) =>
        career.workStyles.some((cw) => cw.toLowerCase().includes(w.toLowerCase().replace('_', ' ')))
      ).length;
      const workScore = Math.min(15, Math.round((workMatches / Math.max(1, profile.workPreferences.length)) * 15));

      // 4. Education fit (10%)
      const careerEduRank = getEducationRank(career.minimumEducation);
      let educationScore = 10;
      let failsHardEducation = false;

      if (studentEduRank < careerEduRank) {
        educationScore = 0;
        failsHardEducation = true;
      }

      // 5. Earning timeline fit (10%)
      let timelineScore = 6;
      if (profile.earningTimeline.includes('3_months') && career.trainingDurationWeeks <= 6) {
        timelineScore = 10;
      } else if (profile.earningTimeline.includes('6_months')) {
        timelineScore = 9;
      }

      // 6. Travel fit (10%)
      let travelScore = 8;
      if (profile.travelPreference === 'nearby_town' || profile.travelPreference === 'anywhere_in_state') {
        travelScore = 10;
      } else if (profile.travelPreference === 'within_village' && career.travelRequirement.includes('village')) {
        travelScore = 10;
      }

      // 7. Learning preference (10%)
      let learningScore = 8;
      if (profile.learningPreferences.includes('practical') && career.learningModes.some((m) => m.toLowerCase().includes('practic'))) {
        learningScore = 10;
      }

      // 8. Device / internet fit (5%)
      const deviceScore = 5;

      const totalDeterministicScore =
        interestScore + skillScore + workScore + educationScore + timelineScore + travelScore + learningScore + deviceScore;

      return {
        career: {
          ...career,
          matchScore: failsHardEducation ? Math.min(60, totalDeterministicScore) : totalDeterministicScore,
        },
        failsHardEducation,
        breakdown: {
          interestAlignment: interestScore,
          existingSkillFit: skillScore,
          workPreference: workScore,
          educationFit: educationScore,
          earningTimelineFit: timelineScore,
          travelFit: travelScore,
          learningPreference: learningScore,
          deviceInternetFit: deviceScore,
        },
      };
    });

    // Partition into eligible vs hard constraint future paths
    const eligible = scoredCareers.filter((c) => !c.failsHardEducation);
    const futurePaths = scoredCareers.filter((c) => c.failsHardEducation).map((c) => c.career);

    // Sort eligible descending by matchScore
    eligible.sort((a, b) => b.career.matchScore - a.career.matchScore);

    const best = eligible[0] || scoredCareers[0];
    const bestMatch = best.career;
    const alternatives = eligible.slice(1, 4).map((c) => c.career);

    return {
      bestMatch,
      alternatives,
      futurePaths,
      scoreBreakdown: best.breakdown,
    };
  },

  /**
   * Enriches deterministic recommendation with Gemini explanations & strengths summary
   */
  async getEnrichedRecommendation(
    profile: StudentProfile,
    language: LanguageCode = 'mr'
  ): Promise<RecommendationResult> {
    const deterministic = this.calculateDeterministicMatches(profile);

    // Check cache
    try {
      const cached = localStorage.getItem(`${CACHE_KEY}_${language}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.bestMatch?.id === deterministic.bestMatch.id) {
          return {
            ...deterministic,
            breakdown: deterministic.scoreBreakdown,
            aiExplanation: parsed.aiExplanation,
          };
        }
      }
    } catch {}

    // Call Gemini for structured explanation (fails gracefully to deterministic fallback)
    const { data, isFallback } = await generateCareerExplanation(
      profile,
      deterministic.bestMatch,
      deterministic.alternatives,
      language
    );

    const result: RecommendationResult = {
      bestMatch: deterministic.bestMatch,
      alternatives: deterministic.alternatives,
      futurePaths: deterministic.futurePaths,
      breakdown: deterministic.scoreBreakdown,
      aiExplanation: {
        strengths: data.strengths,
        mainExplanation: data.mainRecommendationExplanation,
        improvementAreas: data.improvementAreas,
        isFallback,
      },
    };

    // Cache in local storage
    try {
      localStorage.setItem(`${CACHE_KEY}_${language}`, JSON.stringify(result));
    } catch {}

    return result;
  },
};
