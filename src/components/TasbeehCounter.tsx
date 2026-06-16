import { useState } from 'react';

const DHIKR_PRESETS = [
  { name: 'SubhanAllah', arabic: 'سُبْحَانَ اللَّهِ', meaning: 'Glory be to Allah', defaultCount: 33 },
  { name: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', meaning: 'All praise is for Allah', defaultCount: 33 },
  { name: 'Allahu Akbar', arabic: 'اللَّهُ أَكْبَرُ', meaning: 'Allah is the Greatest', defaultCount: 33 },
  { name: 'La ilaha illallah', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', meaning: 'There is no god but Allah', defaultCount: 100 },
  { name: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', meaning: 'I seek forgiveness from Allah', defaultCount: 100 },
  { name: 'Darood Sharif', arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', meaning: 'Blessings upon Muhammad', defaultCount: 100 },
];

export default function TasbeehCounter({ language }: { language: 'en' | 'ur' }) {
  const [selectedDhikr, setSelectedDhikr] = useState(DHIKR_PRESETS[0]);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [history, setHistory] = useState<{ name: string; count: number; time: string }[]>([]);

  const handleTap = () => {
    if (count < target) {
      setCount(prev => prev + 1);
    }
  };

  const handleReset = () => {
    if (count > 0) {
      setHistory(prev => [{
        name: selectedDhikr.name,
        count,
        time: new Date().toLocaleTimeString(),
      }, ...prev].slice(0, 20));
    }
    setCount(0);
  };

  const selectDhikr = (d: typeof DHIKR_PRESETS[0]) => {
    if (count > 0) {
      setHistory(prev => [{
        name: selectedDhikr.name,
        count,
        time: new Date().toLocaleTimeString(),
      }, ...prev].slice(0, 20));
    }
    setSelectedDhikr(d);
    setTarget(d.defaultCount);
    setCount(0);
  };

  const progress = target > 0 ? (count / target) * 100 : 0;

  return (
    <div className="flex-1 space-y-6 max-w-4xl mx-auto px-4 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-heading font-black flex items-center gap-2">
          <span>📿</span>
          <span>{language === 'en' ? 'Digital Tasbeeh' : 'ڈیجیٹل تسبیح'}</span>
        </h2>
        <p className="text-xs text-emerald-200 mt-1">
          {language === 'en' ? 'Count your daily dhikr' : 'روزانہ کے اذکار گنیں'}
        </p>
      </div>

      {/* Dhikr presets */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {DHIKR_PRESETS.map(d => (
          <button key={d.name} onClick={() => selectDhikr(d)}
            className={`p-3 rounded-xl text-center transition cursor-pointer border ${
              selectedDhikr.name === d.name
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-md'
                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--background)]'
            }`}>
            <p className="text-xs font-arabic leading-relaxed">{d.arabic}</p>
            <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{d.defaultCount}x</p>
          </button>
        ))}
      </div>

      {/* Counter */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm text-center space-y-5">
        {/* Arabic text */}
        <p className="text-2xl font-arabic text-[var(--primary)] dark:text-[var(--secondary)]" dir="rtl">
          {selectedDhikr.arabic}
        </p>
        <p className="text-xs text-[var(--text-secondary)]">{selectedDhikr.meaning}</p>

        {/* Progress bar */}
        <div className="w-full bg-[var(--background)] rounded-full h-3 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-200"
            style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          {language === 'en' ? 'Target' : 'ہدف'}: {target}
        </p>

        {/* Count display */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={handleReset}
            className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl cursor-pointer hover:bg-red-200 dark:hover:bg-red-900/50 transition">
            ↺
          </button>
          <div className="text-6xl font-black text-[var(--primary)] dark:text-[var(--secondary)] select-none"
            onClick={handleTap}>
            {count}
          </div>
          <div className="w-14" />
        </div>

        {/* Tap button */}
        <button onClick={handleTap}
          className="w-full py-5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-lg font-bold rounded-2xl transition cursor-pointer active:scale-95 shadow-lg">
          {language === 'en' ? '👆 Tap to Count' : '👆 گننے کے لیے تھپتھپائیں'}
        </button>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-[var(--text-primary)] mb-3">
            {language === 'en' ? '📋 Today\'s History' : '📋 آج کی تاریخ'}
          </h3>
          <div className="space-y-1.5">
            {history.map((h, i) => (
              <div key={i} className="flex justify-between items-center text-xs py-1 border-b border-[var(--border)] last:border-0">
                <span className="font-semibold text-[var(--primary)] dark:text-[var(--secondary)]">{h.name}</span>
                <span className="text-[var(--text-secondary)]">{h.count}x • {h.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
