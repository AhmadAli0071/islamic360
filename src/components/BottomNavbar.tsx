import React from 'react';

interface BottomNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: 'en' | 'ur';
}

export default function BottomNavbar({ activeTab, onTabChange, language }: BottomNavbarProps) {
  const tabs = [
    { id: 'home', label: language === 'en' ? 'Home' : 'ہوم', icon: '🏠', badge: false },
    { id: 'prayer', label: language === 'en' ? 'Prayer' : 'نماز', icon: '🕌', badge: false },
    { id: 'qibla', label: language === 'en' ? 'Qibla' : 'قبلہ', icon: '🧭', badge: false },
    { id: 'academy', label: language === 'en' ? 'Academy' : 'کورسز', icon: '📚', badge: true }, // Red dot indicator for courses
    { id: 'calendar', label: language === 'en' ? 'Calendar' : 'کیلنڈر', icon: '📅', badge: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-[var(--border)] shadow-xl flex items-center justify-around z-40 pb-safe transition-colors duration-300">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-14 h-full cursor-pointer select-none transition-all active:scale-95 duration-100 ${
              isActive ? 'text-emerald-700 dark:text-amber-400 font-semibold' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <div className="relative">
              <span className={`text-xl block transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              {tab.badge && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </div>
            <span className="text-[9px] mt-0.5 tracking-tight font-heading">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
