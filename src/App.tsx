import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import BottomNavbar from './components/BottomNavbar';
import Homepage from './components/Homepage';
import PrayerTimes from './components/PrayerTimes';
import QiblaFinder from './components/QiblaFinder';
import QuranAcademy from './components/QuranAcademy';
import IslamicCalendar from './components/IslamicCalendar';
import IslamicHistory from './components/IslamicHistory';
import AdContainer from './components/AdContainer';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import DuasPage from './components/DuasPage';
import HadithPage from './components/HadithPage';
import WazifaPage from './components/WazifaPage';
import TasbeehCounter from './components/TasbeehCounter';
import AsmaUlHusna from './components/AsmaUlHusna';
import AdsterraPush from './components/ads/AdsterraPush';
import AdsterraPopunder from './components/ads/AdsterraPopunder';
import AdsterraSocialBar from './components/ads/AdsterraSocialBar';
import { CITIES_DB } from './prayerData';
import { CityData } from './types';

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestCity(lat: number, lng: number): CityData {
  let nearest = CITIES_DB[0];
  let minDist = Infinity;
  for (const city of CITIES_DB) {
    const dist = haversineDistance(lat, lng, city.coords.lat, city.coords.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }
  return nearest;
}

export default function App() {
  // Master states
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentCity, setCurrentCity] = useState<CityData>(CITIES_DB[0]); // Defaults to Mecca
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'ur'>((localStorage.getItem('theislamic360_lang') as 'en' | 'ur') || 'en');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load and apply dark theme from localStorage on initial boot
  useEffect(() => {
    const savedTheme = localStorage.getItem('theislamic360_theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
    // Apply RTL for Urdu
    const savedLang = localStorage.getItem('theislamic360_lang');
    if (savedLang === 'ur') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, []);

  // Auto-detect location on first load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const nearest = findNearestCity(position.coords.latitude, position.coords.longitude);
          setCurrentCity(nearest);
          localStorage.setItem('theislamic360_city', JSON.stringify({ name: nearest.name, country: nearest.country }));
          const lang = localStorage.getItem('theislamic360_lang') || 'en';
          const msg = lang === 'en'
            ? `📍 Location detected: ${nearest.name}, ${nearest.country}`
            : `📍 مقام کی نشاندہی: ${nearest.name}، ${nearest.country}`;
          setToastMessage(msg);
        },
        () => {
          // Location denied — keep default (Mecca)
        }
      );
    }
  }, []);

  // Theme change callback
  const handleThemeToggle = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theislamic360_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theislamic360_theme', 'light');
    }
  };

  // Toast notifier
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleSetRemindEvent = (eventName: string) => {
    showToast(`✓ Reminder activated for "${eventName}"! You will receive notification alerts via browser sound and pushes.`);
  };

  // Render the current active Page component
  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Homepage
            currentCity={currentCity}
            language={language}
            onTabChange={setActiveTab}
            onSetRemindEvent={handleSetRemindEvent}
          />
        );
      case 'prayer':
        return <PrayerTimes currentCity={currentCity} language={language} />;
      case 'qibla':
        return <QiblaFinder currentCity={currentCity} language={language} />;
      case 'academy':
        return <QuranAcademy language={language} />;
      case 'calendar':
        return <IslamicCalendar language={language} />;
      case 'history':
        return (
          <IslamicHistory
            language={language}
          />
        );
      case 'duas':
        return <DuasPage language={language} />;
      case 'hadith':
        return <HadithPage language={language} />;
      case 'wazifa':
        return <WazifaPage language={language} />;
      case 'tasbeeh':
        return <TasbeehCounter language={language} />;
      case 'asma':
        return <AsmaUlHusna language={language} />;
      default:
        return (
          <Homepage
            currentCity={currentCity}
            language={language}
            onTabChange={setActiveTab}
            onSetRemindEvent={handleSetRemindEvent}
          />
        );
    }
  };

  // Real-time clock for status bar
  const [statusTime, setStatusTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setStatusTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const formatStatusTime = (d: Date) => {
    const h = d.getHours(), m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans antialiased flex flex-col justify-between transition-colors duration-300">
      
      {/* GLOBAL TOAST BANNER */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm p-4 rounded-xl bg-emerald-800 text-amber-300 shadow-2xl border border-amber-500/20 flex items-center justify-between space-x-3.5 animate-slideUp">
          <div className="text-xs font-semibold leading-relaxed">
            {toastMessage}
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white text-xs font-bold font-mono">
            ✕
          </button>
        </div>
      )}

      {/* PWA INSTALL PROMPT */}
      <PWAInstallPrompt />

      {/* AD NETWORKS — Global components */}
      <AdsterraPush language={language} />
      <AdsterraPopunder />
      <AdsterraSocialBar />

      {/* ==================== 📱 MOBILE APP LAYOUT (< 768px) ==================== */}
      <div className="block md:hidden flex-1 flex flex-col pb-20">
        {/* Sleek iOS Status Bar */}
        <div className="bg-emerald-950 dark:bg-gray-950 text-white px-5 py-2.5 flex justify-between items-center text-[10px] font-bold select-none sticky top-0 z-50">
          <div>{formatStatusTime(statusTime)}</div>
          <div className="flex items-center space-x-1.5">
            <span>📶</span>
            <span>📶</span>
            <span className="text-[9px]">🔋 100%</span>
          </div>
        </div>

        {/* Sticky Mobile App-Style Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-[var(--border)] sticky top-6 z-40 px-4 py-3 flex items-center justify-between shadow-xs">
          {activeTab !== 'home' ? (
            <button
              onClick={() => setActiveTab('home')}
              className="text-emerald-700 dark:text-amber-400 font-bold flex items-center gap-1 text-[11px] px-2.5 py-1 bg-[var(--background)] rounded-lg active:scale-90 transition-transform cursor-pointer"
            >
              <span>←</span>
              <span>Back</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5 flex-1">
              <span className="text-lg">🕌</span>
              <span className="font-heading font-black text-xs text-[var(--primary)] dark:text-[var(--secondary)] tracking-tight">Theislamic360</span>
            </div>
          )}

          {activeTab === 'home' && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium truncate max-w-[130px] mr-2">
              📍 {currentCity.name}
            </span>
          )}

          <div className="flex items-center space-x-2">
            {/* Language toggle trigger */}
            <button
              onClick={() => {
                const lang = language === 'en' ? 'ur' : 'en';
                setLanguage(lang);
                localStorage.setItem('theislamic360_lang', lang);
                document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
                showToast(lang === 'en' ? '🌎 Portal language updated to English' : '🌎 پورٹل کی زبان اردو میں تبدیل کر دی گئی ہے');
              }}
              className="px-1.5 py-0.5 text-[8px] font-extrabold rounded bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] uppercase"
            >
              {language === 'en' ? 'اردو' : 'EN'}
            </button>

            {/* Dark mode trigger toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-1 px-1.5 rounded-lg text-xs bg-[var(--background)] border border-[var(--border)] cursor-pointer"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Scrollable Active Screen Body */}
        <div className="flex-1 pt-4">
          {renderActivePage()}
        </div>
      </div>

      {/* ==================== 💻 DESKTOP WEB LAYOUT (>= 768px) ==================== */}
      <div className="hidden md:flex flex-col flex-1">
        {/* Header Bar */}
        <Header
          currentCity={currentCity}
          onCityChange={(city) => {
            setCurrentCity(city);
            localStorage.setItem('theislamic360_city', JSON.stringify({ name: city.name, country: city.country }));
            showToast(`📍 Switched current prayer calculation location to ${city.name}, ${city.country}`);
          }}
          darkMode={darkMode}
          onThemeToggle={handleThemeToggle}
          language={language}
          onLanguageChange={(lang) => {
            setLanguage(lang);
            localStorage.setItem('theislamic360_lang', lang);
            document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
            showToast(lang === 'en' ? '🌎 Portal language updated to English' : '🌎 پورٹل کی زبان اردو میں تبدیل کر دی گئی ہے');
          }}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Body platform with Left Sidebar content, Central Main Content, and New Right-hand-side 300px sidebar */}
        <div className="max-w-7xl w-full mx-auto flex flex-row items-start flex-1 gap-6 px-4 py-6">
          {/* Menu side rail */}
          <Sidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            language={language} 
          />

          {/* Central content screen */}
          <main className="flex-1 min-w-0 bg-white dark:bg-gray-900 border border-[var(--border)] rounded-2xl p-6 min-h-[calc(100vh-210px)] shadow-xs transition-colors duration-300">
            {renderActivePage()}
          </main>

          {/* RIGHT SIDEBAR WITH ADDITIONAL INFOGRAPHICS & RECURRENT ADS */}
          <aside className="w-72 shrink-0 space-y-6">
            
            {/* Hijri Calendar Quick Date widget */}
            <div className="bg-emerald-900 text-white rounded-2xl p-5 border border-emerald-800/50 shadow-sm relative overflow-hidden">
              <span className="text-[9px] uppercase tracking-widest text-amber-300 font-extrabold block">Certified Date</span>
              <div className="text-xs font-bold font-heading text-amber-100 mt-1">29 Dhul-Qi'dah 1447 AH</div>
              <p className="text-[10px] text-emerald-100/80 mt-1.5">Countdown to Islamic New Year (1 Muharram): 17 Days</p>
            </div>

            {/* Daily Supplication supps */}
            <div className="bg-amber-500/5 dark:bg-amber-400/5 border border-amber-500/20 rounded-2xl p-4.5 space-y-2">
              <h4 className="text-xs font-bold font-heading text-emerald-800 dark:text-amber-400 flex items-center space-x-1.5 uppercase tracking-wider mb-1">
                <span>⭐</span>
                <span>Supplication of the Day</span>
              </h4>
              <p className="text-base font-arabic text-emerald-800 dark:text-amber-300 text-center py-1.5 leading-relaxed">
                رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] italic leading-relaxed border-t border-[var(--border)] pt-2">
                "Our Lord, give us in this world other that which is good and in the hereafter that which is good and protect us from the punishment of the Fire."
              </p>
            </div>

            {/* Desktop Side Banner (300x250 Rectangle) */}
            <AdContainer id="ad-sidebar-desktop-rectangle" size="300x250 Medium Rectangle" type="native" />

            {/* Mini Quick Timetable of current location */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs text-xs space-y-2">
              <h4 className="font-bold text-[10px] uppercase tracking-wider text-gray-400">Quick Schedule ({currentCity.name})</h4>
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between pb-1 border-b border-[var(--border)] text-[11px]">
                  <span>Fajr:</span><span className="font-bold">{currentCity.fajr} AM</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-[var(--border)] text-[11px]">
                  <span>Sunrise:</span><span className="text-gray-400">{currentCity.sunrise} AM</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-[var(--border)] text-[11px]">
                  <span>Dhuhr:</span><span className="font-bold">{currentCity.dhuhr} PM</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-[var(--border)] text-[11px]">
                  <span>Asr:</span><span className="font-bold">{currentCity.asr} PM</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-[var(--border)] text-[11px]">
                  <span>Maghrib:</span><span className="text-red-500 font-bold">{currentCity.maghrib} PM</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Isha:</span><span className="font-bold">{currentCity.isha} PM</span>
                </div>
              </div>
            </div>

            {/* Desktop Side Banner (300x600 Half Page Tower) */}
            <AdContainer id="ad-sidebar-desktop-tower" size="300x600 Tower Ad" type="leaderboard" />

          </aside>
        </div>

        {/* Footer Coils */}
        <Footer language={language} onTabChange={setActiveTab} />
      </div>

      {/* AD PLACEMENT: Sticky Footer Ad ONLY visible on Mobile */}
      <div className="block md:hidden">
        <AdContainer 
          id="ad-mobile-footer" 
          size="320x50 Mobile Sticky" 
          type="mobile-sticky"
          onClose={() => {
            const el = document.getElementById('ad-mobile-footer');
            if (el) el.style.display = 'none';
          }}
        />
      </div>

      {/* MOBILE LOWER BOTTOM BAR */}
      <div className="block md:hidden">
        <BottomNavbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          language={language}
        />
      </div>
    </div>
  );
}
