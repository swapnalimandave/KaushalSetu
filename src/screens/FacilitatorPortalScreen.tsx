import React, { useState, useEffect } from 'react';
import { FacilitatorSection, LanguageCode, LearnerRecord } from '../types';
import { FacilitatorSidebar } from '../components/facilitator/FacilitatorSidebar';
import { FacilitatorTopBar } from '../components/facilitator/FacilitatorTopBar';
import { FacilitatorOverviewView } from '../components/facilitator/FacilitatorOverviewView';
import { FacilitatorLearnersView } from '../components/facilitator/FacilitatorLearnersView';
import { FacilitatorLearnerDetailView } from '../components/facilitator/FacilitatorLearnerDetailView';
import { FacilitatorSkillProofQueueView } from '../components/facilitator/FacilitatorSkillProofQueueView';
import { FacilitatorReviewDetailView } from '../components/facilitator/FacilitatorReviewDetailView';
import { FacilitatorOpportunitiesView } from '../components/facilitator/FacilitatorOpportunitiesView';
import { FacilitatorReportsView } from '../components/facilitator/FacilitatorReportsView';
import {
  getStoredLearners,
  getFacilitatorMetrics,
  getSkillProofReviewQueue,
  resolveLearnerAttention,
} from '../utils/facilitatorManager';
import { X } from 'lucide-react';

interface FacilitatorPortalScreenProps {
  language: LanguageCode;
  initialSection?: FacilitatorSection;
  initialLearnerId?: string;
  initialReviewId?: string;
  onSwitchToStudentView: () => void;
  onLanguageChangeRequest: () => void;
}

