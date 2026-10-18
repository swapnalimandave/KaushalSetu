import {
  LearnerRecord,
  FacilitatorNote,
  FacilitatorMetrics,
  SkillProofData,
} from '../types';
import { INITIAL_COHORT_LEARNERS } from '../data/facilitatorData';
import { getStoredSkillProof, saveStoredSkillProof, mentorVerifySkill, mentorRequestImprovement } from './skillProofManager';
import { getStoredProgress } from './progressManager';
import { getStoredApplication } from './opportunityManager';

const FACILITATOR_LEARNERS_KEY = 'kaushalsetu_facilitator_cohort';

export function getStoredLearners(): LearnerRecord[] {
  let learners = INITIAL_COHORT_LEARNERS;
  try {
    const raw = localStorage.getItem(FACILITATOR_LEARNERS_KEY);
    if (raw) {
      learners = JSON.parse(raw) as LearnerRecord[];
    }
  } catch {
    // fallback
  }

  // Live-sync Ravi Patil with the actual student state
  const liveSkillProof = getStoredSkillProof();
  const liveProgress = getStoredProgress();
  const liveApplication = getStoredApplication();

  return learners.map((l) => {
    if (l.id === 'ravi-patil-18') {
      const isVerified = liveSkillProof.status === 'verified';
      const isImprovement = liveSkillProof.status === 'improvement_requested';
      const isPending = liveSkillProof.status === 'mentor_pending' || liveSkillProof.status === 'submitted' || liveSkillProof.status === 'ai_reviewed';

      let stage = l.currentStage;
      if (liveApplication && (liveApplication.status === 'ready_to_visit' || liveApplication.status === 'applied')) {
        stage = 'apply';
      } else if (isVerified) {
        stage = 'match';
      } else if (isPending || isImprovement) {
        stage = 'prove';
      }

      const completedCount = liveProgress.completedLessons.length;
      const progressPercent = Math.round((completedCount / 16) * 100);

      const attentionNeeded = isImprovement;
      const attentionReason = isImprovement
        ? 'SkillProof returned with feedback: waiting for student re-submission of safe battery handling evidence.'
        : isPending
        ? 'Submitted SkillProof evidence for multimeter bench diagnosis; awaiting mentor review.'
        : isVerified
        ? 'Skill Verified! Ready to present credential at Sai Electronics.'
        : 'Active in Week 2 learning.';

      return {
        ...l,
        overallProgress: Math.max(progressPercent, l.overallProgress),
        currentWeek: liveProgress.currentWeek || 2,
        completedLessonsCount: completedCount,
        currentStage: stage,
        skillProofStatus: liveSkillProof.status,
        needsAttention: attentionNeeded,
        attentionReason,
        attentionReasonMr: isImprovement
          ? 'कौशल्य पुरावा सुधारणेसाठी परत पाठवला: बॅटरी सुरक्षेचा पुरावा देणे बाकी.'
          : isPending
          ? 'मल्टीमीटर तपासणी पुरावा सादर केला; पुनरावलोकनाची प्रतीक्षा.'
          : 'प्रमाणित कौशल्य प्राप्त.',
        attentionSeverity: isImprovement ? 'high' : 'low',
        applicationStatus: liveApplication 
          ? `Documents: ${liveApplication.steps.filter((s) => s.done).length} of ${liveApplication.steps.length} ready`
          : l.applicationStatus,
      };
    }
    return l;
  });
}

export function saveStoredLearners(learners: LearnerRecord[]): void {
  try {
    localStorage.setItem(FACILITATOR_LEARNERS_KEY, JSON.stringify(learners));
  } catch {
    // quota
  }
}

export function getLearnerById(id: string): LearnerRecord | undefined {
  const learners = getStoredLearners();
  return learners.find((l) => l.id === id);
}

