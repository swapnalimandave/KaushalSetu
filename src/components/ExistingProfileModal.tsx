import React, { useState } from 'react';
import { X, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';
import { PrimaryButton } from './ui/PrimaryButton';
import { SecondaryButton } from './ui/SecondaryButton';

interface ExistingProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (phone: string) => void;
}

export const ExistingProfileModal: React.FC<ExistingProfileModalProps> = ({
  isOpen,
  onClose,
  onContinue,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    onContinue(clean);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0A1931]/60 backdrop-blur-xs transition-opacity"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        className="
          relative w-full max-w-md bg-[#FAF9F4] rounded-t-[24px] sm:rounded-[20px]
          border-t-2 sm:border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931]
          p-6 sm:p-7 z-10 max-h-[90vh] overflow-y-auto
        "
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#D9E1E5]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#58B98C]" />
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#0A1931]">
              Student Login · विद्यार्थी प्रवेश
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="student-phone"
              className="block text-[15px] font-bold text-[#0A1931] mb-1 font-sans"
            >
              Enter registered mobile number
            </label>
            <p className="text-[13px] text-[#64748B] mb-2 font-devanagari">
              तुमचा नोंदणीकृत मोबाईल नंबर टाका
            </p>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                <Smartphone className="w-5 h-5" />
                <span className="ml-2 font-bold text-[#0A1931] text-[15px]">+91</span>
                <span className="mx-2 text-[#D9E1E5]">|</span>
              </div>
              <input
                id="student-phone"
                type="tel"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value.replace(/\D/g, ''));
                  if (error) setError('');
                }}
                placeholder="9876543210"
                className="
                  w-full pl-24 pr-4 py-3 rounded-[12px] bg-[#FFFFFF] border-2 border-[#D9E1E5]
                  text-[17px] font-bold text-[#0A1931] tracking-wider
                  focus:outline-none focus:border-[#0A1931] focus:ring-2 focus:ring-[#4A7FA7]/20
                  placeholder:text-[#94A3B8] placeholder:font-normal
                "
              />
            </div>
            {error && (
              <p className="text-[13px] text-[#C62828] mt-1.5 font-medium">{error}</p>
            )}
          </div>

          <div className="p-3 rounded-xl bg-[#DCECF3]/60 border border-[#4A7FA7]/30 text-[12px] text-[#1A3D63] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#4A7FA7] shrink-0 mt-0.5" />
            <span>
              Your profile is stored locally and securely synced when online. No password required.
            </span>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <PrimaryButton
              type="submit"
              fullWidth
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Profile
            </PrimaryButton>
            <SecondaryButton
              type="button"
              fullWidth
              size="md"
              onClick={onClose}
            >
              Cancel
            </SecondaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};
