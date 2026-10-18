/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LanguageCode, StudentProfile, CareerOption, ScreenState } from './types';
import {
  getStoredLanguage,
  saveStoredLanguage,
  getStoredProfile,
  saveStoredProfile,
  DEFAULT_DEMO_PROFILE,
} from './utils/storage';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { StudentHomeScreen } from './screens/StudentHomeScreen';
import { LivelihoodJourneyScreen } from './screens/LivelihoodJourneyScreen';
import { StudentOnboardingScreen } from './screens/StudentOnboardingScreen';
import { OnboardingReviewScreen } from './screens/OnboardingReviewScreen';
import { DiscoveryAnalysisScreen } from './screens/DiscoveryAnalysisScreen';
import { PotentialProfileScreen } from './screens/PotentialProfileScreen';
import { EarnPathScreen } from './screens/EarnPathScreen';
import { LessonDetailScreen } from './screens/LessonDetailScreen';
import { DownloadsScreen } from './screens/DownloadsScreen';
import { SkillProofScreen } from './screens/SkillProofScreen';
import { FacilitatorReviewScreen } from './screens/FacilitatorReviewScreen';
import { ProfileSkillsScreen } from './screens/ProfileSkillsScreen';
import { OpportunitiesScreen } from './screens/OpportunitiesScreen';
import { FacilitatorPortalScreen } from './screens/FacilitatorPortalScreen';
import { VoiceBottomSheetModal } from './components/VoiceBottomSheetModal';
import { ExistingProfileModal } from './components/ExistingProfileModal';
import { LanguageSwitcherModal } from './components/LanguageSwitcherModal';
import { calculateCareerMatches } from './utils/careerMatcher';
import { getStoredProgress } from './utils/progressManager';
import { getStoredSkillProof } from './utils/skillProofManager';
import { getStoredApplication } from './utils/opportunityManager';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>(() => getStoredLanguage());
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => getStoredProfile(selectedLanguage));
  const [currentScreen, setCurrentScreen] = useState<ScreenState>(() => {
    // URL hash support
    if (window.location.hash.includes('facilitator')) return 'facilitator';
    if (window.location.pathname.includes('/facilitator')) return 'facilitator';
    if (window.location.hash.includes('home')) return 'home';
    if (window.location.hash.includes('journey')) return 'journey';
    if (window.location.hash.includes('earnpath')) return 'earnpath';
    if (window.location.hash.includes('skillproof')) return 'skillproof';
    if (window.location.hash.includes('opportunities')) return 'opportunities_placeholder';
    // If student profile already exists in storage, land on Home!
    const hasStoredProfile = Boolean(localStorage.getItem('kaushalsetu_student_profile'));
    if (hasStoredProfile) return 'home';
    return 'welcome';
  });
  const [onboardingInitialStep, setOnboardingInitialStep] = useState<number>(1);
  const [selectedCareer, setSelectedCareer] = useState<CareerOption>(() => calculateCareerMatches(studentProfile).bestMatch);
  
  // Modals
  const [isVoiceWelcomeModalOpen, setIsVoiceWelcomeModalOpen] = useState(false);
  const [isExistingProfileModalOpen, setIsExistingProfileModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Sync profile language whenever app language changes
  const handleLanguageChange = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    saveStoredLanguage(lang);
    setStudentProfile((prev) => {
      const updated = { ...prev, language: lang };
      saveStoredProfile(updated);
      return updated;
    });
  };

  // Profile update handler
  const handleUpdateProfile = (updatedFields: Partial<StudentProfile>) => {
    setStudentProfile((prev) => {
      const updated = { ...prev, ...updatedFields };
      saveStoredProfile(updated);
      return updated;
    });
  };

  // Navigations
  const handleStartJourney = () => {
    setOnboardingInitialStep(1);
    setCurrentScreen('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishOnboarding = () => {
    setCurrentScreen('onboarding_review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditStepFromReview = (stepNumber: number) => {
    setOnboardingInitialStep(stepNumber);
    setCurrentScreen('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmAndFindPath = () => {
    setCurrentScreen('discovery_analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalysisComplete = () => {
    setCurrentScreen('potential');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuildEarnPath = (career: CareerOption) => {
    setSelectedCareer(career);
    setCurrentScreen('earnpath');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangePreferences = () => {
    setOnboardingInitialStep(1);
    setCurrentScreen('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLesson = (lessonId: string) => {
    setCurrentScreen('lesson_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToEarnPath = () => {
    setCurrentScreen('earnpath');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDownloads = () => {
    setCurrentScreen('downloads');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSkillProof = () => {
    setCurrentScreen('skillproof');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFacilitatorReview = () => {
    window.location.hash = '#/facilitator/review/sp-mobile-repair-01';
    setCurrentScreen('facilitator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProfileSkills = () => {
    setCurrentScreen('profile_skills');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOpportunities = () => {
    setCurrentScreen('opportunities_placeholder');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenHome = () => {
    window.location.hash = '#/home';
    setCurrentScreen('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenJourney = () => {
    window.location.hash = '#/journey';
    setCurrentScreen('journey');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFacilitatorPortal = () => {
    window.location.hash = '#/facilitator';
    setCurrentScreen('facilitator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to hash changes across the app
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash;
      if (hash.includes('facilitator')) {
        setCurrentScreen('facilitator');
      } else if (hash.includes('home')) {
        setCurrentScreen('home');
      } else if (hash.includes('journey')) {
        setCurrentScreen('journey');
      } else if (hash.includes('earnpath')) {
        setCurrentScreen('earnpath');
      } else if (hash.includes('skillproof')) {
        setCurrentScreen('skillproof');
      } else if (hash.includes('opportunities')) {
        setCurrentScreen('opportunities_placeholder');
      }
    };

    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  return (
    <div className="min-h-screen text-[#17212B] bg-[#FAF9F4] font-sans">
      {/* SCREEN 0: STUDENT HOME DASHBOARD */}
      {currentScreen === 'home' && (
        <StudentHomeScreen
          language={selectedLanguage}
          profile={studentProfile}
          career={selectedCareer}
          onOpenEarnPath={() => {
            setCurrentScreen('earnpath');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenLesson={(lessonId) => {
            setCurrentScreen('lesson_detail');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSkillProof={handleOpenSkillProof}
          onOpenProfileSkills={handleOpenProfileSkills}
          onOpenOpportunities={handleOpenOpportunities}
          onOpenJourney={handleOpenJourney}
          onOpenDownloads={handleOpenDownloads}
          onOpenFacilitatorPortal={handleOpenFacilitatorPortal}
          onLanguageChangeRequest={() => setIsLanguageModalOpen(true)}
        />
      )}

      {/* SCREEN 0B: LIVELIHOOD JOURNEY TRACKER */}
      {currentScreen === 'journey' && (
        <LivelihoodJourneyScreen
          language={selectedLanguage}
          profile={studentProfile}
          career={selectedCareer}
          progress={getStoredProgress()}
          skillProof={getStoredSkillProof()}
          application={getStoredApplication()}
          onBackToHome={handleOpenHome}
          onOpenFacilitatorPortal={handleOpenFacilitatorPortal}
          onNavigateToScreen={(target) => {
            if (target === 'potential') setCurrentScreen('potential');
            else if (target === 'earnpath') setCurrentScreen('earnpath');
            else if (target === 'skillproof') setCurrentScreen('skillproof');
            else if (target === 'profile_skills') setCurrentScreen('profile_skills');
            else if (target === 'opportunities_placeholder') setCurrentScreen('opportunities_placeholder');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLanguageChangeRequest={() => setIsLanguageModalOpen(true)}
        />
      )}

      {/* SCREEN 1: WELCOME SCREEN (Preserved untouched) */}
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
          onStartJourney={handleStartJourney}
          onContinueExisting={() => setIsExistingProfileModalOpen(true)}
          onOpenVoice={() => setIsVoiceWelcomeModalOpen(true)}
          onOpenFacilitatorPortal={handleOpenFacilitatorPortal}
        />
      )}

      {/* SCREEN 2: 8-STEP CONVERSATIONAL ONBOARDING */}
      {currentScreen === 'onboarding' && (
        <StudentOnboardingScreen
          profile={studentProfile}
          language={selectedLanguage}
          initialStep={onboardingInitialStep}
          onUpdateProfile={handleUpdateProfile}
          onFinishOnboarding={handleFinishOnboarding}
          onExitToWelcome={() => setCurrentScreen('welcome')}
          onLanguageChangeRequest={() => setIsLanguageModalOpen(true)}
        />
      )}

      {/* SCREEN 3: ONBOARDING REVIEW SUMMARY */}
      {currentScreen === 'onboarding_review' && (
        <OnboardingReviewScreen
          profile={studentProfile}
          language={selectedLanguage}
          onEditStep={handleEditStepFromReview}
          onConfirmAndFindPath={handleConfirmAndFindPath}
          onLanguageChangeRequest={() => setIsLanguageModalOpen(true)}
        />
      )}

      {/* SCREEN 4: PROGRESSIVE ANALYSIS TRANSITION */}
      {currentScreen === 'discovery_analysis' && (
        <DiscoveryAnalysisScreen
          language={selectedLanguage}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}

      {/* SCREEN 5: AI POTENTIAL PROFILE & CAREER RECOMMENDATIONS */}
      {currentScreen === 'potential' && (
        <PotentialProfileScreen
          profile={studentProfile}
          language={selectedLanguage}
          onBuildEarnPath={handleBuildEarnPath}
          onChangePreferences={handleChangePreferences}
          onOpenSkillProof={handleOpenSkillProof}
          onOpenOpportunities={handleOpenOpportunities}
          onBackToHome={handleOpenHome}
          onOpenFacilitatorPortal={handleOpenFacilitatorPortal}
          onLanguageChangeRequest={() => setIsLanguageModalOpen(true)}
        />
      )}

      {/* SCREEN 6: PERSONALIZED 4-WEEK EARNPATH */}
      {currentScreen === 'earnpath' && (
        <EarnPathScreen
          career={selectedCareer}
          language={selectedLanguage}
          onOpenLesson={handleOpenLesson}
          onOpenDownloads={handleOpenDownloads}
          onOpenSkillProof={handleOpenSkillProof}
          onOpenProfileSkills={handleOpenProfileSkills}
          onOpenOpportunities={handleOpenOpportunities}
          onBackToHome={handleOpenHome}
          onOpenFacilitatorPortal={handleOpenFacilitatorPortal}
          onBackToPotential={() => {
            setCurrentScreen('potential');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLanguageChangeRequest={() => setIsLanguageModalOpen(true)}
        />
      )}

      {/* SCREEN 7: WORKING SAMPLE LESSON: INSIDE A SMARTPHONE */}
      {currentScreen === 'lesson_detail' && (
        <LessonDetailScreen
          language={selectedLanguage}
          onBackToEarnPath={handleBackToEarnPath}
          onContinueToNextLesson={handleBackToEarnPath}
          onLanguageChangeRequest={() => setIsLanguageModalOpen(true)}
        />
      )}

      {/* SCREEN 8: OFFLINE DOWNLOADS MANAGER */}
      {currentScreen === 'downloads' && (
        <DownloadsScreen
          language={selectedLanguage}
          onBackToEarnPath={handleBackToEarnPath}
          onLanguageChangeRequest={() => setIsLanguageModalOpen(true)}
        />
      )}

      {/* SCREEN 9: SKILLPROOF UNLOCK & SUBMISSION WITH AI PRELIMINARY REVIEW */}
      {currentScreen === 'skillproof' && (
        <SkillProofScreen
          language={selectedLanguage}
          onBackToEarnPath={handleBackToEarnPath}
          onOpenFacilitatorReview={handleOpenFacilitatorReview}
          onOpenProfileSkills={handleOpenProfileSkills}
          onOpenOpportunities={handleOpenOpportunities}
          onOpenFacilitatorPortal={handleOpenFacilitatorPortal}
          onLanguageChangeRequest={() => setIsLanguageModalOpen(true)}
        />
      )}

      {/* SCREEN 10: FACILITATOR / MENTOR REVIEW WORKFLOW */}
      {currentScreen === 'facilitator_review' && (
        <FacilitatorReviewScreen
          language={selectedLanguage}
          onBackToSkillProof={handleOpenSkillProof}
          onLanguageChangeRequest={() => setIsLanguageModalOpen(true)}
        />
      )}

      {/* SCREEN 11: VERIFIED SKILL BADGE & PORTFOLIO */}
      {currentScreen === 'profile_skills' && (
        <ProfileSkillsScreen
          language={selectedLanguage}
          onBackToEarnPath={handleBackToEarnPath}
          onBackToHome={handleOpenHome}
          onOpenOpportunities={handleOpenOpportunities}
          onOpenSkillProofFlow={handleOpenSkillProof}
          onOpenFacilitatorPortal={handleOpenFacilitatorPortal}
          onLanguageChangeRequest={() => setIsLanguageModalOpen(true)}
        />
      )}

      {/* SCREEN 12: SMART OPPORTUNITY MATCHER */}
      {currentScreen === 'opportunities_placeholder' && (
        <OpportunitiesScreen
          language={selectedLanguage}
          onBackToHome={handleOpenHome}
          onBackToEarnPath={handleBackToEarnPath}
          onOpenProfileSkills={handleOpenProfileSkills}
          onOpenFacilitatorPortal={handleOpenFacilitatorPortal}
          onLanguageChangeRequest={() => setIsLanguageModalOpen(true)}
        />
      )}

      {/* SCREEN 13: FACILITATOR & MENTOR PORTAL */}
      {currentScreen === 'facilitator' && (
        <FacilitatorPortalScreen
          language={selectedLanguage}
          onSwitchToStudentView={handleOpenHome}
          onLanguageChangeRequest={() => setIsLanguageModalOpen(true)}
        />
      )}

      {/* Welcome Voice Bottom Sheet */}
      <VoiceBottomSheetModal
        isOpen={isVoiceWelcomeModalOpen}
        language={selectedLanguage}
        onClose={() => setIsVoiceWelcomeModalOpen(false)}
        onStartWithVoice={() => {
          setIsVoiceWelcomeModalOpen(false);
          handleStartJourney();
        }}
      />

      {/* Returning Student Profile Lookup Modal */}
      <ExistingProfileModal
        isOpen={isExistingProfileModalOpen}
        onClose={() => setIsExistingProfileModalOpen(false)}
        onContinue={(phone) => {
          setIsExistingProfileModalOpen(false);
          handleUpdateProfile({ phone });
          setCurrentScreen('home');
        }}
      />

      {/* Global In-Onboarding Language Switcher Modal */}
      <LanguageSwitcherModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={selectedLanguage}
        onSelectLanguage={handleLanguageChange}
      />
    </div>
  );
}
