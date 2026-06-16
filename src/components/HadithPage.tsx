import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface HadithData {
  _id: string;
  dayOfYear: number;
  arabic: string;
  urdu: string;
  english: string;
  narrator: string;
  source: string;
  reference: string;
  explanation: string;
}

export default function HadithPage({ language }: { language: 'en' | 'ur' }) {
  const [hadith, setHadith] = useState<HadithData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'daily' | 'random'>('daily');

  useEffect(() => {
    loadHadith();
  }, []);

  const loadHadith = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await (mode === 'daily' ? api.getDailyHadith() : api.getRandomHadith());
      setHadith(data);
    } catch {
      setError('Failed to load hadith');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (m: 'daily' | 'random') => {
    setMode(m);
    loadHadith();
  };

  return (
    <div className="flex-1 space-y-6 max-w-4xl mx-auto px-4 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-800 to-rose-700 text-white rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-heading font-black flex items-center gap-2">
          <span>📖</span>
          <span>{language === 'en' ? 'Hadith of the Day' : 'حدیث نبوی'}</span>
        </h2>
        <p className="text-xs text-amber-200 mt-1">
          {language === 'en' ? 'Authentic hadith from Sahih collections' : 'صحیح احادیث مبارکہ'}
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button onClick={() => switchMode('daily')}
          className={`px-4 py-2 text-[11px] font-bold rounded-xl transition cursor-pointer ${
            mode === 'daily' ? 'bg-[var(--primary)] text-white shadow-md' : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]'
          }`}>
          {language === 'en' ? '☀️ Daily Hadith' : '☀️ روزانہ حدیث'}
        </button>
        <button onClick={() => switchMode('random')}
          className={`px-4 py-2 text-[11px] font-bold rounded-xl transition cursor-pointer ${
            mode === 'random' ? 'bg-[var(--primary)] text-white shadow-md' : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]'
          }`}>
          {language === 'en' ? '🎲 Random Hadith' : '🎲 تصادفی حدیث'}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="animate-pulse bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-10">
          <p className="text-red-500 text-sm">{error}</p>
          <button onClick={loadHadith} className="mt-3 px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl cursor-pointer">Retry</button>
        </div>
      )}

      {/* Hadith Card */}
      {!loading && !error && hadith && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-5">
          {/* Source badge */}
          <div className="flex justify-between items-center">
            <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-lg">
              {hadith.source} • {hadith.reference}
            </span>
            <span className="text-[10px] text-[var(--text-secondary)]">
              {language === 'en' ? 'Day' : 'دن'} {hadith.dayOfYear}
            </span>
          </div>

          {/* Arabic text */}
          <p className="text-right text-xl leading-loose font-arabic text-[var(--text-primary)]" dir="rtl">
            {hadith.arabic}
          </p>

          {/* Narrator */}
          <p className="text-xs text-[var(--secondary)] font-semibold">
            {language === 'en' ? 'Narrated by' : 'راوی'}: {hadith.narrator}
          </p>

          {/* Translations */}
          <div className="border-t border-[var(--border)] pt-4 space-y-3">
            <p className="text-sm leading-relaxed text-[var(--text-primary)]">
              {language === 'en' ? hadith.english : hadith.urdu}
            </p>
          </div>

          {/* Explanation */}
          {hadith.explanation && (
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-4">
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                {language === 'en' ? '💡 Explanation' : '💡 تشریح'}
              </p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {hadith.explanation}
              </p>
            </div>
          )}

          {/* Refresh */}
          <div className="text-center">
            <button onClick={loadHadith} className="px-5 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[var(--primary-hover)] transition">
              {language === 'en' ? '🔄 Load Another' : '🔄 ایک اور'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
