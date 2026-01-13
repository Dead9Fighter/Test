import React, { useState } from 'react';
import { Image as ImageIcon, Wand2, Download, X } from 'lucide-react';
import { generateImage } from '../services/geminiService';
import { TimeOfDay } from '../types';

interface ImageGeneratorProps {
  timeOfDay: TimeOfDay;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ timeOfDay }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const themeColors = {
    morning: 'bg-orange-500',
    afternoon: 'bg-blue-500',
    evening: 'bg-indigo-500',
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setResultUrl(null);
    try {
      const url = await generateImage(prompt, size);
      if (url) setResultUrl(url);
    } catch (e) {
      alert("Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl transition-all hover:scale-105 z-40 text-white ${themeColors[timeOfDay]}`}
      >
        <ImageIcon size={24} />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-6 relative overflow-hidden">
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 z-10">
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black text-gray-800 mb-1">Visual Helper</h2>
            <p className="text-gray-500 text-sm mb-6">Generate visual instructions for tasks.</p>

            <div className="space-y-4">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want to see (e.g., 'A clean kitchen counter with a vase')"
                className="w-full h-24 p-4 bg-gray-50 rounded-2xl resize-none outline-none focus:ring-2 ring-indigo-100"
              />

              <div className="flex gap-2">
                {(['1K', '2K', '4K'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
                      size === s ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-indigo-700 transition-colors"
              >
                {loading ? <Wand2 className="animate-spin" /> : <Wand2 />}
                {loading ? 'Generating...' : 'Generate Image'}
              </button>
            </div>

            {resultUrl && (
              <div className="mt-6 animate-fade-in">
                <div className="rounded-2xl overflow-hidden border-4 border-gray-100 shadow-lg relative group">
                  <img src={resultUrl} alt="Generated" className="w-full h-auto object-cover" />
                  <a 
                    href={resultUrl} 
                    download={`vibe-gen-${Date.now()}.png`}
                    className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Download size={20} className="text-gray-800" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGenerator;
