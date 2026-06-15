import React, { useState, useRef, useEffect } from 'react';
import { CITIES_DB } from '../prayerData';
import { CityData } from '../types';

interface HeaderProps {
  currentCity: CityData;
  onCityChange: (city: CityData) => void;
  darkMode: boolean;
  onThemeToggle: () => void;
  language: 'en' | 'ur';
  onLanguageChange: (lang: 'en' | 'ur') => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({
  currentCity,
  onCityChange,
  darkMode,
  onThemeToggle,
  language,
  onLanguageChange,
  activeTab,
  onTabChange
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCities = CITIES_DB.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAutoDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Find closest city in our preset database for demonstration
          // Alternatively, create a local simulated city
          const closest = CITIES_DB[0]; // defaults to Mecca or Karachi
          onCityChange(closest);
          alert(`Auto-detected coordinates near: Lat ${position.coords.latitude.toFixed(2)}, Lng ${position.coords.longitude.toFixed(2)}. Selected ${closest.name}.`);
          setDropdownOpen(false);
        },
        () => {
          alert("Unable to retrieve location. Defaulting to Mecca.");
          onCityChange(CITIES_DB[0]);
          setDropdownOpen(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail) {
      setIsLogged(true);
      setSignUpOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--header-bg)] border-b border-[var(--border)] shadow-sm backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* LOGO */}
        <div 
          onClick={() => onTabChange('home')}
          className="flex items-center space-x-2.5 cursor-pointer select-none group"
        >
          <div className="bg-[var(--primary)] text-white p-2 rounded-xl shadow-md transition-all duration-300 group-hover:scale-105">
            <svg className="w-6 h-6 fill-current text-[var(--secondary)]" viewBox="0 0 24 24">
              <path d="M12,2A10,10 0 0,0 2,12C2,16.58 5.03,20.46 9.17,21.75C9.06,21.31 9,20.84 9,20.35C9,17.44 11.23,15.06 14.11,14.54C14.04,14.2 14,13.85 14,13.5C14,11.57 15.57,10 17.5,10C18.15,10 18.76,10.18 19.29,10.48C19.75,8.19 19.34,5.77 17.83,4.26C16.89,3.32 15.65,2.78 14.33,2.54C13.89,2.19 13.33,2 12,2M12,4C14.5,4 16,5 17,6C15.5,7 14,8.5 14,11C14,11.5 14.1,12 14.3,12.5C13,12.8 12,14 12,15.5C12,17 13.1,18.1 14.5,18.3C13.5,19 12.8,20 12.5,21.3C12.3,21.3 12.2,21.3 12,21.3C7.97,21.3 4.7,18 4.7,14C4.7,9.97 7.97,6.7 12,6.7C13.5,6.7 14.8,7.2 15.8,8C15.8,5.5 14.2,4 12,4Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold font-heading text-[var(--primary)] dark:text-[var(--secondary)] flex items-center gap-1 leading-none tracking-tight">
              Theislamic360
            </h1>
            <span className="text-[10px] font-medium tracking-widest text-[var(--secondary)] dark:text-gray-400 uppercase leading-none mt-1 block">
              {language === 'en' ? 'Islamic Lifestyle' : 'اسلامک لائف اسٹائل'}
            </span>
          </div>
        </div>