export function addFacilitatorNote(
  learnerId: string,
  noteText: string,
  category: FacilitatorNote['category'] = 'call_log'
): LearnerRecord {
  const learners = getStoredLearners();
  const index = learners.findIndex((l) => l.id === learnerId);
  if (index === -1) {
    throw new Error('Learner not found');
  }

  const newNote: FacilitatorNote = {
    id: `note-${Date.now()}`,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    author: 'Anita Deshmukh',
    category,
    text: noteText,
  };

  const updatedLearner: LearnerRecord = {
    ...learners[index],
    notes: [newNote, ...learners[index].notes],
    lastActiveDate: 'Today (Facilitator updated)',
  };

  learners[index] = updatedLearner;
  saveStoredLearners(learners);
  return updatedLearner;
}

export function resolveLearnerAttention(learnerId: string): LearnerRecord {
  const learners = getStoredLearners();
  const index = learners.findIndex((l) => l.id === learnerId);
  if (index === -1) throw new Error('Learner not found');

  const updated: LearnerRecord = {
    ...learners[index],
    needsAttention: false,
    attentionReason: 'Issue marked resolved by facilitator',
    attentionReasonMr: 'समन्वयकांकडून सोडवले म्हणून नोंद',
    attentionSeverity: 'low',
  };

  learners[index] = updated;
  saveStoredLearners(learners);
  return updated;
}

export function flagLearnerAttention(
  learnerId: string,
  reason: string,
  severity: 'high' | 'medium' | 'low' = 'medium'
): LearnerRecord {
  const learners = getStoredLearners();
  const index = learners.findIndex((l) => l.id === learnerId);
  if (index === -1) throw new Error('Learner not found');

  const updated: LearnerRecord = {
    ...learners[index],
    needsAttention: true,
    attentionReason: reason,
    attentionSeverity: severity,
  };

  learners[index] = updated;
  saveStoredLearners(learners);
  return updated;
}

export function getFacilitatorMetrics(): FacilitatorMetrics {
  const learners = getStoredLearners();
  const totalEnrolled = 28; // Total cohort center capacity
  const activeThisWeek = learners.filter((l) => !l.lastActiveDate.includes('days ago')).length + 18;
  const needsAttentionCount = learners.filter((l) => l.needsAttention).length;
  const skillProofPendingCount = learners.filter(
    (l) => l.skillProofStatus === 'mentor_pending' || l.skillProofStatus === 'submitted' || l.skillProofStatus === 'ai_reviewed'
  ).length;
  const skillsVerifiedCount = learners.filter((l) => l.skillProofStatus === 'verified').length + 8; // Verified in this batch
  const applicationsUnderwayCount = learners.filter((l) => l.currentStage === 'apply' || l.currentStage === 'outcome').length + 5;
  const outcomesSecuredCount = learners.filter((l) => l.currentStage === 'outcome').length + 4;

  return {
    totalEnrolled,
    activeThisWeek,
    needsAttentionCount,
    skillProofPendingCount,
    skillsVerifiedCount,
    applicationsUnderwayCount,
    outcomesSecuredCount,
  };
}

export interface ReviewQueueItem {
  id: string;
  learnerId: string;
  learnerName: string;
  learnerNameMr: string;
  pathwayTitle: string;
  pathwayTitleMr: string;
  skillTitle: string;
  skillTitleMr: string;
  submittedAt: string;
  status: SkillProofData['status'];
  aiSummaryBadge: string;
  evidencePhotoCount: number;
  hasAudio: boolean;
  needsReviewAction: boolean;
}

