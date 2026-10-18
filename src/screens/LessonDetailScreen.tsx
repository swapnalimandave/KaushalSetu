import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Volume2,
  Pause,
  Play,
  RotateCcw,
  Check,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Download,
  AlertCircle,
  BookOpen,
  Info,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { AnnotationTag } from '../components/ui/AnnotationTag';
import { SmartphoneSchematic } from '../components/SmartphoneSchematic';
import { NextStepCard } from '../components/ui/NextStepCard';
import { markLessonCompleted, getStoredProgress } from '../utils/progressManager';

interface LessonDetailScreenProps {
  language: LanguageCode;
  onBackToEarnPath: () => void;
  onContinueToNextLesson?: () => void;
  onLanguageChangeRequest: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  questionMr: string;
  options: string[];
  optionsMr: string[];
  correctIndex: number;
  explanation: string;
  explanationMr: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which component stores electrical energy for the phone?',
    questionMr: 'स्मार्टफोनमध्ये विद्युत ऊर्जा साठवून ठेवणारा मुख्य घटक कोणता?',
    options: ['Display', 'Battery', 'Camera', 'Speaker'],
    optionsMr: ['डिस्प्ले (Display)', 'बॅटरी (Battery)', 'कॅमेरा (Camera)', 'स्पीकर (Speaker)'],
    correctIndex: 1,
    explanation: 'Correct — the battery supplies stored electrical energy to the device.',
    explanationMr: 'अगदी बरोबर — बॅटरी उपकरणाला आवश्यक विद्युत ऊर्जा साठवते आणि पुरवते.',
  },
  {
    id: 2,
    question: 'Which part is commonly involved when a phone does not charge?',
    questionMr: 'फोन चार्ज होत नसताना सहसा कोणत्या भागात अडचण असते?',
    options: ['Charging port', 'Camera', 'Speaker', 'Display glass'],
    optionsMr: ['चार्जिंग पोर्ट (Charging port)', 'कॅमेरा', 'स्पीकर', 'डिस्प्ले ग्लास'],
    correctIndex: 0,
    explanation: 'Correct — the charging port transfers current from the cable to the battery.',
    explanationMr: 'अगदी बरोबर — चार्जिंग पोर्टमधून केबलद्वारे बॅटरीपर्यंत वीज पोहोचते.',
  },
  {
    id: 3,
    question: 'Before repairing a phone, what should you do first?',
    questionMr: 'फोन दुरुस्त करण्यापूर्वी सर्वात आधी काय केले पाहिजे?',
    options: [
      'Immediately remove parts',
      'Understand the problem and follow safety steps',
      'Turn brightness up',
      'Install random software',
    ],
    optionsMr: [
      'लगेच भाग तोडणे/उघडणे',
      'समस्या समजून घेणे आणि सुरक्षिततेचे नियम पाळणे',
      'ब्राइटनेस वाढवणे',
      'काहीही ॲप्स इन्स्टॉल करणे',
    ],
    correctIndex: 1,
    explanation: 'Correct — diagnosing the problem and disconnecting the battery safely comes first.',
    explanationMr: 'अगदी बरोबर — समस्येची आधी खात्री करणे आणि सुरक्षिततेचे नियम पाळणे हे उत्तम तंत्रज्ञाचे लक्षण आहे.',
  },
];

// Reinforcement mini-questions for adaptive learning (if score <= 1)
const REINFORCEMENT_QUESTIONS: QuizQuestion[] = [
  {
    id: 101,
    question: 'Does the battery store power when the charger is unplugged?',
    questionMr: 'चार्जर काढल्यावरही बॅटरीमध्ये वीज साठवून राहते का?',
    options: ['Yes', 'No'],
    optionsMr: ['होय (Yes)', 'नाही (No)'],
    correctIndex: 0,
    explanation: 'Yes — lithium-ion batteries hold power so your phone runs portably.',
    explanationMr: 'होय — बॅटरी ऊर्जा साठवून ठेवते म्हणूनच फोन कुठेही वापरता येतो.',
  },
  {
    id: 102,
    question: 'Should you poke metal pins into the battery pack?',
    questionMr: 'बॅटरीवर टोकदार खिळे किंवा धातूचे अवजार टोचणे योग्य आहे का?',
    options: ['Never, it causes smoke/fire hazard', 'Yes, it charges it faster'],
    optionsMr: ['कधीही नाही, आग किंवा धूर निघू शकतो', 'होय, चालते'],
    correctIndex: 0,
    explanation: 'Never puncture batteries — always use safe blunt plastic tools.',
    explanationMr: 'कधीही नाही — बॅटरी पंक्चर झाल्यास धोका होऊ शकतो.',
  },
];

