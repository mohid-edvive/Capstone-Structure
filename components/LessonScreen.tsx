
import React, { useState } from 'react';
import { Lesson, Question } from '../types';

interface LessonScreenProps {
  lesson: Lesson;
  hearts: number;
  onFinish: (score: number) => void;
  onWrong: () => void;
  onClose: () => void;
}

const LessonScreen: React.FC<LessonScreenProps> = ({ lesson, hearts, onFinish, onWrong, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);

  const question = lesson.questions[currentIdx];

  const handleCheck = () => {
    const isCorrect = selectedOption === question.correctAnswer;
    if (isCorrect) {
      setStatus('correct');
      setScore(s => s + 1);
    } else {
      setStatus('wrong');
      onWrong();
    }
  };

  const handleContinue = () => {
    if (currentIdx < lesson.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setStatus('idle');
    } else {
      onFinish(score / lesson.questions.length);
    }
  };

  if (hearts <= 0) {
    return (
      <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-300">
        <span className="text-9xl mb-6">💔</span>
        <h1 className="text-4xl font-black mb-4 text-[#ff4b4b] uppercase tracking-tighter">Out of Hearts!</h1>
        <p className="text-gray-500 font-bold mb-8 text-xl max-w-md">Time to recharge your portfolio. Re-read the Investment Basics or wait for your hearts to refill!</p>
        <button 
          onClick={onClose}
          className="bg-[#1cb0f6] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest duo-btn-primary w-full max-w-xs"
        >
          Return to Path
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-500">
      {/* Header */}
      <div className="p-6 md:p-10 flex items-center gap-6 max-w-5xl mx-auto w-full">
        <button onClick={onClose} className="text-gray-300 hover:text-gray-500 text-3xl font-black p-2">✕</button>
        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-100">
          <div 
            className="h-full bg-[#58cc02] transition-all duration-700 ease-out" 
            style={{ width: `${((currentIdx) / lesson.questions.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-2 font-black text-[#ff4b4b] text-2xl">
          <span>❤️</span>
          <span>{hearts}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-6">
        <div className="mb-12 w-full flex items-start gap-8">
            <div className="text-6xl md:text-8xl shrink-0 animate-bounce-subtle">🦉</div>
            <div className="p-6 md:p-8 flex-1 font-black text-2xl md:text-3xl text-gray-700 duo-card bg-white leading-tight">
               {question.prompt}
            </div>
        </div>
        
        <div className="w-full grid grid-cols-1 gap-4">
          {question.options?.map((option, idx) => (
            <button
              key={option}
              onClick={() => status === 'idle' && setSelectedOption(option)}
              className={`w-full p-6 text-left border-2 border-b-4 rounded-2xl text-xl font-black transition-all transform active:scale-95 ${
                selectedOption === option 
                  ? 'border-[#84d8ff] bg-[#ddf4ff] text-[#1cb0f6]' 
                  : 'border-[#e5e5e5] hover:bg-gray-50 text-gray-600'
              } ${status !== 'idle' && 'opacity-60 pointer-events-none'}`}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg border-2 border-gray-200 flex items-center justify-center text-sm text-gray-400 shrink-0">
                  {idx + 1}
                </span>
                {option}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Feedback Banner */}
      <div className={`p-8 md:p-12 border-t-2 transition-all duration-500 ease-in-out ${
        status === 'idle' ? 'bg-white border-gray-100' : status === 'correct' ? 'bg-[#d7ffb8] border-[#b8f28b]' : 'bg-[#ffdfe0] border-[#ffc1c1]'
      }`}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {status === 'idle' ? (
            <>
              <div className="hidden md:block"></div>
              <button
                onClick={handleCheck}
                disabled={!selectedOption}
                className={`w-full md:w-auto px-20 py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${
                  selectedOption ? 'duo-btn-success' : 'bg-[#e5e5e5] border-b-4 border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                Check
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl bg-white shadow-sm ${status === 'correct' ? 'text-[#58cc02]' : 'text-[#ff4b4b]'}`}>
                   {status === 'correct' ? '✓' : '✕'}
                </div>
                <div className="text-left">
                  <p className={`text-3xl font-black ${status === 'correct' ? 'text-[#58a700]' : 'text-[#ea2b2b]'}`}>
                    {status === 'correct' ? 'Nicely done!' : 'Correct solution:'}
                  </p>
                  <p className={`text-lg font-bold ${status === 'correct' ? 'text-[#58a700]' : 'text-[#ea2b2b]'}`}>
                    {status === 'correct' ? 'Your brain is profiting! ✨' : question.correctAnswer}
                  </p>
                </div>
              </div>
              <button
                onClick={handleContinue}
                className={`w-full md:w-auto px-20 py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${
                  status === 'correct' ? 'duo-btn-success' : 'bg-[#ff4b4b] border-b-4 border-[#d33131] text-white hover:brightness-110'
                }`}
              >
                Continue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonScreen;
