
export enum ModuleStatus {
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE',
  COMPLETED = 'COMPLETED'
}

export type QuestionType = 'multiple-choice' | 'match' | 'order';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  pairs?: { left: string; right: string }[];
  steps?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  xpReward: number;
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  status: ModuleStatus;
  lessons: Lesson[];
  requiredScore: number;
}

export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  type: 'Stock' | 'Crypto' | 'ETF';
  levelRequired: number;
}

export interface UserProfile {
  name: string;
  xp: number;
  level: number;
  streak: number;
  hearts: number;
  investingoBucks: number;
  portfolio: { [symbol: string]: number };
  completedLessons: string[];
}
