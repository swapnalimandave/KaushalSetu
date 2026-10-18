import { LanguageCode, StudentProfile, CareerOption, SkillProofData, Opportunity, ApplicationPreparation } from './index';

// 1. Users collection
export interface UserRecord {
  id: string;
  role: 'student' | 'facilitator';
  displayName: string;
  preferredLanguage: LanguageCode;
  createdAt: string;
  updatedAt: string;
}

// 2. StudentProfiles collection (Sanitized: NO Aadhaar, NO bank numbers, NO passwords)
export interface StudentProfileRecord {
  studentId: string;
  name: string;
  age: number;
  state: string;
  education: string;
  interests: string[];
  existingSkills: string[];
  workPreferences: string[];
  earningTimeline: string;
  travelPreference: string;
  deviceAccess: string;
  internetAccess: string;
  learningPreferences: string[];
  selectedCareerId: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// 3. CareerProfiles collection
export interface CareerProfileRecord {
  id: string;
  title: string;
  titleMr: string;
  titleHi: string;
  category: string;
  description: string;
  minimumEducation: string;
  compatibleInterests: string[];
  compatibleSkills: string[];
  compatibleWorkStyles: string[];
  trainingDurationWeeks: number;
  earningTimelineCategory: string;
  travelRequirement: string;
  internetRequirement: string;
  deviceRequirement: string;
  learningModes: string[];
  startingResourceLevel: string;
  pathwaySummary: string;
  active: boolean;
  isSampleData: boolean;
}

// 4. CareerRecommendations collection
export interface CareerRecommendationRecord {
  id: string;
  studentId: string;
  careerId: string;
  structuredScore: number;
  scoreBreakdown: {
    interestAlignment: number;
    existingSkillFit: number;
    workPreference: number;
    educationFit: number;
    earningTimelineFit: number;
    travelFit: number;
    learningPreference: number;
    deviceInternetFit: number;
  };
  hardConstraintResult: {
    eligible: boolean;
    reasons: string[];
  };
  generatedExplanation: string;
  strengthSummary: Array<{
    title: string;
    description: string;
  }>;
  improvementAreas: string[];
  alternativeExplanations?: Record<string, string>;
  isFallback?: boolean;
  generatedAt: string;
}

// 5. LearningPaths collection
export interface LearningPathRecord {
  id: string;
  studentId: string;
  careerId: string;
  title: string;
  durationWeeks: number;
  personalizationReason: string;
  status: 'active' | 'completed';
  weeks: Array<{
    weekNumber: number;
    title: string;
    goal: string;
    lessonIds: string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

// 6. Lessons collection
export interface LessonRecord {
  id: string;
  careerId: string;
  week: number;
  title: string;
  titleMr: string;
  description: string;
  durationMinutes: number;
  contentSections: Array<{
    id: string;
    heading: string;
    body: string;
    audioSnippet?: string;
  }>;
  audioText: string;
  visualData?: Record<string, any>;
  quiz: {
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }>;
  };
  practicalTask?: {
    id: string;
    title: string;
    instructions: string[];
    safetyNote: string;
  };
  offlineAvailable: boolean;
  version: string;
}

// 7. LearningProgress collection
export interface LearningProgressRecord {
  studentId: string;
  pathwayId: string;
  currentWeek: number;
  overallProgress: number;
  lastOpenedLesson: string;
  lessonProgress: Record<string, {
    status: 'locked' | 'available' | 'completed';
    quizScore?: number;
    attempts: number;
    completedAt?: string;
    downloaded?: boolean;
  }>;
  completedTasks: string[];
  updatedAt: string;
}

// 8. SkillProofs collection
export interface SkillProofRecord {
  id: string;
  studentId: string;
  pathwayId: string;
  skillId: string;
  projectTitle: string;
  status: 'draft' | 'submitted' | 'ai_reviewed' | 'mentor_pending' | 'improvement_requested' | 'verified';
  evidenceMetadata: {
    photosCount: number;
    audioDurationSeconds: number;
    notesWordCount: number;
  };
  transcript: string;
  aiReview: {
    taskUnderstanding: 'Good' | 'Promising' | 'Clear' | 'Needs Confirmation' | 'Needs Improvement';
    toolAwareness: 'Good' | 'Promising' | 'Clear' | 'Needs Confirmation' | 'Needs Improvement';
    safetyAwareness: 'Good' | 'Promising' | 'Clear' | 'Needs Confirmation' | 'Needs Improvement';
    explanationClarity: 'Good' | 'Promising' | 'Clear' | 'Needs Confirmation' | 'Needs Improvement';
    problemDiagnosis: 'Good' | 'Promising' | 'Clear' | 'Needs Confirmation' | 'Needs Improvement';
    strengths: string[];
    improvements: string[];
  } | null;
  mentorReview: {
    reviewerId: string;
    reviewerName: string;
    decision: 'verified' | 'needs_improvement';
    feedbackNote: string;
    verifiedAt: string;
    rubricScores: Record<string, boolean>;
  } | null;
  submittedAt: string;
  updatedAt: string;
  verifiedAt: string | null;
}

// 9. VerifiedSkills collection
export interface VerifiedSkillRecord {
  id: string;
  studentId: string;
  skillId: string;
  skillName: string;
  skillProofId: string;
  verifiedBy: string;
  verifiedAt: string;
  status: 'verified';
}

// 10. Opportunities collection
export interface OpportunityRecord {
  id: string;
  title: string;
  titleMr: string;
  organization: string;
  type: 'Apprenticeship' | 'Govt Training' | 'Entry Job' | 'Self Employment';
  location: string;
  distanceKm: number;
  minimumEducation: string;
  minimumAge: number;
  maximumAge: number;
  requiredSkills: string[];
  preferredSkills: string[];
  trainingRequired: boolean;
  travelRequirement: string;
  documentsRequired: string[];
  deadline: string;
  sourceName: string;
  sourceType: 'Government Portal' | 'Industry Partner' | 'Local Workshop' | 'NGO Partner';
  sourceUrl?: string;
  verificationStatus: 'verified' | 'pending';
  lastCheckedDate: string;
  description: string;
  descriptionMr?: string;
  stipendOrSalaryText: string;
  applicationMethod: string;
  isSampleData: boolean;
  active: boolean;
}

// 11. SavedOpportunities
export interface SavedOpportunityRecord {
  studentId: string;
  opportunityId: string;
  savedAt: string;
}

// 12. Applications collection
export interface ApplicationRecord {
  id: string;
  studentId: string;
  opportunityId: string;
  status: 'not_started' | 'preparing' | 'ready_to_apply' | 'application_started' | 'submitted_externally' | 'follow_up_needed';
  profileConfirmed: boolean;
  documentReadiness: {
    aadhaar: boolean;
    class10Certificate: boolean;
    passportPhoto: boolean;
    bankDetails: boolean;
  };
  skillProofReady: boolean;
  sourceReviewed: boolean;
  startedAt: string;
  updatedAt: string;
  externalSubmittedAt: string | null;
}

// 13. FacilitatorNotes
export interface FacilitatorNoteRecord {
  id: string;
  studentId: string;
  facilitatorId: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

// 14. Notifications
export interface NotificationRecord {
  id: string;
  studentId: string;
  type: 'skill_verified' | 'opportunity_match' | 'deadline_soon' | 'lesson_ready' | 'improvement_requested';
  title: string;
  titleMr?: string;
  message: string;
  messageMr?: string;
  read: boolean;
  createdAt: string;
  actionRoute: string;
}

// 15. JourneyEvents
export interface JourneyEventRecord {
  id: string;
  studentId: string;
  stage: 'discover' | 'learn' | 'prove' | 'match' | 'apply' | 'outcome';
  eventType: string;
  referenceId: string;
  createdAt: string;
}

// Offline sync queue item
export interface OfflineQueueItem {
  id: string;
  entityType: 'learningProgress' | 'skillProof' | 'application' | 'profile';
  operation: 'create' | 'update' | 'upsert';
  payload: any;
  createdAt: string;
}

// AI response schemas
export interface GeminiCareerExplanationResponse {
  strengths: Array<{
    title: string;
    description: string;
  }>;
  mainRecommendationExplanation: string;
  improvementAreas: string[];
  alternativeExplanations: Record<string, string>;
}

export interface GeminiSkillProofReviewResponse {
  taskUnderstanding: 'Good' | 'Promising' | 'Clear' | 'Needs Confirmation' | 'Needs Improvement';
  toolAwareness: 'Good' | 'Promising' | 'Clear' | 'Needs Confirmation' | 'Needs Improvement';
  safetyAwareness: 'Good' | 'Promising' | 'Clear' | 'Needs Confirmation' | 'Needs Improvement';
  explanationClarity: 'Good' | 'Promising' | 'Clear' | 'Needs Confirmation' | 'Needs Improvement';
  problemDiagnosis: 'Good' | 'Promising' | 'Clear' | 'Needs Confirmation' | 'Needs Improvement';
  strengths: string[];
  improvements: string[];
}

export interface GeminiAssistantResponse {
  text: string;
  suggestedAction?: {
    label: string;
    route: string;
  };
}
