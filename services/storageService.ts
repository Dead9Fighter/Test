import { TaskItem, SpecialTask, HouseRule } from '../types';

const KEYS = {
  TASKS: 'vibe_tasks',
  SPECIAL_TASKS: 'vibe_special_tasks',
  DAILY_STATUS: 'vibe_daily_status', // Keyed by YYYY-MM-DD
  LAST_LOGIN: 'vibe_last_login',
};

// Default Initial Data
const DEFAULT_TASKS: TaskItem[] = [
  { id: 't1', time: '07:00', icon: 'Sun', zh: '起床 / 準備早餐', en: 'Wake up / Prepare Breakfast', id_lang: 'Bangun / Siapkan Sarapan', isCompleted: false },
  { id: 't2', time: '08:00', icon: 'Baby', zh: '送小孩上學', en: 'Take kids to school', id_lang: 'Antar anak sekolah', isCompleted: false },
  { id: 't3', time: '09:00', icon: 'Shirt', zh: '洗衣服', en: 'Laundry', id_lang: 'Mencuci baju', isCompleted: false, isLaundry: true },
  { id: 't4', time: '10:00', icon: 'SprayCan', zh: '清潔客廳', en: 'Clean Living Room', id_lang: 'Bersihkan Ruang Tamu', isCompleted: false },
  { id: 't5', time: '12:00', icon: 'Utensils', zh: '準備午餐', en: 'Prepare Lunch', id_lang: 'Siapkan Makan Siang', isCompleted: false },
  { id: 't6', time: '15:00', icon: 'ShoppingBag', zh: '買菜', en: 'Grocery Shopping', id_lang: 'Belanja sayur', isCompleted: false },
  { id: 't7', time: '18:00', icon: 'ChefHat', zh: '準備晚餐', en: 'Prepare Dinner', id_lang: 'Siapkan Makan Malam', isCompleted: false },
  { id: 't8', time: '20:00', icon: 'ShowerHead', zh: '小孩洗澡', en: 'Kids Shower', id_lang: 'Mandikan anak', isCompleted: false },
];

export const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const getTasks = (): TaskItem[] => {
  const stored = localStorage.getItem(KEYS.TASKS);
  let tasks = stored ? JSON.parse(stored) : DEFAULT_TASKS;
  
  // Apply daily status
  const todayKey = getTodayKey();
  const dailyStatusRaw = localStorage.getItem(`${KEYS.DAILY_STATUS}_${todayKey}`);
  if (dailyStatusRaw) {
    const statusMap = JSON.parse(dailyStatusRaw);
    tasks = tasks.map((t: TaskItem) => ({ ...t, isCompleted: !!statusMap[t.id] }));
  } else {
    // Reset for new day
    tasks = tasks.map((t: TaskItem) => ({ ...t, isCompleted: false }));
  }
  
  return tasks;
};

export const toggleTaskStatus = (taskId: string, currentStatus: boolean) => {
  const todayKey = getTodayKey();
  const dailyStatusRaw = localStorage.getItem(`${KEYS.DAILY_STATUS}_${todayKey}`);
  const statusMap = dailyStatusRaw ? JSON.parse(dailyStatusRaw) : {};
  
  statusMap[taskId] = !currentStatus;
  localStorage.setItem(`${KEYS.DAILY_STATUS}_${todayKey}`, JSON.stringify(statusMap));
};

export const saveTasks = (tasks: TaskItem[]) => {
  localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
};

export const getSpecialTasks = (): SpecialTask[] => {
  const stored = localStorage.getItem(KEYS.SPECIAL_TASKS);
  return stored ? JSON.parse(stored) : [];
};

export const addSpecialTask = (task: SpecialTask) => {
  const tasks = getSpecialTasks();
  tasks.push(task);
  localStorage.setItem(KEYS.SPECIAL_TASKS, JSON.stringify(tasks));
};

export const completeSpecialTask = (id: string) => {
  let tasks = getSpecialTasks();
  tasks = tasks.map(t => t.id === id ? { ...t, isCompleted: true } : t);
  localStorage.setItem(KEYS.SPECIAL_TASKS, JSON.stringify(tasks));
};
