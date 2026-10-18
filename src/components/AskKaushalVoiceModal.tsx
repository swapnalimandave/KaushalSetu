import React, { useState } from 'react';
import { Mic, X, Sparkles, Volume2, HelpCircle, ArrowRight, Send, Loader2 } from 'lucide-react';
import { CareerOption, LanguageCode } from '../types';
import { SecondaryButton } from './ui/SecondaryButton';
import { askKaushalAssistant } from '../services/ai/aiService';

interface AskKaushalVoiceModalProps {
  career: CareerOption;
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
}

export const AskKaushalVoiceModal: React.FC<AskKaushalVoiceModalProps> = ({
  career,
  isOpen,
  onClose,
  language,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  if (!isOpen) return null;

  const handleAskCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || isLoadingAi) return;
    setIsLoadingAi(true);
    setSelectedQuestion(null);
    try {
      const res = await askKaushalAssistant(customQuestion, {
        currentScreen: 'career_potential',
        careerTitle: career.title,
        language,
      });
      setCustomAnswer(res.text);
    } catch {
      setCustomAnswer(
        language === 'mr'
          ? 'माहिती उपलब्ध नाही. कृपया पर्यायांमधून निवडा.'
          : 'Could not fetch response right now.'
      );
    } finally {
      setIsLoadingAi(false);
    }
  };

  const presetQuestions: Record<LanguageCode, { q: string; a: string }[]> = {
    mr: [
      {
        q: 'हाच पर्याय मला का सुचवला?',
        a: 'तुम्हाला वस्तू दुरुस्त करायला आवडतात, तुमच्याकडे साधी अवजारे वापरण्याचा अनुभव आहे, आणि तुम्हाला पुढील ३ महिन्यांत कमाई सुरू करायची आहे. मोबाईल रिपेअरिंगमध्ये तालुक्याच्या बाजारात लगेच काम मिळण्याची मोठी संधी असते.',
      },
      {
        q: 'मला यामध्ये नेमके काय काम करावे लागेल?',
        a: 'स्मार्टफोनची स्क्रीन बदलणे, बॅटरी तपासणे, चार्जिंग जॅक व स्पीकर दुरुस्त करणे आणि साधे सॉफ्टवेअर रीसेट करणे हे काम असते. सुरुवातीला तुम्ही अनुभवी दुकानदारासोबत काम शिकू शकता.',
      },
      {
        q: 'मी हे इंटरनेट नसताना offline शिकू शकतो का?',
        a: 'होय! कौशलसेतूचे सर्व प्रॅक्टिकल व्हिडिओ व ऑडिओ धडे तुम्ही एकदाच डाऊनलोड करू शकता. त्यानंतर प्रत्यक्ष काम करताना तुम्हाला इंटरनेटची गरज पडत नाही.',
      },
      {
        q: 'मला दुसरा पर्याय निवडायचा असेल तर काय?',
        a: 'तुम्ही खाली दिलेले डिजिटल सेवा किंवा सोलर तंत्रज्ञ पर्याय निवडू शकता, किंवा "Change my preferences" वर जाऊन तुमची आवड बदलू शकता.',
      },
    ],
    hi: [
      {
        q: 'यह करियर मुझे क्यों सुझाया गया?',
        a: 'आपको चीजें रिपेयर करना पसंद है, आपके पास टूल्स का बुनियादी अनुभव है, और आप ३ महीनों के अंदर काम शुरू करना चाहते हैं। मोबाइल रिपेयरिंग में स्थानीय स्तर पर तुरंत अवसर मिलते हैं।',
      },
      {
        q: 'इसमें मुझे असल में क्या काम करना होगा?',
        a: 'स्मार्टफोन की स्क्रीन बदलना, बैटरी रिप्लेसमेंट, चार्जिंग पोर्ट ठीक करना और कंपोनेंट्स की जांच करना। यह काम छोटे मॉड्यूल्स से आसानी से सीखा जा सकता है।',
      },
      {
        q: 'क्या मैं इसे बिना इंटरनेट के ऑफलाइन सीख सकता हूँ?',
        a: 'बिल्कुल! कौशलसेतू के सारे पाठ कम-डेटा में डाउनलोड हो जाते हैं और आप बिना इंटरनेट के कभी भी सुन और देख सकते हैं।',
      },
      {
        q: 'अगर मैं कोई और काम चुनना चाहूँ तो?',
        a: 'आप वैकल्पिक विकल्पों में डिजिटल सर्विस या सोलर टेक्नीशियन चुन सकते हैं, या अपनी पसंद कभी भी बदल सकते हैं।',
      },
    ],
    en: [
      {
        q: 'Why did you recommend this?',
        a: 'Mobile repair fits you because you enjoy hands-on technical work, already have tool experience, and want a path that helps you start earning relatively soon without traveling far.',
      },
      {
        q: 'What work will I do?',
        a: 'You will diagnose smartphone issues, replace damaged screens and batteries, repair charging ports, and test audio components for local customers.',
      },
      {
        q: 'Can I learn this offline?',
        a: 'Yes! KaushalSetu lessons are designed as lightweight downloadable audio packs. Once downloaded, you do not need active mobile data to practice.',
      },
      {
        q: 'What if I choose something else?',
        a: 'You can explore our alternative matches like Digital Service Assistant or Solar Service Technician, or tap "Change my preferences" anytime.',
      },
    ],
  };

  const list = presetQuestions[language] || presetQuestions.en;
  const activeAnswer = selectedQuestion ? list.find((item) => item.q === selectedQuestion)?.a : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ask-kaushal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0A1931]/60 backdrop-blur-xs transition-opacity"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        className="
          relative w-full max-w-lg bg-[#FAF9F4] rounded-t-[24px] sm:rounded-[20px]
          border-t-2 sm:border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931]
          p-6 sm:p-7 z-10 max-h-[90vh] overflow-y-auto
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9E1E5]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0A1931] text-[#F4C84A] flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#0A1931] block">
                Ask KaushalSetu · प्रश्न विचारा
              </span>
              <span className="text-xs text-[#64748B]">Personal Career Guide</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0A1931] hover:bg-[#DCECF3]/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Custom Answer display */}
        {customAnswer && (
          <div className="mt-4 p-4 rounded-xl bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[3px_3px_0px_#58B98C]">
            <span className="text-[11px] font-bold text-[#58B98C] uppercase tracking-wider block mb-1">
              {language === 'mr' ? 'मार्गदर्शक AI उत्तर' : 'KaushalSetu AI Answer'}
            </span>
            <div className="flex items-start gap-2.5 mt-2">
              <Volume2 className="w-5 h-5 text-[#58B98C] shrink-0 mt-0.5" />
              <p className="text-[15px] font-medium text-[#0A1931] leading-relaxed font-devanagari">
                {customAnswer}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#D9E1E5] flex justify-end">
              <button
                type="button"
                onClick={() => setCustomAnswer(null)}
                className="text-xs font-bold text-[#4A7FA7] hover:underline cursor-pointer"
              >
                {language === 'mr' ? 'दुसरा प्रश्न विचारा ↗' : 'Ask another question ↗'}
              </button>
            </div>
          </div>
        )}

        {/* Selected Preset Answer display */}
        {activeAnswer && (
          <div className="mt-4 p-4 rounded-xl bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[2px_2px_0px_#0A1931]">
            <span className="text-[11px] font-bold text-[#4A7FA7] uppercase tracking-wider block mb-1">
              Question: {selectedQuestion}
            </span>
            <div className="flex items-start gap-2.5 mt-2">
              <Volume2 className="w-5 h-5 text-[#58B98C] shrink-0 mt-0.5" />
              <p className="text-[15px] font-medium text-[#0A1931] leading-relaxed font-devanagari">
                {activeAnswer}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#D9E1E5] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedQuestion(null)}
                className="text-xs font-bold text-[#4A7FA7] hover:underline cursor-pointer"
              >
                Ask another question ↗
              </button>
            </div>
          </div>
        )}

        {/* Live Question Input Bar */}
        <form onSubmit={handleAskCustom} className="my-3 flex items-center gap-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder={language === 'mr' ? 'मोबाईल दुरुस्तीबद्दल काहीही विचारा...' : 'Ask anything about this career...'}
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
          <div className="mt-2 mb-3">
            <p className="text-[14px] text-[#64748B]">
              Tap a common question or speak naturally in your language:
            </p>
          </div>
        )}

        {!activeAnswer && !customAnswer && (
          <div className="space-y-2">
              {list.map((item) => (
                <button
                  key={item.q}
                  type="button"
                  onClick={() => setSelectedQuestion(item.q)}
                  className="
                    w-full p-3.5 rounded-xl bg-[#FFFFFF] border border-[#D9E1E5] hover:border-[#0A1931]
                    hover:bg-[#FAF9F4] text-left transition-all cursor-pointer flex items-center justify-between
                    shadow-[1px_1px_0px_rgba(10,25,49,0.04)]
                  "
                >
                  <span className="text-[14px] font-bold text-[#0A1931] font-devanagari">
                    “{item.q}”
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#4A7FA7] shrink-0" />
                </button>
              ))}
            </div>
          
        )}

        <div className="mt-6 pt-3 border-t border-[#D9E1E5] flex justify-end">
          <SecondaryButton size="md" fullWidth onClick={onClose}>
            Done
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};
