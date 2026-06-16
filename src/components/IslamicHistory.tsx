import { useState, useEffect } from 'react';
import AdContainer from './AdContainer';
import { api } from '../services/api';

interface HistoryEventData {
  _id: string;
  month: string;
  day: number;
  title: { en: string; ur: string };
  type: string;
  description: { en: string; ur: string };
  amal?: string[];
  duas?: { arabic: string; urdu: string; transliteration: string }[];
}

interface TodayData {
  hijriDate: { monthNumber: number; monthName: string; day: number; year: number; full: string; fullAr: string };
  events: HistoryEventData[];
}

export default function IslamicHistory({ language }: { language: 'en' | 'ur' }) {
  const [todayData, setTodayData] = useState<TodayData | null>(null);
  const [activeEvent, setActiveEvent] = useState<HistoryEventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getTodayEvents() as TodayData;
      setTodayData(data);
      if (data.events && data.events.length > 0) {
        setActiveEvent(data.events[0]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const formatMonthName = (monthNumber: number) => {
    const names = ['Muharram', 'Safar', 'Rabi ul Awwal', 'Rabi ul Thani', 'Jumada al Awwal', 'Jumada al Thani', 'Rajab', 'Shaban', 'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah'];
    return names[monthNumber - 1] || '';
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
          <span className="text-3xl">⚠️</span>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
          <button onClick={loadData} className="mt-3 px-4 py-2 bg-red-500 text-white rounded-xl text-xs cursor-pointer">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16">
      {/* HEADER */}
      <section className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
        <h2 className="text-xl font-heading font-black text-[var(--primary)] dark:text-[var(--secondary)] flex items-center space-x-2">
          <span>📖</span>
          <span>{language === 'en' ? 'Today in Islamic History & Amal' : 'تاریخ اسلامی اور مسنون اعمال'}</span>
        </h2>
        {todayData && (
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {todayData.hijriDate.fullAr} — {todayData.hijriDate.full}
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT: EVENT LIST */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-xs uppercase text-gray-400 tracking-widest pl-1">
            {language === 'en' ? 'Today\'s Events' : 'آج کے واقعات'}
          </h3>

          {todayData && todayData.events.length > 0 ? (
            <div className="space-y-3">
              {todayData.events.map((ev) => {
                const isActive = activeEvent?._id === ev._id;
                return (
                  <button
                    key={ev._id}
                    onClick={() => setActiveEvent(ev)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-600 text-[var(--primary)] dark:text-amber-400 font-bold shadow-xs'
                        : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--primary)]'
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-500 font-heading">
                        {ev.month} {ev.day}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                        ev.type.includes('mourning') ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-green-100 dark:bg-green-900/30 text-green-600'
                      }`}>
                        {ev.type}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold leading-tight line-clamp-1">{language === 'en' ? ev.title.en : ev.title.ur}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] font-normal line-clamp-2 mt-1 leading-relaxed">
                      {language === 'en' ? ev.description.en : ev.description.ur}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 border border-dashed border-[var(--border)] rounded-xl text-center">
              <span className="text-2xl">📅</span>
              <p className="text-xs text-gray-400 mt-2">{language === 'en' ? 'No specific events today' : 'آج کوئی خاص واقعہ نہیں'}</p>
            </div>
          )}

          <AdContainer id="ad-history-sidebar" size="300x250 Medium Rect" type="native" />
        </div>

        {/* RIGHT: EVENT DETAIL */}
        <div className="lg:col-span-2 space-y-6">
          {activeEvent ? (
            <>
              <article className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[var(--border)] pb-4">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                      {activeEvent.month} {activeEvent.day}
                    </span>
                    <h3 className="text-xl font-heading font-black text-[var(--text-primary)] mt-1.5 leading-tight">
                      {language === 'en' ? activeEvent.title.en : activeEvent.title.ur}
                    </h3>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded font-bold ${
                    activeEvent.type.includes('mourning') ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                  }`}>
                    {activeEvent.type}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed text-justify">
                  {language === 'en' ? activeEvent.description.en : activeEvent.description.ur}
                </p>

                {/* AMAL */}
                {activeEvent.amal && activeEvent.amal.length > 0 && (
                  <section className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 space-y-3">
                    <h3 className="font-heading font-bold text-sm text-[var(--primary)] dark:text-amber-400 flex items-center space-x-2">
                      <span>🤲</span>
                      <span>{language === 'en' ? 'Recommended Amal' : 'مسنون اعمال'}</span>
                    </h3>
                    <div className="space-y-2">
                      {activeEvent.amal.map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-3 bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)]">
                          <span className="font-bold text-amber-500 text-xs shrink-0">0{idx + 1}</span>
                          <p className="text-[11px] text-[var(--text-primary)] leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* DUAS */}
                {activeEvent.duas && activeEvent.duas.length > 0 && (
                  <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-4">
                    <h3 className="font-heading font-bold text-sm text-[var(--primary)] dark:text-amber-400 flex items-center space-x-2 border-b border-[var(--border)] pb-3">
                      <span>📖</span>
                      <span>{language === 'en' ? 'Duas' : 'دعائیں'}</span>
                    </h3>
                    {activeEvent.duas.map((dua, idx) => (
                      <div key={idx} className="bg-[var(--background)] rounded-xl p-4 text-center space-y-3">
                        <p className="text-lg md:text-xl font-arabic font-bold text-emerald-800 dark:text-amber-400 leading-relaxed">
                          {dua.arabic}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed border-t border-[var(--border)] pt-3">
                          {dua.urdu}
                        </p>
                        {dua.transliteration && (
                          <p className="text-[10px] text-gray-400 font-mono">{dua.transliteration}</p>
                        )}
                      </div>
                    ))}
                  </section>
                )}
              </article>

              <AdContainer id="ad-history-content" size="728x90 Inline" type="leaderboard" />
            </>
          ) : (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-10 text-center">
              <span className="text-4xl">📖</span>
              <p className="text-sm text-gray-400 mt-3">{language === 'en' ? 'Select an event to view details' : 'تفصیل دیکھنے کے لیے کوئی واقعہ منتخب کریں'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
