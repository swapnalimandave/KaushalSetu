import {
  StudentProfile,
  CareerOption,
  LanguageCode,
} from '../../types';
import {
  GeminiCareerExplanationResponse,
  GeminiSkillProofReviewResponse,
  GeminiAssistantResponse,
} from '../../types/backend';
import { SkillProofEvidenceInput } from './prompts/skillProofPrompt';
import { AssistantContextInput } from './prompts/assistantPrompt';

const API_TIMEOUT_MS = 9000;

/**
 * Robust fetch wrapper with timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = API_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// ==========================================
// 1. CAREER EXPLANATION AI SERVICE
// ==========================================

export async function generateCareerExplanation(
  profile: StudentProfile,
  topCareer: CareerOption,
  alternatives: CareerOption[],
  language: LanguageCode
): Promise<{ data: GeminiCareerExplanationResponse; isFallback: boolean }> {
  try {
    const response = await fetchWithTimeout('/api/ai/career-explanation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, topCareer, alternatives, language }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const json = await response.json();
    if (json && json.data && validateCareerExplanation(json.data)) {
      return { data: json.data, isFallback: Boolean(json.isFallback) };
    }
    throw new Error('Invalid schema from AI endpoint');
  } catch (err) {
    // Non-blocking fallback
    return {
      data: getFallbackCareerExplanation(topCareer, language),
      isFallback: true,
    };
  }
}

function validateCareerExplanation(obj: any): obj is GeminiCareerExplanationResponse {
  return (
    obj &&
    Array.isArray(obj.strengths) &&
    typeof obj.mainRecommendationExplanation === 'string' &&
    Array.isArray(obj.improvementAreas)
  );
}

function getFallbackCareerExplanation(
  career: CareerOption,
  language: LanguageCode
): GeminiCareerExplanationResponse {
  if (language === 'mr') {
    return {
      strengths: [
        {
          title: 'तांत्रिक समज व प्रॅक्टिकल आवड',
          description: 'दुरुस्ती, जोडणी आणि साधनांचा अचूक वापर करण्याची तुमची क्षमता या क्षेत्रासाठी अत्यंत योग्य आहे.',
        },
        {
          title: 'कमी कालावधीत उत्पन्नाची संधी',
          description: '४ आठवड्यांत प्राथमिक कौशल्ये मिळवून स्थानिक दुकानात किंवा कार्यशाळेत लगेच काम सुरू करता येते.',
        },
      ],
      mainRecommendationExplanation:
        'तुमचे शिक्षण (१० वी), हाताने काम करण्याची आवड आणि ३ महिन्यांत कमावण्याचे उद्दिष्ट लक्षात घेता मोबाईल दुरुस्ती तंत्रज्ञ हा मार्ग सर्वात व्यवहार्य आहे.',
      improvementAreas: [
        'मल्टीमीटरचा अचूक व्होल्टेज व सातत्य (continuity) तपासण्यासाठी वापर',
        'सर्किट बोर्ड हाताळताना इलेक्ट्रोस्टॅटिक सुरक्षितता पाळणे',
      ],
      alternativeExplanations: {
        'digital-assistant': 'स्थानिक ग्राहक सेवा आणि सरकारी डिजिटल पोर्टल हाताळणीसाठी उत्तम पर्याय.',
        'solar-technician': 'गावात सौरऊर्जा पॅनेल बसवणे आणि देखभालीची वाढती मागणी.',
      },
    };
  }

  if (language === 'hi') {
    return {
      strengths: [
        {
          title: 'तकनीकी रुचि और व्यावहारिक समझ',
          description: 'उपकरणों की जांच और औजारों के उपयोग में आपकी व्यावहारिक क्षमता बहुत अच्छी है।',
        },
        {
          title: 'कम समय में आजीविका की शुरुआत',
          description: '4 हफ्तों में बुनियादी कौशल सीखकर स्थानीय दुकान में काम शुरू किया जा सकता है।',
        },
      ],
      mainRecommendationExplanation:
        'आपकी शिक्षा, व्यावहारिक काम में रुचि और जल्द कमाने के लक्ष्य को देखते हुए मोबाइल रिपेयर तकनीशियन सबसे उपयुक्त करियर है।',
      improvementAreas: [
        'मल्टीमीटर से वोल्टेज की सही जांच करना',
        'मदरबोर्ड पर काम करते समय बैटरी अलग रखने की सुरक्षा',
      ],
      alternativeExplanations: {
        'digital-assistant': 'डिजिटल सेवा केंद्र और ऑनलाइन फॉर्म भरने के लिए अच्छा विकल्प।',
        'solar-technician': 'ग्रामीण क्षेत्रों में सोलर इंस्टॉलेशन की बढ़ती मांग।',
      },
    };
  }

  return {
    strengths: [
      {
        title: 'Diagnostic and Hands-on Aptitude',
        description: 'Your preference for practical work and mechanical curiosity directly matches device diagnosis.',
      },
      {
        title: 'Realistic Quick-Earning Path',
        description: 'Requires only 4 weeks of foundational practice before apprentice or workshop placement.',
      },
    ],
    mainRecommendationExplanation:
      'Based on your Class 10 education, nearby town travel preference, and 3-month earning target, Mobile Device Repair Technician is your highest-return practical pathway.',
    improvementAreas: [
      'Mastering digital multimeter continuity testing',
      'Consistent battery disconnection safety discipline',
    ],
    alternativeExplanations: {
      'digital-assistant': 'Great alternative for administrative and CSC center assistance.',
      'solar-technician': 'Rapidly expanding renewable energy installation and service track.',
    },
  };
}

// ==========================================
// 2. SKILLPROOF PRELIMINARY REVIEW AI SERVICE
// ==========================================

export async function generateSkillProofReview(
  evidence: SkillProofEvidenceInput,
  language: LanguageCode
): Promise<{ data: GeminiSkillProofReviewResponse; isFallback: boolean }> {
  try {
    const response = await fetchWithTimeout('/api/ai/skillproof-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evidence, language }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const json = await response.json();
    if (json && json.data && validateSkillProofReview(json.data)) {
      return { data: json.data, isFallback: Boolean(json.isFallback) };
    }
    throw new Error('Invalid schema from AI endpoint');
  } catch (err) {
    return {
      data: getFallbackSkillProofReview(evidence, language),
      isFallback: true,
    };
  }
}

function validateSkillProofReview(obj: any): obj is GeminiSkillProofReviewResponse {
  return (
    obj &&
    typeof obj.taskUnderstanding === 'string' &&
    typeof obj.safetyAwareness === 'string' &&
    Array.isArray(obj.strengths) &&
    Array.isArray(obj.improvements)
  );
}

function getFallbackSkillProofReview(
  evidence: SkillProofEvidenceInput,
  language: LanguageCode
): GeminiSkillProofReviewResponse {
  const isMarathi = language === 'mr';
  return {
    taskUnderstanding: 'Good',
    toolAwareness: 'Clear',
    safetyAwareness: 'Clear',
    explanationClarity: 'Good',
    problemDiagnosis: 'Promising',
    strengths: isMarathi
      ? [
          'बॅटरी व्होल्टेज ३.७V पेक्षा कमी असल्याचे बरोबर ओळखले',
          'दुरुस्ती सुरू करण्यापूर्वी बॅटरी कनेक्टर वेगळा करण्याचा सुरक्षित नियम पाळला',
          'मल्टीमीटरचा योग्य डीसी रेंजवर वापर नोंदवला',
        ]
      : [
          'Correctly identified battery voltage below 3.7V threshold',
          'Demonstrated mandatory protocol: disconnect battery before inspecting sub-board',
          'Clear photo documentation of multimeter probes on battery terminals',
        ],
    improvements: isMarathi
      ? ['मदरबोर्ड हाताळताना अँटी-स्टॅटिक मॅट किंवा रिस्ट बँड वापरण्याचा स्पष्ट उल्लेख करावा']
      : ['Mention using an ESD wrist strap or grounded mat before handling internal PCB components'],
  };
}

// ==========================================
// 3. CONTEXTUAL ASSISTANT AI SERVICE
// ==========================================

export async function askKaushalAssistant(
  question: string,
  context: AssistantContextInput
): Promise<GeminiAssistantResponse> {
  try {
    const response = await fetchWithTimeout('/api/ai/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const json = await response.json();
    if (json && json.data && typeof json.data.text === 'string') {
      return json.data;
    }
    throw new Error('Invalid assistant response');
  } catch (err) {
    return getFallbackAssistantResponse(question, context);
  }
}

function getFallbackAssistantResponse(
  question: string,
  context: AssistantContextInput
): GeminiAssistantResponse {
  const q = question.toLowerCase();
  const lang = context.language;

  // Question: What should I do today?
  if (q.includes('what should i do') || q.includes('काय करू') || q.includes('आज काय')) {
    if (lang === 'mr') {
      return {
        text: 'तुमची पुढची पायरी "Inside a Smartphone" पाठ पूर्ण करणे आहे. यात ५ मिनिटांचा ऑडिओ आणि एक सोपी ३ प्रश्नांची क्विझ आहे. तुम्ही ती ऑफलाइनही सोडवू शकता.',
        suggestedAction: { label: 'पाठ सुरू करा', route: 'lesson_detail' },
      };
    }
    return {
      text: 'Your current next step is to study "Inside a Smartphone". It includes a 5-minute audio lesson and a 3-question practical check that you can complete offline.',
      suggestedAction: { label: 'Start Lesson', route: 'lesson_detail' },
    };
  }

  // Question: Why recommended?
  if (q.includes('why') || q.includes('का') || q.includes('क्यूं')) {
    if (lang === 'mr') {
      return {
        text: 'मोबाईल दुरुस्ती तंत्रज्ञ हा मार्ग तुमच्या १० वी शिक्षण, हाताने काम करण्याची आवड आणि ३ महिन्यांत उत्पन्नाच्या उद्दिष्टाला १००% अनुकूल आहे. साताऱ्यात या कामासाठी लगेच शिकाऊ उमेदवारी उपलब्ध आहे.',
      };
    }
    return {
      text: 'Mobile Device Repair was matched because it fits your Class 10 education, hands-on preference, and goal of earning within 3 months in nearby workshops.',
    };
  }

  // Question: Offline?
  if (q.includes('offline') || q.includes('नेट') || q.includes('इंटरनेट')) {
    if (lang === 'mr') {
      return {
        text: 'होय, KaushalSetu चे सर्व आठवडा १ चे धडे तुम्ही फक्त ८ एमबी मध्ये डाऊनलोड करून इंटरनेट नसतानाही शिकू शकता.',
        suggestedAction: { label: 'ऑफलाइन व्यवस्थापक', route: 'downloads' },
      };
    }
    return {
      text: 'Yes! You can download all Week 1 lessons in one click (~8 MB) and continue studying without an active internet connection.',
      suggestedAction: { label: 'Open Downloads', route: 'downloads' },
    };
  }

  // Default contextual response
  if (lang === 'mr') {
    return {
      text: 'कौशल्यसेतू मार्गदर्शक: तुम्ही सध्या तुमच्या प्रगतीपथावर आहात. होम स्क्रीनवरील "तुमची पुढची कृती" कार्ड पाहून आजचे उद्दिष्ट पूर्ण करा.',
    };
  }
  return {
    text: 'KaushalSetu Guide: You are making steady progress on your career pathway. Follow your Next Step card on the Home screen to stay on track toward your livelihood goal.',
  };
}
