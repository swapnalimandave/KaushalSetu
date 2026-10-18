import React from 'react';
import {
  BookOpen,
  GraduationCap,
  Award,
  Wrench,
  FileBadge,
  School,
  MoreHorizontal,
  Monitor,
  Users,
  HeartHandshake,
  Utensils,
  Hammer,
  Sun,
  Sprout,
  Calculator,
  Palette,
  Store,
  Zap,
  Smartphone,
  MessageSquare,
  Laptop,
  Smile,
  Languages,
  Scissors,
  Tractor,
  Keyboard,
  Compass,
  Clock,
  Calendar,
  CalendarDays,
  CalendarRange,
  Home,
  MapPin,
  Navigation,
  Bus,
  Building2,
  Wifi,
  WifiOff,
  Radio,
  PlayCircle,
  Headphones,
  Check,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface OptionIconProps {
  name?: string;
  className?: string;
}

export const OptionIcon: React.FC<OptionIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'BookOpen': return <BookOpen className={className} />;
    case 'GraduationCap': return <GraduationCap className={className} />;
    case 'Award': return <Award className={className} />;
    case 'Wrench': return <Wrench className={className} />;
    case 'FileBadge': return <FileBadge className={className} />;
    case 'School': return <School className={className} />;
    case 'Monitor': return <Monitor className={className} />;
    case 'Users': return <Users className={className} />;
    case 'HeartHandshake': return <HeartHandshake className={className} />;
    case 'Utensils': return <Utensils className={className} />;
    case 'Hammer': return <Hammer className={className} />;
    case 'Sun': return <Sun className={className} />;
    case 'Sprout': return <Sprout className={className} />;
    case 'Calculator': return <Calculator className={className} />;
    case 'Palette': return <Palette className={className} />;
    case 'Store': return <Store className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Smartphone': return <Smartphone className={className} />;
    case 'MessageSquare': return <MessageSquare className={className} />;
    case 'Laptop': return <Laptop className={className} />;
    case 'Smile': return <Smile className={className} />;
    case 'Languages': return <Languages className={className} />;
    case 'Scissors': return <Scissors className={className} />;
    case 'Tractor': return <Tractor className={className} />;
    case 'Keyboard': return <Keyboard className={className} />;
    case 'Compass': return <Compass className={className} />;
    case 'Clock': return <Clock className={className} />;
    case 'Calendar': return <Calendar className={className} />;
    case 'CalendarDays': return <CalendarDays className={className} />;
    case 'CalendarRange': return <CalendarRange className={className} />;
    case 'Home': return <Home className={className} />;
    case 'MapPin': return <MapPin className={className} />;
    case 'Navigation': return <Navigation className={className} />;
    case 'Bus': return <Bus className={className} />;
    case 'Building2': return <Building2 className={className} />;
    case 'Wifi': return <Wifi className={className} />;
    case 'WifiOff': return <WifiOff className={className} />;
    case 'Radio': return <Radio className={className} />;
    case 'PlayCircle': return <PlayCircle className={className} />;
    case 'Headphones': return <Headphones className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'HelpCircle': return <HelpCircle className={className} />;
    default: return <Check className={className} />;
  }
};
