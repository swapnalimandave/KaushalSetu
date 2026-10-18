import { LanguageCode, StudentProfile } from '../types';

const LANGUAGE_KEY = 'kaushalsetu_user_lang';
const PROFILE_KEY = 'kaushalsetu_student_profile';

export const DEFAULT_DEMO_PROFILE: StudentProfile = {
  language: 'mr',
  name: 'Ravi Patil',
  age: 18,
  state: 'Maharashtra',
  education: 'Class 10',
  interests: ['Repairing things', 'Electrical or mechanical work', 'Working with computers'],
  existingSkills: ['Use a smartphone confidently', 'Use tools', 'Repair simple electrical items'],
  customSkill: '',
  workPreferences: ['Hands-on practical work'],
  earningTimeline: 'Within 3 months',
  travelPreference: 'Nearby town',
  deviceAccess: 'My own Android smartphone',
  internetAccess: 'Available sometimes',
  learningPreferences: ['Listening to explanations', 'Practicing myself'],
};

export function getStoredLanguage(): LanguageCode {
  try {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved === 'mr' || saved === 'hi' || saved === 'en') {
      return saved;
    }
  } catch {
    // Fallback if localStorage is inaccessible
  }
  return 'mr'; // Default: Marathi
}

export function saveStoredLanguage(lang: LanguageCode): void {
  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch {
    // Ignore storage quota or disabled errors
  }
}

export function getStoredProfile(initialLanguage: LanguageCode): StudentProfile {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as StudentProfile;
      return {
        ...parsed,
        language: initialLanguage || parsed.language || 'mr',
      };
    }
  } catch {
    // Fallback
  }
  return {
    ...DEFAULT_DEMO_PROFILE,
    language: initialLanguage,
  };
}

export function saveStoredProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage quota or disabled errors
  }
}
