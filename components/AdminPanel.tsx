import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2 } from 'lucide-react';
import { translateInstruction } from '../services/geminiService';
import { SpecialTask } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSpecialTask: (task: SpecialTask) => void;
}

const PIN = '012295';

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onAddSpecialTask }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [newTaskInput, setNewTaskInput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === PIN) {
      setIsAuthenticated(true);
      setPinInput('');
    } else {
      alert('Wrong PIN');
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskInput.trim()) return;
    setIsTranslating(true);
    try {
      const result = await translateInstruction(newTaskInput);
      const newTask: SpecialTask = {
        id: Date.now().toString(),
        content_zh: result.zh || newTaskInput,
        content_en: result.en || newTaskInput,
        content_id: result.id_lang || newTaskInput,
        isCompleted: false,
        createdAt: Date.now()
      };
      onAddSpecialTask(newTask);
      setNewTaskInput('');
      onClose();
    } catch (e) {
      alert('Translation failed. Please check API Key or connection.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <X size={20} className="text-gray-600" />
        </button>

        {!isAuthenticated ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-black text-gray-800 mb-2">Employer Access</h2>
            <p className="text-gray-500 mb-6">Enter PIN to manage tasks</p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="text-center text-3xl tracking-[0.5em] font-bold w-full p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none transition-colors mb-6"
                placeholder="••••••"
                autoFocus
              />
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200">
                Unlock
              </button>
            </form>
          </div>
        ) : (
          <div className="py-4">
            <div className="flex items-center gap-2 mb-6 text-indigo-600">
              <Sparkles size={24} />
              <h2 className="text-2xl font-black">New Special Task</h2>
            </div>
            
            <textarea
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              placeholder="Type instruction in any language (e.g. 'Clean the windows')"
              className="w-full h-32 p-4 bg-gray-50 rounded-2xl text-lg resize-none outline-none focus:ring-2 ring-indigo-200 mb-4"
            />
            
            <button 
              onClick={handleCreateTask}
              disabled={isTranslating || !newTaskInput}
              className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isTranslating ? <Loader2 className="animate-spin" /> : <Send size={20} />}
              {isTranslating ? 'Translating via Gemini...' : 'Translate & Assign'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
