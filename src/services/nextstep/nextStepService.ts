import { NextStepInfo } from '../../types';
import { getNextStep, StudentStateInput } from '../../utils/nextStepEngine';

export const nextStepService = {
  /**
   * Deterministic 16-tier priority Next Step Engine
   * Gemini is NEVER allowed to dictate or override the deterministic next step
   */
  calculateNextStep(state: StudentStateInput): NextStepInfo {
    return getNextStep(state);
  },
};