export const LessonDetailScreen: React.FC<LessonDetailScreenProps> = ({
  language,
  onBackToEarnPath,
  onContinueToNextLesson,
  onLanguageChangeRequest,
}) => {
  // TTS State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(true);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Content inspection state
  const [hasScrolledContent, setHasScrolledContent] = useState(true);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [attempts, setAttempts] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Lesson Completion state
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setTtsAvailable(false);
    }

    const currentProg = getStoredProgress();
    if (currentProg.completedLessons.includes('inside-a-smartphone')) {
      setIsLessonCompleted(true);
      setQuizSubmitted(true);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const lessonAudioScript =
    language === 'mr'
      ? 'नमस्कार! आज आपण स्मार्टफोनच्या आतील रचनेबद्दल शिकणार आहोत. स्मार्टफोनमध्ये बॅटरी, मदरबोर्ड, डिस्प्ले, चार्जिंग पोर्ट, कॅमेरा आणि स्पीकर हे मुख्य घटक एकत्र काम करतात. कोणतीही दुरुस्ती करताना सर्वात आधी सुरक्षिततेचे नियम पाळणे आणि बॅटरी वेगळी करणे अतिशय महत्त्वाचे आहे.'
      : 'Welcome to Inside a Smartphone! A smartphone contains several connected parts. The battery stores power, the motherboard controls processing, the display gives visual output, and the charging port receives power. Always disconnect the battery first before inspecting hardware.';

  const handleToggleAudio = () => {
    if (!synthRef.current) {
      setTtsAvailable(false);
      return;
    }

    if (isPlayingAudio) {
      synthRef.current.cancel();
      setIsPlayingAudio(false);
    } else {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(lessonAudioScript);
      utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setTtsAvailable(false);
      };

      synthRef.current.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleRestartAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlayingAudio(false);
      setTimeout(handleToggleAudio, 100);
    }
  };

  // Handle Quiz Option Select
  const handleSelectAnswer = (questionId: number, optionIdx: number) => {
    if (quizSubmitted) return;

    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    setAttempts((prev) => ({ ...prev, [questionId]: (prev[questionId] || 0) + 1 }));
    setShowExplanation((prev) => ({ ...prev, [questionId]: true }));
  };

  // Calculate Quiz Score
  const score = QUIZ_QUESTIONS.reduce((acc, q) => {
    return acc + (userAnswers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);

  const allQuestionsAnswered = QUIZ_QUESTIONS.every((q) => userAnswers[q.id] !== undefined);

  const handleCompleteLesson = () => {
    markLessonCompleted('inside-a-smartphone', { score, total: 3, attempts: 1 });
    setIsLessonCompleted(true);
    setQuizSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg selection:bg-[#F4C84A]/30">
      {/* Lightweight AppHeader */}
      <AppHeader
        currentLanguage={language}
        onLanguageClick={onLanguageChangeRequest}
      />

      <main className="flex-1 w-full max-w-[860px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <button
            type="button"
            onClick={onBackToEarnPath}
            className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#0A1931] hover:text-[#4A7FA7] min-h-[44px] px-2 rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back to EarnPath</span>
          </button>

          <span className="text-[12px] font-bold px-2.5 py-1 rounded-md bg-[#DCECF3] text-[#1A3D63] border border-[#4A7FA7]/40 flex items-center gap-1">
            <Check className="w-3.5 h-3.5 stroke-[3] text-[#58B98C]" />
            Available Offline
          </span>
        </div>

        {/* Lesson Title Box */}
        <div className="rounded-[20px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-5 sm:p-7 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A7FA7]">
              Week 1 · Lesson 01
            </span>
            <span className="text-xs font-mono font-bold text-[#64748B]">
              ⏱ 6 min · Audio + Visual Guide
            </span>
          </div>

          <h1 className="text-[24px] sm:text-[32px] font-extrabold text-[#0A1931] tracking-tight font-sans">
            {language === 'mr' ? 'स्मार्टफोनच्या आत काय असते?' : 'Inside a Smartphone'}
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#64748B] mt-1 font-devanagari">
            Learn the foundational internal components before opening or replacing any phone part.
          </p>

          {/* Audio Player Bar */}
          <div className="mt-5 p-3.5 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0A1931] text-[#F4C84A] flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[13px] font-bold text-[#0A1931] block">
                  Listen to Lesson · ऑडिओ मार्गदर्शक
                </span>
                <span className="text-[11px] text-[#64748B] block">
                  Natural spoken explanation in {language === 'mr' ? 'Marathi' : language === 'hi' ? 'Hindi' : 'English'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {ttsAvailable ? (
                <>
                  <button
                    type="button"
                    onClick={handleToggleAudio}
                    className="
                      inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                      bg-[#0A1931] hover:bg-[#1A3D63] text-white text-[13px] font-bold
                      shadow-[2px_2px_0px_#F4C84A] transition-all cursor-pointer min-h-[40px] flex-1 sm:flex-initial
                    "
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Play Audio</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleRestartAudio}
                    title="Restart Audio"
                    className="w-10 h-10 rounded-lg border border-[#D9E1E5] bg-[#FFFFFF] flex items-center justify-center text-[#64748B] hover:text-[#0A1931] cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <span className="text-[12px] text-[#64748B] italic">
                  Audio is unavailable on this device. You can continue reading.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 1: WHAT IS INSIDE A SMARTPHONE? */}
        <section className="rounded-[20px] bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.04)] p-5 sm:p-7 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded bg-[#DCECF3] text-[#0A1931] flex items-center justify-center font-bold text-xs font-mono">
              01
            </span>
            <h2 className="text-[18px] sm:text-[20px] font-bold text-[#0A1931] font-sans">
              What is inside a smartphone? · स्मार्टफोनची अंतर्गत रचना
            </h2>
          </div>

          <p className="text-[15px] sm:text-[16px] text-[#17212B] leading-relaxed mt-2 font-devanagari">
            A smartphone contains several connected parts. Each part has a specific job. Repair begins by understanding these parts before opening or replacing anything.
          </p>

          <div className="p-3.5 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] mt-4 text-[13px] text-[#1A3D63] font-medium flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#F4C84A] shrink-0 mt-0.5" />
            <span>
              <strong>Golden Technician Rule:</strong> Never force components open. Most mobile faults can be diagnosed through careful inspection rather than excessive pressure.
            </span>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE VISUAL SCHEMATIC */}
        <section className="mb-6">
          <SmartphoneSchematic language={language} />
        </section>

        {/* SECTION 3: QUICK CHECK QUIZ & ADAPTIVE FEEDBACK */}
        <section className="rounded-[20px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-5 sm:p-7 mb-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D9E1E5]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#58B98C]" />
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#0A1931] font-sans">
                Quick Check · ज्ञान तपासणी
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#4A7FA7]">
              {score} / 3 Correct
            </span>
          </div>

          <p className="text-[14px] text-[#64748B] mb-5 font-devanagari">
            Choose the best answer for each question. Mistakes are part of learning!
          </p>

          {/* 3 Questions */}
          <div className="space-y-6">
            {QUIZ_QUESTIONS.map((q, qIndex) => {
              const selectedOpt = userAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctIndex;
              const hasTriedAgain = (attempts[q.id] || 0) > 1;

              return (
                <div key={q.id} className="p-4 sm:p-4.5 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5]">
                  <h4 className="text-[15px] sm:text-[16px] font-bold text-[#0A1931] mb-1 font-devanagari">
                    {qIndex + 1}. {language === 'mr' ? q.questionMr : q.question}
                  </h4>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                    {(language === 'mr' ? q.optionsMr : q.options).map((opt, optIdx) => {
                      const isThisSelected = selectedOpt === optIdx;
                      const isThisCorrect = optIdx === q.correctIndex;

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isAnswered && isCorrect}
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          className={`
                            p-3 rounded-lg text-left text-[14px] font-medium transition-all cursor-pointer flex items-center justify-between
                            ${
                              isThisSelected && isCorrect
                                ? 'bg-[#58B98C] text-white border-2 border-[#0A1931] shadow-[2px_2px_0px_#0A1931]'
                                : isThisSelected && !isCorrect
                                ? 'bg-[#FAF9F4] border-2 border-[#EF6F61] text-[#0A1931]'
                                : isAnswered && isThisCorrect && hasTriedAgain
                                ? 'bg-[#58B98C]/20 text-[#0A1931] border border-[#58B98C]'
                                : 'bg-[#FFFFFF] border border-[#D9E1E5] text-[#17212B] hover:border-[#4A7FA7]'
                            }
                          `}
                        >
                          <span className="font-devanagari">{opt}</span>
                          {isThisSelected && isCorrect && <Check className="w-4 h-4 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Supportive Feedback */}
                  {showExplanation[q.id] && (
                    <div className="mt-3 p-3 rounded-lg bg-[#FFFFFF] border border-[#D9E1E5] text-[13px] animate-in fade-in duration-150">
                      {isCorrect ? (
                        <p className="text-[#2E7D32] font-semibold flex items-center gap-1.5 font-devanagari">
                          <Check className="w-4 h-4 stroke-[3]" />
                          {language === 'mr' ? q.explanationMr : q.explanation}
                        </p>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-[#B86B00] font-medium font-devanagari">
                            Not quite. Think about which component stores power.
                          </p>
                          {hasTriedAgain && (
                            <p className="text-[#17212B] text-xs pt-1 border-t border-[#D9E1E5]">
                              Answer: <strong>{language === 'mr' ? q.optionsMr[q.correctIndex] : q.options[q.correctIndex]}</strong> — {language === 'mr' ? q.explanationMr : q.explanation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ADAPTIVE LEARNING SECTION BASED ON SCORE */}
          {allQuestionsAnswered && (
            <div className="mt-6 p-4 rounded-xl border-2 border-[#0A1931] bg-[#FAF9F4] shadow-[2px_2px_0px_#0A1931] animate-in fade-in">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A7FA7]">
                  Adaptive Guidance
                </span>
              </div>

              {score === 3 && (
                <div className="flex items-start gap-2 text-[#2E7D32]">
                  <Check className="w-5 h-5 stroke-[3] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-[15px] text-[#0A1931]">
                      Great work! You can move ahead.
                    </h5>
                    <p className="text-[13px] text-[#64748B] mt-0.5">
                      You clearly understand all the core components and safety protocols.
                    </p>
                  </div>
                </div>
              )}

              {score === 2 && (
                <div className="flex items-start gap-2 text-[#B86B00]">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-[15px] text-[#0A1931]">
                      You're almost there! Review one concept before continuing.
                    </h5>
                    <p className="text-[13px] text-[#64748B] mt-0.5">
                      Check the Interactive Schematic above to review the component roles.
                    </p>
                  </div>
                </div>
              )}

              {score <= 1 && (
                <div>
                  <div className="flex items-start gap-2 text-[#4A7FA7] mb-3">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-bold text-[15px] text-[#0A1931]">
                        Let's strengthen this first.
                      </h5>
                      <p className="text-[13px] text-[#64748B] mt-0.5">
                        Here is a quick reinforcement check to build confidence:
                      </p>
                    </div>
                  </div>

                  {/* 2 Easier Follow-Up Questions */}
                  <div className="space-y-3 pt-2 border-t border-[#D9E1E5]">
                    {REINFORCEMENT_QUESTIONS.map((rq) => (
                      <div key={rq.id} className="p-3 rounded-lg bg-[#FFFFFF] border border-[#D9E1E5] text-xs">
                        <p className="font-bold text-[#0A1931] mb-2">{rq.question}</p>
                        <div className="flex gap-2">
                          {rq.options.map((opt, i) => (
                            <button
                              key={i}
                              type="button"
                              className="px-3 py-1.5 rounded-md bg-[#FAF9F4] border border-[#D9E1E5] hover:bg-[#DCECF3] font-semibold text-[#0A1931] cursor-pointer"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Primary CTA: Complete Lesson */}
          <div className="mt-6 pt-4 border-t border-[#D9E1E5] flex flex-col sm:flex-row gap-3">
            <PrimaryButton
              size="lg"
              fullWidth
              disabled={!allQuestionsAnswered}
              onClick={handleCompleteLesson}
              icon={<Check className="w-5 h-5 stroke-[3]" />}
            >
              {isLessonCompleted ? 'Lesson Completed ✓' : 'Complete Lesson'}
            </PrimaryButton>

            <SecondaryButton
              size="lg"
              onClick={onBackToEarnPath}
            >
              Back to EarnPath
            </SecondaryButton>
          </div>

        </section>

        {/* Dynamic Next Step Card upon completion */}
        {isLessonCompleted && (
          <div className="mb-6 animate-in slide-in-from-bottom duration-300">
            <NextStepCard
              badge="YOUR NEXT STEP"
              title="Essential Repair Tools"
              description="Learn how to handle precision screwdrivers, opening picks, tweezers, and heating pads safely (5 min)."
              actionText="Continue to Next Lesson"
              onAction={onContinueToNextLesson || onBackToEarnPath}
            />
          </div>
        )}

      </main>
    </div>
  );
};
