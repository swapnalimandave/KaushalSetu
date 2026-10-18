export type LanguageCode = 'mr' | 'hi' | 'en';

export interface LanguageOption {
  id: LanguageCode;
  nativeLabel: string;
  englishLabel: string;
  subtitle: string;
}

export type ScreenState = 
  | 'welcome' 
  | 'onboarding' 
  | 'onboarding_review' 
  | 'discovery_analysis' 
  | 'potential'
  | 'home'
  | 'journey'
  | 'earnpath'
  | 'lesson_detail'
  | 'downloads'
  | 'skillproof'
  | 'facilitator_review'
  | 'profile_skills'
  | 'opportunities_placeholder'
  | 'facilitator';

export interface StudentProfile {
  language: LanguageCode;
  name: string;
  phone?: string;
  age: number;
  state: string;
  education: string;
  interests: string[];
  existingSkills: string[];
  customSkill?: string;
  workPreferences: string[];
  earningTimeline: string;
  travelPreference: string;
  deviceAccess: string;
  internetAccess: string;
  learningPreferences: string[];
}

export interface CareerOption {
  id: string;
  title: string;
  titleMr: string;
  titleHi: string;
  category: string;
  matchScore: number;
  minimumEducation: string;
  interests: string[];
  skills: string[];
  workStyles: string[];
  trainingDurationWeeks: number;
  earningTimelineCategory: string;
  travelRequirement: string;
  internetRequirement: string;
  deviceRequirement: string;
  learningModes: string[];
  startingResourceLevel: 'Low' | 'Low to moderate' | 'Moderate' | 'High';
  description: string;
  descriptionMr: string;
  descriptionHi: string;
  tagline: string;
  tags: string[];
  fitReasons: string[];
  fitReasonsMr: string[];
  fitBreakdown: {
    interestMatch: 'Strong' | 'Good' | 'Moderate';
    currentSkills: 'Strong' | 'Good' | 'Developing';
    learningStyle: 'Strong' | 'Good' | 'Moderate';
    timeToEarning: 'Strong' | 'Good' | 'Moderate';
    travelRequirement: 'Suitable' | 'Possible' | 'Challenging';
    deviceInternetFit: 'Suitable' | 'Moderate';
  };
  skillsToImprove: string[];
  skillsToImproveMr: string[];
  pathwaySummary: {
    learningStyle: string;
    typicalStartingPath: string;
    initialEquipmentNeed: string;
    mobility: string;
    internetDependency: string;
  };
  whyFitsShort: string;
  whatMayBeDifficult: string[];
  trainingCommitment: string;
  currentReadiness: string;
}

export type LessonFormat = 'Audio' | 'Visual Guide' | 'Quick Read' | 'Quiz' | 'Practical Task';

export type LessonStatus = 'completed' | 'in_progress' | 'available' | 'locked';

export interface Lesson {
  id: string;
  title: string;
  titleMr: string;
  titleHi: string;
  durationMinutes: number;
  formats: LessonFormat[];
  status: LessonStatus;
  downloaded: boolean;
  order: number;
  summary: string;
  summaryMr: string;
}

export interface PracticalTask {
  id: string;
  title: string;
  titleMr: string;
  instructions: string[];
  instructionsMr: string[];
  completed: boolean;
  notes?: string;
}

export interface WeekModule {
  weekNumber: number;
  theme: string;
  themeMr: string;
  accentColor: 'blue' | 'yellow' | 'green' | 'coral';
  goal: string;
  goalMr: string;
  status: 'Completed' | 'In Progress' | 'Available' | 'Locked';
  lessons: Lesson[];
  task: PracticalTask;
  downloadSizeMb: number;
  isDownloaded: boolean;
}

export interface LearningProgress {
  pathwayId: string;
  overallProgress: number; // 0 to 100
  currentWeek: number;
  completedLessons: string[];
  completedTasks: string[];
  lessonQuizScores: Record<string, { score: number; total: number; attempts: number }>;
  downloadedWeeks: number[];
  downloadedLessons: string[];
  lastOpenedLessonId: string;
}

export type SkillProofStatus = 
  | 'unlocked'
  | 'draft'
  | 'submitted'
  | 'ai_reviewed'
  | 'mentor_pending'
  | 'improvement_requested'
  | 'verified';

export interface EvidenceData {
  photoUrl?: string;
  photoName?: string;
  audioBlobUrl?: string;
  audioDurationSeconds?: number;
  audioTranscript?: string;
  note?: string;
}

export interface AiReviewCategory {
  name: string;
  nameMr: string;
  rating: 'Good' | 'Clear' | 'Promising' | 'Needs confirmation' | 'Developing';
}

export interface AiReviewData {
  categories: AiReviewCategory[];
  strengths: string[];
  strengthsMr: string[];
  improvements: string[];
  improvementsMr: string[];
  reviewedAt: string;
  disclaimer: string;
}

export interface MentorReviewData {
  rubricScores: Record<string, 'Meets' | 'Needs Improvement'>;
  decision: 'verify' | 'request_improvement' | null;
  feedbackNote: string;
  improvementReasons?: string[];
  reviewerName: string;
  reviewerRole: string;
  reviewedAt: string;
}

