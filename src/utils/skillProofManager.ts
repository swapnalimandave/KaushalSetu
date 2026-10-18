import { SkillProofData, EvidenceData, MentorReviewData, AiReviewData } from '../types';

const SKILLPROOF_STORAGE_KEY = 'kaushalsetu_skillproof_data';

// Realistic SVG placeholder photo simulating a mobile repair multimeter diagnostic setup on a workmat
export const SAMPLE_PROJECT_PHOTO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="%23FAF9F4"><rect width="600" height="400" fill="%23FAF9F4"/><rect x="40" y="40" width="520" height="320" rx="16" fill="%230A1931" opacity="0.06"/><rect x="80" y="80" width="180" height="240" rx="14" fill="%23FFFFFF" stroke="%230A1931" stroke-width="3"/><rect x="100" y="100" width="140" height="40" rx="6" fill="%23DCECF3" stroke="%234A7FA7" stroke-width="2"/><text x="170" y="125" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="%230A1931">NO CHARGE</text><rect x="110" y="160" width="120" height="120" rx="6" fill="%23FAF9F4" stroke="%23D9E1E5" stroke-width="2"/><circle cx="170" cy="220" r="16" fill="%23F4C84A" opacity="0.4"/><text x="170" y="225" font-family="sans-serif" font-size="11" text-anchor="middle" fill="%230A1931">BATTERY 0%</text><rect x="300" y="90" width="110" height="170" rx="10" fill="%23EF6F61" stroke="%230A1931" stroke-width="3"/><rect x="315" y="105" width="80" height="35" rx="4" fill="%23FFFFFF" stroke="%230A1931" stroke-width="1.5"/><text x="355" y="128" font-family="monospace" font-size="14" font-weight="bold" text-anchor="middle" fill="%230A1931">3.78 V</text><circle cx="355" cy="180" r="22" fill="%23FAF9F4" stroke="%230A1931" stroke-width="2"/><path d="M355 180 L365 170" stroke="%230A1931" stroke-width="2.5"/><line x1="280" y1="280" x2="330" y2="230" stroke="%23C62828" stroke-width="3" stroke-linecap="round"/><line x1="260" y1="290" x2="310" y2="240" stroke="%230A1931" stroke-width="3" stroke-linecap="round"/><text x="300" y="370" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="%2317212B">Phone Diagnosis Bench · Ravi Patil</text></svg>`;

export const SAMPLE_VOICE_TRANSCRIPT = 
  "मी हा फोन तपासला. हा फोन चार्जर लावल्यावरही चालू होत नाहीये. संभाव्य कारणे: चार्जिंग पिनमध्ये धूळ असणे किंवा बॅटरी पूर्ण उतरलेली असणे. मी आधी मल्टीमीटरने व्होल्टेज ३.७ वोल्ट आहे का ते मोजले. उघडण्यापूर्वी मी बॅटरी कनेक्टर सुरक्षित बाजूला केला. माझी पुढची पायरी चार्जिंग फ्लेक्स स्वच्छ करणे ही आहे.";

export const SAMPLE_VOICE_TRANSCRIPT_EN = 
  "I inspected this phone because it does not turn on even with charger plugged in. Two possible causes: pocket lint inside the Type-C port, or a completely depleted battery. I used my multimeter to test voltage at 3.78V. Before testing, I followed safety by disconnecting power. Next, I will clean the port contact pins.";

export const INITIAL_SKILLPROOF: SkillProofData = {
  id: 'sp-mobile-repair-01',
  studentId: 'ravi-patil-18',
  studentName: 'Ravi Patil',
  pathwayId: 'mobile-repair',
  pathwayTitle: 'Mobile Device Repair Technician',
  skillId: 'basic-mobile-diagnosis',
  skillTitle: 'Basic Mobile Device Diagnosis',
  skillTitleMr: 'मोबाईल उपकरण प्राथमिक तपासणी व समस्या शोधणे',
  projectTitle: 'Basic Mobile Device Diagnosis',
  projectTitleMr: 'मोबाईल प्राथमिक तपासणी प्रात्यक्षिक प्रकल्प',
  taskBrief: 'Inspect a phone with a simple charging or battery-related issue and explain how you would diagnose the problem safely.',
  taskBriefMr: 'चार्जिंग किंवा बॅटरीची अडचण असलेल्या फोनची सुरक्षित तपासणी करा आणि तुम्ही दोष कसा शोधाल ते समजावून सांगा.',
  requirements: [
    'Identify the visible problem',
    'Mention at least 2 possible causes',
    'Show or name the tools you would use',
    'Explain one safety precaution',
    'Describe your next repair step',
  ],
  requirementsMr: [
    'दिसणारी मुख्य अडचण ओळखा',
    'किमान २ संभाव्य कारणे सांगा',
    'वापरलेली किंवा लागणारी अवजारे दाखवा/सांगा',
    'कामापूर्वीचा १ सुरक्षेचा नियम सांगा',
    'दुरुस्तीची पुढची पायरी स्पष्ट करा',
  ],
  status: 'unlocked', // Unlocked after completing week modules
  evidence: {
    photoUrl: SAMPLE_PROJECT_PHOTO,
    photoName: 'phone_multimeter_inspection.jpg',
    audioDurationSeconds: 42,
    audioTranscript: SAMPLE_VOICE_TRANSCRIPT,
    note: 'Tested on Xiaomi Redmi phone; tested adapter and multimeter readings.',
  },
};

export function getStoredSkillProof(): SkillProofData {
  try {
    const saved = localStorage.getItem(SKILLPROOF_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as SkillProofData;
    }
  } catch {
    // fallback
  }
  return INITIAL_SKILLPROOF;
}

export function saveStoredSkillProof(data: SkillProofData): void {
  try {
    localStorage.setItem(SKILLPROOF_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // quota
  }
}

export function updateSkillProofEvidence(evidence: Partial<EvidenceData>): SkillProofData {
  const current = getStoredSkillProof();
  const updated: SkillProofData = {
    ...current,
    evidence: {
      ...current.evidence,
      ...evidence,
    },
  };
  saveStoredSkillProof(updated);
  return updated;
}

export function generateAiPreliminaryReview(): AiReviewData {
  return {
    categories: [
      { name: 'Task Understanding', nameMr: 'कामाचे आकलन', rating: 'Good' },
      { name: 'Tool Awareness', nameMr: 'अवजारांची माहिती', rating: 'Good' },
      { name: 'Safety Awareness', nameMr: 'सुरक्षितता नियम', rating: 'Needs confirmation' },
      { name: 'Explanation Clarity', nameMr: 'स्पष्टीकरण सुस्पष्टता', rating: 'Clear' },
      { name: 'Problem Diagnosis', nameMr: 'दोष निदान तर्क', rating: 'Promising' },
    ],
    strengths: [
      'Clearly identified a charging-related issue on the device bench',
      'Mentioned appropriate basic tools (multimeter and safe opening pick)',
      'Explained the diagnosis in a logical sequence',
    ],
    strengthsMr: [
      'चार्जिंग न होण्याच्या समस्येचे अचूक निरीक्षण केले',
      'मल्टीमीटर आणि नायलॉन ओपनर या योग्य अवजारांचा उल्लेख केला',
      'तपासणीची पद्धत सुस्पष्ट व क्रमवार मांडली',
    ],
    improvements: [
      'Explain the safety step before opening the device (disconnecting the battery connector first)',
      'Mention how you would rule out a damaged cable or adapter before suspecting the internal port',
    ],
    improvementsMr: [
      'फोन उघडण्यापूर्वी बॅटरी डिस्कनेक्ट करण्याचा सुरक्षेचा नियम अधिक स्पष्ट करा',
      'अंतर्गत भाग तपासण्यापूर्वी चार्जर केबल खराब आहे का हे कसे तपासाल ते सांगा',
    ],
    reviewedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    disclaimer: 'AI feedback is only a preliminary review. Your mentor will make the final SkillProof decision.',
  };
}

export function submitSkillProof(): SkillProofData {
  const current = getStoredSkillProof();
  const aiReview = generateAiPreliminaryReview();
  const updated: SkillProofData = {
    ...current,
    status: 'mentor_pending',
    aiReview,
    submittedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
  saveStoredSkillProof(updated);
  return updated;
}

export function mentorVerifySkill(reviewerName = 'Sunil Deshmukh (Lead Vocational Trainer)'): SkillProofData {
  const current = getStoredSkillProof();
  const mentorReview: MentorReviewData = {
    rubricScores: {
      'Problem Identification': 'Meets',
      'Tool Awareness': 'Meets',
      'Safe Handling Awareness': 'Meets',
      'Logical Diagnosis Process': 'Meets',
      'Next Action Explanation': 'Meets',
    },
    decision: 'verify',
    feedbackNote: 'Ravi demonstrated safe multimeter handling and understood the charging circuit principles. Approved for foundational SkillProof.',
    reviewerName,
    reviewerRole: 'Master Trainer, District Rural Skill Center',
    reviewedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
  };

  const updated: SkillProofData = {
    ...current,
    status: 'verified',
    mentorReview,
    verifiedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
  saveStoredSkillProof(updated);
  return updated;
}

export function mentorRequestImprovement(note: string, reasons: string[]): SkillProofData {
  const current = getStoredSkillProof();
  const mentorReview: MentorReviewData = {
    rubricScores: {
      'Problem Identification': 'Meets',
      'Tool Awareness': 'Meets',
      'Safe Handling Awareness': 'Needs Improvement',
      'Logical Diagnosis Process': 'Meets',
      'Next Action Explanation': 'Needs Improvement',
    },
    decision: 'request_improvement',
    feedbackNote: note || 'Please re-record your voice note explaining how you disconnect the battery safely before testing.',
    improvementReasons: reasons.length > 0 ? reasons : ['Safety step missing', 'Explanation needs more detail'],
    reviewerName: 'Sunil Deshmukh (Lead Vocational Trainer)',
    reviewerRole: 'Master Trainer, District Rural Skill Center',
    reviewedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
  };

  const updated: SkillProofData = {
    ...current,
    status: 'improvement_requested',
    mentorReview,
  };
  saveStoredSkillProof(updated);
  return updated;
}
