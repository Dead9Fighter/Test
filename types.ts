export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export interface TaskItem {
  id: string;
  time: string;
  icon: string; // Lucide icon name
  zh: string;
  en: string;
  id_lang: string; // Indonesian
  isCompleted: boolean;
  isLaundry?: boolean; // Special toggle for laundry grid
}

export interface SpecialTask {
  id: string;
  content_zh: string;
  content_en: string;
  content_id: string;
  isCompleted: boolean;
  createdAt: number;
}

export interface HouseRule {
  id: string;
  category: string;
  rules: { zh: string; en: string; id_lang: string }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
