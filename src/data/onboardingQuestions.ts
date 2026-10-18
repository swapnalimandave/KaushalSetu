import { LanguageCode } from '../types';

export interface OptionItem {
  id: string;
  label: string;
  labelMr: string;
  labelHi: string;
  sublabel?: string;
  iconName?: string;
}

export const EDUCATION_OPTIONS: OptionItem[] = [
  { id: 'Up to Class 8', label: 'Up to Class 8', labelMr: '८ वी पर्यंत', labelHi: '८वीं तक', iconName: 'BookOpen' },
  { id: 'Class 10', label: 'Class 10', labelMr: '१० वी (दहावी)', labelHi: '१०वीं', iconName: 'GraduationCap' },
  { id: 'Class 12', label: 'Class 12', labelMr: '१२ वी (बारावी)', labelHi: '१२वीं', iconName: 'Award' },
  { id: 'ITI', label: 'ITI', labelMr: 'आयटीआय (ITI)', labelHi: 'आईटीआई (ITI)', iconName: 'Wrench' },
  { id: 'Diploma', label: 'Diploma', labelMr: 'डिप्लोमा (Diploma)', labelHi: 'डिप्लोमा', iconName: 'FileBadge' },
  { id: 'College', label: 'College / Degree', labelMr: 'कॉलेज किंवा पदवी', labelHi: 'कॉलेज या डिग्री', iconName: 'School' },
  { id: 'Other', label: 'Other', labelMr: 'इतर शिक्षण', labelHi: 'अन्य', iconName: 'MoreHorizontal' },
];

export const INTEREST_OPTIONS: OptionItem[] = [
  { id: 'Repairing things', label: 'Repairing things', labelMr: 'वस्तू दुरुस्त करणे', labelHi: 'चीजें रिपेयर करना', iconName: 'Wrench' },
  { id: 'Working with computers', label: 'Working with computers', labelMr: 'कॉम्प्युटर किंवा लॅपटॉप', labelHi: 'कंप्यूटर पर काम', iconName: 'Monitor' },
  { id: 'Talking to people', label: 'Talking to people', labelMr: 'लोकांशी संवाद साधणे', labelHi: 'लोगों से बातचीत करना', iconName: 'Users' },
  { id: 'Helping others', label: 'Helping others', labelMr: 'इतरांना मदत करणे', labelHi: 'दूसरों की मदद करना', iconName: 'HeartHandshake' },
  { id: 'Cooking', label: 'Cooking', labelMr: 'स्वयंपाक किंवा खाद्यपदार्थ', labelHi: 'खाना बनाना', iconName: 'Utensils' },
  { id: 'Making things by hand', label: 'Making things by hand', labelMr: 'हाताने कलाकृती / वस्तू बनवणे', labelHi: 'हाथ से चीजें बनाना', iconName: 'Hammer' },
  { id: 'Working outdoors', label: 'Working outdoors', labelMr: 'बाहेर फिरून काम करणे', labelHi: 'बाहर घूमकर काम करना', iconName: 'Sun' },
  { id: 'Farming and agriculture', label: 'Farming and agriculture', labelMr: 'शेती व बागायती', labelHi: 'खेती और किसानी', iconName: 'Sprout' },
  { id: 'Working with numbers', label: 'Working with numbers', labelMr: 'हिशोब किंवा आकडेमोड', labelHi: 'हिसाब-किताब रखना', iconName: 'Calculator' },
  { id: 'Drawing and designing', label: 'Drawing and designing', labelMr: 'चित्रकला आणि डिझाइन', labelHi: 'ड्रॉइंग और डिज़ाइन', iconName: 'Palette' },
  { id: 'Selling or running a business', label: 'Selling or running a business', labelMr: 'दुकान किंवा व्यवसाय चालवणे', labelHi: 'दुकान या व्यापार चलाना', iconName: 'Store' },
  { id: 'Electrical or mechanical work', label: 'Electrical or mechanical work', labelMr: 'इलेक्ट्रिकल किंवा मेकॅनिकल काम', labelHi: 'इलेक्ट्रिकल या मैकेनिकल काम', iconName: 'Zap' },
];

