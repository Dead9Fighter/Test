import React from 'react';
import * as Icons from 'lucide-react';
import { TaskItem, TimeOfDay } from '../types';

interface TaskCardProps {
  task: TaskItem;
  timeOfDay: TimeOfDay;
  onToggle: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, timeOfDay, onToggle }) => {
  // Dynamic Icon
  const IconComponent = (Icons as any)[task.icon] || Icons.Circle;

  // Theme Logic
  const activeColors = {
    morning: 'bg-white border-orange-200 shadow-orange-100',
    afternoon: 'bg-white border-blue-200 shadow-blue-100',
    evening: 'bg-white border-indigo-200 shadow-indigo-100',
  };

  const timeColors = {
    morning: 'text-orange-500',
    afternoon: 'text-blue-500',
    evening: 'text-indigo-500',
  };

  const isCompletedStyle = task.isCompleted 
    ? 'opacity-50 grayscale bg-gray-50 border-transparent shadow-none' 
    : `${activeColors[timeOfDay]} border shadow-lg`;

  return (
    <div 
      onClick={() => onToggle(task.id)}
      className={`relative mb-6 p-5 rounded-[2.5rem] transition-all duration-300 transform active:scale-95 cursor-pointer backdrop-blur-md ${isCompletedStyle}`}
    >
      <div className="flex items-center gap-5">
        {/* Time Column */}
        <div className={`flex flex-col items-center justify-center w-16 ${task.isCompleted ? 'text-gray-400' : timeColors[timeOfDay]}`}>
          <span className="text-lg font-bold">{task.time}</span>
          <div className={`mt-2 p-2 rounded-full ${task.isCompleted ? 'bg-gray-200' : 'bg-current bg-opacity-10'}`}>
            <IconComponent size={24} />
          </div>
        </div>

        {/* Content Column */}
        <div className="flex-1">
          <h3 className={`text-xl font-black mb-1 ${task.isCompleted ? 'text-gray-400' : 'text-gray-800'}`}>
            {task.zh}
          </h3>
          <div className={`flex flex-col text-sm ${task.isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="italic">{task.en}</span>
            <span className="italic opacity-80">{task.id_lang}</span>
          </div>
        </div>

        {/* Checkbox Visual */}
        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors border-gray-200">
           {task.isCompleted && <div className="w-5 h-5 rounded-full bg-gray-400" />}
        </div>
      </div>

      {/* Laundry Grid Expansion */}
      {task.isLaundry && !task.isCompleted && (
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-6 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-center text-xs text-gray-400 font-bold bg-gray-50 rounded-lg py-2">
                    {d}
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
