import { VisualTheme, ThemeId } from './index';

export const THEMES: Record<ThemeId, VisualTheme> = {
  academic_classic: {
    id: 'academic_classic',
    name: 'Academic Classic',
    description: 'Traditional scholarly navy, warm parchment & formal serif aesthetics',
    primary: '#1E3A8A', // Deep Navy
    primaryLight: '#DBEAFE',
    secondary: '#3B82F6',
    accent: '#D97706', // Warm Amber
    background: '#F8FAFC',
    cardBg: '#FFFFFF',
    textColor: '#0F172A',
    mutedText: '#64748B',
    borderColor: '#CBD5E1',
    fontFamily: 'serif',
    pptx: {
      bg: 'F8FAFC',
      primary: '1E3A8A',
      secondary: '3B82F6',
      accent: 'D97706',
      text: '0F172A',
      cardBg: 'FFFFFF',
    },
    docx: {
      primary: '1E3A8A',
      secondary: '3B82F6',
      accent: 'D97706',
      text: '0F172A',
      border: '1E3A8A',
      tableHeaderBg: '1E3A8A',
    },
  },
  modern_tech: {
    id: 'modern_tech',
    name: 'Modern Tech Dark',
    description: 'Sleek dark slate with vibrant indigo & cyan accents',
    primary: '#4F46E5', // Indigo
    primaryLight: '#EEF2FF',
    secondary: '#06B6D4', // Cyan
    accent: '#8B5CF6', // Purple
    background: '#0F172A', // Slate 900
    cardBg: '#1E293B',
    textColor: '#F8FAFC',
    mutedText: '#94A3B8',
    borderColor: '#334155',
    fontFamily: 'sans',
    pptx: {
      bg: '0F172A',
      primary: '4F46E5',
      secondary: '06B6D4',
      accent: '8B5CF6',
      text: 'F8FAFC',
      cardBg: '1E293B',
    },
    docx: {
      primary: '312E81',
      secondary: '4338CA',
      accent: '0891B2',
      text: '1E293B',
      border: '4F46E5',
      tableHeaderBg: '312E81',
    },
  },
  oxford_crimson: {
    id: 'oxford_crimson',
    name: 'Oxford Crimson',
    description: 'Distinguished burgundy wine & antique gold accents',
    primary: '#881337', // Rose/Crimson
    primaryLight: '#FFE4E6',
    secondary: '#B45309', // Gold/Bronze
    accent: '#BE123C',
    background: '#FFFDF9',
    cardBg: '#FFFFFF',
    textColor: '#1C1917',
    mutedText: '#78716C',
    borderColor: '#E7E5E4',
    fontFamily: 'serif',
    pptx: {
      bg: 'FFFDF9',
      primary: '881337',
      secondary: 'B45309',
      accent: 'BE123C',
      text: '1C1917',
      cardBg: 'FFFFFF',
    },
    docx: {
      primary: '881337',
      secondary: 'B45309',
      accent: 'BE123C',
      text: '1C1917',
      border: '881337',
      tableHeaderBg: '881337',
    },
  },
  emerald_scholar: {
    id: 'emerald_scholar',
    name: 'Emerald Scholar',
    description: 'Prestige forest green, clean mint & crisp modern lines',
    primary: '#065F46', // Emerald
    primaryLight: '#D1FAE5',
    secondary: '#0D9488', // Teal
    accent: '#059669',
    background: '#F0FDF4',
    cardBg: '#FFFFFF',
    textColor: '#064E3B',
    mutedText: '#047857',
    borderColor: '#A7F3D0',
    fontFamily: 'sans',
    pptx: {
      bg: 'F0FDF4',
      primary: '065F46',
      secondary: '0D9488',
      accent: '059669',
      text: '064E3B',
      cardBg: 'FFFFFF',
    },
    docx: {
      primary: '065F46',
      secondary: '0D9488',
      accent: '059669',
      text: '064E3B',
      border: '065F46',
      tableHeaderBg: '065F46',
    },
  },
};
