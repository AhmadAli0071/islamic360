import React, { useState } from 'react';

interface BottomNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: 'en' | 'ur';
}

export default function BottomNavbar({ activeTab, onTabChange, language }: BottomNavbarProps) {
  const [showMore, setShowMore] = useState(false);

  const allTabs = [
    { id: 'home', label: language === 'en' ? 'Home' : 'ہوم', icon: '🏠', badge: false },
    { id: 'prayer', label: language === 'en' ? 'Prayer' : 'نماز', icon: '🕌', badge: false },
    { id: 'duas', label: language === 'en' ? 'Duas' : 'دعائیں', icon: '🤲', badge: false },
    { id: 'hadith', label: language === 'en' ? 'Hadith' : 'حدیث', icon: '📖', badge: false },
    { id: 'wazifa', label: language === 'en' ? 'Wazifa' : 'وظیفہ', icon: '📿', badge: false },
    { id: 'tasbeeh', label: language === 'en' ? 'Tasbeeh' : 'تسبیح', icon: '📿', badge: false },
    { id: 'asma', label: language === 'en' ? 'Names' : 'نام', icon: '🕊️', badge: false },
    { id: 'academy', label: language === 'en' ? 'Academy' : 'کورسز', icon: '📚', badge: true },
    { id: 'calendar', label: language === 'en' ? 'Calendar' : 'کیلنڈر', icon: '📅', badge: false },
    { id: 'history', label: language === 'en' ? 'History' : 'تاریخ', icon: '📖', badge: false },
    { id: 'store', label: language === 'en' ? 'Store' : 'اسٹور', icon: '🛍️', badge: false },
    { id: 'track', label: language === 'en' ? 'Track' : 'ٹریک', icon: '📦', badge: false },
  ];

  const mainTabs = allTabs.slice(0, 4);
  const moreTabs = allTabs.slice(4);

  const handleTabClick = (id: string) => {
    onTabChange(id);
    setShowMore(false);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-[var(--border)] shadow-xl flex items-center justify-around z-40 pb-safe transition-colors duration-300">
        {mainTabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
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

        <button
          onClick={() => setShowMore(!showMore)}
          className={`flex flex-col items-center justify-center w-14 h-full cursor-pointer select-none transition-all active:scale-95 duration-100 ${
            showMore ? 'text-emerald-700 dark:text-amber-400' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <span className="text-xl block">{showMore ? '✕' : '•••'}</span>
          <span className="text-[9px] mt-0.5 tracking-tight font-heading">{language === 'en' ? 'More' : 'مزید'}</span>
        </button>
      </nav>

      {showMore && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setShowMore(false)}
        >
          <div
            className="fixed bottom-16 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl p-4 pb-8 z-40 animate-slideUp"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
            <div className="grid grid-cols-4 gap-3">
              {moreTabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                      isActive ? 'bg-emerald-50 dark:bg-amber-900/20 text-emerald-700 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-2xl">{tab.icon}</span>
                    <span className="text-[10px] font-medium text-center leading-tight">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
