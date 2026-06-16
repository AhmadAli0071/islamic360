import { useState, useEffect } from 'react';

interface WazifaData {
  _id: string;
  dayOfYear: number;
  title: { en: string; ur: string };
  arabic: string;
  urdu: string;
  english: string;
  count: number;
  type: string;
  benefit: { en: string; ur: string };
}

export default function WazifaPage({ language }: { language: 'en' | 'ur' }) {
  const [wazifa, setWazifa] = useState<WazifaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadWazifa();
  }, []);

  const loadWazifa = async () => {
    try {
      setLoading(true);
      setError('');
      setCompleted(false);
      const res = await fetch('/api/wazifas/daily');
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setWazifa(json.data);
    } catch {
      setError('Failed to load daily wazifa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 max-w-4xl mx-auto px-4 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-800 text-white rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-heading font-black flex items-center gap-2">
          <span>📿</span>
          <span>{language === 'en' ? 'Daily Wazifa' : 'روزانہ ورد و وظیفہ'}</span>
        </h2>
        <p className="text-xs text-purple-200 mt-1">
          {language === 'en' ? 'Daily spiritual practice for barakah' : 'برکت کے لیے روزانہ کا معمول'}
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="animate-pulse bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-10">
          <p className="text-red-500 text-sm">{error}</p>
          <button onClick={loadWazifa} className="mt-3 px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl cursor-pointer">Retry</button>
        </div>
      )}

      {/* Wazifa Card */}
      {!loading && !error && wazifa && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-5">
          {/* Day & type badge */}
          <div className="flex justify-between items-center">
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-[10px] font-bold rounded-lg">
              {language === 'en' ? `Day ${wazifa.dayOfYear}` : `دن ${wazifa.dayOfYear}`} • {wazifa.type}
            </span>
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-lg">
              {wazifa.count}x
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-heading font-bold text-center text-[var(--primary)] dark:text-[var(--secondary)]">
            {language === 'en' ? wazifa.title.en : wazifa.title.ur}
          </h3>

          {/* Arabic */}
          <p className="text-center text-xl leading-loose font-arabic text-[var(--text-primary)]" dir="rtl">
            {wazifa.arabic}
          </p>

          {/* Translation */}
          <div className="border-t border-[var(--border)] pt-4 space-y-2">
            <p className="text-sm leading-relaxed text-[var(--text-primary)]">
              {language === 'en' ? wazifa.english : wazifa.urdu}
            </p>
          </div>

          {/* Benefit */}
          <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-4">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
              {language === 'en' ? '✨ Benefit' : '✨ فائدہ'}
            </p>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {language === 'en' ? wazifa.benefit.en : wazifa.benefit.ur}
            </p>
          </div>

          {/* Complete button */}
          <div className="text-center space-y-2">
            <button onClick={() => setCompleted(true)}
              className={`px-8 py-3 text-xs font-bold rounded-2xl cursor-pointer transition ${
                completed ? 'bg-emerald-500 text-white' : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]'
              }`}>
              {completed ? '✅ Completed Today' : language === 'en' ? 'Mark as Completed' : 'آج مکمل کیا'}
            </button>
            <div>
              <button onClick={loadWazifa} className="text-[10px] text-[var(--text-secondary)] hover:text-[var(--primary)] cursor-pointer">
                {language === 'en' ? '🔄 Load Another' : '🔄 ایک اور'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
