import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const STORAGE_KEY = 'islamic360_pwa_dismissed';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    // Check if user already dismissed
    if (localStorage.getItem(STORAGE_KEY) === 'true') return;

    // Detect iOS Safari
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    setIsIOS(isIOSDevice);

    // Show the modal immediately on mount (first visit)
    // But give a small delay so page renders first
    const timer = setTimeout(() => setShowModal(true), 1000);

    // Listen for beforeinstallprompt (Chrome/Android)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowModal(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowModal(false);
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Chrome/Android: use the deferred prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
      }
      setDeferredPrompt(null);
      setShowModal(false);
    } else if (isIOS) {
      // iOS: show instructions instead
      return;
    } else {
      // Fallback: try to show the prompt via the beforeinstallprompt event
      setShowModal(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShowModal(false);
    setDeferredPrompt(null);
  };

  if (installed) return null;

  return (
    <>
      {/* OVERLAY */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-sm w-full p-7 shadow-2xl relative overflow-hidden">
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg cursor-pointer"
            >
              ✕
            </button>

            {/* Icon */}
            <div className="text-5xl text-center mb-4">🕌</div>

            {/* Title */}
            <h2 className="text-lg font-heading font-black text-center text-[var(--primary)] dark:text-[var(--secondary)]">
              Install Islamic360 App
            </h2>
            <p className="text-xs text-center text-[var(--text-secondary)] mt-2 leading-relaxed">
              Get prayer times, hadith, duas & daily wazifa with one tap — even offline!
            </p>

            {/* Feature list */}
            <div className="mt-5 space-y-2.5">
              {[
                { icon: '⏱️', text: 'Prayer times with countdown' },
                { icon: '📖', text: 'Daily hadith & duas' },
                { icon: '📿', text: '365 daily wazifas' },
                { icon: '🔔', text: 'Notification alerts' },
              ].map(f => (
                <div key={f.text} className="flex items-center gap-3 text-xs">
                  <span>{f.icon}</span>
                  <span className="text-[var(--text-primary)] font-medium">{f.text}</span>
                </div>
              ))}
            </div>

            {/* iOS instructions (shown only on iOS) */}
            {isIOS && !deferredPrompt && (
              <div className="mt-5 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
                <p className="font-bold">📱 Install on iPhone/iPad:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-[11px]">
                  <li>Tap the <strong>Share</strong> button <span className="text-base">⎙</span></li>
                  <li>Scroll down & tap <strong>"Add to Home Screen"</strong></li>
                  <li>Tap <strong>"Add"</strong> in the top right</li>
                </ol>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-6 space-y-2.5">
              {!isIOS && (
                <button
                  onClick={handleInstall}
                  className="w-full py-3.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-sm rounded-2xl transition cursor-pointer shadow-lg shadow-emerald-900/20"
                >
                  {deferredPrompt ? 'Install App Now' : 'Install App'}
                </button>
              )}
              {isIOS && !deferredPrompt && (
                <button
                  onClick={handleDismiss}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-sm rounded-2xl transition cursor-pointer"
                >
                  I Understand
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="w-full py-2.5 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
