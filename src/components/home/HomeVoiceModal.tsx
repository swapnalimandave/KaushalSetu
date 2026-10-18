import React, { useState } from 'react';
import { Mic, X, Volume2, HelpCircle, ArrowRight, Send, Loader2 } from 'lucide-react';
import { LanguageCode, NextStepInfo, LearningProgress } from '../../types';
import { SecondaryButton } from '../ui/SecondaryButton';
import { askKaushalAssistant } from '../../services/ai/aiService';

interface HomeVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  nextStep: NextStepInfo;
  progress: LearningProgress;
  onNavigate: (route: string) => void;
}

export const HomeVoiceModal: React.FC<HomeVoiceModalProps> = ({
  isOpen,
  onClose,
  language,
  nextStep,
  progress,
  onNavigate,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState<{ text: string; actionLabel?: string; actionRoute?: string } | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  if (!isOpen) return null;

  const handleAskCustomQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || isLoadingAi) return;
    setIsLoadingAi(true);
    setSelectedQuestion(null);
    try {
      const res = await askKaushalAssistant(customQuestion, {
        currentScreen: 'home',
        careerTitle: 'Mobile Device Repair Technician',
        nextStepTitle: language === 'mr' ? nextStep.titleMr : nextStep.title,
        language,
      });
      setCustomAnswer({
        text: res.text,
        actionLabel: res.suggestedAction?.label,
        actionRoute: res.suggestedAction?.route,
      });
    } catch {
      setCustomAnswer({
        text: language === 'mr'
          ? 'माहिती उपलब्ध नाही, कृपया पुन्हा प्रयत्न करा.'
          : 'Could not fetch response right now.',
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  const questions = [
    {
      id: 'today',
      q: language === 'mr' ? 'मी आज काय करावे?' : 'What should I do today?',
      a: language === 'mr'
        ? `तुमची आजची मुख्य पायरी म्हणजे "${nextStep.titleMr}". ${nextStep.descriptionMr}`
        : `Your main action today is "${nextStep.title}". ${nextStep.description}`,
      actionLabel: language === 'mr' ? nextStep.ctaLabelMr : nextStep.ctaLabel,
      actionRoute: nextStep.ctaRoute,
    },
    {
      id: 'next_step',
      q: language === 'mr' ? 'माझी पुढची पायरी काय आहे?' : 'What is my next step?',
      a: language === 'mr'
        ? `पुढची पायरी: ${nextStep.actionTypeMr} — ${nextStep.titleMr} (${nextStep.duration || '८ मिनिटे'}). ही पायरी पूर्ण केल्यावर तुम्ही आठवडा २ मधील प्रात्यक्षिक तपासणी चेकलिस्टसाठी तयार व्हाल.`
        : `Next step: ${nextStep.actionType} — ${nextStep.title} (${nextStep.duration || '8 min'}). Completing this moves you directly to your hands-on diagnosis checklist.`,
      actionLabel: language === 'mr' ? nextStep.ctaLabelMr : nextStep.ctaLabel,
      actionRoute: nextStep.ctaRoute,
    },
    {
      id: 'progress',
      q: language === 'mr' ? 'माझा किती अभ्यास पूर्ण झाला आहे?' : 'How much of my path is complete?',
      a: language === 'mr'
        ? `तुमचा ४ आठवड्यांचा मार्ग ३८% पूर्ण झाला आहे. तुम्ही आठवडा २ (समस्या तपासणी) मध्ये आहात. एकूण १६ धड्यांपैकी ५ धडे पूर्ण झाले आहेत.`
        : `Your 4-week EarnPath is 38% complete. You are in Week 2 (Diagnosis). You have finished 5 of 16 lessons.`,
      actionLabel: language === 'mr' ? 'मार्ग उघडा' : 'Open EarnPath',
      actionRoute: 'earnpath',
    },
    {
      id: 'opportunities',
      q: language === 'mr' ? 'माझ्यासाठी कोणत्या कामाच्या संधी आहेत?' : 'Do I have any opportunity matches?',
      a: language === 'mr'
        ? `होय! तुमच्यासाठी ४ स्थानिक संधी उपलब्ध आहेत. यात साई इलेक्ट्रॉनिक्समधील 'मोबाईल रिपेअर शिकाऊ उमेदवारी' (₹६,५०० मानधन) आघाडीवर आहे.`
        : `Yes! You have 4 local opportunity matches. Top match is Mobile Repair Apprentice at Sai Electronics (₹6,500/mo stipend) in nearby Satara.`,
      actionLabel: language === 'mr' ? 'सर्व संधी पहा' : 'View Matches',
      actionRoute: 'opportunities_placeholder',
    },
    {
      id: 'offline',
      q: language === 'mr' ? 'इंटरनेट नसताना कोणते धडे उपलब्ध आहेत?' : 'Which lessons are offline?',
      a: language === 'mr'
        ? `तुमच्या फोनवर ३ धडे ऑफलाइन उपलब्ध आहेत: 'स्मार्टफोनमधील अंतर्गत भाग', 'दुरुस्तीची मूलभूत अवजारे' आणि 'दुरुस्तीपूर्वी सुरक्षेचे नियम'. तुम्ही इंटरनेटशिवाय ते कधीही ऐकू शकता.`
        : `You have 3 lessons downloaded offline: 'Inside a Smartphone', 'Essential Repair Tools', and 'Safety Before Repair'. You can study them without internet anytime.`,
      actionLabel: language === 'mr' ? 'डाउनलोड मॅनेजर' : 'Downloads Manager',
      actionRoute: 'downloads',
    },
  ];

  const activeAnswer = questions.find((q) => q.id === selectedQuestion);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0A1931]/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full sm:max-w-md bg-[#FAF9F4] border-t-2 sm:border-2 border-[#0A1931] sm:rounded-[24px] rounded-t-[24px] p-6 shadow-[0_-8px_30px_rgba(10,25,49,0.25)] flex flex-col max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9E1E5]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#0A1931] text-[#FAF9F4] flex items-center justify-center shadow-[2px_2px_0px_#F4C84A]">
              <Mic className="w-5 h-5 text-[#F4C84A]" />
            </div>
            <div>
              <h2 className="text-[17px] font-extrabold text-[#0A1931] font-sans">
                {language === 'mr' ? 'कौशलसेतूला विचारा' : 'Ask KaushalSetu'}
              </h2>
              <span className="text-[11px] text-[#64748B]">
                {language === 'mr' ? 'आवाज किंवा टॅप करून विचारा' : 'Voice or tap guide'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0A1931] hover:bg-[#DCECF3] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Custom Answer Box */}
        {customAnswer && (
          <div className="my-4 p-4 rounded-xl bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[3px_3px_0px_#58B98C]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#58B98C] mb-1.5">
              <Volume2 className="w-4 h-4 text-[#58B98C]" />
              <span>{language === 'mr' ? 'मार्गदर्शक AI उत्तर' : 'KaushalSetu AI Answer'}</span>
            </div>
            <p className="text-[14px] text-[#0A1931] font-devanagari leading-relaxed">
              {customAnswer.text}
            </p>
            <div className="mt-3 pt-3 border-t border-[#D9E1E5] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setCustomAnswer(null)}
                className="text-xs font-bold text-[#64748B] hover:text-[#0A1931] underline cursor-pointer"
              >
                {language === 'mr' ? 'नवीन प्रश्न विचारा' : 'Ask another'}
              </button>
              {customAnswer.actionRoute && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate(customAnswer.actionRoute!);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A1931] text-[#FAF9F4] text-xs font-bold shadow-[2px_2px_0px_#F4C84A] cursor-pointer"
                >
                  <span>{customAnswer.actionLabel || 'Go'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Selected Preset Answer Box */}
        {activeAnswer && (
          <div className="my-4 p-4 rounded-xl bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[3px_3px_0px_#0A1931]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#4A7FA7] mb-1.5">
              <Volume2 className="w-4 h-4 text-[#4A7FA7]" />
              <span>{language === 'mr' ? 'कौशलसेतूचे उत्तर' : 'KaushalSetu Guidance'}</span>
            </div>
            <p className="text-[14px] text-[#0A1931] font-devanagari leading-relaxed">
              {activeAnswer.a}
            </p>

            <div className="mt-3 pt-3 border-t border-[#D9E1E5] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedQuestion(null)}
                className="text-xs font-bold text-[#64748B] hover:text-[#0A1931] underline cursor-pointer"
              >
                {language === 'mr' ? 'दुसरा प्रश्न विचारा' : 'Ask another question'}
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate(activeAnswer.actionRoute);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A1931] text-[#FAF9F4] text-xs font-bold shadow-[2px_2px_0px_#F4C84A] cursor-pointer"
              >
                <span>{activeAnswer.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Live Question Input Bar */}
        <form onSubmit={handleAskCustomQuestion} className="my-3 flex items-center gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder={language === 'mr' ? 'तुमचा प्रश्न इथे टाईप करा...' : 'Type or ask any question...'}
            disabled={isLoadingAi}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#0A1931] bg-[#FFFFFF] text-xs font-medium text-[#17212B] focus:outline-none focus:ring-2 focus:ring-[#4A7FA7] font-devanagari"
          />
          <button
            type="submit"
            disabled={!customQuestion.trim() || isLoadingAi}
            className="px-3 py-2.5 rounded-xl bg-[#0A1931] text-[#F4C84A] disabled:opacity-40 flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_#F4C84A]"
          >
            {isLoadingAi ? <Loader2 className="w-4 h-4 animate-spin text-[#F4C84A]" /> : <Send className="w-4 h-4" />}
          </button>
        </form>

        {!activeAnswer && !customAnswer && (
          <div className="mb-2 text-xs font-bold text-[#64748B]">
            <span>
              {language === 'mr'
                ? 'किंवा खालीलपैकी एक प्रश्न निवडा:'
                : 'Or select a quick question below:'}
            </span>
          </div>
        )}

        {/* Question Options */}
        <div className="space-y-2 mb-4">
          {questions.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                setCustomAnswer(null);
                setSelectedQuestion(q.id);
              }}
              className={`
                w-full text-left p-3 rounded-xl border-2 transition-all flex items-center justify-between gap-2 text-[13px] font-bold cursor-pointer
                ${
                  selectedQuestion === q.id
                    ? 'border-[#0A1931] bg-[#DCECF3] text-[#0A1931]'
                    : 'border-[#0A1931]/20 bg-[#FFFFFF] hover:border-[#0A1931] text-[#17212B]'
                }
              `}
            >
              <span className="font-devanagari">{q.q}</span>
              <Volume2 className="w-4 h-4 text-[#4A7FA7] shrink-0" />
            </button>
          ))}
        </div>

        <SecondaryButton fullWidth size="md" onClick={onClose}>
          {language === 'mr' ? 'बंद करा' : 'Close'}
        </SecondaryButton>
      </div>
    </div>
  );
};
