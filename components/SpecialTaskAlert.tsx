import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { SpecialTask } from '../types';

interface SpecialTaskAlertProps {
  task: SpecialTask;
  onComplete: (id: string) => void;
}

const SpecialTaskAlert: React.FC<SpecialTaskAlertProps> = ({ task, onComplete }) => {
  if (task.isCompleted) return null;

  return (
    <div className="mx-6 mb-6 p-5 rounded-[2rem] bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-xl shadow-rose-200 flex items-start justify-between relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-20">
        <AlertCircle size={80} />
      </div>
      
      <div className="z-10 flex-1 pr-4">
        <h3 className="text-xl font-black mb-1">{task.content_zh}</h3>
        <p className="text-sm opacity-90 italic mb-1">{task.content_en}</p>
        <p className="text-sm opacity-80 italic">{task.content_id}</p>
      </div>

      <button 
        onClick={() => onComplete(task.id)}
        className="z-10 bg-white/20 p-3 rounded-full hover:bg-white/40 transition-colors backdrop-blur-md"
      >
        <CheckCircle2 size={32} className="text-white" />
      </button>
    </div>
  );
};

export default SpecialTaskAlert;
