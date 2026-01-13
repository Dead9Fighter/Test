import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck } from 'lucide-react';
import { TimeOfDay } from '../types';

interface HeaderProps {
  timeOfDay: TimeOfDay;
  onAdminClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ timeOfDay, onAdminClick }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-HK', { month: 'long', day: 'numeric', weekday: 'short' }).format(date);
  };

  const themeColors = {
    morning: 'text-orange-600',
    afternoon: 'text-blue-600',
    evening: 'text-indigo-600',
  };

  const bgColors = {
    morning: 'bg-orange-100',
    afternoon: 'bg-blue-100',
    evening: 'bg-indigo-100',
  };

  return (
    <header className="px-6 py-6 flex justify-between items-start">
      <div>
        <div className={`text-sm font-bold opacity-70 ${themeColors[timeOfDay]}`}>
          {formatDate(currentTime)}
        </div>
        <h1 className={`text-4xl font-black ${themeColors[timeOfDay]}`}>
          {timeOfDay === 'morning' ? 'Good Morning' : timeOfDay === 'afternoon' ? 'Good Afternoon' : 'Good Evening'}
        </h1>
        <p className="text-gray-400 italic text-sm mt-1">Hello, have a nice day!</p>
      </div>
      
      <button 
        onClick={onAdminClick}
        className={`p-3 rounded-2xl ${bgColors[timeOfDay]} ${themeColors[timeOfDay]} hover:opacity-80 transition-opacity backdrop-blur-sm`}
      >
        <ShieldCheck size={24} />
      </button>
    </header>
  );
};

export default Header;
