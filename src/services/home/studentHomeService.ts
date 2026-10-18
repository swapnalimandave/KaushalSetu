import {
  StudentProfile,
  CareerOption,
  LearningProgress,
  SkillProofData,
  ApplicationPreparation,
  Opportunity,
  NextStepInfo,
  LivelihoodStage,
  StudentNotification,
} from '../../types';
import { profileService } from '../profile/profileService';
import { recommendationService } from '../recommendations/recommendationService';
import { learningService } from '../learning/learningService';
import { skillProofService } from '../skillproof/skillProofService';
import { opportunityService } from '../opportunities/opportunityService';
import { applicationService } from '../applications/applicationService';
import { nextStepService } from '../nextstep/nextStepService';
import { calculateJourneyStages, getStoredOutcome } from '../../utils/journeyManager';

export interface StudentHomeSummary {
  goal: {
    timeline: string;
    targetEarning: string;
    careerTitle: string;
    careerTitleMr: string;
  };
  earnPathProgress: {
    overallProgress: number;
    currentWeek: number;
    completedLessonsCount: number;
    totalLessonsCount: number;
    downloadedWeeks: number[];
  };
  nextStep: NextStepInfo;
  skillSummary: {
    isVerified: boolean;
    status: SkillProofData['status'];
    skillTitle: string;
    skillTitleMr: string;
    verifiedAt?: string;
  };
  opportunitySummary: {
    topMatches: Opportunity[];
    savedCount: number;
    bestOpportunityTitle: string;
  };
  applicationSummary: {
    status: ApplicationPreparation['status'];
    stepsCompleted: number;
    totalSteps: number;
    isReadyToVisit: boolean;
  };
  journey: {
    currentStage: string;
    stages: LivelihoodStage[];
  };
  notifications: StudentNotification[];
}

export const studentHomeService = {
  getStudentHomeSummary(
    customProfile?: StudentProfile,
    customCareer?: CareerOption
  ): StudentHomeSummary {
    const profile = customProfile || profileService.getProfile();
    const career = customCareer || recommendationService.calculateDeterministicMatches(profile).bestMatch;
    const progress = learningService.getProgress();
    const skillProof = skillProofService.getSkillProof();
    const application = applicationService.getApplication();
    const opportunities = opportunityService.getOpportunities();

    const nextStep = nextStepService.calculateNextStep({
      profile,
      career,
      progress,
      skillProof,
      application,
      opportunities,
    });

    const outcome = getStoredOutcome();
    const stages = calculateJourneyStages(career, progress, skillProof, application, outcome);

    const isVerified = skillProof.status === 'verified';
    const stepsCompleted = application.steps.filter((s) => s.done).length;

    const notifications: StudentNotification[] = [
      {
        id: 'notif-1',
        title: 'Week 2 Lesson Available',
        titleMr: 'आठवडा २ चा पाठ उपलब्ध आहे',
        body: 'Diagnosing Charging Problems is ready for you to study today.',
        bodyMr: 'चार्जिंगच्या तक्रारी तपासणे हा पाठ आज अभ्यासासाठी तयार आहे.',
        type: 'learning',
        timestamp: 'Today',
        read: false,
      },
      {
        id: 'notif-2',
        title: 'SkillProof Verification Update',
        titleMr: 'कौशल्य पडताळणी अपडेट',
        body: 'Instructor Shinde verified your Tool Safety and Diagnostic preliminary checklist.',
        bodyMr: 'शिक्षक शिंदे सरांनी तुमची प्राथमिक तपासणी चेकलिस्ट मंजूर केली आहे.',
        type: 'skillproof',
        timestamp: 'Yesterday',
        read: false,
      },
      {
        id: 'notif-3',
        title: 'Apprenticeship Intake in Satara',
        titleMr: 'सातारा कार्यशाळेत नवीन प्रवेश',
        body: 'Sai Electronics has 2 apprentice seats opening for next month batch.',
        bodyMr: 'साई इलेक्ट्रॉनिक्समध्ये पुढील महिन्याच्या बॅचसाठी २ जागा उपलब्ध आहेत.',
        type: 'opportunity',
        timestamp: '2 days ago',
        read: true,
      },
    ];

    return {
      goal: {
        timeline: profile.earningTimeline || '3_months',
        targetEarning: '₹8,000 – ₹12,000 / month',
        careerTitle: career.title,
        careerTitleMr: career.titleMr,
      },
      earnPathProgress: {
        overallProgress: progress.overallProgress,
        currentWeek: progress.currentWeek,
        completedLessonsCount: progress.completedLessons.length,
        totalLessonsCount: 16,
        downloadedWeeks: progress.downloadedWeeks,
      },
      nextStep,
      skillSummary: {
        isVerified,
        status: skillProof.status,
        skillTitle: skillProof.skillTitle,
        skillTitleMr: skillProof.skillTitleMr,
        verifiedAt: skillProof.mentorReview?.verifiedAt,
      },
      opportunitySummary: {
        topMatches: opportunities.slice(0, 2),
        savedCount: opportunities.filter((o) => o.saved).length,
        bestOpportunityTitle: opportunities[0]?.title || 'Mobile Repair Apprentice',
      },
      applicationSummary: {
        status: application.status,
        stepsCompleted,
        totalSteps: application.steps.length,
        isReadyToVisit: stepsCompleted === application.steps.length,
      },
      journey: {
        currentStage: stages.find((s) => s.status === 'in_progress')?.id || 'learn',
        stages,
      },
      notifications,
    };
  },
};