export interface SkillProofData {
  id: string;
  studentId: string;
  studentName: string;
  pathwayId: string;
  pathwayTitle: string;
  skillId: string;
  skillTitle: string;
  skillTitleMr: string;
  projectTitle: string;
  projectTitleMr: string;
  taskBrief: string;
  taskBriefMr: string;
  requirements: string[];
  requirementsMr: string[];
  status: SkillProofStatus;
  evidence: EvidenceData;
  aiReview?: AiReviewData;
  mentorReview?: MentorReviewData;
  submittedAt?: string;
  verifiedAt?: string;
}

export type OpportunityType = 'Apprenticeship' | 'Entry Role' | 'Govt Training' | 'Micro-Workshop';

export interface Opportunity {
  id: string;
  title: string;
  titleMr: string;
  titleHi: string;
  provider: string;
  location: string;
  locationType: 'Nearby town' | 'District HQ' | 'Within Block';
  distanceKm: number;
  type: OpportunityType;
  matchLevel: 'Strong Match' | 'Good Match' | 'Eligible';
  matchLevelMr: string;
  stipendOrSalary: string;
  duration: string;
  requiredSkills: string[];
  requiredSkillsMr: string[];
  requiredEducation: string;
  eligibilityMet: boolean;
  whyFits: string;
  whyFitsMr: string;
  documentsNeeded: string[];
  documentsNeededMr: string[];
  isVerifiedPartner: boolean;
  deadlineText?: string;
  saved?: boolean;
}

export interface ApplicationStep {
  id: string;
  label: string;
  labelMr: string;
  done: boolean;
  required: boolean;
  helpText?: string;
}

export interface ApplicationPreparation {
  opportunityId: string;
  opportunityTitle: string;
  provider: string;
  status: 'draft' | 'in_preparation' | 'ready_to_visit' | 'applied' | 'interview_scheduled';
  steps: ApplicationStep[];
  startedAt: string;
  notes?: string;
}

export type LivelihoodStageId = 'discover' | 'learn' | 'prove' | 'match' | 'apply' | 'outcome';
export type StageStatus = 'completed' | 'current' | 'upcoming';

export type LivelihoodOutcomeStatus = 
  | 'not_started'
  | 'applied'
  | 'interview_scheduled'
  | 'apprenticeship_offered'
  | 'job_offered'
  | 'training_joined'
  | 'self_employment_started'
  | 'no_outcome_yet';

export interface LivelihoodStage {
  id: LivelihoodStageId;
  order: number;
  label: string;
  labelMr: string;
  labelHi: string;
  status: StageStatus;
  summary: string;
  summaryMr: string;
  highlightDetail?: string;
  routeTarget: ScreenState;
}

export interface StudentNotification {
  id: string;
  title: string;
  titleMr: string;
  body: string;
  bodyMr: string;
  type: 'learning' | 'skillproof' | 'opportunity' | 'document' | 'system';
  timestamp: string;
  read: boolean;
  actionRoute?: ScreenState;
  actionLabel?: string;
  actionLabelMr?: string;
}

export interface NextStepInfo {
  priority: number;
  statusType: 
    | 'onboarding'
    | 'career_select'
    | 'active_lesson'
    | 'pending_quiz'
    | 'week_task'
    | 'skillproof_unlock'
    | 'skillproof_draft'
    | 'skillproof_improvement'
    | 'mentor_pending'
    | 'opportunity_new'
    | 'application_docs'
    | 'application_prep'
    | 'application_submitted'
    | 'followup';
  categoryLabel: string;
  categoryLabelMr: string;
  actionType: string;
  actionTypeMr: string;
  title: string;
  titleMr: string;
  duration?: string;
  description: string;
  descriptionMr: string;
  ctaLabel: string;
  ctaLabelMr: string;
  ctaRoute: ScreenState;
  badgeText?: string;
  badgeTextMr?: string;
}

export type FacilitatorSection = 
  | 'overview' 
  | 'learners' 
  | 'learner_detail' 
  | 'skillproof' 
  | 'review_detail' 
  | 'opportunities' 
  | 'reports';

export interface FacilitatorNote {
  id: string;
  date: string;
  author: string;
  category: 'call_log' | 'practical_workshop' | 'counseling' | 'tools_issued' | 'employer_intro';
  text: string;
}

export interface LearnerRecord {
  id: string;
  name: string;
  nameMr: string;
  phone: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  education: string;
  village: string;
  district: string;
  careerTrack: string;
  careerTrackMr: string;
  enrollmentDate: string;
  lastActiveDate: string;
  currentStage: LivelihoodStageId;
  overallProgress: number; // 0 to 100
  currentWeek: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  needsAttention: boolean;
  attentionReason?: string;
  attentionReasonMr?: string;
  attentionSeverity?: 'high' | 'medium' | 'low';
  skillProofStatus: SkillProofStatus;
  skillProofId?: string;
  targetOpportunity?: string;
  targetOpportunityProvider?: string;
  applicationStatus?: string;
  notes: FacilitatorNote[];
}

export interface FacilitatorMetrics {
  totalEnrolled: number;
  activeThisWeek: number;
  needsAttentionCount: number;
  skillProofPendingCount: number;
  skillsVerifiedCount: number;
  applicationsUnderwayCount: number;
  outcomesSecuredCount: number;
}
