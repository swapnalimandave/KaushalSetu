import React, { useState } from 'react';
import { ArrowLeft, HardDrive, Trash2, Check, Download, AlertCircle, Sparkles } from 'lucide-react';
import { LanguageCode } from '../types';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { getStoredProgress } from '../utils/progressManager';
import { removeWeekDownload, downloadWeekOffline } from '../utils/offlineManager';

interface DownloadsScreenProps {
  language: LanguageCode;
  onBackToEarnPath: () => void;
  onLanguageChangeRequest: () => void;
}

export const DownloadsScreen: React.FC<DownloadsScreenProps> = ({
  language,
  onBackToEarnPath,
  onLanguageChangeRequest,
}) => {
  const [progress, setProgress] = useState(getStoredProgress());
  const [notice, setNotice] = useState<string | null>(null);

  const isWeek1Downloaded = progress.downloadedWeeks.includes(1);

  const handleRemove = (weekNum: number) => {
    const updated = removeWeekDownload(weekNum, [
      'inside-a-smartphone',
      'essential-repair-tools',
      'safety-before-repair',
      'common-phone-problems',
    ]);
    setProgress(updated);
    setNotice('Offline package removed. Your learning scores and progress remain completely safe.');
    setTimeout(() => setNotice(null), 3500);
  };

  const handleRedownload = (weekNum: number) => {
    const updated = downloadWeekOffline(weekNum, [
      'inside-a-smartphone',
      'essential-repair-tools',
      'safety-before-repair',
      'common-phone-problems',
    ]);
    setProgress(updated);
    setNotice('Week 1 downloaded successfully for offline study.');
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="min-h-screen flex flex-col notebook-ruled-bg selection:bg-[#F4C84A]/30">
      <AppHeader
        currentLanguage={language}
        onLanguageClick={onLanguageChangeRequest}
      />

      <main className="flex-1 w-full max-w-[760px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
        {/* Back navigation */}
        <div className="mb-4">
          <button
            type="button"
            onClick={onBackToEarnPath}
            className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#0A1931] hover:text-[#4A7FA7] min-h-[44px] px-2 rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back to EarnPath</span>
          </button>
        </div>

        {/* Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="w-5 h-5 text-[#4A7FA7]" />
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#4A7FA7]">
              Offline Storage Management
            </span>
          </div>
          <h1 className="text-[26px] sm:text-[32px] font-extrabold text-[#0A1931] tracking-tight font-sans">
            Offline Lessons · डाऊनलोड केलेले धडे
          </h1>
          <p className="text-[14px] text-[#64748B] mt-1 font-devanagari">
            Access your audio guides and lesson materials anywhere, even without cellular data.
          </p>
        </div>

        {notice && (
          <div className="mb-5 p-3 rounded-xl bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[2px_2px_0px_#0A1931] text-[13px] font-medium text-[#0A1931] flex items-center gap-2">
            <Check className="w-4 h-4 text-[#58B98C] stroke-[3]" />
            <span>{notice}</span>
          </div>
        )}

        {/* Downloaded Packages List */}
        <div className="space-y-4">
          {isWeek1Downloaded ? (
            <div className="p-5 rounded-[20px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#58B98C]" />
                  <span className="text-xs font-bold uppercase text-[#58B98C]">
                    Available Offline
                  </span>
                </div>
                <h3 className="text-[18px] font-bold text-[#0A1931] font-sans">
                  Week 1 · Mobile Repair Foundations
                </h3>
                <p className="text-[13px] text-[#64748B] mt-0.5">
                  4 lessons · Audio explanations, schematics & practice checklists
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs font-mono font-bold text-[#1A3D63]">
                  <span>Storage: ~8 MB</span>
                  <span>·</span>
                  <span>Audio packs included</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRemove(1)}
                className="
                  inline-flex items-center gap-1.5 px-3 py-2 rounded-lg
                  bg-[#FAF9F4] hover:bg-[#EF6F61]/15 text-[#C62828] border border-[#D9E1E5] hover:border-[#EF6F61]
                  text-[13px] font-bold transition-colors cursor-pointer self-end sm:self-auto min-h-[40px]
                "
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Download</span>
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-[20px] bg-[#FFFFFF] border border-[#D9E1E5] text-center">
              <HardDrive className="w-10 h-10 text-[#64748B] mx-auto mb-2 opacity-50" />
              <h3 className="text-[17px] font-bold text-[#0A1931]">
                No offline lessons stored currently
              </h3>
              <p className="text-[13px] text-[#64748B] mt-1 max-w-sm mx-auto">
                Download Week 1 to continue studying when travelling or in low-network rural areas.
              </p>
              <div className="mt-4">
                <PrimaryButton size="md" onClick={() => handleRedownload(1)} icon={<Download className="w-4 h-4" />}>
                  Download Week 1 (~8 MB)
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>

        {/* Small Note */}
        <div className="mt-6 p-4 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] text-[13px] text-[#64748B] leading-relaxed">
          <p className="font-semibold text-[#0A1931] mb-1">
            Data Saving Guarantee:
          </p>
          Removing a download only deletes local audio clips from your phone storage. Your quiz scores, practice checks, and progress percentages are preserved permanently.
        </div>
      </main>
    </div>
  );
};
