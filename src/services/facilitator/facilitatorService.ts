import { LearnerRecord, FacilitatorNote, FacilitatorMetrics } from '../../types';
import {
  getStoredLearners,
  saveStoredLearners,
  getLearnerById,
  addFacilitatorNote,
  resolveLearnerAttention,
  getSkillProofReviewQueue,
  getFacilitatorMetrics,
} from '../../utils/facilitatorManager';

export const facilitatorService = {
  getLearners(): LearnerRecord[] {
    return getStoredLearners();
  },

  getLearner(id: string): LearnerRecord | undefined {
    return getLearnerById(id);
  },

  addPrivateNote(
    learnerId: string,
    noteText: string,
    category: FacilitatorNote['category'] = 'counseling'
  ): LearnerRecord {
    return addFacilitatorNote(learnerId, noteText, category);
  },

  resolveAttention(learnerId: string): LearnerRecord | undefined {
    return resolveLearnerAttention(learnerId);
  },

  getReviewQueue() {
    return getSkillProofReviewQueue();
  },

  getMetrics(): FacilitatorMetrics {
    return getFacilitatorMetrics();
  },
};
