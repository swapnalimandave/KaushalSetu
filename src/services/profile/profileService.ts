import { StudentProfile, LanguageCode } from '../../types';
import { StudentProfileRecord } from '../../types/backend';
import { syncService } from '../sync/syncService';

const PROFILE_KEY = 'kaushalsetu_student_profile';

export const DEFAULT_RAVI_PROFILE: StudentProfile = {
  language: 'mr',
  name: 'Ravi Patil',
  phone: '+91 98231 44520',
  age: 18,
  state: 'Maharashtra',
  education: 'Class 10',
  interests: ['fixing_things', 'electronics', 'hands_on'],
  existingSkills: ['basic_tools', 'wiring', 'phone_handling'],
  customSkill: 'Helped at uncle repair shop',
  workPreferences: ['local_repair', 'workshop', 'independent_work'],
  earningTimeline: '3_months',
  travelPreference: 'nearby_town',
  deviceAccess: 'smartphone_basic',
  internetAccess: 'sometimes',
  learningPreferences: ['audio', 'practical', 'visual'],
};

/**
 * Sanitizes profile to guarantee NO Aadhaar, bank numbers, or passwords are stored
 */
function sanitizeProfile(raw: Partial<StudentProfile>): Partial<StudentProfile> {
  const clean = { ...raw };
  delete (clean as any).aadhaar;
  delete (clean as any).aadhaarNumber;
  delete (clean as any).bankAccount;
  delete (clean as any).bankAccountNumber;
  delete (clean as any).password;
  delete (clean as any).govId;
  return clean;
}

export const profileService = {
  getProfile(preferredLang: LanguageCode = 'mr'): StudentProfile {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_RAVI_PROFILE,
          ...sanitizeProfile(parsed),
        };
      }
    } catch (e) {
      console.warn('[ProfileService] Error reading stored profile, using default');
    }
    return { ...DEFAULT_RAVI_PROFILE, language: preferredLang };
  },

  saveProfile(profile: StudentProfile): StudentProfile {
    const sanitized = sanitizeProfile(profile) as StudentProfile;
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(sanitized));
      // Queue background sync
      syncService.enqueue('profile', 'upsert', sanitized);
    } catch (e) {
      console.warn('[ProfileService] Error saving profile to local storage', e);
    }
    return sanitized;
  },

  updateProfileFields(fields: Partial<StudentProfile>): StudentProfile {
    const current = this.getProfile();
    const updated = {
      ...current,
      ...sanitizeProfile(fields),
    };
    return this.saveProfile(updated);
  },

  toBackendRecord(profile: StudentProfile, studentId = 'ravi-patil-18'): StudentProfileRecord {
    return {
      studentId,
      name: profile.name,
      age: profile.age,
      state: profile.state,
      education: profile.education,
      interests: profile.interests,
      existingSkills: profile.existingSkills,
      workPreferences: profile.workPreferences,
      earningTimeline: profile.earningTimeline,
      travelPreference: profile.travelPreference,
      deviceAccess: profile.deviceAccess,
      internetAccess: profile.internetAccess,
      learningPreferences: profile.learningPreferences,
      selectedCareerId: 'mobile-repair',
      onboardingCompleted: true,
      createdAt: '2026-03-01T08:00:00.000Z',
      updatedAt: new Date().toISOString(),
    };
  },
};
