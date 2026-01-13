import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, Minimize2 } from 'lucide-react';
import { chatWithBot } from '../services/geminiService';
import { ChatMessage, TimeOfDay } from '../types';

interface ChatBotProps {
  timeOfDay: TimeOfDay;
}

const ChatBot: React.FC<ChatBotProps> = ({ timeOfDay }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const themeColors = {
    morning: 'bg-orange-500 text-white',
    afternoon: 'bg-blue-500 text-white',
    evening: 'bg-indigo-500 text-white',
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Transform history for Gemini
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const replyText = await chatWithBot(history, userMsg.text);
      
      const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: replyText, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      const errorMsg: ChatMessage = { id: Date.now().toString(), role: 'model', text: "Sorry, I couldn't connect to the AI.", timestamp: Date.now() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 p-4 rounded-full shadow-xl transition-all hover:scale-105 z-40 ${themeColors[timeOfDay]}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 md:bottom-24 md:right-20 md:left-auto md:w-96 h-[80vh] md:h-[600px] bg-white md:rounded-[2rem] rounded-t-[2rem] shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-100">
          {/* Header */}
          <div className={`p-4 flex justify-between items-center ${themeColors[timeOfDay]}`}>
            <h3 className="font-bold">Helper Assistant AI</h3>
            <button onClick={() => setIsOpen(false)}><Minimize2 size={20} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-10">
                    <MessageSquare size={48} className="mx-auto mb-2 opacity-20" />
                    <p>Ask me anything!</p>
                </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-gray-800 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                   <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200">
                       <Loader2 size={16} className="animate-spin text-gray-400" />
                   </div>
               </div> 
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-gray-200"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input}
                className={`p-3 rounded-full ${themeColors[timeOfDay]} disabled:opacity-50`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
