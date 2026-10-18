import React, { useState } from 'react';
import { Mic, X, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { LanguageCode } from '../types';
import { PrimaryButton } from './ui/PrimaryButton';
import { SecondaryButton } from './ui/SecondaryButton';

interface VoiceBottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  onStartWithVoice?: () => void;
}

export const VoiceBottomSheetModal: React.FC<VoiceBottomSheetModalProps> = ({
  isOpen,
  onClose,
  language,
  onStartWithVoice,
}) => {
  const [isSimulatingAudio, setIsSimulatingAudio] = useState(false);

  if (!isOpen) return null;

  const greetings: Record<LanguageCode, { text: string; sub: string; speechPrompt: string }> = {
    mr: {
      text: 'नमस्कार! मी कौशलसेतू आवाज सहाय्यक आहे.',
      sub: 'तुम्ही मराठीत बोलून तुमची आवड आणि कौशल्ये सांगू शकता.',
      speechPrompt: 'उदा. "मला मोबाईल रिपेअरिंग किंवा सोलर पॅनेल शिकायचे आहे."',
    },
    hi: {
      text: 'नमस्ते! मैं कौशलसेतु वॉयस सहायक हूँ।',
      sub: 'आप हिंदी में बोलकर अपनी पसंद और कौशल बता सकते हैं।',
      speechPrompt: 'उदा. "मुझे कंप्यूटर टाइपिंग या इलेक्ट्रिकल काम सीखना है।"',
    },
    en: {
      text: 'Hello! I am your KaushalSetu Voice Assistant.',
      sub: 'You can speak in your own words about what you enjoy doing.',
      speechPrompt: 'e.g. "I want to learn solar installation or rural banking."',
    },
  };

  const currentGreeting = greetings[language];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0A1931]/60 backdrop-blur-xs transition-opacity duration-200"
    >
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal / Bottom Sheet container */}
      <div
        className="
          relative w-full max-w-lg bg-[#FAF9F4] rounded-t-[24px] sm:rounded-[20px]
          border-t-2 sm:border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931]
          p-6 sm:p-7 z-10 transition-transform duration-200 max-h-[90vh] overflow-y-auto
        "
      >
        {/* Notebook top tape visual cue */}
        <div className="hidden sm:block absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#F4C84A]/60 rotate-1 border-x border-[#0A1931]/20 pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-[#D9E1E5]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF6F61] animate-ping" />
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#EF6F61]">
              Voice Assistant Preview
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close voice assistant"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0A1931] hover:bg-[#DCECF3]/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 flex flex-col items-center text-center">
          {/* Animated voice pulsating orb */}
          <div className="relative my-2">
            <div className="w-20 h-20 rounded-full bg-[#0A1931] text-white flex items-center justify-center shadow-[3px_3px_0px_#EF6F61]">
              <Mic className="w-9 h-9 text-[#F4C84A]" />
            </div>
            <div className="absolute -inset-2 rounded-full border-2 border-dashed border-[#4A7FA7] animate-spin" style={{ animationDuration: '10s' }} />
          </div>

          <h3 id="voice-modal-title" className="text-[20px] sm:text-[22px] font-bold text-[#0A1931] mt-4 font-sans">
            Voice onboarding will begin here
          </h3>

          {/* Bilingual greeting card */}
          <div className="mt-4 p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E5] text-left w-full shadow-[1px_1px_0px_rgba(10,25,49,0.05)]">
            <p className="text-[16px] font-semibold text-[#0A1931] font-devanagari">
              {currentGreeting.text}
            </p>
            <p className="text-[14px] text-[#64748B] mt-1 font-devanagari">
              {currentGreeting.sub}
            </p>

            <div className="mt-3 pt-2.5 border-t border-[#D9E1E5]/70 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F4C84A] shrink-0" />
              <p className="text-[12px] text-[#1A3D63] font-medium italic">
                {currentGreeting.speechPrompt}
              </p>
            </div>
          </div>

          {/* Sound wave visualizer */}
          <div className="flex items-center justify-center gap-1.5 my-5 h-8">
            <span className="w-1.5 h-3 bg-[#4A7FA7] rounded-full animate-pulse" />
            <span className="w-1.5 h-6 bg-[#0A1931] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-8 bg-[#EF6F61] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            <span className="w-1.5 h-5 bg-[#F4C84A] rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
            <span className="w-1.5 h-7 bg-[#58B98C] rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
            <span className="w-1.5 h-4 bg-[#4A7FA7] rounded-full animate-pulse" style={{ animationDelay: '350ms' }} />
          </div>

          <p className="text-[13px] text-[#64748B] max-w-sm">
            In the upcoming step, you can simply speak in your local dialect without typing any forms.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#D9E1E5]">
          <SecondaryButton
            size="md"
            fullWidth
            onClick={onClose}
          >
            Got it, use touch screen
          </SecondaryButton>
          <PrimaryButton
            size="md"
            fullWidth
            onClick={() => {
              onClose();
              onStartWithVoice?.();
            }}
            icon={<Mic className="w-4 h-4" />}
          >
            Start with Voice
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
