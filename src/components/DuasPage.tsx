import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface DuaData {
  _id: string;
  category: string;
  title: { en: string; ur: string };
  arabic: string;
  urdu: string;
  english: string;
  transliteration: string;
  reference: string;
}

const CATEGORIES = ['morning', 'evening', 'sleep', 'food', 'travel', 'hardship', 'forgiveness', 'protection', 'ramadan'];

export default function DuasPage({ language }: { language: 'en' | 'ur' }) {
  const [duas, setDuas] = useState<DuaData[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('morning');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadDuas();
  }, [selectedCat]);

  const loadDuas = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getDuas(selectedCat === 'all' ? undefined : selectedCat);
      setDuas(data);
    } catch {
      setError('Failed to load duas');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-heading font-black flex items-center gap-2">
          <span>🤲</span>
          <span>{language === 'en' ? 'Duas & Supplications' : 'دعائیں و اذکار'}</span>
        </h2>
        <p className="text-xs text-emerald-200 mt-1">
          {language === 'en' ? 'Authentic duas from Quran & Sunnah' : 'قرآن و سنت سے مستند دعائیں'}
        </p>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 text-[11px] font-bold rounded-xl transition cursor-pointer ${
              selectedCat === cat ? 'bg-[var(--primary)] text-white shadow-md' : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--background)]'
            }`}>
            {language === 'en' ? cat.charAt(0).toUpperCase() + cat.slice(1) : cat}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="animate-pulse bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-10">
          <p className="text-red-500 text-sm">{error}</p>
          <button onClick={loadDuas} className="mt-3 px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl cursor-pointer">Retry</button>
        </div>
      )}

      {/* Dua cards */}
      {!loading && !error && duas.length === 0 && (
        <div className="text-center py-10 text-[var(--text-secondary)] text-sm">
          {language === 'en' ? 'No duas found for this category.' : 'اس زمرے میں کوئی دعا نہیں ملی'}
        </div>
      )}

      {!loading && !error && duas.map(dua => (
        <div key={dua._id} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-heading font-bold text-[var(--primary)] dark:text-[var(--secondary)]">
              {language === 'en' ? dua.title.en : dua.title.ur}
            </h3>
            <button onClick={() => handleCopy(dua.arabic, dua._id)}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg cursor-pointer transition ${
                copiedId === dua._id ? 'bg-emerald-500 text-white' : 'bg-[var(--background)] text-[var(--text-secondary)] hover:text-[var(--primary)]'
              }`}>
              {copiedId === dua._id ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          <p className="text-right text-xl leading-loose font-arabic text-[var(--text-primary)]" dir="rtl">
            {dua.arabic}
          </p>

          <div className="space-y-1 text-xs text-[var(--text-secondary)] italic">
            <p>{dua.transliteration}</p>
          </div>

          <div className="border-t border-[var(--border)] pt-3 space-y-2 text-xs leading-relaxed">
            <p className="text-[var(--text-primary)]">{language === 'en' ? dua.english : dua.urdu}</p>
            {dua.reference && (
              <p className="text-[var(--text-secondary)]">
                <span className="font-bold">{language === 'en' ? 'Reference: ' : 'حوالہ: '}</span>
                {dua.reference}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
