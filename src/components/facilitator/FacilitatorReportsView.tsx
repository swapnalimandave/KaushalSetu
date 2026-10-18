import React, { useState } from 'react';
import {
  FileBarChart2,
  Download,
  Printer,
  Award,
  Users,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Calendar,
  Share2,
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { FACILITATOR_PROFILE_INFO } from '../../data/facilitatorData';

interface FacilitatorReportsViewProps {
  language: LanguageCode;
}

export const FacilitatorReportsView: React.FC<FacilitatorReportsViewProps> = ({
  language,
}) => {
  const [reportPeriod, setReportPeriod] = useState<'q1_2026' | 'monthly'>('q1_2026');
  const [printSuccess, setPrintSuccess] = useState(false);

  const handlePrint = () => {
    setPrintSuccess(true);
    setTimeout(() => {
      window.print();
      setPrintSuccess(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-5 shadow-[2px_2px_0px_rgba(10,25,49,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileBarChart2 className="w-5 h-5 text-[#4A7FA7]" />
              <h2 className="text-xl font-bold font-serif text-[#0A1931]">
                {language === 'mr' ? 'कौशल्य व उपजीविका प्रभाव अहवाल' : 'Operational Impact & Cohort Reports'}
              </h2>
            </div>
            <p className="text-sm text-[#556987] mt-0.5">
              {language === 'mr'
                ? 'ग्रामपंचायत, एनजीओ विश्वस्त आणि कौशल्य अभियानासाठी अधिकृत त्रैमासिक प्रगती अहवाल.'
                : 'Quarterly livelihood transition summary for Gram Panchayat, partner NGOs, and skill missions.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-[#0A1931] text-[#FAF9F4] text-xs font-bold hover:bg-[#17212B] shadow-[2px_2px_0px_#F4C84A] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#F4C84A]" />
              <span>Print Cohort Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Impact Numbers Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.02)]">
          <p className="text-xs font-semibold text-[#556987]">Youth Enrolled</p>
          <p className="text-2xl font-bold font-serif text-[#0A1931] mt-1">28</p>
          <p className="text-[11px] text-[#58B98C] font-semibold mt-1">85% Active weekly attendance</p>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.02)]">
          <p className="text-xs font-semibold text-[#556987]">Verified SkillProofs</p>
          <p className="text-2xl font-bold font-serif text-[#D97706] mt-1">11</p>
          <p className="text-[11px] text-[#556987] mt-1">3 currently in review queue</p>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.02)]">
          <p className="text-xs font-semibold text-[#556987]">Shop Connections</p>
          <p className="text-2xl font-bold font-serif text-[#4A7FA7] mt-1">7</p>
          <p className="text-[11px] text-[#556987] mt-1">Local Satara & Karad businesses</p>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#D9E1E5] shadow-[2px_2px_0px_rgba(10,25,49,0.02)]">
          <p className="text-xs font-semibold text-[#556987]">Livelihood Transitions</p>
          <p className="text-2xl font-bold font-serif text-[#1B6644] mt-1">6</p>
          <p className="text-[11px] text-[#58B98C] font-semibold mt-1">Apprenticeship & Shop bench</p>
        </div>
      </div>

      {/* Official Printable Report Card preview */}
      <div className="bg-[#FFFFFF] border-2 border-[#D9E1E5] rounded-xl p-6 md:p-8 space-y-6 shadow-sm print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="border-b-2 border-[#0A1931] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#556987]">
              OFFICIAL CENTER COHORT LEDGER
            </span>
            <h3 className="text-xl font-bold font-serif text-[#0A1931]">
              KaushalSetu Rural Vocational Center · Satara
            </h3>
            <p className="text-xs text-[#556987] mt-0.5">
              Operating Partner: Gramin Vikas Trust • Cohort: 2026-A (Livelihood Acceleration)
            </p>
          </div>

          <div className="text-left md:text-right text-xs text-[#556987]">
            <p className="font-semibold text-[#0A1931]">Lead Facilitator: Anita Deshmukh</p>
            <p>Verification Master Trainer: Sunil Deshmukh</p>
            <p className="text-[10px] mt-0.5">Report Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Breakdown by Career Track */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1931]">
            1. Pathway Enrollment & Progression Status
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#D9E1E5] text-[#556987] uppercase text-[10px]">
                  <th className="py-2">Vocational Track</th>
                  <th className="py-2">Enrolled</th>
                  <th className="py-2">In EarnPath</th>
                  <th className="py-2">Skill Verified</th>
                  <th className="py-2">Placement Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9E1E5]/60 text-[#17212B]">
                <tr>
                  <td className="py-2.5 font-bold">Mobile Device Repair Technician</td>
                  <td className="py-2.5">8</td>
                  <td className="py-2.5">5</td>
                  <td className="py-2.5 font-semibold text-[#D97706]">2 (Ravi Patil pending)</td>
                  <td className="py-2.5 text-[#58B98C] font-semibold">1 Apprentice (Sai Elec)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold">Rooftop Solar Installation & Maint.</td>
                  <td className="py-2.5">6</td>
                  <td className="py-2.5">3</td>
                  <td className="py-2.5 font-semibold text-[#D97706]">2 (Pooja Shinde ready)</td>
                  <td className="py-2.5 text-[#58B98C] font-semibold">2 Trainees (Surya Shakti)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold">Two-Wheeler EV Service Assistant</td>
                  <td className="py-2.5">5</td>
                  <td className="py-2.5">2</td>
                  <td className="py-2.5 font-semibold text-[#1B6644]">2 (Mahesh More)</td>
                  <td className="py-2.5 text-[#58B98C] font-semibold">1 Walk-in Interview Thu</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold">Domestic Electrical Assistant</td>
                  <td className="py-2.5">5</td>
                  <td className="py-2.5">3</td>
                  <td className="py-2.5 font-semibold text-[#D97706]">1</td>
                  <td className="py-2.5 text-[#58B98C] font-semibold">1 Apprentice Wireman</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold">Retail Billing & Customer Support</td>
                  <td className="py-2.5">4</td>
                  <td className="py-2.5">3</td>
                  <td className="py-2.5 font-semibold text-[#D97706]">1</td>
                  <td className="py-2.5 text-[#58B98C] font-semibold">1 D-Mart Outlet</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Verified Outcomes Summary */}
        <div className="pt-4 border-t border-[#D9E1E5] space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1931]">
            2. Verified Livelihood Placements This Quarter
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5]">
              <p className="font-bold text-[#0A1931]">Mahesh More</p>
              <p className="text-[11px] text-[#4A7FA7]">GreenWheels EV Hub, Satara</p>
              <p className="text-[10px] text-[#556987] mt-1">Stipend: ₹8,500/mo · EV Motor Diagnosis</p>
            </div>
            <div className="p-3 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5]">
              <p className="font-bold text-[#0A1931]">Ravi Patil (Scheduled)</p>
              <p className="text-[11px] text-[#4A7FA7]">Sai Electronics, Satara Market</p>
              <p className="text-[10px] text-[#556987] mt-1">Apprentice: ₹7,000/mo · Mobile Repair</p>
            </div>
            <div className="p-3 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5]">
              <p className="font-bold text-[#0A1931]">Pooja Shinde (Scheduled)</p>
              <p className="text-[11px] text-[#4A7FA7]">Surya Shakti Solar, Wai</p>
              <p className="text-[10px] text-[#556987] mt-1">Field Tech: ₹9,000/mo · Rooftop Array</p>
            </div>
          </div>
        </div>

        {/* Center Certification & Sign-off Stamp */}
        <div className="pt-6 border-t-2 border-dashed border-[#D9E1E5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#556987]">
          <div>
            <p className="font-bold text-[#0A1931]">Signed & Verified By:</p>
            <p className="mt-1">Anita Deshmukh · Senior Facilitator</p>
            <p>Gramin Vikas Trust, Satara Center</p>
          </div>

          <div className="p-3 rounded-xl border-2 border-[#58B98C] bg-[#FAF9F4] text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#1B6644] block">
              OFFICIAL KAUSHALSETU AUDIT
            </span>
            <span className="font-bold text-xs text-[#0A1931]">COHORT 2026-A CERTIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
