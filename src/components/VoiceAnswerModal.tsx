import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Volume2, Sparkles, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { LanguageCode } from '../types';
import { PrimaryButton } from './ui/PrimaryButton';
import { SecondaryButton } from './ui/SecondaryButton';
import { mapSpokenTextToOptions } from '../data/onboardingQuestions';

interface VoiceAnswerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stepNumber: number;
  questionTitle: string;
  language: LanguageCode;
  onApplyVoiceAnswer: (matchedOptions: string[], rawTranscript: string) => void;
}

// Global declaration for Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export const VoiceAnswerModal: React.FC<VoiceAnswerModalProps> = ({
  isOpen,
  onClose,
  stepNumber,
  questionTitle,
  language,
  onApplyVoiceAnswer,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [matchedOptions, setMatchedOptions] = useState<string[]>([]);
  const recognitionRef = useRef<any>(null);

  // Suggested demo speech phrases for rapid testing without physical microphone
  const samplePhrases: Record<number, Record<LanguageCode, string>> = {
    1: {
      mr: 'मी दहावी (10th) पर्यंत शिकलो आहे',
      hi: 'मैंने १०वीं (Class 10) तक पढ़ाई की है',
      en: 'I completed Class 10',
    },
    2: {
      mr: 'मला मोबाईल रिपेअरिंग आणि इलेक्ट्रिकल काम खूप आवडतं',
      hi: 'मुझे चीजें रिपेयर करना और कंप्यूटर पसंद है',
      en: 'I enjoy repairing things and electrical work',
    },
    3: {
      mr: 'मी स्मार्टफोन वापरू शकतो आणि साधी अवजारे चालवतो',
      hi: 'मैं स्मार्टफोन और टूल्स इस्तेमाल कर लेता हूँ',
      en: 'I can use a smartphone and repair simple items',
    },
    4: {
      mr: 'मला प्रॅक्टिकल हाताने करायचे काम हवे आहे',
      hi: 'मुझे हाथ से करने वाला प्रैक्टिकल काम पसंद है',
      en: 'I prefer hands-on practical work',
    },
    5: {
      mr: 'मला पुढील ३ महिन्यांत कमाई सुरू करायची आहे',
      hi: 'मुझे अगले ३ महीनों में काम शुरू करना है',
      en: 'I want to start earning within 3 months',
    },
    6: {
      mr: 'मी जवळच्या तालुक्यात किंवा शहरात जाऊ शकतो',
      hi: 'मैं पास के कस्बे या शहर तक जा सकता हूँ',
      en: 'I can travel to a nearby town',
    },
    7: {
      mr: 'माझ्याकडे स्वतःचा ॲन्ड्रॉइड फोन आहे आणि कधीकधी इंटरनेट मिळते',
      hi: 'मेरे पास एंड्रॉइड फोन है और कभी-कभी इंटरनेट मिलता है',
      en: 'I have my own Android phone and sometimes internet',
    },
    8: {
      mr: 'मी ऐकून आणि स्वतः हाताने प्रॅक्टिस करून छान शिकतो',
      hi: 'मैं सुनकर और खुद करके जल्दी सीखता हूँ',
      en: 'I learn best by listening and practicing myself',
    },
  };

  const speechLangMap: Record<LanguageCode, string> = {
    mr: 'mr-IN',
    hi: 'hi-IN',
    en: 'en-IN',
  };

  const startListening = () => {
    setErrorStatus(null);
    setTranscript('');
    setMatchedOptions([]);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorStatus('Voice input is not available on this browser. You can continue by selecting an option.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = speechLangMap[language];
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setTranscript(text);

        const { matchedOptions } = mapSpokenTextToOptions(stepNumber, text);
        setMatchedOptions(matchedOptions);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorStatus('We couldn’t access your microphone. You can continue using touch or text.');
        } else if (event.error === 'no-speech') {
          setErrorStatus('No voice was detected. Please try speaking again.');
        } else {
          setErrorStatus('We could not hear clearly. You can try again or tap the options.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setErrorStatus('We couldn’t access your microphone. You can continue using touch or text.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  };

  const handleSimulateSampleVoice = (sampleText: string) => {
    stopListening();
    setErrorStatus(null);
    setTranscript(sampleText);
    const { matchedOptions } = mapSpokenTextToOptions(stepNumber, sampleText);
    setMatchedOptions(matchedOptions);
  };

  useEffect(() => {
    if (isOpen) {
      startListening();
    } else {
      stopListening();
    }
    return () => {
      stopListening();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentSample = samplePhrases[stepNumber]?.[language] || 'मला प्रॅक्टिकल काम शिकायचे आहे';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-answer-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0A1931]/60 backdrop-blur-xs transition-opacity"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        className="
          relative w-full max-w-lg bg-[#FAF9F4] rounded-t-[24px] sm:rounded-[20px]
          border-t-2 sm:border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931]
          p-6 sm:p-7 z-10 max-h-[92vh] overflow-y-auto
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9E1E5]">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-[#EF6F61] animate-ping' : 'bg-[#58B98C]'}`} />
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#0A1931]">
              Voice Answer · आवाजाने उत्तर द्या
            </span>
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

        {/* Current question context */}
        <div className="mt-3 text-xs text-[#64748B]">
          Answering Question {stepNumber}: <span className="font-semibold text-[#0A1931]">{questionTitle}</span>
        </div>

        {/* Body State */}
        <div className="py-5 flex flex-col items-center text-center">
          {/* Animated Microphone state */}
          <div className="relative my-2">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`
                w-20 h-20 rounded-full flex items-center justify-center shadow-[3px_3px_0px_#0A1931]
                transition-transform active:scale-95 cursor-pointer
                ${isListening ? 'bg-[#EF6F61] text-white ring-4 ring-[#EF6F61]/30' : 'bg-[#0A1931] text-white'}
              `}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              <Mic className={`w-9 h-9 ${isListening ? 'animate-bounce text-white' : 'text-[#F4C84A]'}`} />
            </button>
          </div>

          <h3 id="voice-answer-title" className="text-[18px] sm:text-[20px] font-bold text-[#0A1931] mt-3">
            {isListening ? 'Listening… / ऐकत आहे…' : transcript ? 'Voice captured' : 'Tap to speak'}
          </h3>

          <p className="text-[13px] text-[#64748B] mt-1 font-devanagari">
            Speak naturally in Marathi, Hindi, or English.
          </p>

          {/* Waveform indicator when listening */}
          {isListening && (
            <div className="flex items-center justify-center gap-1.5 my-4 h-7">
              <span className="w-1.5 h-3 bg-[#4A7FA7] rounded-full animate-pulse" />
              <span className="w-1.5 h-7 bg-[#0A1931] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-8 bg-[#EF6F61] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              <span className="w-1.5 h-5 bg-[#F4C84A] rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
              <span className="w-1.5 h-6 bg-[#58B98C] rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
            </div>
          )}

          {/* Error Message gracefully displayed */}
          {errorStatus && (
            <div className="w-full mt-3 p-3.5 rounded-xl bg-[#FAF9F4] border border-[#EF6F61]/40 text-left flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#EF6F61] shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#17212B] leading-snug">{errorStatus}</p>
            </div>
          )}

          {/* Transcript Display */}
          {transcript && (
            <div className="w-full mt-4 p-4 rounded-xl bg-[#FFFFFF] border-2 border-[#0A1931] text-left shadow-[2px_2px_0px_#0A1931]">
              <span className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider block mb-1">
                You said / तुम्ही म्हणालात:
              </span>
              <p className="text-[16px] font-bold text-[#0A1931] font-devanagari">
                “{transcript}”
              </p>

              {matchedOptions.length > 0 ? (
                <div className="mt-3 pt-2.5 border-t border-[#D9E1E5]">
                  <span className="text-[11px] font-bold uppercase text-[#58B98C] flex items-center gap-1 mb-1.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    Matching option(s) found:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedOptions.map((opt) => (
                      <span
                        key={opt}
                        className="text-[12px] font-bold px-2 py-1 rounded bg-[#DCECF3] text-[#0A1931] border border-[#4A7FA7]/40"
                      >
                        ✓ {opt}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-[12px] text-[#64748B] mt-2 italic">
                  Tap "Use this answer" or select a card on screen.
                </p>
              )}
            </div>
          )}

          {/* Quick Demo Simulator button for environments without physical mic */}
          <div className="w-full mt-4 pt-3 border-t border-[#D9E1E5]/70 flex flex-col items-center">
            <span className="text-[11px] font-medium text-[#64748B] mb-1.5">
              Or test with sample audio transcript:
            </span>
            <button
              type="button"
              onClick={() => handleSimulateSampleVoice(currentSample)}
              className="text-[12px] font-bold text-[#1A3D63] bg-[#DCECF3]/70 hover:bg-[#DCECF3] border border-[#4A7FA7]/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-center max-w-full truncate"
            >
              🎤 Test sample: “{currentSample}”
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t border-[#D9E1E5]">
          {transcript ? (
            <>
              <PrimaryButton
                size="md"
                fullWidth
                onClick={() => {
                  onApplyVoiceAnswer(matchedOptions, transcript);
                  onClose();
                }}
                icon={<Check className="w-4 h-4 stroke-[3]" />}
              >
                Use this answer
              </PrimaryButton>
              <SecondaryButton
                size="md"
                fullWidth
                onClick={startListening}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                Try again
              </SecondaryButton>
            </>
          ) : (
            <>
              <SecondaryButton
                size="md"
                fullWidth
                onClick={onClose}
              >
                Cancel / Choose by touch
              </SecondaryButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