export function getSkillProofReviewQueue(): ReviewQueueItem[] {
  const liveSkillProof = getStoredSkillProof();
  const learners = getStoredLearners();
  const ravi = learners.find((l) => l.id === 'ravi-patil-18');

  const queue: ReviewQueueItem[] = [
    {
      id: liveSkillProof.id || 'sp-mobile-repair-01',
      learnerId: 'ravi-patil-18',
      learnerName: ravi ? ravi.name : 'Ravi Patil',
      learnerNameMr: ravi ? ravi.nameMr : 'रवी पाटील',
      pathwayTitle: 'Mobile Device Repair Technician',
      pathwayTitleMr: 'मोबाईल उपकरण दुरुस्ती तंत्रज्ञ',
      skillTitle: 'Basic Mobile Device Diagnosis',
      skillTitleMr: 'मोबाईल उपकरण प्राथमिक तपासणी व समस्या शोधणे',
      submittedAt: liveSkillProof.submittedAt || 'Today, 10:15 AM',
      status: liveSkillProof.status,
      aiSummaryBadge: 'Good Tool Awareness & Logic (Safety Caution)',
      evidencePhotoCount: liveSkillProof.evidence?.photoUrl ? 1 : 0,
      hasAudio: Boolean(liveSkillProof.evidence?.audioDurationSeconds || liveSkillProof.evidence?.audioTranscript),
      needsReviewAction: liveSkillProof.status === 'mentor_pending' || liveSkillProof.status === 'ai_reviewed' || liveSkillProof.status === 'unlocked',
    },
    {
      id: 'sp-solar-02',
      learnerId: 'pooja-shinde-20',
      learnerName: 'Pooja Shinde',
      learnerNameMr: 'पूजा शिंदे',
      pathwayTitle: 'Rooftop Solar Installation & Maintenance',
      pathwayTitleMr: 'सोलर पॅनल बसवणे व देखभाल तंत्रज्ञ',
      skillTitle: 'Solar Array Wiring & Safety Disconnect',
      skillTitleMr: 'सोलर वायरिंग आणि सुरक्षित डिस्कनेक्ट पद्धत',
      submittedAt: 'Yesterday, 3:45 PM',
      status: 'mentor_pending',
      aiSummaryBadge: 'Strong Safety Protocol & Tool Verification',
      evidencePhotoCount: 2,
      hasAudio: true,
      needsReviewAction: true,
    },
    {
      id: 'sp-ev-03',
      learnerId: 'mahesh-more-22',
      learnerName: 'Mahesh More',
      learnerNameMr: 'महेश मोरे',
      pathwayTitle: 'Two-Wheeler EV Service Assistant',
      pathwayTitleMr: 'इलेक्ट्रिक दुचाकी सेवा सहाय्यक',
      skillTitle: 'BLDC Motor Sensor Testing & Continuity',
      skillTitleMr: 'बीएलडीसी मोटर सेन्सर चाचणी',
      submittedAt: '12 Feb 2026',
      status: 'verified',
      aiSummaryBadge: 'Meets all rubric criteria',
      evidencePhotoCount: 1,
      hasAudio: true,
      needsReviewAction: false,
    },
  ];

  return queue;
}

export function performMentorReview(
  skillProofId: string,
  decision: 'verify' | 'request_improvement',
  feedbackNote: string,
  reasons: string[] = []
): void {
  if (skillProofId === 'sp-mobile-repair-01' || skillProofId.includes('mobile-repair')) {
    if (decision === 'verify') {
      mentorVerifySkill('Anita Deshmukh & Master Trainer Sunil');
    } else {
      mentorRequestImprovement(feedbackNote, reasons);
    }
  }

  // Update cohort record as well
  const learners = getStoredLearners();
  const updated = learners.map((l) => {
    if (l.skillProofId === skillProofId || (skillProofId.includes('mobile-repair') && l.id === 'ravi-patil-18')) {
      return {
        ...l,
        skillProofStatus: decision === 'verify' ? ('verified' as const) : ('improvement_requested' as const),
        needsAttention: decision === 'request_improvement',
        attentionReason: decision === 'request_improvement'
          ? `Improvement requested: ${feedbackNote.slice(0, 80)}...`
          : 'Skill verified by facilitator',
        attentionSeverity: decision === 'request_improvement' ? ('high' as const) : ('low' as const),
      };
    }
    return l;
  });
  saveStoredLearners(updated);
}
