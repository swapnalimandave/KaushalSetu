import {
  LivelihoodStage,
  LivelihoodOutcomeStatus,
  LearningProgress,
  SkillProofData,
  ApplicationPreparation,
  CareerOption,
} from '../types';

const OUTCOME_STORAGE_KEY = 'kaushalsetu_self_reported_outcome';

export interface OutcomeRecord {
  status: LivelihoodOutcomeStatus;
  updatedAt: string;
  notes?: string;
  providerName?: string;
}

export function getStoredOutcome(): OutcomeRecord {
  try {
    const saved = localStorage.getItem(OUTCOME_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as OutcomeRecord;
    }
  } catch {
    // fallback
  }
  return {
    status: 'no_outcome_yet',
    updatedAt: new Date().toISOString().split('T')[0],
  };
}

export function saveStoredOutcome(outcome: OutcomeRecord): void {
  try {
    localStorage.setItem(OUTCOME_STORAGE_KEY, JSON.stringify(outcome));
  } catch {
    // quota
  }
}

export function calculateJourneyStages(
  career: CareerOption | null,
  progress: LearningProgress,
  skillProof: SkillProofData,
  application: ApplicationPreparation,
  outcome: OutcomeRecord
): LivelihoodStage[] {
  const isDiscoverDone = Boolean(career);
  const isLearnDone = progress.overallProgress >= 90;
  const isSkillProofVerified = skillProof.status === 'verified';
  const hasApplied = application.status === 'applied';

  return [
    {
      id: 'discover',
      order: 1,
      label: 'Discover',
      labelMr: 'शोध (Discover)',
      labelHi: 'खोज (Discover)',
      status: isDiscoverDone ? 'completed' : 'current',
      summary: career ? `Pathway: ${career.title}` : 'Complete discovery questions',
      summaryMr: career ? `निवडलेला मार्ग: ${career.titleMr}` : 'तुमची आवड व क्षमता शोधा',
      highlightDetail: 'Hands-on technical fit with 3-month earning horizon',
      routeTarget: 'potential',
    },
    {
      id: 'learn',
      order: 2,
      label: 'Learn',
      labelMr: 'शिकणे (Learn)',
      labelHi: 'सीखना (Learn)',
      status: isLearnDone ? 'completed' : 'current',
      summary: `Week ${progress.currentWeek} of 4 · Diagnosis`,
      summaryMr: `आठवडा ${progress.currentWeek} / ४ · समस्या तपासणी`,
      highlightDetail: `${progress.completedLessons.length} lessons completed · ${progress.downloadedLessons.length} offline`,
      routeTarget: 'earnpath',
    },
    {
      id: 'prove',
      order: 3,
      label: 'Prove',
      labelMr: 'सिद्ध करा (Prove)',
      labelHi: 'प्रमाणित करें (Prove)',
      status: isSkillProofVerified
        ? 'completed'
        : skillProof.status === 'unlocked' || skillProof.status === 'submitted'
        ? 'current'
        : 'upcoming',
      summary: isSkillProofVerified
        ? 'Verified Skill Badge'
        : skillProof.status === 'submitted'
        ? 'Awaiting mentor review'
        : 'Basic Mobile Diagnosis Project',
      summaryMr: isSkillProofVerified
        ? 'प्रमाणित कौशल्य बॅज प्राप्त'
        : skillProof.status === 'submitted'
        ? 'शिक्षकांच्या पडताळणीची प्रतीक्षा'
        : 'मोबाईल प्राथमिक तपासणी प्रकल्प',
      highlightDetail: isSkillProofVerified ? 'Credential ID: KS-2026-MDR-0842' : 'Demonstrate practical multimeter skills',
      routeTarget: isSkillProofVerified ? 'profile_skills' : 'skillproof',
    },
    {
      id: 'match',
      order: 4,
      label: 'Match',
      labelMr: 'संधी जुळणी (Match)',
      labelHi: 'अवसर मिलान (Match)',
      status: isSkillProofVerified ? 'current' : 'upcoming',
      summary: '4 Local Opportunities Matched',
      summaryMr: '४ स्थानिक शिकाऊ व कामाच्या संधी',
      highlightDetail: 'Satara district & nearby town verified workshops',
      routeTarget: 'opportunities_placeholder',
    },
    {
      id: 'apply',
      order: 5,
      label: 'Apply',
      labelMr: 'तयारी व अर्ज (Apply)',
      labelHi: 'आवेदन (Apply)',
      status: hasApplied
        ? 'completed'
        : application.steps.filter((s) => s.done).length > 0
        ? 'current'
        : 'upcoming',
      summary: hasApplied
        ? 'Application Packet Submitted'
        : `${application.steps.filter((s) => s.done).length} of ${application.steps.length} Preparation Steps Ready`,
      summaryMr: hasApplied
        ? 'अर्जाचे कागदपत्र सादर'
        : `${application.steps.length} पैकी ${application.steps.filter((s) => s.done).length} पायऱ्या पूर्ण`,
      highlightDetail: 'Target: Sai Electronics & Smartphone Clinic',
      routeTarget: 'opportunities_placeholder',
    },
    {
      id: 'outcome',
      order: 6,
      label: 'Outcome',
      labelMr: 'उपजीविका टप्पा (Outcome)',
      labelHi: 'आजीविका परिणाम (Outcome)',
      status: outcome.status !== 'no_outcome_yet' && outcome.status !== 'not_started' ? 'completed' : 'upcoming',
      summary: getOutcomeLabel(outcome.status),
      summaryMr: getOutcomeLabelMr(outcome.status),
      highlightDetail: 'Self-reported progress toward livelihood',
      routeTarget: 'journey',
    },
  ];
}

export function getOutcomeLabel(status: LivelihoodOutcomeStatus): string {
  switch (status) {
    case 'apprenticeship_offered':
      return 'Apprenticeship Offered';
    case 'job_offered':
      return 'Job Offered';
    case 'training_joined':
      return 'Training Program Joined';
    case 'self_employment_started':
      return 'Self-Employment Started';
    case 'interview_scheduled':
      return 'Interview / Shop Visit Scheduled';
    case 'applied':
      return 'Application Submitted';
    case 'not_started':
      return 'Not Started';
    case 'no_outcome_yet':
    default:
      return 'No Outcome Yet';
  }
}

export function getOutcomeLabelMr(status: LivelihoodOutcomeStatus): string {
  switch (status) {
    case 'apprenticeship_offered':
      return 'शिकाऊ उमेदवारी प्राप्त झाली';
    case 'job_offered':
      return 'कामाची ऑफर मिळाली';
    case 'training_joined':
      return 'प्रशिक्षण सुरू झाले';
    case 'self_employment_started':
      return 'स्वतःचे काम सुरू केले';
    case 'interview_scheduled':
      return 'भेट / मुलाखत निश्चित झाली';
    case 'applied':
      return 'अर्ज सादर केला आहे';
    case 'not_started':
      return 'सुरू झालेले नाही';
    case 'no_outcome_yet':
    default:
      return 'अजून कोणताही निकाल नाही';
  }
}
