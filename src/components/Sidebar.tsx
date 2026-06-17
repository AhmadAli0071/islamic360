import React from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: 'en' | 'ur';
}

export default function Sidebar({ activeTab, onTabChange, language }: SidebarProps) {
  const menuItems = [
    { id: 'home', label: language === 'en' ? 'Dashboard Home' : 'مرکزی ڈیش بورڈ', icon: '🏠' },
    { id: 'prayer', label: language === 'en' ? 'Prayer Timetable' : 'نماز کے اوقات', icon: '⏱️' },
    { id: 'duas', label: language === 'en' ? 'Duas & Azkar' : 'دعائیں و اذکار', icon: '🤲' },
    { id: 'hadith', label: language === 'en' ? 'Hadith' : 'حدیث نبوی', icon: '📖' },
    { id: 'wazifa', label: language === 'en' ? 'Daily Wazifa' : 'روزانہ وظیفہ', icon: '📿' },
    { id: 'tasbeeh', label: language === 'en' ? 'Tasbeeh' : 'تسبیح', icon: '📿' },
    { id: 'asma', label: language === 'en' ? '99 Names' : '99 نام', icon: '🕊️' },
    { id: 'academy', label: language === 'en' ? 'Quran Academy' : 'قرآن اکیڈمی', icon: '📚' },
    { id: 'calendar', label: language === 'en' ? 'Islamic Calendar' : 'قمری کیلنڈر', icon: '🗓️' },
    { id: 'history', label: language === 'en' ? 'History & Azkar' : 'تاریخ اور اذکار', icon: '📖' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[var(--surface)] text-[var(--text-primary)] border-r border-[var(--border)] shrink-0 min-h-[calc(100vh-69px)] sticky top-[69px] p-4 transition-colors duration-300">
      <div className="space-y-6">
        
        {/* UPPER CAPTION */}
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-bold block mb-1">
            {language === 'en' ? 'Navigation Hub' : 'سیکشنز فہرست'}
          </span>
          <div className="h-0.5 w-8 bg-amber-500 rounded-full"></div>
        </div>

        {/* NAVIGATION MENUS */}
        <nav className="space-y-1.5 flex-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[var(--primary)] dark:text-[var(--secondary)] border-l-4 border-emerald-700 dark:border-amber-400 font-semibold shadow-sm'
                    : 'text-[var(--text-primary)] hover:bg-[var(--background)]'
                }`}
              >
                <span className={`text-lg transition-transform duration-200 group-hover:scale-110 ${isActive ? 'scale-105' : ''}`}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ACCESSORY DAILY QUOTE FOR DESKTOP SIDEBAR */}
        <div className="bg-amber-500/10 dark:bg-amber-400/5 border border-amber-500/20 rounded-2xl p-4 mt-6">
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold text-xs mb-1">
            <span>💡</span>
            <span>{language === 'en' ? 'Hadith of the Day' : 'آج کی حدیث'}</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] italic leading-relaxed">
            {language === 'en'
              ? '"The most beloved of deeds to Allah are those that are most consistent, even if they are small." (Sahih Al-Bukhari)'
              : '"اللہ کے ہاں سب سے محبوب عمل وہ ہے جو مستقل ہو، خواہ وہ تھوڑا ہی کیوں نہ ہو۔" (صحیح بخاری)'}
          </p>
        </div>

      </div>
    </aside>
  );
}
