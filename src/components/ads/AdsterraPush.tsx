import { useState, useEffect } from 'react';
import { AD_CONFIG } from '../../config/ads';
import { canShowPushNotification, markPushShown } from '../../hooks/useAdNetwork';

export default function AdsterraPush({ language }: { language: 'en' | 'ur' }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!AD_CONFIG.adsterra.enabled || AD_CONFIG.global.testingMode) return;

    // Show push prompt after 10 seconds, if eligible
    const timer = setTimeout(() => {
      if (canShowPushNotification() && !localStorage.getItem('adsterra_push_dismissed')) {
        setShowPrompt(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleAllow = () => {
    markPushShown();
    setShowPrompt(false);
    setDismissed(true);

    // Initialize Adsterra push
    if (AD_CONFIG.adsterra.push.scriptSrc) {
      const script = document.createElement('script');
      script.src = AD_CONFIG.adsterra.push.scriptSrc;
      script.async = true;
      document.head.appendChild(script);
    }
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
