import React, { useState, useEffect } from 'react';
import { CityData, AcademicCourse, HistoryEvent } from '../types';
import { ACADEMY_COURSES, HISTORY_EVENTS, UPCOMING_EVENTS, getHijriDateString, getFullDayName } from '../prayerData';
import AdContainer from './AdContainer';

interface HomepageProps {
  currentCity: CityData;
  language: 'en' | 'ur';
  onTabChange: (tab: string) => void;
  onSelectHistoryEvent: (event: HistoryEvent) => void;
  onSetRemindEvent: (name: string) => void;
}

export default function Homepage({
  currentCity,
  language,
  onTabChange,
  onSelectHistoryEvent,
  onSetRemindEvent
}: HomepageProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Real-time ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute Prayer States for Today
  const getPrayersList = (city: CityData) => {
    return [
      { name: 'Fajr', arabic: 'الفجر', time: city.fajr, icon: '🌅' },
      { name: 'Sunrise', arabic: 'الشروق', time: city.sunrise, icon: '☀️' },
      { name: 'Dhuhr', arabic: 'الظهر', time: city.dhuhr, icon: '☀️' },
      { name: 'Asr', arabic: 'العصر', time: city.asr, icon: '⛅' },
      { name: 'Maghrib', arabic: 'المغرب', time: city.maghrib, icon: '🌇' },
      { name: 'Isha', arabic: 'العشاء', time: city.isha, icon: '🌙' },
    ];
  };

  const prayers = getPrayersList(currentCity);

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
  const historyEventPreview = HISTORY_EVENTS.find(e => e.hijriDate.includes('29 Dhul-Hijjah') || e.hijriDate.includes('7 Muharram')) || HISTORY_EVENTS[0];

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16">
      
      {/* 2. HERO SECTION - NEXT PRAYER CARD */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-800 text-white p-6 md:p-8 shadow-xl transition-all duration-300">
        {/* Subtle geometric pattern placeholder */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
            <g fill="#FFF" fillOpacity="0.4">
              <path d="M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8/3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8/3.582 8 8 8z" />
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
              {getHijriDateString(currentTime)}
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
            onClick={() => {
              onSelectHistoryEvent(historyEventPreview);
              onTabChange('history');
            }}
            className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-600 dark:text-amber-400 hover:underline cursor-pointer pt-1"
          >
            <span>{language === 'en' ? 'Explore details & Amal' : 'پورا واقعہ پڑھیں اور دعائیں'}</span>
            <span>→</span>
          </button>
        </div>
      </section>

      {/* 8. RECOMMENDED AMAL FOR TODAY */}
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
              Ask for Patience & Forgiveness (Ahl al-Bayt remembrance)
            </div>
            
            <p className="text-base font-arabic font-bold text-emerald-800 dark:text-amber-400 text-center leading-relaxed py-2">
              إِنَّا لِلَّٰهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ. اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا
            </p>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic border-t border-[var(--border)] pt-2">
              "Indeed we belong to Allah, and indeed we shall return to Him. O Allah, reward me in my affliction and compensate me with something better than it."
            </p>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => handlePlayAudio('recite-1')}
                className="flex items-center space-x-1 text-[11px] text-emerald-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                <span>{playingAudio === 'recite-1' ? '⏸️ Stop Recitation' : '🔊 Listen To Recitation'}</span>
              </button>

              <button
                onClick={() => handleCopyText('إِنَّا لِلَّٰهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ. اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا', 'recite-1')}
                className="flex items-center space-x-1 text-[11px] text-amber-600 hover:underline cursor-pointer font-medium"
              >
                <span>{copyStatus === 'recite-1' ? '✓ Copied' : '📋 Copy Arabic Dua'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

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
          onClick={() => onTabChange('qibla')}
          className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xs text-center group"
        >
          <span className="text-2xl mb-1.5 block transition-transform group-hover:rotate-12">🧭</span>
          <span className="text-xs font-bold block text-[var(--text-primary)]">Qibla Finder</span>
          <span className="text-[9px] text-[var(--text-secondary)] mt-0.5">Live Compass Degree</span>
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

      {/* 11. FEATURED QURAN COURSES */}
      <section className="space-y-4">
        <div className="flex justify-between items-baseline">
          <h3 className="font-heading font-bold text-base flex items-center space-x-2">
            <span>🎓</span>
            <span>{language === 'en' ? 'Featured Quran Courses' : 'قرآنی علوم کے کورسز'}</span>
          </h3>
          <button 
            onClick={() => onTabChange('academy')}
            className="text-xs font-semibold text-emerald-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            {language === 'en' ? 'View all programs' : 'تمام کورسز دیکھیں'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ACADEMY_COURSES.map(course => (
            <div 
              key={course.id} 
              className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group relative"
            >
              {course.isFreeTrial && (
                <span className="absolute top-3.5 right-3.5 z-10 bg-amber-500 text-emerald-950 text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-xs">
                  Free Trial Class
                </span>
              )}
              
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={course.image} 
                  alt={course.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    {course.tag}
                  </span>
                  <h4 className="text-white text-xs font-arabic mt-0.5 leading-none">
                    {course.arabicTitle}
                  </h4>
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold leading-tight line-clamp-1 group-hover:text-[var(--primary)] dark:group-hover:text-amber-400 transition">
                    {course.title}
                  </h5>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-[10px] text-gray-400 border-t border-[var(--border)] pt-2">
                    <span className="flex items-center space-x-1">
                      <span>⏱️</span>
                      <span>{course.duration}</span>
                    </span>
                    <span className="font-bold text-amber-500">
                      ★ {course.rating.toFixed(1)} ({course.studentsCount} Students)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block leading-none">Tuition Cost</span>
                      <span className="text-xs font-black text-emerald-700 dark:text-amber-400">{course.price}</span>
                    </div>

                    <button
                      onClick={() => onTabChange('academy')}
                      className="px-3.5 py-1.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-[10px] font-bold transition cursor-pointer"
                    >
                      Book Free Seat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 12. AD PLACEMENT 4 - BETWEEN CONTENT */}
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
