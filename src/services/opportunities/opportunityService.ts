import { StudentProfile, Opportunity } from '../../types';
import {
  getStoredOpportunities,
  saveStoredOpportunities,
  toggleOpportunitySaved,
} from '../../utils/opportunityManager';
import { getStoredSkillProof } from '../../utils/skillProofManager';

export interface EligibilityResult {
  eligible: boolean;
  status: 'eligible' | 'almost_eligible' | 'not_eligible' | 'unknown';
  requirements: Array<{
    requirement: string;
    learnerValue: string;
    status: 'met' | 'pending' | 'unmet';
    explanation: string;
  }>;
}

export interface MatchScoreResult {
  score: number;
  matchLevel: 'Strong Match' | 'Good Match' | 'Eligible' | 'Not Eligible';
  breakdown: {
    verifiedSkillAlignment: number; // 25%
    educationFit: number;           // 15%
    careerRelevance: number;        // 20%
    travelFit: number;              // 10%
    ageEligibility: number;         // 10%
    preferredSkillMatch: number;    // 10%
    timelineTypeFit: number;        // 10%
  };
  hardConstraintFailures: string[];
}

export const opportunityService = {
  getOpportunities(): Opportunity[] {
    return getStoredOpportunities();
  },

  saveOpportunities(opps: Opportunity[]): void {
    saveStoredOpportunities(opps);
  },

  toggleSaved(oppId: string): Opportunity[] {
    return toggleOpportunitySaved(oppId);
  },

  /**
   * Deterministic Eligibility Engine (NEVER decided by Gemini)
   */
  checkEligibility(student: StudentProfile, opportunity: Opportunity): EligibilityResult {
    const requirements: EligibilityResult['requirements'] = [];
    let hardFail = false;
    let pendingCount = 0;

    // 1. Education requirement
    const reqEdu = (opportunity.requiredEducation || 'Class 10').toLowerCase();
    const studentEdu = (student.education || 'Class 10').toLowerCase();
    const eduMet = studentEdu.includes('10') || studentEdu.includes('12') || studentEdu.includes('iti');

    requirements.push({
      requirement: `Minimum Education: ${opportunity.requiredEducation || 'Class 10'}`,
      learnerValue: student.education || 'Class 10',
      status: eduMet ? 'met' : 'unmet',
      explanation: eduMet
        ? 'Your Class 10 qualification fulfills the basic entry standard.'
        : 'Additional schooling required for this role.',
    });
    if (!eduMet) hardFail = true;

    // 2. Age requirement (Typically 18-28 for apprenticeships)
    const studentAge = student.age || 18;
    const ageMet = studentAge >= 18 && studentAge <= 30;
    requirements.push({
      requirement: 'Age Eligibility (18+ for workshop bench placement)',
      learnerValue: `${studentAge} years old`,
      status: ageMet ? 'met' : 'unmet',
      explanation: ageMet
        ? 'You meet the minimum legal age for apprenticeship.'
        : 'Must be at least 18 years of age.',
    });
    if (!ageMet) hardFail = true;

    // 3. Verified Skill Requirement
    const skillProof = getStoredSkillProof();
    const isVerified = skillProof.status === 'verified';
    requirements.push({
      requirement: 'Verified Skill: Basic Mobile Device Diagnosis',
      learnerValue: isVerified ? 'Verified by Facilitator' : 'SkillProof in Review / Pending',
      status: isVerified ? 'met' : 'pending',
      explanation: isVerified
        ? 'Your mentor verification badge gives you priority bench admission.'
        : 'Complete your mentor verification rubric to unlock instant interview preference.',
    });
    if (!isVerified) pendingCount++;

    // 4. Location / Travel
    const distanceKm = opportunity.distanceKm || 5;
    const travelMet = distanceKm <= 20;
    requirements.push({
      requirement: `Location Constraint: within 20km (${opportunity.location})`,
      learnerValue: `${distanceKm} km away (${student.travelPreference.replace('_', ' ')})`,
      status: travelMet ? 'met' : 'pending',
      explanation: travelMet
        ? 'Accessible via regular local state transport (ST bus).'
        : 'Distance may require daily commute assistance.',
    });

    let overallStatus: EligibilityResult['status'] = 'eligible';
    if (hardFail) {
      overallStatus = 'not_eligible';
    } else if (pendingCount > 0) {
      overallStatus = 'almost_eligible';
    }

    return {
      eligible: !hardFail && pendingCount === 0,
      status: overallStatus,
      requirements,
    };
  },

  /**
   * Deterministic Match Scoring Engine
   */
  calculateOpportunityMatch(student: StudentProfile, opportunity: Opportunity): MatchScoreResult {
    const hardConstraintFailures: string[] = [];
    const skillProof = getStoredSkillProof();
    const isSkillVerified = skillProof.status === 'verified';

    // 1. Verified skill alignment (25%)
    const verifiedSkillAlignment = isSkillVerified ? 25 : 12;

    // 2. Education fit (15%)
    const studentEdu = (student.education || 'Class 10').toLowerCase();
    const educationFit = studentEdu.includes('10') || studentEdu.includes('12') ? 15 : 0;
    if (educationFit === 0) hardConstraintFailures.push('Education requirement not met');

    // 3. Career relevance (20%)
    const careerRelevance = opportunity.type === 'Apprenticeship' || opportunity.title.toLowerCase().includes('mobile') ? 20 : 14;

    // 4. Travel fit (10%)
    const travelFit = (opportunity.distanceKm || 5) <= 15 ? 10 : 6;

    // 5. Age eligibility (10%)
    const ageEligibility = (student.age || 18) >= 18 ? 10 : 0;
    if (ageEligibility === 0) hardConstraintFailures.push('Must be 18+ for workshop placement');

    // 6. Preferred skill match (10%)
    const preferredSkillMatch = 9;

    // 7. Timeline / type fit (10%)
    const timelineTypeFit = student.earningTimeline.includes('3_months') && opportunity.type === 'Apprenticeship' ? 10 : 7;

    const totalScore =
      verifiedSkillAlignment +
      educationFit +
      careerRelevance +
      travelFit +
      ageEligibility +
      preferredSkillMatch +
      timelineTypeFit;

    let matchLevel: MatchScoreResult['matchLevel'] = 'Strong Match';
    if (hardConstraintFailures.length > 0) {
      matchLevel = 'Not Eligible';
    } else if (totalScore < 70) {
      matchLevel = 'Eligible';
    } else if (totalScore < 85) {
      matchLevel = 'Good Match';
    }

    return {
      score: hardConstraintFailures.length > 0 ? Math.min(50, totalScore) : totalScore,
      matchLevel,
      breakdown: {
        verifiedSkillAlignment,
        educationFit,
        careerRelevance,
        travelFit,
        ageEligibility,
        preferredSkillMatch,
        timelineTypeFit,
      },
      hardConstraintFailures,
    };
  },
};
