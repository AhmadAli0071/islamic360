import { useState, useEffect } from 'react';

export default function AdsterraPush({ language }: { language: 'en' | 'ur' }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('adsterra_push_dismissed')) return;

    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleAllow = () => {
    setShowPrompt(false);
    setDismissed(true);
    var s = document.createElement('script');
    s.src = 'https://pl29776408.effectivecpmnetwork.com/d1/4c/d4/d14cd465b50dc1e91f19c4bf35f97498.js';
    document.head.appendChild(s);
  };

  const handleDismiss = () => {
    localStorage.setItem('adsterra_push_dismissed', 'true');
    setShowPrompt(false);
    setDismissed(true);
  };

  if (!showPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-80 z-50 animate-slideUp">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🕌</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[var(--text-primary)]">
              {language === 'en' ? 'Prayer & Islamic Notifications' : 'نماز اور اسلامی اطلاعات'}
            </p>
            <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">
              {language === 'en'
                ? 'Get prayer times, hadith & daily wazifa alerts'
                : 'نماز کے اوقات، حدیث اور روزانہ وظیفہ کے اطلاع حاصل کریں'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleAllow}
            className="flex-1 py-2 bg-[var(--primary)] text-white text-[11px] font-bold rounded-xl cursor-pointer hover:bg-[var(--primary-hover)] transition">
            {language === 'en' ? '✅ Allow Notifications' : '✅ اطلاع کی اجازت دیں'}
          </button>
          <button onClick={handleDismiss}
            className="px-3 py-2 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition">
            {language === 'en' ? 'Later' : 'بعد میں'}
          </button>
        </div>
      </div>
    </div>
  );
}