export const FacilitatorPortalScreen: React.FC<FacilitatorPortalScreenProps> = ({
  language,
  initialSection = 'overview',
  initialLearnerId = 'ravi-patil-18',
  initialReviewId = 'sp-mobile-repair-01',
  onSwitchToStudentView,
  onLanguageChangeRequest,
}) => {
  const [currentSection, setCurrentSection] = useState<FacilitatorSection>(initialSection);
  const [selectedLearnerId, setSelectedLearnerId] = useState<string>(initialLearnerId);
  const [selectedReviewId, setSelectedReviewId] = useState<string>(initialReviewId);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Live state
  const [learners, setLearners] = useState<LearnerRecord[]>(() => getStoredLearners());
  const [metrics, setMetrics] = useState(() => getFacilitatorMetrics());
  const [reviewQueue, setReviewQueue] = useState(() => getSkillProofReviewQueue());

  const refreshData = () => {
    setLearners(getStoredLearners());
    setMetrics(getFacilitatorMetrics());
    setReviewQueue(getSkillProofReviewQueue());
  };

  // Sync hash routing on mount and change
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.includes('facilitator/learners/')) {
        const id = hash.split('facilitator/learners/')[1]?.split('?')[0];
        if (id) {
          setSelectedLearnerId(id);
          setCurrentSection('learner_detail');
        }
      } else if (hash.includes('facilitator/review/')) {
        const id = hash.split('facilitator/review/')[1]?.split('?')[0];
        if (id) {
          setSelectedReviewId(id);
          setCurrentSection('review_detail');
        }
      } else if (hash.includes('facilitator/learners')) {
        setCurrentSection('learners');
      } else if (hash.includes('facilitator/skillproof')) {
        setCurrentSection('skillproof');
      } else if (hash.includes('facilitator/opportunities')) {
        setCurrentSection('opportunities');
      } else if (hash.includes('facilitator/reports')) {
        setCurrentSection('reports');
      } else if (hash.includes('facilitator')) {
        setCurrentSection('overview');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSelectSection = (section: FacilitatorSection, extraId?: string) => {
    setCurrentSection(section);
    setIsMobileMenuOpen(false);

    if (section === 'learner_detail' && extraId) {
      setSelectedLearnerId(extraId);
      window.location.hash = `#/facilitator/learners/${extraId}`;
    } else if (section === 'review_detail' && extraId) {
      setSelectedReviewId(extraId);
      window.location.hash = `#/facilitator/review/${extraId}`;
    } else if (section === 'overview') {
      window.location.hash = '#/facilitator';
    } else {
      window.location.hash = `#/facilitator/${section}`;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    refreshData();
  };

  const handleSelectLearner = (learnerId: string) => {
    setSelectedLearnerId(learnerId);
    setCurrentSection('learner_detail');
    window.location.hash = `#/facilitator/learners/${learnerId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectReview = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setCurrentSection('review_detail');
    window.location.hash = `#/facilitator/review/${reviewId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResolveAttention = (learnerId: string) => {
    resolveLearnerAttention(learnerId);
    refreshData();
  };

  const currentLearner = learners.find((l) => l.id === selectedLearnerId) || learners[0];

  return (
    <div className="min-h-screen bg-[#FAF9F4] text-[#17212B] flex flex-col md:flex-row font-sans">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:block">
        <FacilitatorSidebar
          currentSection={currentSection}
          onSelectSection={handleSelectSection}
          onSwitchToStudentView={onSwitchToStudentView}
          pendingReviewsCount={reviewQueue.filter((r) => r.needsReviewAction).length}
          needsAttentionCount={learners.filter((l) => l.needsAttention).length}
          language={language}
          onLanguageChangeRequest={onLanguageChangeRequest}
        />
      </div>

      {/* Mobile Drawer (visible when isMobileMenuOpen) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-[#0A1931]/60 backdrop-blur-xs flex">
          <div className="w-72 bg-[#FAF9F4] h-full shadow-2xl flex flex-col">
            <div className="p-3 flex justify-end">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg border border-[#D9E1E5] text-[#0A1931] hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FacilitatorSidebar
              currentSection={currentSection}
              onSelectSection={handleSelectSection}
              onSwitchToStudentView={onSwitchToStudentView}
              pendingReviewsCount={reviewQueue.filter((r) => r.needsReviewAction).length}
              needsAttentionCount={learners.filter((l) => l.needsAttention).length}
              language={language}
              onLanguageChangeRequest={onLanguageChangeRequest}
            />
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <FacilitatorTopBar
          currentSection={currentSection}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onSwitchToStudentView={onSwitchToStudentView}
          language={language}
          onLanguageChangeRequest={onLanguageChangeRequest}
          needsAttentionCount={learners.filter((l) => l.needsAttention).length}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1400px] w-full mx-auto">
          {currentSection === 'overview' && (
            <FacilitatorOverviewView
              metrics={metrics}
              learners={learners}
              reviewQueue={reviewQueue}
              language={language}
              onNavigateSection={handleSelectSection}
              onSelectLearner={handleSelectLearner}
              onSelectReview={handleSelectReview}
              onResolveAttention={handleResolveAttention}
            />
          )}

          {currentSection === 'learners' && (
            <FacilitatorLearnersView
              learners={learners}
              language={language}
              onSelectLearner={handleSelectLearner}
              onSelectReview={handleSelectReview}
            />
          )}

          {currentSection === 'learner_detail' && (
            <FacilitatorLearnerDetailView
              learner={currentLearner}
              language={language}
              onBackToLearners={() => handleSelectSection('learners')}
              onSelectReview={handleSelectReview}
              onRefreshLearner={refreshData}
            />
          )}

          {currentSection === 'skillproof' && (
            <FacilitatorSkillProofQueueView
              queue={reviewQueue}
              language={language}
              onSelectReview={handleSelectReview}
              onSelectLearner={handleSelectLearner}
            />
          )}

          {currentSection === 'review_detail' && (
            <FacilitatorReviewDetailView
              skillProofId={selectedReviewId}
              language={language}
              onBackToQueue={() => handleSelectSection('skillproof')}
              onViewLearner={handleSelectLearner}
            />
          )}

          {currentSection === 'opportunities' && (
            <FacilitatorOpportunitiesView
              language={language}
              onViewLearner={handleSelectLearner}
            />
          )}

          {currentSection === 'reports' && (
            <FacilitatorReportsView language={language} />
          )}
        </main>
      </div>
    </div>
  );
};