export const EXISTING_SKILL_OPTIONS: OptionItem[] = [
  { id: 'Use a smartphone confidently', label: 'Use a smartphone confidently', labelMr: 'स्मार्टफोन सहज वापरणे', labelHi: 'स्मार्टफोन आसानी से चलाना', iconName: 'Smartphone' },
  { id: 'Use WhatsApp', label: 'Use WhatsApp', labelMr: 'व्हॉट्सॲप वापरणे', labelHi: 'व्हाट्सएप का उपयोग', iconName: 'MessageSquare' },
  { id: 'Basic computer use', label: 'Basic computer use', labelMr: 'प्राथमिक कॉम्प्युटर वापरणे', labelHi: 'बेसिक कंप्यूटर इस्तेमाल', iconName: 'Laptop' },
  { id: 'Repair simple electrical items', label: 'Repair simple electrical items', labelMr: 'साधी वायर किंवा उपकरणे दुरुस्त करणे', labelHi: 'बिजली का साधारण काम / रिपेयर', iconName: 'Zap' },
  { id: 'Use tools', label: 'Use tools (pliers, drivers, etc.)', labelMr: 'पाना, स्क्रू ड्रायव्हर किंवा अवजारे', labelHi: 'टूल्स / औजारों का इस्तेमाल', iconName: 'Tool' },
  { id: 'Speak confidently with customers', label: 'Speak confidently with customers', labelMr: 'ग्राहकांशी आत्मविश्वासू बोलणे', labelHi: 'ग्राहकों से आत्मविश्वास से बात', iconName: 'Smile' },
  { id: 'Basic English', label: 'Basic English', labelMr: 'साधे इंग्रजी शब्द समजणे', labelHi: 'सरल अंग्रेज़ी समझना', iconName: 'Languages' },
  { id: 'Cooking', label: 'Cooking', labelMr: 'स्वयंपाक तयार करणे', labelHi: 'खाना बनाना', iconName: 'Utensils' },
  { id: 'Sewing', label: 'Sewing & Tailoring', labelMr: 'शिलाई किंवा कपडे शिवणे', labelHi: 'सिलाई-कढ़ाई', iconName: 'Scissors' },
  { id: 'Farming work', label: 'Farming work', labelMr: 'शेतातील प्रत्यक्ष काम', labelHi: 'खेत का काम', iconName: 'Tractor' },
  { id: 'Data entry', label: 'Data entry / typing', labelMr: 'डेटा एन्ट्री किंवा टायपिंग', labelHi: 'डेटा एंट्री / टाइपिंग', iconName: 'Keyboard' },
  { id: "I'm still exploring", label: "I'm still exploring", labelMr: 'मी अजून नवीन कौशल्ये शोधत आहे', labelHi: 'मैं अभी नई चीजें सीख रहा हूँ', iconName: 'Compass' },
];

export const WORK_PREFERENCE_OPTIONS: OptionItem[] = [
  { id: 'Hands-on practical work', label: 'Hands-on practical work', labelMr: 'प्रत्यक्ष हाताने करायचे प्रॅक्टिकल काम', labelHi: 'हाथ से करने वाला प्रैक्टिकल काम', iconName: 'Wrench' },
  { id: 'Working with people', label: 'Working with people', labelMr: 'लोकांमध्ये राहून करायचे काम', labelHi: 'लोगों के साथ मिलकर काम', iconName: 'Users' },
  { id: 'Computer or digital work', label: 'Computer or digital work', labelMr: 'कॉम्प्युटर किंवा डिजिटल काम', labelHi: 'कंप्यूटर या डिजिटल वर्क', iconName: 'Monitor' },
  { id: 'Outdoor work', label: 'Outdoor work', labelMr: 'बाहेरचे किंवा फिरतीचे काम', labelHi: 'बाहरी या फील्ड वर्क', iconName: 'Sun' },
  { id: 'Creative work', label: 'Creative work', labelMr: 'कलात्मक आणि कल्पक काम', labelHi: 'रचनात्मक / क्रिएटिव काम', iconName: 'Sparkles' },
  { id: 'Running my own small business', label: 'Running my own small business', labelMr: 'स्वतःचा छोटा व्यवसाय सुरू करणे', labelHi: 'अपना छोटा बिज़नेस चलाना', iconName: 'Store' },
  { id: "I'm not sure yet", label: "I'm not sure yet", labelMr: 'अजून नक्की माहित नाही', labelHi: 'अभी पक्का पता नहीं', iconName: 'HelpCircle' },
];

