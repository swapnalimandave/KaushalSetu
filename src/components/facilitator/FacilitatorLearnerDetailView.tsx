import React, { useState } from 'react';
import {
  ArrowLeft,
  PhoneCall,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  FileText,
  ShieldCheck,
  Send,
  Plus,
  ExternalLink,
  Smartphone,
  Wifi,
  ChevronRight,
} from 'lucide-react';
import { LearnerRecord, LanguageCode, FacilitatorNote } from '../../types';
import { addFacilitatorNote, resolveLearnerAttention, flagLearnerAttention } from '../../utils/facilitatorManager';

interface FacilitatorLearnerDetailViewProps {
  learner: LearnerRecord;
  language: LanguageCode;
  onBackToLearners: () => void;
  onSelectReview: (reviewId: string) => void;
  onRefreshLearner: () => void;
}

export const FacilitatorLearnerDetailView: React.FC<FacilitatorLearnerDetailViewProps> = ({
  learner,
  language,
  onBackToLearners,
  onSelectReview,
  onRefreshLearner,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'earnpath' | 'skillproof' | 'opportunity' | 'notes'>('overview');
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<FacilitatorNote['category']>('call_log');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [showAttentionModal, setShowAttentionModal] = useState(false);
  const [flagReasonInput, setFlagReasonInput] = useState('');

  const isRavi = learner.id === 'ravi-patil-18';

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setIsSubmittingNote(true);
    addFacilitatorNote(learner.id, newNoteText.trim(), newNoteCategory);
    setNewNoteText('');
    setIsSubmittingNote(false);
    onRefreshLearner();
  };

  const handleToggleResolve = () => {
    if (learner.needsAttention) {
      resolveLearnerAttention(learner.id);
    } else {
      setShowAttentionModal(true);
    }
    onRefreshLearner();
  };

  const handleSaveFlag = () => {
    if (flagReasonInput.trim()) {
      flagLearnerAttention(learner.id, flagReasonInput.trim(), 'medium');
      setFlagReasonInput('');
      setShowAttentionModal(false);
      onRefreshLearner();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToLearners}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A7FA7] hover:text-[#0A1931] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'mr' ? 'सर्व प्रशिक्षणार्थी यादीकडे परत' : 'Back to Learners Cohort'}</span>
        </button>

        <div className="flex items-center gap-2">
          {learner.needsAttention ? (
            <button
              onClick={handleToggleResolve}
              className="px-3 py-1.5 rounded-lg bg-[#58B98C]/15 border border-[#58B98C]/40 text-[#1B6644] text-xs font-bold hover:bg-[#58B98C]/25 transition-all cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Issue Resolved</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAttentionModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-[#556987] hover:text-[#EF6F61] hover:border-[#EF6F61]/40 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Flag for Attention</span>
            </button>
          )}

          {learner.skillProofStatus === 'mentor_pending' && (
            <button
              onClick={() => onSelectReview(learner.skillProofId || 'sp-mobile-repair-01')}
              className="px-3 py-1.5 rounded-lg bg-[#0A1931] text-[#FAF9F4] text-xs font-bold hover:bg-[#17212B] shadow-[2px_2px_0px_#F4C84A] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-[#F4C84A]" />
              <span>Evaluate SkillProof</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Dossier Header Card */}
      <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-5 md:p-6 shadow-[2px_2px_0px_rgba(10,25,49,0.04)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0A1931] text-[#F4C84A] flex items-center justify-center font-serif text-xl font-bold shadow-[3px_3px_0px_#F4C84A] shrink-0">
              {learner.name.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl md:text-2xl font-bold font-serif text-[#0A1931]">
                  {learner.name}
                </h2>
                <span className="text-sm font-devanagari font-bold text-[#4A7FA7]">
                  ({learner.nameMr})
                </span>
                {isRavi && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4C84A] text-[#0A1931]">
                    Active Demo Learner
                  </span>
                )}
                {learner.needsAttention && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EF6F61] text-white">
                    Needs Attention
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-[#4A7FA7] mt-0.5">
                {learner.careerTrack}
              </p>

              <div className="flex items-center gap-3 text-xs text-[#556987] mt-1.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#4A7FA7]" />
                  {learner.village}, {learner.district}
                </span>
                <span>•</span>
                <span>Age: {learner.age}</span>
                <span>•</span>
                <span>{learner.education}</span>
                <span>•</span>
                <span>Enrolled: {learner.enrollmentDate}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            <a
              href={`tel:${learner.phone}`}
              className="px-4 py-2 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] hover:border-[#4A7FA7] text-[#0A1931] text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#4A7FA7]" />
              <span>{learner.phone}</span>
            </a>
          </div>
        </div>

        {/* Attention Banner if flagged */}
        {learner.needsAttention && (
          <div className="mt-4 p-3 rounded-lg bg-[#FFF2F0] border border-[#EF6F61]/40 flex items-start gap-2.5 text-xs">
            <AlertTriangle className="w-4 h-4 text-[#EF6F61] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#C62828]">Attention Flag:</p>
              <p className="text-[#17212B] mt-0.5">{learner.attentionReason}</p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mt-6 pt-4 border-t border-[#D9E1E5] flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#0A1931] text-[#FAF9F4] border-[#0A1931]'
                : 'bg-[#FAF9F4] text-[#556987] border-[#D9E1E5] hover:text-[#0A1931]'
            }`}
          >
            Profile & Constraints
          </button>
          <button
            onClick={() => setActiveTab('earnpath')}
            className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
              activeTab === 'earnpath'
                ? 'bg-[#0A1931] text-[#FAF9F4] border-[#0A1931]'
                : 'bg-[#FAF9F4] text-[#556987] border-[#D9E1E5] hover:text-[#0A1931]'
            }`}
          >
            EarnPath Progress ({learner.overallProgress}%)
          </button>
          <button
            onClick={() => setActiveTab('skillproof')}
            className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              activeTab === 'skillproof'
                ? 'bg-[#F4C84A] text-[#0A1931] border-[#0A1931]'
                : 'bg-[#FAF9F4] text-[#855B00] border-[#F4C84A] hover:bg-[#F4C84A]/20'
            }`}
          >
            <Award className="w-3 h-3" />
            <span>SkillProof & Badge</span>
          </button>
          <button
            onClick={() => setActiveTab('opportunity')}
            className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
              activeTab === 'opportunity'
                ? 'bg-[#58B98C] text-white border-[#58B98C]'
                : 'bg-[#FAF9F4] text-[#1B6644] border-[#58B98C]/40 hover:bg-[#58B98C]/15'
            }`}
          >
            Opportunity ({learner.targetOpportunity ? 'Matched' : 'General'})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
              activeTab === 'notes'
                ? 'bg-[#0A1931] text-[#FAF9F4] border-[#0A1931]'
                : 'bg-[#FAF9F4] text-[#556987] border-[#D9E1E5] hover:text-[#0A1931]'
            }`}
          >
            <span>Facilitator Notes</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#D9E1E5] text-[#0A1931] text-[10px]">
              {learner.notes.length}
            </span>
          </button>
        </div>
      </div>

      {/* Tab 1: Profile & Constraints */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-[#0A1931] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#4A7FA7]" />
              <span>Potential Discovery & Background</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5]">
                <p className="text-[#556987] font-semibold">Education & Baseline</p>
                <p className="text-[#0A1931] font-bold mt-0.5">{learner.education}</p>
                <p className="text-[11px] text-[#556987] mt-1">
                  Passed Class 10 state board with foundational science & math.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5]">
                <p className="text-[#556987] font-semibold">Language & Comprehension</p>
                <p className="text-[#0A1931] font-bold mt-0.5">Marathi (Primary) & Basic Hindi</p>
                <p className="text-[11px] text-[#556987] mt-1">
                  Prefers voice notes and Devanagari diagrams over dense English text.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5]">
                <p className="text-[#556987] font-semibold">Existing Strengths & Hobbies</p>
                <p className="text-[#0A1931] font-bold mt-0.5">Curious about gadget opening, screwdrivers, bicycle repair</p>
                <p className="text-[11px] text-[#556987] mt-1">
                  Shows natural mechanical aptitude and patience with small parts.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-5 space-y-4">
            <h3 className="font-bold text-sm text-[#0A1931] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#EF6F61]" />
              <span>Operational & Reality Constraints</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5]">
                <div className="flex items-center justify-between">
                  <p className="text-[#556987] font-semibold">Travel Preference</p>
                  <span className="px-2 py-0.5 rounded bg-[#FAF9F4] border border-[#BACDD8] text-[#2C5E82] font-bold text-[10px]">
                    Nearby Town (≤ 15 km)
                  </span>
                </div>
                <p className="text-[#0A1931] font-bold mt-0.5">Satara Market or Koregaon</p>
                <p className="text-[11px] text-[#556987] mt-1">
                  Can commute by ST bus or local motorcycle; cannot relocate to Pune/Mumbai immediately.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5]">
                <div className="flex items-center justify-between">
                  <p className="text-[#556987] font-semibold">Smartphone & Internet</p>
                  <span className="px-2 py-0.5 rounded bg-[#FAF9F4] border border-[#F4C84A] text-[#855B00] font-bold text-[10px]">
                    Intermittent
                  </span>
                </div>
                <p className="text-[#0A1931] font-bold mt-0.5">Android device · Offline study mode used</p>
                <p className="text-[11px] text-[#556987] mt-1">
                  Downloads lesson packs at village gram panchayat Wi-Fi or center hotspot.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5]">
                <div className="flex items-center justify-between">
                  <p className="text-[#556987] font-semibold">Earning Timeline Goal</p>
                  <span className="px-2 py-0.5 rounded bg-[#58B98C]/20 text-[#1B6644] font-bold text-[10px]">
                    Urgent (≤ 3 months)
                  </span>
                </div>
                <p className="text-[#0A1931] font-bold mt-0.5">Needs early apprentice stipend (₹6,000 - ₹8,500/mo)</p>
                <p className="text-[11px] text-[#556987] mt-1">
                  Family requires supplementary livelihood support by summer season.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: EarnPath Progress */}
      {activeTab === 'earnpath' && (
        <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#0A1931]">
                4-Week Vocational EarnPath Breakdown
              </h3>
              <p className="text-xs text-[#556987]">
                {learner.careerTrack} · Overall Completion: {learner.overallProgress}%
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#DCECF3] text-[#2C5E82] text-xs font-bold">
              Week {learner.currentWeek} of 4 Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Week 1 */}
            <div className="p-3.5 rounded-lg border-2 border-[#58B98C] bg-[#FAF9F4]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1B6644]">Week 1: Fundamentals</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#58B98C] text-white">Done</span>
              </div>
              <p className="text-xs text-[#0A1931] font-semibold mt-1">Phone Anatomy & Tools</p>
              <p className="text-[11px] text-[#556987] mt-1">4 of 4 lessons passed (100% quiz)</p>
              <p className="text-[10px] text-[#58B98C] font-semibold mt-2">✓ Practical ESD mat safety task verified</p>
            </div>

            {/* Week 2 */}
            <div className="p-3.5 rounded-lg border-2 border-[#4A7FA7] bg-[#FAF9F4]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#2C5E82]">Week 2: Multimeter & Battery</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#4A7FA7] text-white">Active</span>
              </div>
              <p className="text-xs text-[#0A1931] font-semibold mt-1">DC Voltage & Power Rails</p>
              <p className="text-[11px] text-[#556987] mt-1">1 of 4 lessons completed</p>
              <p className="text-[10px] text-[#D97706] font-semibold mt-2">⚡ Practical multimeter bench demo underway</p>
            </div>

            {/* Week 3 */}
            <div className="p-3.5 rounded-lg border border-[#D9E1E5] bg-[#FAF9F4] opacity-80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#556987]">Week 3: Safe Disassembly</span>
                <span className="text-[10px] font-semibold text-[#556987]">Available</span>
              </div>
              <p className="text-xs text-[#0A1931] font-semibold mt-1">Heat Gun & Screen Lift</p>
              <p className="text-[11px] text-[#556987] mt-1">0 of 4 lessons started</p>
              <p className="text-[10px] text-[#556987] mt-2">Includes glue softening & suction cups</p>
            </div>

            {/* Week 4 */}
            <div className="p-3.5 rounded-lg border border-[#D9E1E5] bg-[#FAF9F4] opacity-80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#556987]">Week 4: SkillProof Capstone</span>
                <span className="text-[10px] font-semibold text-[#556987]">Target</span>
              </div>
              <p className="text-xs text-[#0A1931] font-semibold mt-1">Basic Mobile Diagnosis</p>
              <p className="text-[11px] text-[#556987] mt-1">Evidence upload & review</p>
              <p className="text-[10px] text-[#4A7FA7] font-semibold mt-2">Unlocks verified credential</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: SkillProof & Badge */}
      {activeTab === 'skillproof' && (
        <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-5 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F4C84A] text-[#0A1931]">
                  Practical Project
                </span>
                <span className="text-xs text-[#556987]">ID: {learner.skillProofId || 'sp-mobile-repair-01'}</span>
              </div>
              <h3 className="text-lg font-bold font-serif text-[#0A1931] mt-1">
                Basic Mobile Device Diagnosis (प्रात्यक्षिक प्रकल्प)
              </h3>
              <p className="text-xs text-[#556987]">
                Demonstrating multimeter voltage testing, safe battery handling, and diagnostic logic.
              </p>
            </div>

            <button
              onClick={() => onSelectReview(learner.skillProofId || 'sp-mobile-repair-01')}
              className="px-4 py-2 rounded-lg bg-[#0A1931] text-[#FAF9F4] text-xs font-bold hover:bg-[#17212B] shadow-[2px_2px_0px_#F4C84A] transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <ShieldCheck className="w-4 h-4 text-[#F4C84A]" />
              <span>Open Evaluation Rubric</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] space-y-2 text-xs">
              <p className="font-bold text-[#0A1931]">Submitted Evidence Summary</p>
              <div className="space-y-1.5 text-[#556987]">
                <p>• Photo: Multimeter connected to device test points (3.78V reading visible)</p>
                <p>• Audio: 42s voice note in Marathi explaining step-by-step diagnostic reasoning</p>
                <p>• Student Note: Redmi test device, verified adapter output before checking internal flex</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] space-y-2 text-xs">
              <p className="font-bold text-[#0A1931]">AI Preliminary Rubric Insight</p>
              <div className="space-y-1 text-[#17212B]">
                <p className="text-[#1B6644] font-semibold">✓ Strong: Identified power rail failure logically</p>
                <p className="text-[#1B6644] font-semibold">✓ Strong: Mentioned safe opening picks and ESD precaution</p>
                <p className="text-[#C62828] font-semibold">⚠️ Note: Remind student to verbally state battery disconnect step</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Opportunity & Placement */}
      {activeTab === 'opportunity' && (
        <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#0A1931]">
                Target Opportunity & Application Readiness
              </h3>
              <p className="text-xs text-[#556987]">
                Connecting learner with verified local business owner.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#58B98C]/20 text-[#1B6644] text-xs font-bold">
              {learner.applicationStatus || 'Matched'}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#556987]">Matched Shop</span>
              <h4 className="text-base font-bold text-[#0A1931]">
                {learner.targetOpportunityProvider || 'Sai Electronics & Mobile Care'}
              </h4>
              <p className="text-xs text-[#4A7FA7] font-semibold">
                Role: {learner.targetOpportunity || 'Mobile Repair Apprentice'} · Satara Bus Stand Market
              </p>
              <p className="text-[11px] text-[#556987] mt-1">
                Stipend: ₹7,000 - ₹8,500/mo · Distance: ~10 km from Koregaon
              </p>
            </div>

            <button
              onClick={() => alert(`Dialing employer partner for ${learner.name}: Sai Electronics (+91 98220 54110)`)}
              className="px-3.5 py-2 rounded-lg bg-[#FAF9F4] border border-[#0A1931] text-[#0A1931] text-xs font-bold hover:bg-[#FFFFFF] transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#4A7FA7]" />
              <span>Call Shop Owner</span>
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-[#0A1931]">Required Document Checklist for Walk-In Visit:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded bg-[#FAF9F4] border border-[#D9E1E5] flex items-center justify-between">
                <span>1. Aadhaar Card copy</span>
                <span className="text-[#58B98C] font-bold">✓ Ready</span>
              </div>
              <div className="p-2.5 rounded bg-[#FAF9F4] border border-[#D9E1E5] flex items-center justify-between">
                <span>2. Class 10 Marksheet copy</span>
                <span className="text-[#58B98C] font-bold">✓ Ready</span>
              </div>
              <div className="p-2.5 rounded bg-[#FAF9F4] border border-[#D9E1E5] flex items-center justify-between">
                <span>3. Verified KaushalSetu Skill Badge</span>
                <span className="text-[#D97706] font-bold">⏳ In Review</span>
              </div>
              <div className="p-2.5 rounded bg-[#FAF9F4] border border-[#D9E1E5] flex items-center justify-between">
                <span>4. Two passport photographs</span>
                <span className="text-[#58B98C] font-bold">✓ Ready</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Facilitator Notes Journal */}
      {activeTab === 'notes' && (
        <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-5 space-y-6">
          <div>
            <h3 className="font-bold text-sm text-[#0A1931]">
              Facilitator Journal & Operational Notes
            </h3>
            <p className="text-xs text-[#556987]">
              Track counseling calls, lab tool dispatches, and employer interactions for this learner.
            </p>
          </div>

          {/* New note form */}
          <form onSubmit={handleAddNote} className="p-4 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0A1931]">Record New Interaction:</span>
              <select
                value={newNoteCategory}
                onChange={(e) => setNewNoteCategory(e.target.value as FacilitatorNote['category'])}
                className="px-2.5 py-1 rounded bg-[#FFFFFF] border border-[#D9E1E5] text-xs font-semibold text-[#0A1931]"
              >
                <option value="call_log">Phone Call Log</option>
                <option value="practical_workshop">Workshop Observation</option>
                <option value="counseling">Career Counseling</option>
                <option value="tools_issued">Lab Tools Issued</option>
                <option value="employer_intro">Employer Introduction</option>
              </select>
            </div>

            <textarea
              rows={3}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="e.g. Spoke with Ravi regarding multimeter practice. Confirmed he will visit the center bench this Saturday..."
              className="w-full p-3 rounded-lg bg-[#FFFFFF] border border-[#D9E1E5] text-xs text-[#0A1931] placeholder-[#556987] focus:outline-none focus:border-[#4A7FA7]"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newNoteText.trim() || isSubmittingNote}
                className="px-4 py-2 rounded-lg bg-[#0A1931] text-[#FAF9F4] text-xs font-bold hover:bg-[#17212B] disabled:opacity-50 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#F4C84A]" />
                <span>Save Note</span>
              </button>
            </div>
          </form>

          {/* Notes list */}
          <div className="space-y-3">
            {learner.notes.map((note) => {
              const categoryLabels: Record<string, string> = {
                call_log: 'Phone Call',
                practical_workshop: 'Workshop Lab',
                counseling: 'Counseling',
                tools_issued: 'Tool Dispatch',
                employer_intro: 'Employer Intro',
              };

              return (
                <div key={note.id} className="p-3.5 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0A1931]">{note.author}</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-[#DCECF3] text-[#2C5E82]">
                        {categoryLabels[note.category] || note.category}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#556987] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {note.date}
                    </span>
                  </div>
                  <p className="text-xs text-[#17212B] leading-relaxed">{note.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Flag Attention Modal */}
      {showAttentionModal && (
        <div className="fixed inset-0 z-50 bg-[#0A1931]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border-2 border-[#EF6F61] rounded-xl max-w-md w-full p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-[#C62828]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-base">Flag Learner for Mentor Attention</h3>
            </div>
            <p className="text-xs text-[#556987]">
              Specify the blocker or difficulty {learner.name} is facing so the center team can follow up.
            </p>
            <input
              type="text"
              value={flagReasonInput}
              onChange={(e) => setFlagReasonInput(e.target.value)}
              placeholder="e.g. Needs multimeter kit access; inactive on lessons for 3 days"
              className="w-full p-2.5 rounded-lg border border-[#D9E1E5] text-xs text-[#0A1931] focus:outline-none focus:border-[#EF6F61]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAttentionModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#556987] hover:bg-[#FAF9F4]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveFlag}
                disabled={!flagReasonInput.trim()}
                className="px-4 py-1.5 rounded-lg bg-[#EF6F61] text-white text-xs font-bold hover:bg-[#C62828] disabled:opacity-50 cursor-pointer"
              >
                Flag Learner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
