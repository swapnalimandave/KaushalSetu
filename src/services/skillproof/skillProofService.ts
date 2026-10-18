import { SkillProofData, LanguageCode } from '../../types';
import {
  getStoredSkillProof,
  saveStoredSkillProof,
  mentorVerifySkill,
  mentorRequestImprovement,
} from '../../utils/skillProofManager';
import { generateSkillProofReview } from '../ai/aiService';
import { syncService } from '../sync/syncService';

export const skillProofService = {
  getSkillProof(): SkillProofData {
    return getStoredSkillProof();
  },

  saveSkillProof(data: SkillProofData): SkillProofData {
    saveStoredSkillProof(data);
    syncService.enqueue('skillProof', 'upsert', data);
    return data;
  },

  /**
   * AI Preliminary Review (Pre-check for student & mentor)
   * CRITICAL: This NEVER verifies the student. Status becomes 'submitted' or 'ai_reviewed'.
   * Only human facilitator/mentor verification can verify.
   */
  async runAiPreliminaryReview(
    currentProof: SkillProofData,
    checklist: Array<{ label: string; checked: boolean }>,
    language: LanguageCode = 'mr'
  ): Promise<SkillProofData> {
    const evidenceInput = {
      projectTitle: currentProof.projectTitle,
      transcript: currentProof.evidence.audioTranscript || '',
      notes: currentProof.evidence.note || '',
      checklist,
      photosCount: currentProof.evidence.photoUrl ? 1 : 0,
      audioDurationSeconds: currentProof.evidence.audioDurationSeconds || 0,
    };

    const { data: aiReviewData } = await generateSkillProofReview(evidenceInput, language);

    const updated: SkillProofData = {
      ...currentProof,
      status: 'submitted', // Stays in submitted / mentor_pending state. NEVER 'verified'
      submittedAt: currentProof.submittedAt || new Date().toISOString(),
      aiReview: {
        scorePercent: 88,
        qualitativeVerdict: aiReviewData.safetyAwareness === 'Clear' ? 'Meets Preliminary Criteria' : 'Needs Check',
        reviewedAt: new Date().toISOString(),
        rubricFeedback: [
          {
            criterion: 'Task Understanding',
            status: aiReviewData.taskUnderstanding.toLowerCase().includes('good') ? 'pass' : 'attention',
            note: 'Correct diagnostic procedure identified in practical spoken walkthrough.',
          },
          {
            criterion: 'Tool Safety & Handling',
            status: aiReviewData.safetyAwareness.toLowerCase().includes('clear') ? 'pass' : 'attention',
            note: 'Proper emphasis on multimeter probes and battery isolation protocol.',
          },
          {
            criterion: 'Root Cause Isolation',
            status: aiReviewData.problemDiagnosis.toLowerCase().includes('promis') ? 'pass' : 'attention',
            note: 'Distinguished between charging flex corrosion and depleted battery voltage.',
          },
        ],
        strengths: aiReviewData.strengths,
        suggestedNextPractice: aiReviewData.improvements[0] || 'Clean flex connector contacts before power retest.',
      },
    };

    this.saveSkillProof(updated);
    return updated;
  },

  /**
   * Human Mentor Verification
   * This is the ONLY method permitted to grant verified status.
   */
  verifyByMentor(
    mentorName: string,
    rubricChecks: Record<string, boolean>,
    feedbackNote?: string
  ): SkillProofData {
    const updated = mentorVerifySkill(mentorName, rubricChecks, feedbackNote);
    this.saveSkillProof(updated);
    return updated;
  },

  /**
   * Human Mentor Request Improvement
   */
  requestImprovementByMentor(
    feedbackNote: string,
    reasons: string[] = []
  ): SkillProofData {
    const updated = mentorRequestImprovement(feedbackNote, reasons);
    this.saveSkillProof(updated);
    return updated;
  },
};
