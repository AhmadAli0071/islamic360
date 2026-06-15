import React, { useState } from 'react';
import { HISTORY_EVENTS } from '../prayerData';
import { HistoryEvent } from '../types';
import AdContainer from './AdContainer';

interface IslamicHistoryProps {
  language: 'en' | 'ur';
  selectedEvent: HistoryEvent | null;
  onSelectEvent: (event: HistoryEvent) => void;
}

export default function IslamicHistory({ language, selectedEvent, onSelectEvent }: IslamicHistoryProps) {
  const activeEvent = selectedEvent || HISTORY_EVENTS[0];
  
  // Audio Player Simulation States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(12); // simulated elapsed
  const totalDuration = 180; // simulated total seconds (3m)

  const handleAudioToggle = () => {
    setIsPlaying(!isPlaying);
  };

  // Copy support
  const [copyState, setCopyState] = useState<string | null>(null);
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyState(id);
    setTimeout(() => setCopyState(null), 3500);
  };

  // Format audio seconds to mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const handleShare = (network: string) => {
    const shareUrl = window.location.href;
    const shareText = `Check out "${activeEvent.title}" on Theislamic360!`;
    navigator.clipboard.writeText(`${shareText} - ${shareUrl}`);
    alert(`Link compiled for ${network}! Public URL copied to clipboard.`);
  };

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16">
      
      {/* PAGE INTRO HEADER */}
      <section className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl p-5 shadow-sm transition-colors duration-300">
        <h2 className="text-xl font-heading font-black text-[var(--primary)] dark:text-[var(--secondary)] flex items-center space-x-2">
          <span>📖</span>
          <span>{language === 'en' ? 'Today in Islamic History & Amal' : 'تاریخ اسلامی اور مسنون اعمال'}</span>
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Explore verified events, scholarly timelines, and recommended supplications recorded across historical Islamic centuries.
        </p>
      </section>

      {/* TWO PANEL COLUMNS LIST/DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT HISTORICAL EVENT SELECTOR NAVIGATION */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-xs uppercase text-gray-400 tracking-widest pl-1">
            Historical Records
          </h3>
          
          <div className="space-y-3">
            {HISTORY_EVENTS.map(ev => {
              const isActive = activeEvent.id === ev.id;
              return (
                <button
                  key={ev.id}
                  onClick={() => {
                    onSelectEvent(ev);
                    setIsPlaying(false);
                    setCurrentTime(12);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-600 text-[var(--primary)] dark:text-amber-400 font-bold shadow-xs'
                      : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--primary)]'
                  }`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-500 font-heading">
                      {ev.hijriDate}
                    </span>
                    <span className="text-[9px] text-gray-400 font-mono">Verified</span>
                  </div>
                  <h4 className="text-xs font-semibold leading-tight line-clamp-1">{ev.title}</h4>
                  <p className="text-[10px] text-[var(--text-secondary)] font-normal line-clamp-2 mt-1 leading-relaxed">
                    {ev.shortDescription}
                  </p>
                </button>
              );
            })}
          </div>

          {/* AD: Sidebar below selectors */}
          <AdContainer id="ad-history-amal" size="300x250 Medium Rect" type="native" />
        </div>

        {/* RIGHT CONTENT PANEL (DETAILS, AUDIO RECITER AND COPY DUA) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* ARTICLE CONTENT CARD */}
          <article className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-5 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[var(--border)] pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  {activeEvent.hijriDate} Historic Day
                </span>
                <h3 className="text-xl font-heading font-black text-[var(--text-primary)] mt-1.5 leading-tight">
                  {activeEvent.title}
                </h3>
              </div>
              
              <div className="text-xs text-gray-400 dark:text-gray-500 font-medium sm:text-right shrink-0">
                Timeline context:<br/>
                <span className="font-bold text-amber-600 dark:text-amber-400">{activeEvent.gregorianDate} Reference</span>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-line text-justify">
              {activeEvent.fullDescription}
            </p>

            <div className="p-4 bg-[var(--background)] rounded-xl border border-[var(--border)] space-y-1.5">
              <span className="text-[9px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 block">Historic Lessons & Impact</span>
              <p className="text-xs text-[var(--text-primary)] leading-relaxed italic">
                "{activeEvent.impact}"
              </p>
            </div>

            {/* SHARE OVERLAY WRAPPERS */}
            <div className="flex items-center space-x-3 text-xs pt-2">
              <span className="font-bold text-[var(--text-secondary)]">Share Day:</span>
              <button onClick={() => handleShare('WhatsApp')} className="p-1 px-2 text-[11px] rounded bg-green-500/10 hover:bg-green-500/20 text-green-600 font-semibold cursor-pointer">WhatsApp</button>
              <button onClick={() => handleShare('Telegram')} className="p-1 px-2 text-[11px] rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 font-semibold cursor-pointer">Telegram</button>
              <button onClick={() => handleShare('Twitter')} className="p-1 px-2 text-[11px] rounded bg-gray-500/10 hover:bg-gray-500/20 text-gray-600 dark:text-gray-200 font-semibold cursor-pointer">Twitter</button>
            </div>
          </article>

          {/* AD PLACEMENT: In-content */}
          <AdContainer id="ad-history-content" size="728x90 Inline Placing" type="leaderboard" />

          {/* RECOMMENDED AMAL LIST */}
          <section className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm text-[var(--primary)] dark:text-amber-400 flex items-center space-x-2">
              <span>🤲</span>
              <span>Prophetic Amal for {activeEvent.hijriDate}</span>
            </h3>

            <div className="space-y-3 text-[11px] text-[var(--text-secondary)]">
              {activeEvent.amal.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)]">
                  <span className="font-bold text-amber-500 text-xs">0{idx+1}</span>
                  <p className="leading-relaxed text-[var(--text-primary)]">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* DUA PANEL AND INTERACTIVE AUDIO RECITER CONTAINER */}
          {activeEvent.duaArabic && (
            <section className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-5 transition-colors duration-300">
              <div className="flex justify-between items-baseline border-b border-[var(--border)] pb-3">
                <h3 className="font-heading font-bold text-sm text-[var(--primary)] dark:text-amber-400 flex items-center space-x-2">
                  <span>📖</span>
                  <span>Supplication (Dua) for the trial</span>
                </h3>
                
                <button
                  onClick={() => handleCopyText(`${activeEvent.duaArabic}\n${activeEvent.duaTranslation}`, 'dua-copy')}
                  className="text-[11px] text-amber-600 hover:underline cursor-pointer font-bold uppercase tracking-wider"
                >
                  {copyState === 'dua-copy' ? '✓ Supplication Copied!' : '📋 Copy Text'}
                </button>
              </div>

              <div className="bg-[var(--background)] rounded-xl p-5 text-center space-y-4 shadow-inner">
                <p className="text-xl md:text-2xl font-arabic font-bold text-emerald-800 dark:text-amber-400 leading-wider">
                  {activeEvent.duaArabic}
                </p>

                <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed border-t border-[var(--border)] pt-3.5">
                  {activeEvent.duaTranslation}
                </p>
              </div>

              {/* AUDIO PLAYER MODULE */}
              <div className="border border-[var(--border)] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--background)]">
                <div className="flex items-center space-x-3.5 w-full sm:w-auto">
                  <button
                    onClick={handleAudioToggle}
                    className="w-10 h-10 rounded-full bg-[var(--primary)] text-white hover:scale-105 transition flex items-center justify-center cursor-pointer text-sm shadow-md"
                    title={isPlaying ? "Pause Recitation" : "Listen Recitation"}
                  >
                    {isPlaying ? '⏸️' : '▶️'}
                  </button>
                  <div>
                    <span className="text-xs font-bold block">Auditory Recitation</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5 leading-none">Sheikh Mahmoud Khalil Al-Husary recites</span>
                  </div>
                </div>

                {/* Simulated Seek Bar */}
                <div className="flex-1 w-full mx-1 space-y-1">
                  <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden relative">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-300" 
                      style={{ width: `${(currentTime / totalDuration) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(totalDuration)}</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* RELATED ARTICLES MODULE */}
          <section className="space-y-3">
            <h4 className="font-heading font-black text-xs uppercase text-gray-400 tracking-widest pl-1">Related Scholarly Reading</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="#learn-muharram" className="p-4 bg-[var(--surface)] text-[var(--test-primary)] border border-[var(--border)] rounded-xl hover:border-[var(--primary)] transition flex items-start gap-3">
                <span className="text-xl">🕌</span>
                <div>
                  <h5 className="text-xs font-bold">The Spiritual Legacy of Ashura fasting</h5>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">Understanding rules of fasting on 9th and 10th Muharram according to verified prophetic actions.</p>
                </div>
              </a>
              <a href="#learn-ibrahim" className="p-4 bg-[var(--surface)] text-[var(--test-primary)] border border-[var(--border)] rounded-xl hover:border-[var(--primary)] transition flex items-start gap-3">
                <span className="text-xl">🕋</span>
                <div>
                  <h5 className="text-xs font-bold">Raising foundations of the Holy Kaaba</h5>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">A complete historic review based on Holy Quran verses of Surah Al-Baqarah detailing construction.</p>
                </div>
              </a>
            </div>
          </section>

        </div>

      </div>

    </div>
  );
}
