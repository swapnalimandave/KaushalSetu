import React, { useState } from 'react';
import { Sparkles, Check, Info } from 'lucide-react';
import { LanguageCode } from '../types';

interface SmartphoneSchematicProps {
  language: LanguageCode;
  onSelectComponent?: (componentId: string) => void;
}

interface ComponentInfo {
  id: string;
  name: string;
  nameMr: string;
  location: string;
  role: string;
  roleMr: string;
  repairTip: string;
  repairTipMr: string;
  color: string;
}

const COMPONENTS: Record<string, ComponentInfo> = {
  battery: {
    id: 'battery',
    name: 'Battery',
    nameMr: 'बॅटरी (Battery Pack)',
    location: 'Center lower half',
    role: 'Stores electrical energy and powers all internal chips and displays.',
    roleMr: 'विद्युत ऊर्जा साठवून ठेवते आणि सर्व अंतर्गत सर्किट्सना वीजपुरवठा करते.',
    repairTip: 'Always disconnect battery connector first before attempting any other repair.',
    repairTipMr: 'कोणतीही दुरुस्ती करताना सर्वात आधी बॅटरी कनेक्टर वेगळा करावा.',
    color: '#F4C84A',
  },
  motherboard: {
    id: 'motherboard',
    name: 'Motherboard (Main PCB)',
    nameMr: 'मदरबोर्ड (मुख्य सर्किट बोर्ड)',
    location: 'Upper half',
    role: 'Contains the processor, memory chips, power IC, and sensor connectors.',
    roleMr: 'यात प्रोसेसर, मेमरी, पॉवर आयसी आणि सर्व सेन्सर्सचे कनेक्शन असतात.',
    repairTip: 'Handle with anti-static tweezers; protect delicate ribbon connectors.',
    repairTipMr: 'अँटी-स्टॅटिक चिमट्याने काळजीपूर्वक हाताळा; रिबन केबल्स तुटू देऊ नका.',
    color: '#58B98C',
  },
  display: {
    id: 'display',
    name: 'Display & Touch Glass',
    nameMr: 'डिस्प्ले व टचस्क्रीन',
    location: 'Front full frame',
    role: 'Presents visual interface and detects finger touch coordinates.',
    roleMr: 'चित्रे व मजकूर दाखवतो आणि बोटांच्या स्पर्शाची नोंद घेतो.',
    repairTip: 'Requires gentle heat to soften perimeter adhesive without cracking glass.',
    repairTipMr: 'बाजूचे डिंक वितळवण्यासाठी योग्य तापमान द्यावे, काच वाकवू नये.',
    color: '#4A7FA7',
  },
  charging_port: {
    id: 'charging_port',
    name: 'Charging Port (Sub-Board)',
    nameMr: 'चार्जिंग पोर्ट (सब-बोर्ड)',
    location: 'Bottom edge',
    role: 'Connects Type-C / Micro-USB cable to transfer current and data.',
    roleMr: 'केबल जोडून बॅटरी चार्ज करणे आणि डेटा ट्रान्सफर करणे.',
    repairTip: 'Inspect with magnifier for pocket lint or bent pins before replacing.',
    repairTipMr: 'बदलण्यापूर्वी पोर्टमधील धूळ किंवा वाकलेल्या पिना भिंगाने तपासा.',
    color: '#EF6F61',
  },
  camera: {
    id: 'camera',
    name: 'Camera Modules',
    nameMr: 'कॅमेरा लेन्स व सेन्सर',
    location: 'Top rear corner',
    role: 'Captures photos and video through optical lenses and image sensors.',
    roleMr: 'फोटो व व्हिडिओ काढण्यासाठी ऑप्टिकल लेन्स व सेन्सर.',
    repairTip: 'Never touch camera glass with bare fingers; dust creates blurry spots.',
    repairTipMr: 'लेन्सवर उघड्या बोटांचे ठसे उमटू देऊ नका; धूळ बसल्यास फोटो अंधूक येतो.',
    color: '#1A3D63',
  },
  speaker: {
    id: 'speaker',
    name: 'Loudspeaker / Earpiece',
    nameMr: 'लाऊडस्पीकर व इअरपीस',
    location: 'Top ear slot & bottom sound chamber',
    role: 'Converts electrical audio signals into sound waves for calls and media.',
    roleMr: 'विद्युत लहरींचे आवाजात रूपांतर करून रिंगटोन व कॉल ऐकवते.',
    repairTip: 'Metal filings frequently stick to the internal speaker magnet.',
    repairTipMr: 'स्पीकरच्या चुंबकाला लोखंडी कण चिकटल्यास घरघर आवाज येतो.',
    color: '#0A1931',
  },
  microphone: {
    id: 'microphone',
    name: 'Microphone (Mic)',
    nameMr: 'मायक्रोफोन (आवाज पकडणारा मायक)',
    location: 'Tiny pinhole near bottom port',
    role: 'Picks up your voice and transforms voice sound into digital signals.',
    roleMr: 'तुमचा आवाज पकडून दुसऱ्या व्यक्तीपर्यंत पोहोचवतो.',
    repairTip: 'Ensure the acoustic rubber gasket is not blocked during reassembly.',
    repairTipMr: 'फोन बसवताना मायक्रोफोनच्या लहान छिद्रावर रबर पॅक योग्य ठेवा.',
    color: '#B86B00',
  },
};