        {/* CITY SELECTOR dropdown inside Header */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--primary)] focus:outline-none cursor-pointer transition-all shadow-sm"
          >
            <span role="img" aria-label="location" className="text-xs">📍</span>
            <span className="max-w-[100px] truncate">{currentCity.name}, {currentCity.country}</span>
            <svg className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-[var(--border)] animate-fadeIn">
              <div className="p-2">
                <input
                  type="text"
                  placeholder={language === 'en' ? "Search city..." : "شہر تلاش کریں..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="max-h-56 overflow-y-auto py-1">
                <button
                  onClick={handleAutoDetect}
                  className="w-full text-left px-4 py-2 text-xs flex items-center space-x-2 text-[var(--primary)] dark:text-[var(--secondary)] hover:bg-[var(--background)] transition"
                >
                  <span className="text-sm">🌐</span>
                  <span className="font-semibold">{language === 'en' ? 'Auto-Detect Location' : 'اپنی لوکیشن تلاش کریں'}</span>
                </button>

                {filteredCities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => {
                      onCityChange(city);
                      setDropdownOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-[var(--background)] transition-colors ${
                      currentCity.name === city.name ? 'bg-[var(--background)] font-semibold text-[var(--primary)]' : 'text-[var(--text-primary)]'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{city.name}</div>
                      <div className="text-[10px] text-[var(--text-secondary)]">{city.country}</div>
                    </div>
                    {currentCity.name === city.name && (
                      <span className="text-xs text-[var(--primary)] dark:text-[var(--secondary)]">✓</span>
                    )}
                  </button>
                ))}

                {filteredCities.length === 0 && (
                  <div className="px-4 py-3 text-xs text-center text-gray-400">
                    No cities found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* CONTROLS (Lang, Theme, Auth) */}
        <div className="flex items-center space-x-2.5 sm:space-x-4">
          
          {/* LANGAUGE SELECTOR */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'ur' : 'en')}
            className="px-2 py-1 text-xs font-bold rounded-md bg-[var(--background)] text-[var(--text-primary)] hover:bg-[var(--border)] border border-[var(--border)] cursor-pointer select-none transition"
            title="Switch Language"
          >
            {language === 'en' ? 'اردو' : 'EN'}
          </button>

          {/* THEME TOGGLE */}
          <button
            onClick={onThemeToggle}
            className="p-1.5 rounded-lg bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--border)] cursor-pointer transition"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? (
              <svg className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 24 24">
                <path d="M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,2A1,1 0 0,1 13,3V4A1,1 0 0,1 12,5A1,1 0 0,1 11,4V3A1,1 0 0,1 12,2M12,19A1,1 0 0,1 13,20V21A1,1 0 0,1 12,22A1,1 0 0,1 11,21V20A1,1 0 0,1 12,19M2,12A1,1 0 0,1 3,11H4A1,1 0 0,1 5,12A1,1 0 0,1 4,13H3A1,1 0 0,1 2,12M19,12A1,1 0 0,1 20,11H21A1,1 0 0,1 22,12A1,1 0 0,1 21,13H20A1,1 0 0,1 19,12M6.27,5.17A1,1 0 0,1 7.68,5.17L8.39,5.88A1,1 0 0,1 8.39,7.29A1,1 0 0,1 7.68,7.29L6.97,6.58A1,1 0 0,1 6.27,5.17M15.61,16.71A1,1 0 0,1 17.02,16.71L17.73,17.42A1,1 0 0,1 17.73,18.83A1,1 0 0,1 17.02,18.83L16.31,18.12A1,1 0 0,1 15.61,16.71M7.68,18.83A1,1 0 0,1 6.27,18.83L5.56,18.12A1,1 0 0,1 5.56,16.71A1,1 0 0,1 6.27,16.71L6.98,17.42A1,1 0 0,1 7.68,18.83M17.73,7.29A1,1 0 0,1 16.31,7.29L15.6,6.58A1,1 0 0,1 15.6,5.17A1,1 0 0,1 17.01,5.17L17.72,5.88A1,1 0 0,1 17.73,7.29Z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600 fill-current" viewBox="0 0 24 24">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20V4Z" />
              </svg>
            )}
          </button>

          {/* SIGN IN / USER ACTION */}
          {isLogged ? (
            <button
              onClick={() => setIsLogged(false)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 text-xs font-semibold cursor-pointer transition shadow-sm"
              title="Dashboard - Click to Logout"
            >
              <span>👤</span>
              <span className="hidden sm:inline">Profile</span>
            </button>
          ) : (
            <button
              onClick={() => setSignUpOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] text-xs font-semibold cursor-pointer transition shadow-sm"
            >
              <span className="text-xs">🔑</span>
              <span className="hidden sm:inline">{language === 'en' ? 'Join Portal' : 'لاگ ان'}</span>
            </button>
          )}

        </div>
      </div>

      {/* LOGIN MODAL */}
      {signUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSignUpOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer text-lg font-bold"
            >
              ✕
            </button>
            <div className="text-center mb-5">
              <span className="text-4xl">🕌</span>
              <h3 className="font-heading font-bold text-lg mt-2 text-[var(--primary)] dark:text-[var(--secondary)]">
                {language === 'en' ? 'Join Theislamic360 Platform' : 'دی اسلامک 360 پورٹل'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {language === 'en' ? 'Save premium alerts and book trial Quran classes.' : 'مفت ٹرائل کلاس اور دعائیں بک کریں۔'}
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Passphrase</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={userPassword}
                  onChange={e => setUserPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[var(--primary)] focus:ring-[var(--primary)]" />
                  <span>Remember me</span>
                </label>
                <a href="#reset" className="hover:underline">Forgot?</a>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] font-bold text-xs transition duration-200"
              >
                Create Account & Log In
              </button>
            </form>

            <div className="mt-4 text-center text-[10px] text-[var(--text-secondary)] border-t border-[var(--border)] pt-3">
              We never pitch or sell your personal statistics. Your logs are secure.
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
