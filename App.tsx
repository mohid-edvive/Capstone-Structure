
import React, { useState } from 'react';
import { UserProfile, Module, ModuleStatus, Lesson } from './types';
import { MODULES, INITIAL_USER } from './constants';
import Navbar from './components/Navbar';
import LessonScreen from './components/LessonScreen';
import Simulator from './components/Simulator';
import AITutor from './components/AITutor';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [activeTab, setActiveTab] = useState('path');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentModules, setCurrentModules] = useState<Module[]>(MODULES);

  const handleLessonFinish = (score: number) => {
    if (!activeLesson) return;

    const moduleIdx = currentModules.findIndex(m => m.lessons.some(l => l.id === activeLesson.id));
    const passed = score >= (currentModules[moduleIdx]?.requiredScore || 0);

    if (passed) {
      const xpGain = activeLesson.xpReward;
      const ibGain = xpGain * 10;
      
      setUser(prev => ({
        ...prev,
        xp: prev.xp + xpGain,
        investingoBucks: prev.investingoBucks + ibGain,
        level: Math.floor((prev.xp + xpGain) / 100) + 1,
        completedLessons: [...prev.completedLessons, activeLesson.id]
      }));

      const nextModules = [...currentModules];
      if (moduleIdx < nextModules.length - 1) {
        nextModules[moduleIdx + 1].status = ModuleStatus.AVAILABLE;
      }
      setCurrentModules(nextModules);
    }
    setActiveLesson(null);
  };

  const handleWrong = () => {
    setUser(prev => ({ ...prev, hearts: Math.max(0, prev.hearts - 1) }));
  };

  const handleTrade = (symbol: string, amount: number, price: number) => {
    const cost = amount * price;
    if (user.investingoBucks < cost && amount > 0) return;
    const currentHoldings = user.portfolio[symbol] || 0;
    const newHoldings = currentHoldings + amount;
    if (newHoldings < 0) return;

    setUser(prev => ({
      ...prev,
      investingoBucks: prev.investingoBucks - cost,
      portfolio: { ...prev.portfolio, [symbol]: newHoldings }
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentTab={activeTab} setTab={setActiveTab} />

      <main className="md:pl-64 min-h-screen pb-20 md:pb-0">
        {/* Top Stats Bar */}
        <div className="sticky top-0 z-40 bg-white border-b-2 border-gray-100 p-4 md:px-8 flex justify-center md:justify-end">
          <div className="flex items-center gap-6 max-w-4xl w-full">
            <div className="flex items-center gap-2 font-black text-[#ffc800] text-lg">
              <span>🔥</span>
              <span>{user.streak}</span>
            </div>
            <div className="flex items-center gap-2 font-black text-[#1cb0f6] text-lg">
              <span>💎</span>
              <span>{user.xp}</span>
            </div>
            <div className="flex items-center gap-2 font-black text-[#ff4b4b] text-lg">
              <span>❤️</span>
              <span>{user.hearts}</span>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-2 bg-[#58cc02] text-white px-4 py-1.5 rounded-2xl font-black text-sm border-b-4 border-[#46a302]">
              ${user.investingoBucks.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {activeTab === 'path' && (
            <div className="p-8 pt-12 pb-32 relative path-container flex flex-col items-center">
              <div className="flex flex-col items-center gap-12 w-full max-w-sm">
                {currentModules.map((module, idx) => {
                  const isLocked = module.status === ModuleStatus.LOCKED;
                  const xOffset = idx % 2 === 0 ? 'translateX(30%)' : 'translateX(-30%)';
                  
                  return (
                    <div key={module.id} className="relative z-10 flex flex-col items-center w-full">
                      <div style={{ transform: xOffset }} className="flex flex-col items-center">
                        <button 
                          onClick={() => !isLocked && user.hearts > 0 && setActiveLesson(module.lessons[0])}
                          className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all relative ${
                            isLocked 
                              ? 'bg-[#e5e5e5] border-b-4 border-[#afafaf] text-[#afafaf] cursor-not-allowed' 
                              : 'bg-[#58cc02] border-b-8 border-[#46a302] text-white hover:brightness-110 active:translate-y-2 active:border-b-0'
                          }`}
                        >
                          {isLocked ? '🔒' : module.icon}
                        </button>
                        <div className="mt-4 bg-white px-4 py-1.5 rounded-xl border-2 border-gray-200 text-center shadow-sm">
                          <h3 className={`font-black text-[10px] uppercase tracking-widest ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                            {module.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div className="mt-16 flex items-start gap-4 p-6 bg-white duo-card w-full">
                   <div className="text-5xl animate-bounce-subtle shrink-0">🦉</div>
                   <div className="flex-1">
                      <p className="font-black text-gray-700 text-sm leading-relaxed">
                        "Your knowledge is like a high-yield savings account—the more you put in, the more it grows! Keep going!"
                      </p>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'simulator' && <Simulator user={user} onTrade={handleTrade} />}
          {activeTab === 'tutor' && <AITutor />}
          {activeTab === 'profile' && (
            <div className="p-8 max-w-2xl mx-auto">
              <div className="duo-card p-10 mb-8 bg-white flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 bg-[#1cb0f6] rounded-3xl flex items-center justify-center text-6xl text-white border-b-8 border-[#1899d6] animate-bounce-subtle">👤</div>
                <div className="text-center md:text-left">
                  <h1 className="text-4xl font-black text-gray-800">{user.name}</h1>
                  <div className="flex gap-2 mt-2 justify-center md:justify-start">
                    <span className="bg-gray-100 text-gray-500 font-black text-[10px] px-3 py-1 rounded-lg uppercase">Joined May 2024</span>
                    <span className="bg-[#ddf4ff] text-[#1cb0f6] font-black text-[10px] px-3 py-1 rounded-lg uppercase">Gold Tier</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="duo-card p-6 text-center">
                  <p className="text-4xl mb-2">🔥</p>
                  <p className="text-2xl font-black text-gray-800">{user.streak}</p>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Day Streak</p>
                </div>
                <div className="duo-card p-6 text-center">
                  <p className="text-4xl mb-2">💎</p>
                  <p className="text-2xl font-black text-gray-800">{user.xp}</p>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total XP</p>
                </div>
              </div>

              <div className="duo-card p-8 bg-white">
                <h2 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-widest">My Portfolio</h2>
                <div className="space-y-4">
                  {Object.entries(user.portfolio).map(([symbol, amount]) => (amount as number) > 0 && (
                    <div key={symbol} className="flex justify-between items-center p-4 border-2 border-gray-50 rounded-xl hover:bg-gray-50 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#1cb0f6] rounded-lg flex items-center justify-center font-black text-white">{symbol[0]}</div>
                        <span className="font-black text-lg">{symbol}</span>
                      </div>
                      <span className="font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">{amount as number} Shares</span>
                    </div>
                  ))}
                  {Object.values(user.portfolio).every(v => (v as number) === 0) && (
                    <p className="text-center text-gray-400 font-bold italic py-10">No shares owned yet. Start practicing in the Market!</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {activeLesson && (
        <LessonScreen 
          lesson={activeLesson} 
          hearts={user.hearts}
          onFinish={handleLessonFinish}
          onWrong={handleWrong}
          onClose={() => setActiveLesson(null)} 
        />
      )}
    </div>
  );
};

export default App;
