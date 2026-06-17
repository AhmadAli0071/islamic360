import { useState, useEffect, useRef } from 'react';
import { CityData } from '../types';
import AdContainer from './AdContainer';

interface QiblaFinderProps {
  currentCity: CityData;
  language: 'en' | 'ur';
}

interface QiblaData {
  bearing: number;
  distance: number;
  direction: string;
}

export default function QiblaFinder({ currentCity, language }: QiblaFinderProps) {
  const [qiblaData, setQiblaData] = useState<QiblaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deviceOrientation, setDeviceOrientation] = useState<number | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [alignment, setAlignment] = useState<'perfect' | 'close' | 'far'>('far');
  const [mapToggle, setMapToggle] = useState(false);

  useEffect(() => {
    fetchQibla();
    requestOrientationPermission();
  }, [currentCity]);

  const fetchQibla = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/qibla/direction?lat=${currentCity.coords.lat}&lng=${currentCity.coords.lng}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setQiblaData(json.data);
    } catch {
      setError('Failed to load Qibla direction');
    } finally {
      setLoading(false);
    }
  };

  const requestOrientationPermission = async () => {
    // iOS 13+ requires permission request
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const state = await (DeviceOrientationEvent as any).requestPermission();
        if (state === 'granted') {
          setHasPermission(true);
          startOrientationListener();
        } else {
          setHasPermission(false);
        }
      } catch {
        startOrientationListener();
      }
    } else {
      // Android / non-iOS — no permission needed
      startOrientationListener();
    }
  };

  const startOrientationListener = () => {
    if (window.DeviceOrientationEvent) {
      const handler = (e: DeviceOrientationEvent) => {
        if (e.alpha !== null) {
          setDeviceOrientation(e.alpha);
        }
      };
      window.addEventListener('deviceorientation', handler);
      return () => window.removeEventListener('deviceorientation', handler);
    }
  };

  // Calculate alignment
  useEffect(() => {
    if (deviceOrientation !== null && qiblaData) {
      const diff = Math.abs((qiblaData.degree - deviceOrientation + 540) % 360 - 180);
      if (diff < 5) setAlignment('perfect');
      else if (diff < 20) setAlignment('close');
      else setAlignment('far');
    }
  }, [deviceOrientation, qiblaData]);

  // Calculate turn direction
  const compassAngle = deviceOrientation !== null ? deviceOrientation : 0;
  const qiblaAngle = qiblaData ? qiblaData.degree : 0;
  const turnDirection = qiblaData && deviceOrientation !== null
    ? ((compassAngle - qiblaAngle + 540) % 360 - 180)
    : 0;

  if (loading) {
    return (
      <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 max-w-5xl mx-auto px-4 pb-16">
        <div className="text-center py-16">
          <p className="text-red-500 text-sm">{error}</p>
          <button onClick={fetchQibla} className="mt-4 px-5 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl cursor-pointer">Retry</button>
        </div>
      </div>
    );
  }

  if (qiblaData && qiblaData.distance < 1) {
    return (
      <div className="flex-1 max-w-5xl mx-auto px-4 pb-16">
        <div className="text-center py-16 space-y-4">
          <span className="text-6xl">🕋</span>
          <p className="text-lg font-bold">{language === 'en' ? 'You are at the Kaaba!' : 'آپ کعبہ کے پاس ہیں!'}</p>
          <p className="text-sm text-[var(--text-secondary)]">{language === 'en' ? 'Qibla direction is not needed — you are already at the holiest site.' : 'قبلہ کی سمت کی ضرورت نہیں — آپ پہلے ہی مقدس مقام پر ہیں۔'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 max-w-4xl mx-auto px-4 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-heading font-black flex items-center gap-2">
          <span>🧭</span>
          <span>{language === 'en' ? 'Qibla Finder & Compass' : 'قبلہ نما کمپاس'}</span>
        </h2>
        <p className="text-xs text-indigo-200 mt-1">
          {language === 'en' ? 'Point your device to find Qibla direction' : 'قبلہ کی سمت معلوم کرنے کے لیے اپنا آلہ گھمائیں'}
        </p>
      </div>

      {/* Compass */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm flex flex-col items-center space-y-6">
        {/* Alignment status */}
        <div className={`px-5 py-2 rounded-full text-xs font-bold ${
          alignment === 'perfect' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
          alignment === 'close' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {alignment === 'perfect' ? (language === 'en' ? '✅ Facing Qibla!' : '✅ قبلہ رخ!') :
           alignment === 'close' ? (language === 'en' ? '🔄 Almost there' : '🔄 قریب ہیں') :
           (language === 'en' ? '🧭 Rotate device' : '🧭 آلہ گھمائیں')}
        </div>

        {/* Turn direction indicator */}
        {deviceOrientation !== null && alignment !== 'perfect' && (
          <div className="text-center">
            <p className="text-lg font-bold">
              {turnDirection > 10 ? (language === 'en' ? '← Turn Left' : '← بائیں گھمائیں') :
               turnDirection < -10 ? (language === 'en' ? '→ Turn Right' : '→ دائیں گھمائیں') :
               (language === 'en' ? '⬆ Almost facing Qibla' : '⬆ قریب قریب قبلہ رخ')}
            </p>
          </div>
        )}

        {/* Compass circle */}
        <div className="relative w-64 h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full border-4 border-[var(--border)] shadow-inner transition">
          {/* Qibla needle (does NOT rotate - always points in direction user should turn) */}
          <div className="absolute inset-0" style={{ transform: `rotate(${qiblaAngle - compassAngle}deg)` }}>
            <div className="absolute top-1/2 left-1/2 w-0 h-0 -translate-y-16 -translate-x-1/2">
              <div className="w-2.5 h-20 bg-gradient-to-t from-red-600 to-red-400 rounded-full mx-auto shadow-lg" />
              <div className="w-5 h-5 bg-red-600 rounded-full mx-auto -mt-1 shadow-md" />
              <div className="text-2xl text-center -mt-8">🕋</div>
            </div>
          </div>

          {/* Center dot */}
          <div className="w-3 h-3 bg-emerald-600 rounded-full z-10 shadow-md" />
        </div>

        {/* Instruction */}
        <p className="text-xs font-semibold text-[var(--text-secondary)] text-center">
          {language === 'en'
            ? 'Rotate your device until the 🕋 arrow points ⬆ UP'
            : 'اپنے آلے کو اس طرح گھمائیں کہ 🕋 کا تیر ⬆ اوپر کی طرف ہو جائے'}
        </p>

        {/* Device orientation info */}
        <div className="text-center space-y-1">
          <p className="text-xs text-[var(--text-secondary)]">
            {language === 'en' ? 'Device heading' : 'آلے کی سمت'}: <span className="font-bold text-[var(--text-primary)]">{compassAngle.toFixed(0)}°</span>
            {!hasPermission && hasPermission !== null && (
              <span className="ml-2 text-amber-500">{language === 'en' ? '(Permission needed)' : '(اجازت درکار)'}</span>
            )}
          </p>
          {deviceOrientation === null && (
            <p className="text-xs text-amber-500">{language === 'en' ? 'Rotate your device to activate compass' : 'کمپاس چالو کرنے کے لیے آلہ گھمائیں'}</p>
          )}
        </div>

        {/* Manual fallback slider for desktop */}
        {deviceOrientation === null && (
          <div className="w-full max-w-xs">
            <p className="text-[10px] text-[var(--text-secondary)] mb-1 text-center">
              {language === 'en' ? 'Manual rotation (fallback)' : 'دستی گردش'}
            </p>
            <input type="range" min="0" max="360" value={compassAngle}
              onChange={e => setDeviceOrientation(Number(e.target.value))}
              className="w-full accent-emerald-600" />
          </div>
        )}
      </div>

      {/* Qibla info */}
      {qiblaData && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-heading font-bold mb-3 flex items-center gap-2">
            <span>🕋</span>
            <span>{language === 'en' ? 'Qibla Details' : 'قبلہ کی تفصیلات'}</span>
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
              <p className="text-[10px] text-[var(--text-secondary)]">{language === 'en' ? 'Degree' : 'ڈگری'}</p>
              <p className="text-lg font-black text-[var(--primary)] dark:text-[var(--secondary)]">{qiblaData.degree.toFixed(1)}°</p>
            </div>
            <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
              <p className="text-[10px] text-[var(--text-secondary)]">{language === 'en' ? 'Direction' : 'رخ'}</p>
              <p className="text-sm font-bold text-amber-700 dark:text-amber-400">{qiblaData.direction}</p>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
              <p className="text-[10px] text-[var(--text-secondary)]">{language === 'en' ? 'Distance' : 'فاصلہ'}</p>
              <p className="text-sm font-bold text-blue-700 dark:text-blue-400">{qiblaData.distance.toFixed(0)} km</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[10px] text-[var(--text-secondary)]">
              {language === 'en' ? `Location: ${currentCity.name}, ${currentCity.country}` : `مقام: ${currentCity.name}، ${currentCity.country}`}
            </p>
            <p className="text-[10px] text-[var(--text-secondary)]">
              {language === 'en' ? 'Kaaba: 21.42°N, 39.83°E' : 'کعبہ: 21.42°N, 39.83°E'}
            </p>
          </div>
        </div>
      )}

      {/* Map toggle */}
      {qiblaData && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-10 h-5 rounded-full transition ${mapToggle ? 'bg-emerald-500' : 'bg-gray-300'}`}
              onClick={() => setMapToggle(!mapToggle)}>
              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition mt-0.5 ${mapToggle ? 'translate-x-5 ml-0.5' : 'translate-x-1 ml-0.5'}`} />
            </div>
            <span className="text-xs font-semibold">{language === 'en' ? 'Show Qibla path' : 'قبلہ کا راستہ دکھائیں'}</span>
          </label>
          {mapToggle && (
            <div className="mt-4 h-44 bg-cover bg-center rounded-xl relative overflow-hidden flex items-end justify-center"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&q=80&w=800)' }}>
              <div className="bg-gradient-to-t from-black/70 to-transparent p-4 w-full text-center">
                <p className="text-white text-xs font-bold">
                  {qiblaData.distance.toFixed(0)} km → 🕋 {qiblaData.direction}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <AdContainer id="ad-qibla-bottom" size="728x90 Bottom" type="leaderboard" />
    </div>
  );
}