export const EARNING_TIMELINE_OPTIONS: OptionItem[] = [
  { id: 'As soon as possible', label: 'As soon as possible', labelMr: 'लवकरात लवकर', labelHi: 'जितनी जल्दी हो सके', iconName: 'Clock' },
  { id: 'Within 3 months', label: 'Within 3 months', labelMr: 'पुढील ३ महिन्यांत', labelHi: 'अगले ३ महीनों में', iconName: 'Calendar' },
  { id: 'Within 6 months', label: 'Within 6 months', labelMr: 'पुढील ६ महिन्यांत', labelHi: 'अगले ६ महीनों में', iconName: 'CalendarDays' },
  { id: 'Within a year', label: 'Within a year', labelMr: 'एका वर्षात', labelHi: '१ साल के अंदर', iconName: 'CalendarRange' },
  { id: "I'm exploring for the future", label: "I'm exploring for the future", labelMr: 'भविष्यासाठी फक्त शोधत आहे', labelHi: 'भविष्य के लिए एक्सप्लोर कर रहा हूँ', iconName: 'Compass' },
];

export const TRAVEL_OPTIONS: OptionItem[] = [
  { id: 'Within my village', label: 'Within my village', labelMr: 'माझ्या गावातच', labelHi: 'मेरे गाँव में ही', iconName: 'Home' },
  { id: 'Nearby town', label: 'Nearby town', labelMr: 'जवळच्या तालुक्यात किंवा शहरात', labelHi: 'पास के कस्बे या शहर में', iconName: 'MapPin' },
  { id: 'Within my district', label: 'Within my district', labelMr: 'जिल्ह्याच्या ठिकाणी', labelHi: 'जिले के मुख्य शहर में', iconName: 'Navigation' },
  { id: 'I can travel farther if needed', label: 'I can travel farther if needed', labelMr: 'गरज पडल्यास बाहेर गावी जाणे शक्य', labelHi: 'ज़रूरत पड़ने पर दूर भी जा सकता हूँ', iconName: 'Bus' },
  { id: 'I prefer work I can do from home', label: 'I prefer work I can do from home', labelMr: 'घरी बसून करता येईल असे काम', labelHi: 'घर से बैठकर करने वाला काम', iconName: 'Building2' },
];

export const DEVICE_OPTIONS: OptionItem[] = [
  { id: 'My own Android smartphone', label: 'My own Android smartphone', labelMr: 'माझा स्वतःचा ॲन्ड्रॉइड फोन', labelHi: 'मेरा अपना एंड्रॉइड फोन', iconName: 'Smartphone' },
  { id: 'Shared smartphone', label: 'Shared smartphone', labelMr: 'कुटुंबातील इतरांचा फोन', labelHi: 'परिवार का शेयर किया हुआ फोन', iconName: 'Users' },
  { id: 'Basic smartphone', label: 'Basic smartphone', labelMr: 'साधा / हळू चालणारा स्मार्टफोन', labelHi: 'साधारण स्मार्टफोन', iconName: 'Smartphone' },
  { id: 'Computer access sometimes', label: 'Computer access sometimes', labelMr: 'कधीकधी कॉम्प्युटर मिळतो', labelHi: 'कभी-कभी कंप्यूटर उपलब्ध होता है', iconName: 'Monitor' },
  { id: 'Computer at home', label: 'Computer at home', labelMr: 'घरी कॉम्प्युटर किंवा लॅपटॉप आहे', labelHi: 'घर पर कंप्यूटर या लैपटॉप है', iconName: 'Laptop' },
];

export const INTERNET_OPTIONS: OptionItem[] = [
  { id: 'Usually available', label: 'Usually available', labelMr: 'इंटरनेट नेहमी चांगले असते', labelHi: 'इंटरनेट हमेशा ठीक रहता है', iconName: 'Wifi' },
  { id: 'Available sometimes', label: 'Available sometimes', labelMr: 'कधीकधी मिळते (नेटवर्क कमी-जास्त)', labelHi: 'कभी-कभी मिलता है', iconName: 'Wifi' },
  { id: 'Very limited', label: 'Very limited', labelMr: 'खूप मर्यादित किंवा क्वचितच', labelHi: 'बहुत कम या बहुत सीमित', iconName: 'WifiOff' },
  { id: 'Mostly Wi-Fi access', label: 'Mostly Wi-Fi access', labelMr: 'वाय-फाय किंवा हॉटस्पॉटवर अवलंबून', labelHi: 'अधिकतर वाई-फाई या हॉटस्पॉट', iconName: 'Radio' },
];

