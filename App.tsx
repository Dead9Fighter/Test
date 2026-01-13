import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TaskCard from './components/TaskCard';
import SpecialTaskAlert from './components/SpecialTaskAlert';
import AdminPanel from './components/AdminPanel';
import ChatBot from './components/ChatBot';
import ImageGenerator from './components/ImageGenerator';
import { getTasks, toggleTaskStatus, getSpecialTasks, addSpecialTask, completeSpecialTask } from './services/storageService';
import { TaskItem, SpecialTask, TimeOfDay } from './types';

const App: React.FC = () => {
  // State
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [specialTasks, setSpecialTasks] = useState<SpecialTask[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Initialize
  useEffect(() => {
    // Determine time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');

    // Load data
    refreshData();
  }, []);

  const refreshData = () => {
    setTasks(getTasks());
    setSpecialTasks(getSpecialTasks().filter(t => !t.isCompleted));
  };

  const handleTaskToggle = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      toggleTaskStatus(id, task.isCompleted);
      refreshData();
    }
  };

  const handleSpecialTaskComplete = (id: string) => {
    completeSpecialTask(id);
    refreshData();
  };

  const handleAddSpecialTask = (task: SpecialTask) => {
    addSpecialTask(task);
    refreshData();
  };

  // Background Theme Styles
  const bgStyles = {
    morning: 'bg-orange-50/60',
    afternoon: 'bg-blue-50/60',
    evening: 'bg-indigo-50/60',
  };

  const timelineColors = {
    morning: 'border-orange-200',
    afternoon: 'border-blue-200',
    evening: 'border-indigo-200',
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${bgStyles[timeOfDay]} pb-24`}>
      <Header timeOfDay={timeOfDay} onAdminClick={() => setIsAdminOpen(true)} />

      <main className="max-w-xl mx-auto relative mt-4">
        {/* Floating Special Tasks */}
        {specialTasks.map(st => (
          <SpecialTaskAlert key={st.id} task={st} onComplete={handleSpecialTaskComplete} />
        ))}

        {/* Timeline Line */}
        <div className={`absolute left-[2.6rem] top-0 bottom-0 border-l-2 ${timelineColors[timeOfDay]} z-0`} />

        {/* Task Cards */}
        <div className="px-6 relative z-10">
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              timeOfDay={timeOfDay} 
              onToggle={handleTaskToggle} 
            />
          ))}
        </div>
        
        <div className="px-6 text-center mt-12 mb-8">
           <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">End of List</p>
        </div>
      </main>

      {/* Admin Panel */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        onAddSpecialTask={handleAddSpecialTask}
      />

      {/* Floating Action Buttons */}
      <ChatBot timeOfDay={timeOfDay} />
      <ImageGenerator timeOfDay={timeOfDay} />
    </div>
  );
};

export default App;
