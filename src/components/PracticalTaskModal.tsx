import React, { useState } from 'react';
import { X, Check, Wrench, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { PracticalTask, LanguageCode } from '../types';
import { PrimaryButton } from './ui/PrimaryButton';
import { SecondaryButton } from './ui/SecondaryButton';

interface PracticalTaskModalProps {
  task: PracticalTask;
  isOpen: boolean;
  onClose: () => void;
  onCompleteTask: (taskId: string) => void;
  language: LanguageCode;
}

export const PracticalTaskModal: React.FC<PracticalTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onCompleteTask,
  language,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [studentNotes, setStudentNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(task.completed);

  if (!isOpen) return null;

  const instructions = language === 'mr' ? task.instructionsMr : task.instructions;

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const allChecked = instructions.every((_, i) => checkedItems[i]);

  const handleSubmit = () => {
    onCompleteTask(task.id);
    setIsSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
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
            <span className="w-2.5 h-2.5 rounded-full bg-[#F4C84A]" />
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#0A1931]">
              Week 1 Practical Task · प्रात्यक्षिक कार्य
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

        {/* Title */}
        <div className="mt-4">
          <h3 id="task-modal-title" className="text-[20px] sm:text-[22px] font-extrabold text-[#0A1931] font-sans">
            {language === 'mr' ? task.titleMr : task.title}
          </h3>
          <p className="text-[13px] text-[#64748B] mt-1 font-devanagari">
            Apply what you learned in Week 1. Check off each practical action as you verify it.
          </p>
        </div>

        {/* Instructions Checklist */}
        <div className="mt-5 space-y-2.5">
          {instructions.map((inst, index) => {
            const isChecked = checkedItems[index] || isSubmitted;
            return (
              <button
                key={index}
                type="button"
                onClick={() => toggleCheck(index)}
                className={`
                  w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer
                  ${isChecked ? 'bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[2px_2px_0px_#0A1931]' : 'bg-[#FFFFFF] border-[#D9E1E5] hover:bg-[#FAF9F4]'}
                `}
              >
                <div
                  className={`
                    w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors
                    ${isChecked ? 'bg-[#58B98C] text-white' : 'border-2 border-[#D9E1E5] bg-[#FAF9F4]'}
                  `}
                >
                  <Check className={`w-3.5 h-3.5 stroke-[3] ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                <span className={`text-[14px] leading-snug font-devanagari ${isChecked ? 'font-bold text-[#0A1931]' : 'text-[#17212B]'}`}>
                  {inst}
                </span>
              </button>
            );
          })}
        </div>

        {/* Student Voice or Text Observation Box */}
        <div className="mt-5 p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E5]">
          <label htmlFor="task-notes" className="block text-[13px] font-bold text-[#0A1931] mb-1">
            Your Observation / तुमचे निरीक्षण (Optional):
          </label>
          <textarea
            id="task-notes"
            rows={3}
            value={studentNotes}
            onChange={(e) => setStudentNotes(e.target.value)}
            placeholder="e.g. Disconnected the battery first; noticed battery had 4500mAh rating."
            className="w-full p-3 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-[14px] text-[#0A1931] focus:outline-none focus:border-[#0A1931]"
          />
        </div>

        {/* Mentor verification note */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#DCECF3]/60 border border-[#4A7FA7]/30 text-[12px] text-[#1A3D63] flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#4A7FA7] shrink-0 mt-0.5" />
          <span>
            <strong>Note:</strong> This marks your foundation practice complete. Your final <strong>SkillProof in Week 4</strong> will require evidence and mentor verification.
          </span>
        </div>

        {/* Submit */}
        <div className="mt-6 pt-3 border-t border-[#D9E1E5] flex flex-col sm:flex-row gap-2.5">
          {isSubmitted ? (
            <div className="w-full flex items-center justify-between">
              <span className="text-[13px] font-bold text-[#2E7D32] flex items-center gap-1.5">
                <Check className="w-4 h-4 stroke-[3]" />
                Practice completed ✓
              </span>
              <SecondaryButton size="md" onClick={onClose}>
                Close
              </SecondaryButton>
            </div>
          ) : (
            <>
              <PrimaryButton
                size="md"
                fullWidth
                disabled={!allChecked}
                onClick={handleSubmit}
                icon={<Check className="w-4 h-4 stroke-[3]" />}
              >
                Mark Practice Completed
              </PrimaryButton>
              <SecondaryButton size="md" fullWidth onClick={onClose}>
                Review Later
              </SecondaryButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
