
import React, { useState, useRef, useEffect } from 'react';
import { askBarnaby } from '../geminiService';

const AITutor: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'barnaby'; text: string }[]>([
    { role: 'barnaby', text: "Hello! I'm Barnaby, your personal Investment Coach. Ask me anything about market trends, portfolio strategies, or financial terms. How can I assist your learning today? 📊" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const response = await askBarnaby(userMsg);
    setMessages(prev => [...prev, { role: 'barnaby', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen max-w-3xl mx-auto pb-10 px-4 pt-6">
      <div className="p-6 flex items-center gap-4 bg-white border-2 border-gray-100 rounded-2xl mb-6 shadow-sm">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-3xl animate-float">🦉</div>
        <div>
          <h1 className="text-xl font-black text-gray-800">Investment Coach</h1>
          <p className="text-xs font-bold text-[#58cc02] uppercase tracking-widest">• Online</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-lg font-bold shadow-sm ${
              msg.role === 'user' 
                ? 'bg-[#1cb0f6] text-white' 
                : 'bg-white text-gray-700 border-2 border-gray-100'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-gray-100 p-4 rounded-2xl animate-pulse">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-md">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="What is a Dividend? ..."
            className="flex-1 bg-gray-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#1cb0f6] font-bold"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 bg-[#1cb0f6] text-white rounded-xl duo-button border-b-4 border-[#1899d6] font-black"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;
