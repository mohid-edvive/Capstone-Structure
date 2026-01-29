
import React from 'react';

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab, setTab }) => {
  const tabs = [
    { id: 'path', icon: '🏠', label: 'LEARN' },
    { id: 'simulator', icon: '💹', label: 'MARKET' },
    { id: 'tutor', icon: '🦉', label: 'COACH' },
    { id: 'profile', icon: '👤', label: 'PROFILE' }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 border-r-2 border-gray-200 p-4 pt-8 bg-white z-50">
        <div className="px-4 mb-8">
          <h1 className="text-[#1cb0f6] text-3xl font-black tracking-tighter">investingo</h1>
        </div>
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-black text-sm transition-all border-2 ${
                currentTab === tab.id 
                  ? 'bg-[#ddf4ff] border-[#84d8ff] text-[#1cb0f6]' 
                  : 'border-transparent text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-2 py-1 flex justify-around items-center z-50 h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full rounded-lg transition-all ${
              currentTab === tab.id ? 'text-[#1cb0f6]' : 'text-gray-400'
            }`}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className="text-[10px] font-black">{tab.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Navbar;
