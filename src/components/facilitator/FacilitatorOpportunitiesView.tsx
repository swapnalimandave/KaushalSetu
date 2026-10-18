import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  MapPin,
  PhoneCall,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { LanguageCode } from '../../types';

interface FacilitatorOpportunitiesViewProps {
  language: LanguageCode;
  onViewLearner: (learnerId: string) => void;
}

const LOCAL_EMPLOYERS = [
  {
    id: 'emp-sai',
    name: 'Sai Electronics & Mobile Care',
    nameMr: 'साई इलेक्ट्रॉनिक्स आणि मोबाईल केअर',
    contactPerson: 'Mr. Ramesh Shinde (Proprietor)',
    phone: '+91 98220 54110',
    location: 'Shop 12, Bus Stand Market, Satara',
    openRoles: 'Mobile Repair Apprentice (1 slot)',
    stipend: '₹7,000 - ₹8,500/month',
    activeCandidates: ['Ravi Patil'],
    verifiedSkillRequired: 'Basic Mobile Device Diagnosis',
    notes: 'Welcomes KaushalSetu verified learners. Values safety precautions and willingness to learn SMD soldering.',
  },
  {
    id: 'emp-ev',
    name: 'GreenWheels EV Service Station',
    nameMr: 'ग्रीनव्हील्स ईव्ही सर्व्हिस सेंटर',
    contactPerson: 'Sachin Patil (Workshop Head)',
    phone: '+91 94211 88902',
    location: 'Plot 44, Satara MIDC',
    openRoles: 'EV Battery & Motor Junior Assistant (2 slots)',
    stipend: '₹8,500 - ₹10,000/month',
    activeCandidates: ['Mahesh More'],
    verifiedSkillRequired: 'BLDC Motor Sensor Testing & Continuity',
    notes: 'Walk-in interview scheduled for Mahesh More on Thursday at 3:00 PM.',
  },
  {
    id: 'emp-solar',
    name: 'Surya Shakti Clean Energy Solutions',
    nameMr: 'सूर्य शक्ती सोलर सिस्टीम्स',
    contactPerson: 'Er. Anand Kulkarni',
    phone: '+91 98901 33240',
    location: 'Wai Highway Junction, Satara',
    openRoles: 'Rooftop Solar Installation Trainee',
    stipend: '₹9,000/month + field travel',
    activeCandidates: ['Pooja Shinde'],
    verifiedSkillRequired: 'Solar Array Wiring & Safety Disconnect',
    notes: 'Looking for candidates comfortable with rooftop safety harnesses and DC meter measurements.',
  },
  {
    id: 'emp-iti',
    name: 'Govt ITI Satara PMKVY Skill Hub',
    nameMr: 'शासकीय आयटीआय सातारा (कौशल्य केंद्र)',
    contactPerson: 'Mr. Salunkhe (Placement Officer)',
    phone: '+91 94030 12845',
    location: 'Sadar Bazar, Satara',
    openRoles: 'Advanced Micro-Soldering Batch (15 seats)',
    stipend: '₹8,000 govt training stipend',
    activeCandidates: ['Santosh Jadhav (Recommended)'],
    verifiedSkillRequired: 'Class 10 + Foundational Electronics',
    notes: 'New batch starting 1st of next month. Free tools kit provided upon completion.',
  },
];

const DOCUMENT_SUPPORT_QUEUE = [
  {
    id: 'doc-1',
    learner: 'Ravi Patil',
    learnerId: 'ravi-patil-18',
    item: 'Color Printout of Verified Skill Badge with QR',
    status: 'Ready after mentor sign-off',
    helper: 'Center Printer Station',
  },
  {
    id: 'doc-2',
    learner: 'Pooja Shinde',
    learnerId: 'pooja-shinde-20',
    item: 'Bank Account Passbook Photocopy for Direct Stipend',
    status: 'Needed before Monday',
    helper: 'Assisted at Gram Panchayat Seva Kendra',
  },
  {
    id: 'doc-3',
    learner: 'Sunita Kamble',
    learnerId: 'sunita-kamble-21',
    item: 'Aadhaar Card Name Correction / Phone Link',
    status: 'Appointment booked',
    helper: 'Taluka Maha-E-Seva Center',
  },
];

