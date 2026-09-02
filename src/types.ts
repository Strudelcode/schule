export type SubjectId =
  | 'deutsch'
  | 'englisch'
  | 'italienisch'
  | 'mathematik'
  | 'biologie'
  | 'geografie'
  | 'geschichte'
  | 'lernberatung'
  | 'organisation'
  | 'bibliothek'
  | 'religion_musik'
  | 'abschlusspruefung'
  | 'fussball';

export type FileType =
  | 'docx'
  | 'xlsx'
  | 'pptx'
  | 'pdf'
  | 'txt'
  | 'html'
  | 'jpg'
  | 'png'
  | 'mp4'
  | 'mp3'
  | 'url'
  | 'dotx'
  | 'folder';

export interface VFile {
  id: string;
  name: string;
  path: string; // e.g. "/01_Deutsch/Dokumente/Wortarten.docx"
  parentId: string; // id of parent folder, or "root"
  isFolder: boolean;
  type: FileType;
  size?: string;
  dateModified: string;
  content?: string; // HTML or Markdown formatted content for docx/txt/html
  slides?: { title: string; bullets: string[]; image?: string; notes?: string }[]; // For pptx
  spreadsheet?: {
    sheets: { name: string; rows: (string | number)[][] }[];
  }; // For xlsx
  pdfPages?: string[]; // For pdf preview text/pages
  mediaUrl?: string; // For images/videos
  tags?: string[];
  summary?: string;
  isFavorite?: boolean;
}

export interface SubjectInfo {
  id: SubjectId;
  title: string;
  shortTitle: string;
  icon: string;
  color: string;
  bgLight: string;
  borderAccent: string;
  description: string;
  folderName: string;
  fileCount: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  subjectId: SubjectId;
  category: string;
  type: 'docx' | 'pdf' | 'pptx' | 'xlsx' | 'txt' | 'tool' | 'interactive';
  originalPath: string;
  summary: string;
  tags: string[];
  content?: string;
  sections?: { title: string; body: string; bulletPoints?: string[] }[];
  rules?: { term: string; explanation: string; example?: string }[];
  quiz?: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface IrregularVerb {
  infinitive: string;
  pastSimple: string;
  pastParticiple: string;
  german: string;
}

export interface ItalianVerbConjugation {
  infinitive: string;
  translation: string;
  presente: string[];
  passatoProssimo: string;
  imperfetto: string[];
  futuroSemplice: string[];
}

export interface TimetableSlot {
  day: string;
  period: number;
  time: string;
  subject: string;
  room?: string;
  teacher?: string;
}

export interface FootballTeam {
  name: string;
  logo: string;
}

export interface FootballMatch {
  labelHome: string;
  labelAway: string;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  date: string;
  scorers: {
    home: { name: string; goals: number }[];
    away: { name: string; goals: number }[];
  };
}
