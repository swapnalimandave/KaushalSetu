import { ApplicationPreparation } from '../../types';
import {
  getStoredApplication,
  saveStoredApplication,
  toggleApplicationStep,
  markApplicationSubmitted,
} from '../../utils/opportunityManager';
import { syncService } from '../sync/syncService';

export interface DocumentReadinessState {
  aadhaar: boolean;
  class10Certificate: boolean;
  passportPhoto: boolean;
  bankDetails: boolean;
}

export const applicationService = {
  getApplication(): ApplicationPreparation {
    return getStoredApplication();
  },

  saveApplication(app: ApplicationPreparation): ApplicationPreparation {
    saveStoredApplication(app);
    syncService.enqueue('application', 'upsert', app);
    return app;
  },

  toggleStep(stepId: string): ApplicationPreparation {
    const updated = toggleApplicationStep(stepId);
    syncService.enqueue('application', 'update', { stepId, status: updated.status });
    return updated;
  },

  /**
   * Updates document readiness flags ONLY (never stores sensitive numbers)
   */
  updateDocumentReadiness(flags: Partial<DocumentReadinessState>): DocumentReadinessState {
    const current = this.getDocumentReadiness();
    const updated = { ...current, ...flags };
    try {
      localStorage.setItem('kaushalsetu_doc_readiness', JSON.stringify(updated));
    } catch {}
    return updated;
  },

  getDocumentReadiness(): DocumentReadinessState {
    try {
      const stored = localStorage.getItem('kaushalsetu_doc_readiness');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      aadhaar: true,
      class10Certificate: true,
      passportPhoto: false,
      bankDetails: false,
    };
  },

  markSubmitted(): ApplicationPreparation {
    const updated = markApplicationSubmitted();
    syncService.enqueue('application', 'update', { status: 'applied', submittedAt: new Date().toISOString() });
    return updated;
  },
};
