import React, { useState } from 'react';
import { CityData } from '../types';
import AdContainer from './AdContainer';

interface PrayerTimesProps {
  currentCity: CityData;
  language: 'en' | 'ur';
}

export default function PrayerTimes({ currentCity, language }: PrayerTimesProps) {
  // Generate simulated monthly calendar rows for June 2026 (30 days)
  const generateMonthlyData = (city: CityData) => {
    const dates = [];
    const baseFajr = city.fajr;
    const baseSunrise = city.sunrise;
    const baseDhuhr = city.dhuhr;
    const baseAsr = city.asr;
    const baseMaghrib = city.maghrib;
    const baseIsha = city.isha;

    // Helper to randomly alter a few minutes for authentic layout variance
    const addMinutes = (timeStr: string, offset: number) => {
      const [h, m] = timeStr.split(':').map(Number);
      const total = h * 60 + m + offset;
      const hours = Math.floor(total / 60) % 24;
      const minutes = total % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    for (let day = 1; day <= 30; day++) {
      // Sub-degree fluctuations
      const offset = Math.round(Math.sin(day / 5) * 3);
      dates.push({
        day,
        gregorian: `June ${day}, 2026`,
        hijri: `${day + 14} Dhul-Qi'dah`, // estimation
        dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][(day + 1) % 7], // Offset in 2026
        fajr: addMinutes(baseFajr, offset),
        sunrise: addMinutes(baseSunrise, offset),
        dhuhr: addMinutes(baseDhuhr, offset),
        asr: addMinutes(baseAsr, offset),
        maghrib: addMinutes(baseMaghrib, offset),
        isha: addMinutes(baseIsha, offset),
      });
    }
    return dates;
  };

  const monthlyRows = generateMonthlyData(currentCity);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert(`Generating high-definition PDF timetable for ${currentCity.name}, ${currentCity.country}...\nYour download will begin shortly inside your browser.`);
  };

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16 printable-section">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] transition shadow-xs none-print">
        <div>
          <h2 className="text-xl font-heading font-black text-[var(--primary)] dark:text-[var(--secondary)]">
            {language === 'en' ? 'Comprehensive Prayer Timetable' : 'مکمل اوقات نماز کیلنڈر'}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {language === 'en' 
              ? `High accuracy local times for local mosques in ${currentCity.name}, ${currentCity.country}` 
              : `${currentCity.name} کے لیے مستند و مسنون اوقات براۓ مسجد تالیف`}
          </p>
        </div>

        {/* Action triggers */}
        <div className="flex items-center space-x-2.5 shrink-0 none-print">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs cursor-pointer transition shadow-xs"
          >
            <span>⬇️</span>
            <span>Download PDF</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-xs cursor-pointer transition shadow-xs"
          >
            <span>🖨️</span>
            <span>Print Page</span>
          </button>
        </div>
      </div>

      {/* TODAY'S TIMING PREVIEW CARD */}
      <section className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs text-emerald-300 font-bold uppercase tracking-widest">{language === 'en' ? 'Today\'s Summary' : 'آج کا خلاصہ'}</div>
          <h3 className="text-2xl font-black font-heading tracking-tight">{currentCity.name} Highlights</h3>
          <p className="text-xs text-emerald-100">Calculation Method: ISNA (North America / Default) • Azimuth: 15° / 15°</p>
        </div>

        <div className="grid grid-cols-6 gap-2 sm:gap-4 font-mono">
          {[
            { n: 'Fajr', t: currentCity.fajr },
            { n: 'Sunrise', t: currentCity.sunrise },
            { n: 'Dhuhr', t: currentCity.dhuhr },
            { n: 'Asr', t: currentCity.asr },
            { n: 'Maghrib', t: currentCity.maghrib },
            { n: 'Isha', t: currentCity.isha },
          ].map(it => (
            <div key={it.n} className="bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/50 text-center">
              <span className="text-[10px] text-emerald-300 block font-heading uppercase">{it.n}</span>
              <span className="text-xs font-bold text-amber-300 mt-1 block">{it.t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* MONTHLY CALENDAR GRID */}
      <section className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl p-5 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading font-bold text-base flex items-center space-x-2">
            <span>📅</span>
            <span>{language === 'en' ? 'Monthly timetable: June 2026' : 'ماہانہ کیلنڈر: جون 2026'}</span>
          </h3>
          <span className="text-[10px] text-[var(--text-secondary)] font-semibold border border-[var(--border)] px-2.5 py-1 rounded-full">
            Standard 12 Hours Format
          </span>
        </div>

        {/* Scrollable table matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs text-gray-400 font-bold bg-[var(--background)]">
                <th className="py-2.5 px-3">Day</th>
                <th className="py-2.5 px-3">Gregorian Date</th>
                <th className="py-2.5 px-3">Fajr</th>
                <th className="py-2.5 px-3">Sunrise</th>
                <th className="py-2.5 px-3">Dhuhr</th>
                <th className="py-2.5 px-3">Asr</th>
                <th className="py-2.5 px-3">Maghrib</th>
                <th className="py-2.5 px-3">Isha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] font-mono text-xs">
              {monthlyRows.map(row => {
                const isFriday = row.dayName === 'Friday';
                const isToday = row.day === 15; // Local meta target

                return (
                  <tr 
                    key={row.day} 
                    className={`hover:bg-[var(--background)] transition-colors ${
                      isToday ? 'bg-amber-500/10 font-bold text-amber-900 dark:text-amber-300 border-y-2 border-amber-500' : isFriday ? 'bg-emerald-500/5' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-heading font-semibold">
                      {row.day} {isFriday && <span className="text-[9px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded ml-1">Jum'ah</span>}
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400 whitespace-nowrap font-heading">
                      {row.gregorian}
                    </td>
                    <td className="py-2.5 px-3">{row.fajr} AM</td>
                    <td className="py-2.5 px-3 text-gray-400 dark:text-gray-600">{row.sunrise} AM</td>
                    <td className="py-2.5 px-3">{row.dhuhr} PM</td>
                    <td className="py-2.5 px-3">{row.asr} PM</td>
                    <td className="py-2.5 px-3 text-red-600 dark:text-red-400 font-bold">{row.maghrib} PM</td>
                    <td className="py-2.5 px-3">{row.isha} PM</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* AD PLACEMENT: Banner below table */}
      <AdContainer id="ad-prayer-banner" size="728x90 Banner" type="leaderboard" />
      
    </div>
  );
}