export const LEARNING_PREFERENCE_OPTIONS: OptionItem[] = [
  { id: 'Watching simple visuals', label: 'Watching simple visuals', labelMr: 'चित्रे आणि छोटे व्हिडिओ पाहून', labelHi: 'छोटे वीडियो और चित्र देखकर', iconName: 'PlayCircle' },
  { id: 'Listening to explanations', label: 'Listening to explanations', labelMr: 'आवाजात समजावून सांगितलेले ऐकून', labelHi: 'आवाज में समझाकर सुनना', iconName: 'Headphones' },
  { id: 'Reading', label: 'Reading', labelMr: 'वाचून समजून घेणे', labelHi: 'पढ़कर समझना', iconName: 'BookOpen' },
  { id: 'Practicing myself', label: 'Practicing myself', labelMr: 'स्वतः हाताने प्रॅक्टिस करून', labelHi: 'खुद हाथ से प्रैक्टिस करके', iconName: 'Wrench' },
  { id: 'Learning with a teacher or mentor', label: 'Learning with a teacher or mentor', labelMr: 'शिक्षकांकडून किंवा मार्गदर्शकाकडून थेट', labelHi: 'टीचर या मेंटर के साथ सीखना', iconName: 'GraduationCap' },
];

/**
 * Keyword-based speech mapper to map natural spoken Hindi/Marathi/English to closest option
 */
