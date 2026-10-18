import {
  StudentProfile,
  CareerOption,
  LearningProgress,
  SkillProofData,
  ApplicationPreparation,
  Opportunity,
  NextStepInfo,
} from '../types';

export interface StudentStateInput {
  profile: StudentProfile;
  career: CareerOption | null;
  progress: LearningProgress;
  skillProof: SkillProofData;
  application: ApplicationPreparation;
  opportunities: Opportunity[];
}

export function getNextStep(state: StudentStateInput): NextStepInfo {
  const { profile, career, progress, skillProof, application, opportunities } = state;

  // 1. Incomplete onboarding
  if (!profile.name || !profile.education || !profile.interests || profile.interests.length === 0) {
    return {
      priority: 1,
      statusType: 'onboarding',
      categoryLabel: 'YOUR NEXT STEP',
      categoryLabelMr: 'तुमची पुढची पायरी',
      actionType: 'Complete discovery',
      actionTypeMr: 'माहिती पूर्ण करा',
      title: 'Complete your potential discovery',
      titleMr: 'तुमची क्षमता व आवड शोध पूर्ण करा',
      duration: '4 min',
      description: 'Answer simple questions about your interests and resources to find your best livelihood path.',
      descriptionMr: 'तुमच्यासाठी योग्य उपजीविकेचा मार्ग शोधण्यासाठी काही सोप्या प्रश्नांची उत्तरे द्या.',
      ctaLabel: 'Resume Discovery',
      ctaLabelMr: 'शोध सुरू करा',
      ctaRoute: 'onboarding',
      badgeText: 'Step 1 of 8',
      badgeTextMr: 'पायरी १ / ८',
    };
  }

  // 2. No career selected
  if (!career) {
    return {
      priority: 2,
      statusType: 'career_select',
      categoryLabel: 'YOUR NEXT STEP',
      categoryLabelMr: 'तुमची पुढची पायरी',
      actionType: 'Choose pathway',
      actionTypeMr: 'मार्ग निवडा',
      title: 'Select your recommended career',
      titleMr: 'तुमचा शिफारस केलेला करिअर मार्ग निवडा',
      duration: '2 min',
      description: 'Review your personalized matches and pick the pathway that fits your timeline.',
      descriptionMr: 'तुमच्यासाठी सुचवलेले पर्याय तपासा आणि तुमच्या वेळेनुसार मार्ग निश्चित करा.',
      ctaLabel: 'View Recommendations',
      ctaLabelMr: 'शिफारशी पहा',
      ctaRoute: 'potential',
      badgeText: 'Ready',
      badgeTextMr: 'तयार आहे',
    };
  }

  // 11/12. Application preparation with missing items
  // If an application has already started and missing items exist, this can take high priority if lessons are done or as user explores
  const missingStep = application?.steps?.find((s) => !s.done);

  // 8. SkillProof improvement requested
  if (skillProof.status === 'improvement_requested') {
    return {
      priority: 8,
      statusType: 'skillproof_improvement',
      categoryLabel: 'YOUR NEXT STEP',
      categoryLabelMr: 'तुमची पुढची पायरी',
      actionType: 'Update evidence',
      actionTypeMr: 'माहिती सुधारा',
      title: 'Update your SkillProof submission',
      titleMr: 'प्रात्यक्षिक तपासणी माहिती अद्ययावत करा',
      duration: '5 min',
      description: 'Your mentor requested a clearer multimeter observation note before approving your badge.',
      descriptionMr: 'प्रमाणित बॅजसाठी तुमच्या शिक्षकांनी मल्टीमीटर नोंदी सुधारण्यास सांगितले आहे.',
      ctaLabel: 'Open SkillProof',
      ctaLabelMr: 'प्रकल्प उघडा',
      ctaRoute: 'skillproof',
      badgeText: 'Action needed',
      badgeTextMr: 'सुधारणा आवश्यक',
    };
  }

  // 9. Mentor verification pending
  if (
    skillProof.status === 'submitted' ||
    skillProof.status === 'ai_reviewed' ||
    skillProof.status === 'mentor_pending'
  ) {
    return {
      priority: 9,
      statusType: 'mentor_pending',
      categoryLabel: 'YOUR NEXT STEP',
      categoryLabelMr: 'तुमची पुढची पायरी',
      actionType: 'Review submission',
      actionTypeMr: 'स्थिती पहा',
      title: 'Wait for mentor verification',
      titleMr: 'शिक्षकांच्या अंतिम पडताळणीची प्रतीक्षा',
      duration: 'Reviewing',
      description: 'Your diagnosis audio & bench photo have cleared preliminary AI screening and are with Instructor Shinde.',
      descriptionMr: 'तुमचे फोटो व ऑडिओ शिक्षकांकडे अंतिम मंजुरीसाठी पाठवले गेले आहेत.',
      ctaLabel: 'Track Status',
      ctaLabelMr: 'स्थिती तपासा',
      ctaRoute: 'skillproof',
      badgeText: 'Under review',
      badgeTextMr: 'तपासणी सुरू',
    };
  }

  // 6. SkillProof unlock (Week 4 reached and ready)
  if (skillProof.status === 'unlocked' && progress.currentWeek >= 4) {
    return {
      priority: 6,
      statusType: 'skillproof_unlock',
      categoryLabel: 'YOUR NEXT STEP',
      categoryLabelMr: 'तुमची पुढची पायरी',
      actionType: 'Submit evidence',
      actionTypeMr: 'कौशल्य सिद्ध करा',
      title: 'Submit your SkillProof project',
      titleMr: 'प्रात्यक्षिक तपासणी प्रकल्प सादर करा',
      duration: '15 min',
      description: 'Show that you can inspect a device problem, record your audio explanation, and earn your verified badge.',
      descriptionMr: 'फोन तपासणीचा फोटो व व्हॉइस रेकॉर्डिंग सादर करून अधिकृत बॅज मिळवा.',
      ctaLabel: 'Submit SkillProof',
      ctaLabelMr: 'प्रकल्प सादर करा',
      ctaRoute: 'skillproof',
      badgeText: 'Milestone',
      badgeTextMr: 'महत्त्वाचा टप्पा',
    };
  }

  // 3. Active Lesson (DEMO STATE: Week 2 in progress, Diagnosing Charging Problems)
  // If student is currently working through lessons
  const isWeek2InProgress = progress.currentWeek === 2 || !progress.completedLessons.includes('charging-problems');
  if (isWeek2InProgress) {
    return {
      priority: 3,
      statusType: 'active_lesson',
      categoryLabel: 'YOUR NEXT STEP',
      categoryLabelMr: 'तुमची पुढची पायरी',
      actionType: 'Continue learning',
      actionTypeMr: 'शिकणे सुरू ठेवा',
      title: 'Diagnosing Charging Problems',
      titleMr: 'चार्जिंगच्या तक्रारी तपासणे',
      duration: '8 min',
      description: 'Finish this lesson to move closer to your Week 2 practical task.',
      descriptionMr: 'हा पाठ पूर्ण करून तुमच्या दुसऱ्या आठवड्यातील प्रत्यक्ष तपासणी चेकलिस्टकडे पाऊल टाका.',
      ctaLabel: 'Continue Lesson',
      ctaLabelMr: 'पाठ सुरू करा',
      ctaRoute: 'lesson_detail',
      badgeText: 'Week 2 · 8 min',
      badgeTextMr: 'आठवडा २ · ८ मिनिटे',
    };
  }

  // 5. Week practical task
  if (progress.currentWeek === 2 && !progress.completedTasks.includes('task-w2')) {
    return {
      priority: 5,
      statusType: 'week_task',
      categoryLabel: 'YOUR NEXT STEP',
      categoryLabelMr: 'तुमची पुढची पायरी',
      actionType: 'Hands-on task',
      actionTypeMr: 'प्रात्यक्षिक काम',
      title: 'Complete Week 2 Diagnostic Checklist',
      titleMr: 'आठवडा २: समस्या तपासणी चेकलिस्ट पूर्ण करा',
      duration: '12 min',
      description: 'Practice the 3-point inspection routine on an inoperative device before Week 3.',
      descriptionMr: 'फोन न उघडता संशयित बिघाड तपासण्याचा प्रत्यक्ष सराव करा.',
      ctaLabel: 'Start Task',
      ctaLabelMr: 'सराव सुरू करा',
      ctaRoute: 'earnpath',
      badgeText: 'Practical task',
      badgeTextMr: 'प्रात्यक्षिक काम',
    };
  }

  // 10. Verified skill with no opportunity opened / prepared
  if (skillProof.status === 'verified' && (!application || application.status === 'draft')) {
    return {
      priority: 10,
      statusType: 'opportunity_new',
      categoryLabel: 'YOUR NEXT STEP',
      categoryLabelMr: 'तुमची पुढची पायरी',
      actionType: 'Match opportunity',
      actionTypeMr: 'संधी शोधा',
      title: 'Check your best opportunity match',
      titleMr: 'तुमच्यासाठी सर्वोत्तम संधी तपासा',
      duration: '3 min',
      description: 'Your diagnostic badge is verified. 4 local apprenticeships and training programs match your profile.',
      descriptionMr: 'तुमचा बॅज प्रमाणित झाला आहे. सातारा परिसरातील ४ शिकाऊ व प्रशिक्षण संधी उपलब्ध आहेत.',
      ctaLabel: 'Explore Matches',
      ctaLabelMr: 'संधी पहा',
      ctaRoute: 'opportunities_placeholder',
      badgeText: '4 Matches',
      badgeTextMr: '४ संधी उपलब्ध',
    };
  }

  // 11. Eligible opportunity with missing documents
  if (missingStep) {
    return {
      priority: 11,
      statusType: 'application_docs',
      categoryLabel: 'YOUR NEXT STEP',
      categoryLabelMr: 'तुमची पुढची पायरी',
      actionType: 'Prepare application',
      actionTypeMr: 'अर्जाची तयारी',
      title: 'Prepare your application',
      titleMr: 'अर्जाची तयारी पूर्ण करा',
      duration: '5 min',
      description: `3 of 5 steps ready for Mobile Repair Apprentice at ${application.provider}. Missing: ${missingStep.label}.`,
      descriptionMr: `५ पैकी ३ पायऱ्या पूर्ण झाल्या आहेत. अपूर्ण: ${missingStep.labelMr}.`,
      ctaLabel: 'Complete Preparation',
      ctaLabelMr: 'तयारी पूर्ण करा',
      ctaRoute: 'opportunities_placeholder',
      badgeText: '3 of 5 ready',
      badgeTextMr: '५ पैकी ३ पूर्ण',
    };
  }

  // 13. External application started / submitted
  if (application?.status === 'applied') {
    return {
      priority: 13,
      statusType: 'application_submitted',
      categoryLabel: 'YOUR NEXT STEP',
      categoryLabelMr: 'तुमची पुढची पायरी',
      actionType: 'Track status',
      actionTypeMr: 'पाठपुरावा',
      title: 'Track your application',
      titleMr: 'तुमच्या अर्जाचा पाठपुरावा करा',
      duration: 'Follow-up',
      description: `Application packet prepared for ${application.provider}. Next: Visit the workshop for a short greeting.`,
      descriptionMr: `${application.provider} साठी कागदपत्रे तयार आहेत. दुकानात जाऊन मालकांशी भेट घ्या.`,
      ctaLabel: 'View Checklist',
      ctaLabelMr: 'चेकलिस्ट पहा',
      ctaRoute: 'opportunities_placeholder',
      badgeText: 'Packet ready',
      badgeTextMr: 'कागदपत्रे तयार',
    };
  }

  // 14. Default fallback: EarnPath
  return {
    priority: 14,
    statusType: 'followup',
    categoryLabel: 'YOUR NEXT STEP',
    categoryLabelMr: 'तुमची पुढची पायरी',
    actionType: 'Continue journey',
    actionTypeMr: 'प्रवास सुरू ठेवा',
    title: 'Continue your 4-week EarnPath',
    titleMr: 'तुमचा ४ आठवड्यांचा मार्ग पुढे चालू ठेवा',
    duration: 'Ongoing',
    description: 'Keep building practical skills toward district smartphone repair apprenticeship.',
    descriptionMr: 'स्थानिक रोजगारासाठी तुमचे व्यावहारिक कौशल्य वाढवत रहा.',
    ctaLabel: 'Open EarnPath',
    ctaLabelMr: 'मार्ग उघडा',
    ctaRoute: 'earnpath',
    badgeText: 'Pathway active',
    badgeTextMr: 'मार्ग सक्रिय',
  };
}
