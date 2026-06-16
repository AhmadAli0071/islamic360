import { useState, useEffect } from 'react';
import { CityData } from '../types';
import AdContainer from './AdContainer';

interface PrayerTimesProps {
  currentCity: CityData;
  language: 'en' | 'ur';
}

interface PrayerEntry {
  name: string;
  time: string;
}

interface PrayerAPIResponse {
  prayers: PrayerEntry[];
  date: string;
  hijri: { day: string; month: string; monthAr: string; year: string; full: string; fullAr: string };
  gregorian: { date: string; day: string; weekday: { en: string }; month: { number: number }; year: string };
}

export default function PrayerTimes({ currentCity, language }: PrayerTimesProps) {
  const [data, setData] = useState<PrayerAPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrayerTimes();
  }, [currentCity]);

  const fetchPrayerTimes = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/prayers/times?city=${currentCity.name}&country=${currentCity.country}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setData(json.data);
    } catch {
      setError('Failed to load prayer times');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 max-w-5xl mx-auto px-4 pb-16">
        <div className="text-center py-16">
          <p className="text-red-500 text-sm">{error}</p>
          <button onClick={fetchPrayerTimes} className="mt-4 px-5 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl cursor-pointer">Retry</button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const prayers = data.prayers.filter(p => p.name !== 'Sunrise');

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16 animate-fadeIn">
      {/* Today's Summary Card */}
      <section className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-2xl p-5 md:p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-700/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="text-xs text-emerald-300 font-bold uppercase tracking-widest">
          {language === 'en' ? "Today's Summary" : 'آج کا خلاصہ'}
        </div>
        <div className="mt-2">
          <p className="text-lg font-heading font-black">
            {currentCity.name}, {currentCity.country}
          </p>
          <p className="text-sm text-emerald-200">
            {data.date} • {data.hijri.fullAr ? data.hijri.fullAr : data.hijri.full}
          </p>
        </div>
        <p className="text-[10px] text-emerald-100/80 mt-2">
          {language === 'en' ? 'Calculation: Al-Adhan API (Method 1)' : 'حساب: العدھان API'}
        </p>
      </section>

      {/* Prayer Times Grid */}
      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-heading font-bold mb-4 flex items-center gap-2">
          <span>⏱️</span>
          <span>{language === 'en' ? 'Today\'s Prayer Times' : 'آج کے اوقاتِ نماز'}</span>
        </h3>
        <div className="space-y-1">
          {prayers.map(p => (
            <div key={p.name} className="flex justify-between items-center py-2.5 px-3 rounded-xl hover:bg-[var(--background)] transition">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${p.name === 'Fajr' ? 'bg-blue-400' : p.name === 'Dhuhr' ? 'bg-amber-400' : p.name === 'Asr' ? 'bg-orange-400' : p.name === 'Maghrib' ? 'bg-red-400' : 'bg-indigo-400'}`} />
                <span className="text-sm font-semibold">
                  {language === 'en' ? p.name : (
                    p.name === 'Fajr' ? 'فجر' : p.name === 'Dhuhr' ? 'ظہر' : p.name === 'Asr' ? 'عصر' : p.name === 'Maghrib' ? 'مغرب' : 'عشاء'
                  )}
                </span>
              </div>
              <span className="text-sm font-mono font-bold text-[var(--primary)] dark:text-[var(--secondary)]">
                {p.time}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* All prayers table */}
      <section className="overflow-x-auto bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm printable-section">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-[var(--background)] border-b border-[var(--border)] text-left">
              {[
                language === 'en' ? 'Prayer' : 'نماز',
                language === 'en' ? 'Time' : 'وقت',
              ].map(h => (
                <th key={h} className="px-4 py-3 font-bold text-[var(--text-secondary)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {data.prayers.map(p => (
              <tr key={p.name} className="hover:bg-[var(--background)] transition">
                <td className="px-4 py-3 font-semibold">
                  {language === 'en' ? p.name : (
                    p.name === 'Fajr' ? 'فجر' : p.name === 'Sunrise' ? 'طلوع آفتاب' : p.name === 'Dhuhr' ? 'ظہر' : p.name === 'Asr' ? 'عصر' : p.name === 'Maghrib' ? 'مغرب' : 'عشاء'
                  )}
                </td>
                <td className="px-4 py-3 font-mono font-bold">{p.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <AdContainer id="ad-prayer-bottom" size="728x90 Bottom" type="leaderboard" />
    </div>
  );
}