export function mapSpokenTextToOptions(
  step: number,
  spokenText: string
): { matchedOptions: string[]; suggestedText: string } {
  const lower = spokenText.toLowerCase().trim();
  const matched: string[] = [];

  switch (step) {
    case 1: // Education
      if (lower.includes('10') || lower.includes('दहावी') || lower.includes('दसवीं') || lower.includes('tenth') || lower.includes('ssc')) {
        matched.push('Class 10');
      } else if (lower.includes('12') || lower.includes('बारावी') || lower.includes('बारहवीं') || lower.includes('twelfth') || lower.includes('hsc')) {
        matched.push('Class 12');
      } else if (lower.includes('8') || lower.includes('आठवी') || lower.includes('आठवीं') || lower.includes('eighth')) {
        matched.push('Up to Class 8');
      } else if (lower.includes('iti') || lower.includes('आयटीआय') || lower.includes('आईटीआई')) {
        matched.push('ITI');
      } else if (lower.includes('diploma') || lower.includes('डिप्लोमा')) {
        matched.push('Diploma');
      } else if (lower.includes('college') || lower.includes('degree') || lower.includes('कॉलेज') || lower.includes('पदवी') || lower.includes('ग्रेजुएट')) {
        matched.push('College');
      }
      break;

    case 2: // Interests
      if (lower.includes('repair') || lower.includes('दुरुस्त') || lower.includes('रिपेअर') || lower.includes('सुधार')) {
        matched.push('Repairing things');
      }
      if (lower.includes('electric') || lower.includes('इलेक्ट्रिक') || lower.includes('वायरिंग') || lower.includes('मेकॅनिक') || lower.includes('mechanic')) {
        matched.push('Electrical or mechanical work');
      }
      if (lower.includes('computer') || lower.includes('कॉम्प्युटर') || lower.includes('संगणक') || lower.includes('mobile') || lower.includes('मोबाईल') || lower.includes('laptop')) {
        matched.push('Working with computers');
      }
      if (lower.includes('farm') || lower.includes('शेती') || lower.includes('शेत') || lower.includes('खेती') || lower.includes('पिके')) {
        matched.push('Farming and agriculture');
      }
      if (lower.includes('cook') || lower.includes('जेवण') || lower.includes('स्वयंपाक') || lower.includes('खाना') || lower.includes('हॉटेल')) {
        matched.push('Cooking');
      }
      if (lower.includes('people') || lower.includes('लोक') || lower.includes('संवाद') || lower.includes('बात')) {
        matched.push('Talking to people');
      }
      if (lower.includes('outdoor') || lower.includes('बाहेर') || lower.includes('फिर')) {
        matched.push('Working outdoors');
      }
      if (lower.includes('business') || lower.includes('दुकान') || lower.includes('धंदा') || lower.includes('व्यापार')) {
        matched.push('Selling or running a business');
      }
      break;

    case 3: // Existing Skills
      if (lower.includes('phone') || lower.includes('mobile') || lower.includes('स्मार्टफोन') || lower.includes('फोन')) {
        matched.push('Use a smartphone confidently');
      }
      if (lower.includes('tool') || lower.includes('पाना') || lower.includes('स्क्रू') || lower.includes('औजार') || lower.includes('अवजारे')) {
        matched.push('Use tools');
      }
      if (lower.includes('electric') || lower.includes('इलेक्ट्रिक') || lower.includes('वायरिंग') || lower.includes('उपकरण')) {
        matched.push('Repair simple electrical items');
      }
      if (lower.includes('whatsapp') || lower.includes('व्हॉट्सॲप')) {
        matched.push('Use WhatsApp');
      }
      if (lower.includes('computer') || lower.includes('कॉम्प्युटर') || lower.includes('टायपिंग')) {
        matched.push('Basic computer use');
      }
      break;

    case 4: // Work Preference
      if (lower.includes('hand') || lower.includes('practical') || lower.includes('हात') || lower.includes('प्रत्यक्ष')) {
        matched.push('Hands-on practical work');
      }
      if (lower.includes('people') || lower.includes('लोक') || lower.includes('ग्राहक')) {
        matched.push('Working with people');
      }
      if (lower.includes('computer') || lower.includes('digital') || lower.includes('कॉम्प्युटर') || lower.includes('ऑनलाइन')) {
        matched.push('Computer or digital work');
      }
      if (lower.includes('business') || lower.includes('दुकान') || lower.includes('स्वतःचा')) {
        matched.push('Running my own small business');
      }
      break;

    case 5: // Earning Timeline
      if (lower.includes('लवकर') || lower.includes('urgent') || lower.includes('soon') || lower.includes('आत्ताच') || lower.includes('जल्दी')) {
        matched.push('As soon as possible');
      } else if (lower.includes('3') || lower.includes('तीन') || lower.includes('three')) {
        matched.push('Within 3 months');
      } else if (lower.includes('6') || lower.includes('सहा') || lower.includes('six')) {
        matched.push('Within 6 months');
      } else if (lower.includes('year') || lower.includes('वर्ष') || lower.includes('साल')) {
        matched.push('Within a year');
      }
      break;

    case 6: // Travel
      if (lower.includes('town') || lower.includes('तालुका') || lower.includes('शहर') || lower.includes('जवळ')) {
        matched.push('Nearby town');
      } else if (lower.includes('village') || lower.includes('गाव') || lower.includes('गावात')) {
        matched.push('Within my village');
      } else if (lower.includes('district') || lower.includes('जिल्हा')) {
        matched.push('Within my district');
      } else if (lower.includes('home') || lower.includes('घर')) {
        matched.push('I prefer work I can do from home');
      }
      break;

    case 7: // Device + Internet
      if (lower.includes('android') || lower.includes('smartphone') || lower.includes('माझा') || lower.includes('फोन')) {
        matched.push('My own Android smartphone');
      }
      if (lower.includes('sometimes') || lower.includes('कधीकधी') || lower.includes('कमी')) {
        matched.push('Available sometimes');
      }
      break;

    case 8: // Learning Style
      if (lower.includes('listen') || lower.includes('ऐकून') || lower.includes('आवाज') || lower.includes('सुन')) {
        matched.push('Listening to explanations');
      }
      if (lower.includes('practice') || lower.includes('स्वतः') || lower.includes('हाताने') || lower.includes('खुद')) {
        matched.push('Practicing myself');
      }
      if (lower.includes('video') || lower.includes('बघून') || lower.includes('पाहून') || lower.includes('देखकर')) {
        matched.push('Watching simple visuals');
      }
      break;
  }

  return {
    matchedOptions: matched,
    suggestedText: spokenText,
  };
}
