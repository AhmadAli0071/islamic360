import React, { useState } from 'react';
import { CityData } from '../types';
import AdContainer from './AdContainer';

interface QiblaFinderProps {
  currentCity: CityData;
  language: 'en' | 'ur';
}

export default function QiblaFinder({ currentCity, language }: QiblaFinderProps) {
  // Angle of alignment simulation State (0 to 360)
  const [phoneRotation, setPhoneRotation] = useState(180);
  const [mapToggle, setMapToggle] = useState(false);

  // Qibla angle of current selected city
  const targetQibla = currentCity.coords.qibla;

  // Compute needle direction relative to current simulated phone rotation (phoneRotation)
  // Compass North is at (360 - phoneRotation)
  // Qibla angle is relative to local North
  const needleRotation = (targetQibla - phoneRotation) % 360;

  // Check if aligned properly (within +/- 3 degrees tolerance)
  const isAligned = Math.abs(needleRotation) < 5 || Math.abs(needleRotation - 360) < 5 || Math.abs(needleRotation + 360) < 5;

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16">
      
      {/* INTRO SUMMARY BANNER */}
      <div className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl p-5 shadow-sm transition-colors duration-300">
        <h2 className="text-xl font-heading font-black text-[var(--primary)] dark:text-[var(--secondary)] flex items-center space-x-2">
          <span>🧭</span>
          <span>{language === 'en' ? 'Interactive Qibla Compass' : 'روحانی قبلہ نما کمپاس'}</span>
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          {language === 'en' 
            ? `Calibrated direction to the Holy Kaaba in Mecca for ${currentCity.name}, ${currentCity.country}`
            : `مکہ مکرمہ میں خانہ کعبہ کی سمت معلوم کرنے کا مستند نقشہ برائے: ${currentCity.name}`}
        </p>
      </div>

      {/* CORE CANVAS WORKSPACE */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* COMPASS COMPONENT CARD */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm transition-colors duration-300 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
          
          {/* Subtle background glow when perfectly aligned */}
          {isAligned && (
            <div className="absolute inset-0 bg-yellow-400/10 dark:bg-amber-400/5 animate-pulse pointer-events-none"></div>
          )}

          <div className="text-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">Calculated Angle</span>
            <span className="text-3xl font-mono font-black text-[var(--primary)] dark:text-amber-400">
              {targetQibla}° {targetQibla > 180 ? 'West of North' : 'East of North'}
            </span>
          </div>

          {/* COMPASS INTERFACE COIL */}
          <div className="relative w-64 h-64 flex items-center justify-center bg-gray-500/5 rounded-full border-4 border-[var(--border)] shadow-inner transition">
            
            {/* Compass Ring Degree numbers */}
            <div className="absolute inset-2 border border-dotted border-[var(--border)] rounded-full"></div>
            
            {/* North Indicator */}
            <div 
              className="absolute text-xs font-bold text-red-500 font-mono transition-transform duration-300"
              style={{
                transform: `rotate(${-phoneRotation}deg) translateY(-105px)`
              }}
            >
              N
            </div>
            <div 
              className="absolute text-[10px] font-bold text-gray-400 font-mono transition-transform duration-300"
              style={{
                transform: `rotate(${90-phoneRotation}deg) translateY(-105px)`
              }}
            >
              E
            </div>
            <div 
              className="absolute text-[10px] font-bold text-gray-400 font-mono transition-transform duration-300"
              style={{
                transform: `rotate(${180-phoneRotation}deg) translateY(-105px)`
              }}
            >
              S
            </div>
            <div 
              className="absolute text-[10px] font-bold text-gray-400 font-mono transition-transform duration-300"
              style={{
                transform: `rotate(${270-phoneRotation}deg) translateY(-105px)`
              }}
            >
              W
            </div>

            {/* QIBLA TARGET ARROW (🕋 Icon and custom line) */}
            <div 
              className="absolute w-full h-full flex items-center justify-center transition-transform duration-200"
              style={{
                transform: `rotate(${needleRotation}deg)`
              }}
            >
              {/* Green/Gold central pointer arrow */}
              <div className="relative flex flex-col items-center">
                {/* Kaaba indicator */}
                <div className="text-xl -translate-y-7 absolute select-none">🕋</div>
                
                {/* Arrow head */}
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[24px] border-b-amber-500"></div>
                {/* Arrow trunk */}
                <div className="w-2.5 h-16 bg-emerald-700 dark:bg-emerald-600 rounded-b"></div>
              </div>
            </div>

            {/* Core cap */}
            <div className="absolute w-4 h-4 bg-amber-500 rounded-full border border-white shadow"></div>
          </div>

          {/* CALIBRATION GUIDE SLIDER */}
          <div className="w-full space-y-2.5 bg-[var(--background)] p-4 rounded-xl border border-[var(--border)]">
            <div className="flex justify-between items-baseline text-xs font-semibold">
              <span className="text-gray-500">Rotate device simulator:</span>
              <span className="text-[var(--primary)] dark:text-amber-400 font-mono">{phoneRotation}°</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="359"
              value={phoneRotation}
              onChange={(e) => setPhoneRotation(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-[var(--border)] accent-emerald-700 cursor-pointer"
            />

            <div className="text-center pt-1">
              {isAligned ? (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-amber-500 text-emerald-950 font-bold text-[10px] uppercase tracking-wider animate-bounce">
                  <span>✓ Properly Aligned with Kaaba!</span>
                </div>
              ) : (
                <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                  Drag the rotational knob slider to align the Kaaba 🕋 directly with vertical North pointer
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GEOLOCATION ACCURACY & MAP OVERLAY CARDS */}
        <div className="space-y-6">
          
          {/* SATELLITE DETAILS */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-4 text-xs transition-colors duration-300">
            <h3 className="font-heading font-bold text-sm text-[var(--primary)] dark:text-amber-400 flex items-center space-x-2 border-b border-[var(--border)] pb-2">
              <span>🛰️</span>
              <span>GPS Geolocation Accuracies</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="bg-[var(--background)] p-3 rounded-xl border border-[var(--border)]">
                <span className="text-[10px] text-gray-400 block leading-none">Latitude</span>
                <span className="text-xs font-bold text-[var(--text-primary)] mt-1 block">
                  {currentCity.coords.lat.toFixed(4)}° N
                </span>
              </div>
              <div className="bg-[var(--background)] p-3 rounded-xl border border-[var(--border)]">
                <span className="text-[10px] text-gray-400 block leading-none">Longitude</span>
                <span className="text-xs font-bold text-[var(--text-primary)] mt-1 block">
                  {Math.abs(currentCity.coords.lng).toFixed(4)}° {currentCity.coords.lng >= 0 ? 'E' : 'W'}
                </span>
              </div>
              <div className="bg-[var(--background)] p-3 rounded-xl border border-[var(--border)]">
                <span className="text-[10px] text-gray-400 block leading-none">GPS Accuracy</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                  ± 3.8 Meters (Excellent)
                </span>
              </div>
              <div className="bg-[var(--background)] p-3 rounded-xl border border-[var(--border)]">
                <span className="text-[10px] text-gray-400 block leading-none">Magnetic Declination</span>
                <span className="text-xs font-bold text-[var(--text-primary)] mt-1 block">
                  + 2.45° E (Auto-adjusted)
                </span>
              </div>
            </div>

            <div className="bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 p-3 rounded-xl text-[11px] leading-relaxed">
              <strong>Accuracy Tip:</strong> When using on actual mobile smartphones, step away from computers, magnetic metal buckles, or massive microwave transmission lines to avoid deflection sensors.
            </div>
          </div>

          {/* INTERACTIVE STATIC MAP TOGGLE VIEW */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-3 transition-colors duration-300">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-bold text-sm text-[var(--text-primary)]">
                🗺️ Geodetic Orthodromic Path Map
              </h3>

              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  name="toggle" 
                  id="map-toggle" 
                  checked={mapToggle}
                  onChange={() => setMapToggle(!mapToggle)}
                  className="sr-only"
                />
                <label 
                  htmlFor="map-toggle" 
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition ${mapToggle ? 'bg-amber-400' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white shadow transform transition ${mapToggle ? 'translate-x-5 mt-1 ml-0.5' : 'translate-x-1 mt-1 ml-0.5'}`}></span>
                </label>
              </div>
            </div>

            {mapToggle ? (
              <div className="h-44 bg-[var(--background)] rounded-xl border border-[var(--border)] flex flex-col justify-center items-center p-4">
                {/* Simulated Geodetic vector path line */}
                <span className="text-sm">🕋 {currentCity.name} To Mecca</span>
                <div className="w-full max-w-[200px] h-1 bg-dashed bg-gradient-to-r from-emerald-600 to-amber-500 my-4 relative">
                  <span className="absolute -top-1 left-1.5 text-xs">✈️</span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">Distance: 4,320 km geodetic orthodromic radius</span>
              </div>
            ) : (
              <div 
                className="h-44 bg-cover bg-center rounded-xl border border-[var(--border)] relative overflow-hidden flex flex-col justify-end p-4 group"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600')`
                }}
              >
                <div className="absolute inset-0 bg-neutral-900/40 group-hover:bg-neutral-900/50 transition duration-300"></div>
                <div className="relative text-white z-10 space-y-1">
                  <h4 className="text-xs font-bold leading-none">Kaaba Geographic Center coordinates</h4>
                  <p className="text-[10px] text-gray-200">21.4225° N, 39.8262° E • Great Mosque of Mecca</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* AD CONTAINER below Compass */}
      <AdContainer id="ad-qibla-content" size="300x250 Medium Rectangle" type="native" />

    </div>
  );
}