export const FacilitatorOpportunitiesView: React.FC<FacilitatorOpportunitiesViewProps> = ({
  language,
  onViewLearner,
}) => {
  const [selectedEmployer, setSelectedEmployer] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-5 shadow-[2px_2px_0px_rgba(10,25,49,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#58B98C]" />
              <h2 className="text-xl font-bold font-serif text-[#0A1931]">
                {language === 'mr' ? 'स्थानिक रोजगार संधी व अर्ज साहाय्य' : 'Opportunity & Application Support'}
              </h2>
            </div>
            <p className="text-sm text-[#556987] mt-0.5">
              {language === 'mr'
                ? 'स्थानिक उद्योजक, दुकाने आणि प्रशिक्षण भागीदारांशी थेट समन्वय. विद्यार्थ्यांना कागदपत्रे व मुलाखतीसाठी तयार करणे.'
                : 'Direct coordination with verified local shops, small businesses, and training partners in Satara district.'}
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-lg bg-[#58B98C]/15 border border-[#58B98C]/40 text-[#1B6644] text-xs font-bold shrink-0">
            4 Local Employers Partnered
          </span>
        </div>
      </div>

      {/* Two Column: Employer Network + Document Support Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Employer & Shop Network (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-bold text-[#0A1931] flex items-center gap-2">
            <span>Verified Local Employers & Openings</span>
            <span className="text-xs text-[#556987]">({LOCAL_EMPLOYERS.length})</span>
          </h3>

          <div className="space-y-3.5">
            {LOCAL_EMPLOYERS.map((emp) => (
              <div
                key={emp.id}
                className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-4.5 hover:border-[#4A7FA7] transition-all shadow-[2px_2px_0px_rgba(10,25,49,0.03)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-base text-[#0A1931]">
                      {language === 'mr' ? emp.nameMr : emp.name}
                    </h4>
                    <p className="text-xs text-[#4A7FA7] font-semibold mt-0.5">
                      {emp.openRoles} · {emp.stipend}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[#556987] mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#556987] shrink-0" />
                      <span>{emp.location}</span>
                    </div>
                  </div>

                  <a
                    href={`tel:${emp.phone}`}
                    className="p-2 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] text-[#0A1931] hover:border-[#4A7FA7] text-xs font-semibold flex items-center gap-1.5 shrink-0"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#4A7FA7]" />
                    <span className="hidden sm:inline">Call Owner</span>
                  </a>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#D9E1E5]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-[#556987] font-semibold">Active Candidates: </span>
                    <span className="font-bold text-[#0A1931]">
                      {emp.activeCandidates.join(', ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-[#58B98C] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Req: {emp.verifiedSkillRequired}</span>
                  </div>
                </div>

                <p className="mt-2 text-[11px] text-[#556987] bg-[#FAF9F4] p-2 rounded border border-[#D9E1E5]/60">
                  <span className="font-semibold text-[#0A1931]">Center Note: </span>
                  {emp.notes}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Document Assistance Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-bold text-[#0A1931] flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#4A7FA7]" />
            <span>Document Gathering Assistance</span>
          </h3>

          <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-4 space-y-3 shadow-[2px_2px_0px_rgba(10,25,49,0.03)]">
            <p className="text-xs text-[#556987]">
              Help candidates complete paperwork before they visit the employer for hands-on trial.
            </p>

            <div className="space-y-2.5">
              {DOCUMENT_SUPPORT_QUEUE.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-lg bg-[#FAF9F4] border border-[#D9E1E5] space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onViewLearner(doc.learnerId)}
                      className="font-bold text-[#0A1931] hover:text-[#4A7FA7] hover:underline"
                    >
                      {doc.learner}
                    </button>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#DCECF3] text-[#2C5E82]">
                      {doc.status}
                    </span>
                  </div>
                  <p className="text-[#17212B] font-medium">{doc.item}</p>
                  <p className="text-[11px] text-[#556987]">Support: {doc.helper}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#D9E1E5] text-center">
              <button
                onClick={() => alert('Printing candidate verification slip with QR code for Ravi Patil...')}
                className="w-full py-2 rounded-lg bg-[#0A1931] text-[#FAF9F4] text-xs font-bold hover:bg-[#17212B] shadow-[2px_2px_0px_#F4C84A] transition-all cursor-pointer"
              >
                Print Student Credential Slip
              </button>
            </div>
          </div>

          {/* Walk-in preparation tips for mentors */}
          <div className="bg-[#FFFFFF] border border-[#D9E1E5] rounded-xl p-4 space-y-2 text-xs">
            <p className="font-bold text-[#0A1931]">Mentor Walk-In Protocol:</p>
            <ul className="space-y-1.5 text-[#556987] list-disc list-inside">
              <li>Call the shop owner 24 hours prior to introduce the candidate.</li>
              <li>Ensure the candidate brings physical copies of Aadhaar, marksheet, and their QR-verified badge.</li>
              <li>Remind the student to wear safe workshop attire (closed shoes).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