export const SmartphoneSchematic: React.FC<SmartphoneSchematicProps> = ({
  language,
  onSelectComponent,
}) => {
  const [activeComponentId, setActiveComponentId] = useState<string>('battery');

  const activeComp = COMPONENTS[activeComponentId] || COMPONENTS.battery;

  const handleSelect = (id: string) => {
    setActiveComponentId(id);
    onSelectComponent?.(id);
  };

  return (
    <div className="w-full rounded-[20px] bg-[#FFFFFF] border-2 border-[#0A1931] shadow-[3px_3px_0px_#0A1931] p-4 sm:p-6">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#D9E1E5]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#58B98C] animate-pulse" />
          <h3 className="text-[15px] font-bold text-[#0A1931] font-sans">
            Interactive Smartphone Schematic · अंतर्गत रचनेचा नकाशा
          </h3>
        </div>
        <span className="text-[12px] font-bold text-[#4A7FA7] font-handwriting">
          Tap parts to inspect 👆
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Left: Clean SVG Schematic Diagram */}
        <div className="md:col-span-5 flex justify-center py-2">
          <div className="relative w-[220px] h-[360px] bg-[#FAF9F4] rounded-[28px] border-4 border-[#0A1931] shadow-[4px_4px_0px_#0A1931] p-3 flex flex-col justify-between">
            
            {/* Top speaker slit & camera hole */}
            <div className="flex items-center justify-between px-3 pt-1">
              <button
                type="button"
                onClick={() => handleSelect('camera')}
                className={`w-6 h-6 rounded-full border-2 border-[#0A1931] transition-transform ${activeComponentId === 'camera' ? 'scale-125 bg-[#EF6F61] ring-2 ring-[#0A1931]' : 'bg-[#1A3D63]'}`}
                title="Camera"
              />
              <button
                type="button"
                onClick={() => handleSelect('speaker')}
                className={`w-12 h-2 rounded-full border border-[#0A1931] transition-colors ${activeComponentId === 'speaker' ? 'bg-[#EF6F61]' : 'bg-[#0A1931]'}`}
                title="Earpiece Speaker"
              />
            </div>

            {/* Motherboard Upper Section */}
            <button
              type="button"
              onClick={() => handleSelect('motherboard')}
              className={`
                w-full h-20 rounded-xl border-2 border-[#0A1931] p-2 flex flex-col justify-between text-left transition-all cursor-pointer
                ${activeComponentId === 'motherboard' ? 'bg-[#58B98C] text-[#0A1931] ring-2 ring-[#0A1931] scale-[1.02]' : 'bg-[#58B98C]/25 text-[#0A1931] hover:bg-[#58B98C]/40'}
              `}
            >
              <span className="text-[10px] font-black tracking-wider uppercase">Motherboard</span>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-[#0A1931] text-[8px] text-white flex items-center justify-center font-mono">CPU</span>
                <span className="w-3 h-3 rounded bg-[#0A1931]/70" />
                <span className="w-5 h-2 rounded bg-[#0A1931]/40" />
              </div>
            </button>

            {/* Battery Large Center Section */}
            <button
              type="button"
              onClick={() => handleSelect('battery')}
              className={`
                w-full h-36 rounded-xl border-2 border-[#0A1931] p-2.5 flex flex-col justify-between text-left transition-all cursor-pointer
                ${activeComponentId === 'battery' ? 'bg-[#F4C84A] text-[#0A1931] ring-2 ring-[#0A1931] scale-[1.02]' : 'bg-[#F4C84A]/30 text-[#0A1931] hover:bg-[#F4C84A]/50'}
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black tracking-wider uppercase">Battery Pack</span>
                <span className="text-[10px] font-bold font-mono">5000 mAh</span>
              </div>
              <div className="flex items-center justify-center my-1 text-xs font-bold text-[#0A1931]">
                ⚡ 3.85V Li-ion
              </div>
              <span className="text-[9px] text-[#64748B] font-mono">Safety: Disconnect First</span>
            </button>

            {/* Bottom Sub-Board: Charging Port, Mic, Loudspeaker */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleSelect('microphone')}
                className={`h-9 rounded-lg border-2 border-[#0A1931] flex flex-col items-center justify-center text-[9px] font-bold transition-all ${activeComponentId === 'microphone' ? 'bg-[#B86B00] text-white' : 'bg-[#FAF9F4]'}`}
                title="Microphone"
              >
                <span>MIC</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelect('charging_port')}
                className={`h-9 rounded-lg border-2 border-[#0A1931] flex flex-col items-center justify-center text-[9px] font-bold transition-all ${activeComponentId === 'charging_port' ? 'bg-[#EF6F61] text-white ring-1 ring-[#0A1931]' : 'bg-[#DCECF3]'}`}
                title="Charging Port"
              >
                <span>PORT</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelect('speaker')}
                className={`h-9 rounded-lg border-2 border-[#0A1931] flex flex-col items-center justify-center text-[9px] font-bold transition-all ${activeComponentId === 'speaker' ? 'bg-[#0A1931] text-white' : 'bg-[#FAF9F4]'}`}
                title="Speaker"
              >
                <span>AUDIO</span>
              </button>
            </div>

            {/* Floating Display selector button */}
            <div className="absolute -right-3 top-1/2 -translate-y-1/2">
              <button
                type="button"
                onClick={() => handleSelect('display')}
                className={`
                  px-2 py-3 rounded-lg border-2 border-[#0A1931] text-[10px] font-black uppercase vertical-rl tracking-wider shadow-[2px_2px_0px_#0A1931]
                  ${activeComponentId === 'display' ? 'bg-[#4A7FA7] text-white' : 'bg-[#FFFFFF] text-[#0A1931] hover:bg-[#DCECF3]'}
                `}
                style={{ writingMode: 'vertical-rl' }}
              >
                Display Panel
              </button>
            </div>

          </div>
        </div>

        {/* Right: Component Detail Card */}
        <div className="md:col-span-7 flex flex-col justify-center">
          
          {/* Quick Select Buttons */}
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {Object.values(COMPONENTS).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`
                  px-2.5 py-1 rounded-md text-[12px] font-bold transition-all cursor-pointer
                  ${activeComponentId === item.id ? 'bg-[#0A1931] text-white shadow-xs' : 'bg-[#FAF9F4] border border-[#D9E1E5] text-[#17212B] hover:border-[#4A7FA7]'}
                `}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Active Component Details */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#FAF9F4] border border-[#D9E1E5] shadow-[1px_1px_0px_rgba(10,25,49,0.05)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A7FA7]">
                Selected Component · निवडलेला घटक
              </span>
              <span className="text-[11px] font-mono text-[#64748B]">
                Position: {activeComp.location}
              </span>
            </div>

            <h4 className="text-[18px] sm:text-[20px] font-extrabold text-[#0A1931] font-devanagari">
              {language === 'mr' ? activeComp.nameMr : activeComp.name}
            </h4>

            {language === 'mr' && (
              <span className="text-xs text-[#64748B] block mb-2">{activeComp.name}</span>
            )}

            <div className="mt-2.5 space-y-2 text-[14px]">
              <div>
                <span className="font-bold text-[#0A1931] block text-xs uppercase tracking-wider">
                  Role in Phone:
                </span>
                <p className="text-[#17212B] mt-0.5 leading-snug font-devanagari">
                  {language === 'mr' ? activeComp.roleMr : activeComp.role}
                </p>
              </div>

              <div className="pt-2 border-t border-[#D9E1E5]">
                <span className="font-bold text-[#B86B00] block text-xs uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Technician Repair Note:
                </span>
                <p className="text-[#1A3D63] font-medium mt-0.5 leading-snug font-devanagari">
                  {language === 'mr' ? activeComp.repairTipMr : activeComp.repairTip}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
