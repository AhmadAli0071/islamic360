import React, { useState, useEffect } from 'react';
import { CityData, AcademicCourse, HistoryEvent } from '../types';
import { HISTORY_EVENTS, UPCOMING_EVENTS, getHijriDateString, getFullDayName, extractDayMonth, findTodayHistoryEvent } from '../prayerData';
import AdContainer from './AdContainer';

interface PrayerEntry {
  name: string;
  time: string;
}

const PRAYER_META: Record<string, { arabic: string; icon: string }> = {
  Fajr: { arabic: 'الفجر', icon: '🌅' },
  Sunrise: { arabic: 'الشروق', icon: '☀️' },
  Dhuhr: { arabic: 'الظهر', icon: '☀️' },
  Asr: { arabic: 'العصر', icon: '⛅' },
  Maghrib: { arabic: 'المغرب', icon: '🌇' },
  Isha: { arabic: 'العشاء', icon: '🌙' },
};

interface HomepageProps {
  currentCity: CityData;
  language: 'en' | 'ur';
  onTabChange: (tab: string) => void;
  onSetRemindEvent: (name: string) => void;
}

export default function Homepage({
  currentCity,
  language,
  onTabChange,
  onSetRemindEvent
}: HomepageProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayersData, setPrayersData] = useState<PrayerEntry[] | null>(null);
  const [prayersError, setPrayersError] = useState(false);
  const [todayHijri, setTodayHijri] = useState<string>(getHijriDateString(new Date()));
  const [todayEvent, setTodayEvent] = useState<HistoryEvent | undefined>(() => findTodayHistoryEvent(extractDayMonth(getHijriDateString(new Date()))));
  
  // Real-time ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch live prayer times
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/prayers/times?city=${currentCity.name}&country=${currentCity.country}`)
      .then(r => r.json())
      .then(json => {
        if (!cancelled && json.success) setPrayersData(json.data.prayers);
        else if (!cancelled) setPrayersError(true);
      })
      .catch(() => { if (!cancelled) setPrayersError(true); });
    return () => { cancelled = true; };
  }, [currentCity]);

  // Fetch today's Hijri date and match history event
  useEffect(() => {
    let cancelled = false;
    fetch('/api/hijri/today')
      .then(r => r.json())
      .then(json => {
        if (!cancelled && json.success) {
          const hijriStr = json.data.full;
          const dayMonth = extractDayMonth(hijriStr);
          setTodayHijri(hijriStr);
          setTodayEvent(findTodayHistoryEvent(dayMonth));
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Build prayer list from API data
  const prayers: { name: string; arabic: string; time: string; icon: string }[] =
    prayersData
      ? prayersData.map(p => ({ ...p, ...PRAYER_META[p.name] || { arabic: '', icon: '🕌' } }))
      : Object.entries(PRAYER_META).map(([name, meta]) => ({ name, time: '--:--', ...meta }));

  // Parse time strings (HH:MM) to absolute Date representations relative to today
  const getPrayerDate = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const d = new Date(currentTime);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  // Determine current active, next, and elapsed prayer times
  let currentPrayerIndex = -1;
  let nextPrayerIndex = 0;
  
  for (let i = 0; i < prayers.length; i++) {
    const pTime = getPrayerDate(prayers[i].time);
    if (currentTime >= pTime) {
      currentPrayerIndex = i;
    }
  }

  nextPrayerIndex = (currentPrayerIndex + 1) % prayers.length;
  // If we passed Isha, the next is tomorrow's Fajr
  const nextPrayer = prayers[nextPrayerIndex];
  const nextPrayerDate = getPrayerDate(nextPrayer.time);
  if (nextPrayerIndex === 0 && currentTime > getPrayerDate(prayers[prayers.length - 1].time)) {
    nextPrayerDate.setDate(nextPrayerDate.getDate() + 1); // tomorrow
  }

  // Countdown calculations
  const msRemaining = nextPrayerDate.getTime() - currentTime.getTime();
  const secondsRemaining = Math.max(0, Math.floor(msRemaining / 1000));
  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  const formattedCountdown = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Calculate circular countdown progress percentage
  // Assume generic 4h (14400s) average gap between prayers as total time span
  const maxGap = 4 * 60 * 60; 
  const progressRatio = Math.max(0, Math.min(1, secondsRemaining / maxGap));
  const dashOffset = 220 * progressRatio; // 2 * PI * r (approx r=35)

  // Copy support for Recommended Azkar
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 3000);
  };

  // Audio Playback simulation
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const handlePlayAudio = (id: string) => {
    if (playingAudio === id) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(id);
      // Play mock audio player
      const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
      setTimeout(() => setPlayingAudio(null), 8000); // simulated duration
    }
  };

  // Find preview event for Today in History
  const historyEventPreview = todayEvent;

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16">
      
      {/* 2. HERO SECTION - NEXT PRAYER CARD */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-800 text-white p-6 md:p-8 shadow-xl transition-all duration-300">
        {/* Subtle geometric pattern placeholder */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
            <g fill="#FFF" fillOpacity="0.4">
              <path d="M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" />
            </g>
          </svg>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-700/50 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>{language === 'en' ? 'Live Alert' : 'براہ راست الرٹ'}</span>
            </div>
            
            <div className="text-xs text-teal-100 uppercase font-semibold tracking-wider pt-1">
              {language === 'en' ? 'UPCOMING DEVOTIONAL PRAYER' : 'اگلی نماز'}
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tight text-white flex items-baseline gap-2 justify-center md:justify-start">
              {nextPrayer.name}
              <span className="text-lg md:text-2xl font-arabic font-normal text-amber-300">({nextPrayer.arabic})</span>
            </h2>

            <p className="text-sm text-teal-100/90 font-medium">
              {language === 'en' 
                ? `Prayer time is scheduled at ${nextPrayer.time} in ${currentCity.name}` 
                : `${currentCity.name} میں ${nextPrayer.name} کا وقت ${nextPrayer.time} پر ہے`}
            </p>
          </div>

          {/* Center Timer and Progress Ring */}
          <div className="flex items-center space-x-4 md:space-x-6 justify-center">
            <div className="relative flex items-center justify-center">
              {/* SVG Ring */}
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="35" stroke="rgba(255,255,255,0.15)" strokeWidth="6" fill="transparent" />
                <circle
                  cx="48"
                  cy="48"
                  r="35"
                  stroke="#D4AF37"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="220"
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-[10px] text-teal-200 block uppercase tracking-wider leading-none">Remaining</span>
                <span className="text-xs font-bold text-amber-400 leading-none block mt-0.5">
                  {Math.round(progressRatio * 100)}%
                </span>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="text-xs text-teal-200 uppercase tracking-widest">{language === 'en' ? 'Countdown' : 'الٹی گنتی'}</div>
              <div className="text-3xl md:text-4xl font-mono font-bold text-amber-400 tracking-wider mt-1 select-none">
                {formattedCountdown}
              </div>
              <p className="text-[11px] text-teal-200/80 mt-1">
                {language === 'en' ? 'Time ticks to Iqamah' : 'اقامت شروع ہونے کا وقت'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 STORE PROMO CARD */}
      <button onClick={() => onTabChange('store')} className="w-full text-left cursor-pointer group">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900 via-orange-800 to-rose-900 text-white p-5 md:p-6 shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.01]">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
              <pattern id="store-pattern" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
                <circle cx="24" cy="24" r="1" fill="#FFD700" fillOpacity="0.3" />
                <path d="M12 12L36 36M36 12L12 36" stroke="#FFD700" strokeOpacity="0.1" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#store-pattern)" />
            </svg>
          </div>
          <div className="relative flex items-center gap-4 md:gap-6">
            <div className="text-4xl md:text-5xl bg-white/10 rounded-2xl p-3.5 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
              🛍️
            </div>
            <div className="flex-1 space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                <span>{language === 'en' ? 'New' : 'نیا'}</span>
              </div>
              <h3 className="text-lg md:text-xl font-black font-heading tracking-tight">
                {language === 'en' ? 'Islamic 360 Store' : 'اسلامک 360 اسٹور'}
              </h3>
              <p className="text-xs text-amber-200/90 leading-relaxed max-w-md">
                {language === 'en'
                  ? 'Shop premium Islamic products — Books, Attire, Home Decor & more. COD available.'
                  : 'اعلیٰ اسلامی مصنوعات خریدیں — کتب، لباس، گھر کی سجاوٹ اور مزید۔ کوڈ کی سہولت۔'}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-bold bg-white/20 px-3 py-1 rounded-full group-hover:bg-white/30 transition">
                  {language === 'en' ? '🛒 Browse Store →' : '🛒 اسٹور دیکھیں →'}
                </span>
                <span className="text-[10px] text-amber-300/70">{language === 'en' ? 'Cash on Delivery' : 'ڈیلیوری پر ادائیگی'}</span>
              </div>
            </div>
          </div>
        </section>
      </button>

      {/* 3. AD PLACEMENT 1 - LEADERBOARD */}
      <AdContainer id="ad-leaderboard-1" size="728x90 (Desktop) / 320x100 (Mobile)" type="leaderboard" />

      {/* 4. TODAY'S PRAYER TIMES */}
      <section className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl p-5 shadow-sm transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading font-bold text-base flex items-center space-x-2">
            <span>⏰</span>
            <span>{language === 'en' ? 'Today\'s Prayer Schedule' : 'آج نماز کے اوقات'}</span>
          </h3>
          <span className="text-[11px] bg-emerald-50 dark:bg-emerald-950/40 text-[var(--primary)] dark:text-[var(--secondary)] px-2.5 py-1 rounded-full font-medium">
            {currentCity.name} Matrix
          </span>
        </div>

        {/* Column headings */}
        <div className="grid grid-cols-4 text-xs font-bold text-[var(--text-secondary)] border-b border-[var(--border)] pb-2 mb-1 px-3">
          <div className="col-span-2">{language === 'en' ? 'Prayer Name' : 'نماز کا نام'}</div>
          <div className="text-center">{language === 'en' ? 'Schedule' : 'وقت'}</div>
          <div className="text-right">{language === 'en' ? 'Status' : 'حالت'}</div>
        </div>

        <div className="space-y-1.5">
          {prayers.map((p, idx) => {
            const isCurrent = currentPrayerIndex === idx;
            const isCompleted = currentPrayerIndex > idx;
            const isUpcoming = currentPrayerIndex < idx && nextPrayerIndex !== idx;
            const isNext = nextPrayerIndex === idx;

            let statusText = '⬜ Expected';
            let statusClass = 'text-gray-400';
            if (isCurrent) {
              statusText = '🔴 Current';
              statusClass = 'text-red-500 font-bold';
            } else if (isNext) {
              statusText = '⏰ Coming';
              statusClass = 'text-amber-500 font-bold';
            } else if (isCompleted) {
              statusText = '✅ Prayed';
              statusClass = 'text-green-600 dark:text-green-400 font-semibold';
            }

            return (
              <div
                key={p.name}
                className={`grid grid-cols-4 items-center px-4 py-3 rounded-xl transition-all duration-200 border ${
                  isCurrent
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/5 border-emerald-500 text-[var(--primary)] dark:text-[var(--secondary)] font-bold shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-[var(--background)]'
                }`}
              >
                <div className="col-span-2 flex items-center space-x-3">
                  <span className="text-sm">{p.icon}</span>
                  <div>
                    <span className="text-xs font-semibold block">{p.name}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-heading block">{p.arabic}</span>
                  </div>
                </div>
                
                <div className="text-center font-mono text-xs font-semibold text-[var(--text-primary)]">
                  {p.time}
                </div>

                <div className="text-right text-[11px] font-medium">
                  <span className={statusClass}>{statusText}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. ISLAMIC DATE STRIP */}
      <div className="border border-amber-500/20 bg-amber-500/5 dark:bg-amber-400/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-3.5">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🌙</div>
          <div>
            <div className="text-sm font-bold text-amber-700 dark:text-amber-400 font-heading">
              {todayHijri}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              {getFullDayName(currentTime)} • {currentTime.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>
        <div className="px-3.5 py-1 text-[10px] font-semibold border border-amber-500/30 rounded-full text-amber-600 dark:text-amber-400 uppercase tracking-widest leading-none bg-amber-500/10">
          Islamic Hijri Date
        </div>
      </div>

      {/* 6. AD PLACEMENT 2 - CONTENT AD */}
      <AdContainer id="ad-content-1" size="300x250 Rectangle" type="native" />

      {/* 7. TODAY IN ISLAMIC HISTORY (Preview widget) */}
      {historyEventPreview && (
      <section className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl p-5 shadow-sm transition-colors duration-300 relative overflow-hidden">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-heading font-bold text-base flex items-center space-x-2">
            <span>📖</span>
            <span>{language === 'en' ? 'Today in Islamic History' : 'آج کا تاریخی واقعہ'}</span>
          </h3>
          <span className="bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            {historyEventPreview.hijriDate}
          </span>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-[var(--primary)] dark:text-[var(--secondary)]">
            {historyEventPreview.title}
          </h4>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-3">
            {historyEventPreview.shortDescription}
          </p>
          
          <button
            onClick={() => onTabChange('history')}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-600 dark:text-amber-400 hover:underline cursor-pointer pt-1"
          >
            <span>{language === 'en' ? 'Explore details & Amal' : 'پورا واقعہ پڑھیں اور دعائیں'}</span>
            <span>→</span>
          </button>
        </div>
      </section>
      )}

      {/* 8. RECOMMENDED AMAL FOR TODAY */}
      {historyEventPreview && (
      <section className="bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-600/20 rounded-2xl p-5 shadow-sm">
        <h3 className="font-heading font-bold text-base flex items-center space-x-2 mb-3.5">
          <span>🤲</span>
          <span>{language === 'en' ? 'Recommended Amal for Today' : 'آج کے مستحکم اعمال'}</span>
        </h3>

        <div className="space-y-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3.5 space-y-2 relative">
            <span className="absolute -top-2.5 left-3 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider">
              {language === 'en' ? 'Recommended' : 'مسنون عمل'}
            </span>
            <div className="text-xs font-semibold text-[var(--text-primary)] pt-1">
              {historyEventPreview.title}
            </div>

            {historyEventPreview.amal.map((a, i) => (
              <p key={i} className="text-xs text-[var(--text-secondary)] leading-relaxed">{i + 1}. {a}</p>
            ))}

            {historyEventPreview.duaArabic && (
              <>
                <p className="text-base font-arabic font-bold text-emerald-800 dark:text-amber-400 text-center leading-relaxed py-2">
                  {historyEventPreview.duaArabic}
                </p>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic border-t border-[var(--border)] pt-2">
                  {historyEventPreview.duaTranslation}
                </p>
              </>
            )}

            <div className="flex items-center justify-between pt-1">
              {historyEventPreview.audioUrl && (
                <button
                  onClick={() => handlePlayAudio('amal-' + historyEventPreview.id)}
                  className="flex items-center space-x-1 text-[11px] text-emerald-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  <span>{playingAudio === 'amal-' + historyEventPreview.id ? '⏸️ Stop Recitation' : '🔊 Listen To Recitation'}</span>
                </button>
              )}

              {historyEventPreview.duaArabic && (
                <button
                  onClick={() => handleCopyText(historyEventPreview.duaArabic!, 'amal-' + historyEventPreview.id)}
                  className="flex items-center space-x-1 text-[11px] text-amber-600 hover:underline cursor-pointer font-medium"
                >
                  <span>{copyStatus === 'amal-' + historyEventPreview.id ? '✓ Copied' : '📋 Copy Arabic Dua'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* 9. QUICK ACTION BUTTONS Grid of 4 */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <button
          onClick={() => onTabChange('academy')}
          className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xs text-center group"
        >
          <span className="text-2xl mb-1.5 block transition-transform group-hover:scale-110">📚</span>
          <span className="text-xs font-bold block text-[var(--text-primary)]">Quran Academy</span>
          <span className="text-[9px] text-[var(--text-secondary)] mt-0.5">Online Tajweed Programs</span>
        </button>

        <button
          onClick={() => onTabChange('calendar')}
          className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xs text-center group"
        >
          <span className="text-2xl mb-1.5 block transition-transform group-hover:scale-110">📅</span>
          <span className="text-xs font-bold block text-[var(--text-primary)]">Islamic Calendar</span>
          <span className="text-[9px] text-[var(--text-secondary)] mt-0.5">Hijri Event Markers</span>
        </button>

        <button
          onClick={() => onTabChange('prayer')}
          className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xs text-center group"
        >
          <span className="text-2xl mb-1.5 block transition-transform group-hover:scale-110">🕌</span>
          <span className="text-xs font-bold block text-[var(--text-primary)]">Monthly Timetable</span>
          <span className="text-[9px] text-[var(--text-secondary)] mt-0.5">Export Printable PDF</span>
        </button>
      </section>

      {/* 11. AD PLACEMENT 4 - BETWEEN CONTENT */}
      <AdContainer id="ad-content-2" size="728x90 Inline Placement" type="leaderboard" />

      {/* 13. UPCOMING ISLAMIC EVENTS */}
      <section className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-baseline mb-4">
          <h3 className="font-heading font-bold text-base flex items-center space-x-2">
            <span>📅</span>
            <span>{language === 'en' ? 'Upcoming Islamic Commemorations' : 'آنے والے ہجری تہوار'}</span>
          </h3>
          <button
            onClick={() => onTabChange('calendar')}
            className="text-xs font-semibold text-emerald-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            {language === 'en' ? 'View Full Calendar' : 'پورا کیلنڈر دیکھیں'}
          </button>
        </div>

        <div className="space-y-3.5">
          {UPCOMING_EVENTS.map(event => (
            <div 
              key={event.name} 
              className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:border-amber-400 transition"
            >
              <div className="flex items-center space-x-3.5">
                <div className="text-xl">
                  {event.type === 'fard' ? '⚪' : event.type === 'sunnah' ? '🟢' : '🟡'}
                </div>
                <div>
                  <h4 className="text-xs font-bold">{event.name}</h4>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    {event.gregorianDate} • {event.description}
                  </div>
                </div>
              </div>

              <div className="text-right flex items-center space-x-3">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Timeline</span>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 block">
                    {event.daysRemaining === 1 ? 'Tomorrow' : `${event.daysRemaining} days left`}
                  </span>
                </div>

                <button
                  onClick={() => onSetRemindEvent(event.name)}
                  className="p-1.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--border)] text-xs border border-[var(--border)] cursor-pointer"
                  title="Subscribe to alerts"
                >
                  🔔
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
