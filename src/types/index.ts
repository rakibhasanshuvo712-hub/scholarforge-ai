export type AcademicMode = 'presentation' | 'lab_report' | 'assignment';

export interface CoverPageMetadata {
  studentName: string;
  studentId: string;
  department: string;
  institution: string;
  courseCode: string;
  courseTitle: string;
  instructorName: string;
  submissionDate: string;
}

export type ThemeId = 'academic_classic' | 'modern_tech' | 'oxford_crimson' | 'emerald_scholar';

export interface VisualTheme {
  id: ThemeId;
  name: string;
  description: string;
  primary: string; // hex color #123456
  primaryLight: string;
  secondary: string;
  accent: string;
  background: string;
  cardBg: string;
  textColor: string;
  mutedText: string;
  borderColor: string;
  fontFamily: 'serif' | 'sans';
  // PPTX color codes (without #)
  pptx: {
    bg: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    cardBg: string;
  };
  // DOCX color codes (without #)
  docx: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    border: string;
    tableHeaderBg: string;
  };
}

export interface SlideItem {
  id: string;
  slideNumber: number;
  title: string;
  subtitle?: string;
  bullets: string[];
  speakerNotes?: string;
  diagramCode?: string;
  diagramCaption?: string;
  codeSnippet?: string;
  callout?: string;
}

export interface ReportSection {
  id: string;
  heading: string;
  subheading?: string;
  content: string;
  bulletPoints?: string[];
  codeSnippet?: string;
  codeLanguage?: string;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  diagramCode?: string;
  diagramCaption?: string;
}

export interface PrimaryDiagram {
  code: string;
  title: string;
  type: string; // 'flowchart' | 'sequence' | 'er' | 'class' | 'architecture'
  caption: string;
}

export interface GeneratedDocument {
  mode: AcademicMode;
  title: string;
  subtitle?: string;
  executiveSummary: string;
  metadata: CoverPageMetadata;
  slides?: SlideItem[];
  sections?: ReportSection[];
  primaryDiagram: PrimaryDiagram;
  references: string[];
  generatedAt: string;
}

export interface GenerateApiRequest {
  mode: AcademicMode;
  title: string;
  description: string;
  metadata: CoverPageMetadata;
  codeSnippet?: string;
  count: number;
  apiKey?: string;
}

export interface GenerateApiResponse {
  success: boolean;
  document?: GeneratedDocument;
  error?: string;
  isMockFallback?: boolean;
}
