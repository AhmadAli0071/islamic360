import { useState } from 'react';

const NAMES = [
  { arabic: 'الرَّحْمٰنُ', en: 'Ar-Rahman', ur: 'الرحمٰن', meaning: 'The Most Gracious', meaningUr: 'بے حد رحم کرنے والا' },
  { arabic: 'الرَّحِيْمُ', en: 'Ar-Raheem', ur: 'الرحیم', meaning: 'The Most Merciful', meaningUr: 'بے انتہا رحم کرنے والا' },
  { arabic: 'الْمَلِكُ', en: 'Al-Malik', ur: 'الملک', meaning: 'The King', meaningUr: 'بادشاہ' },
  { arabic: 'الْقُدُّوسُ', en: 'Al-Quddus', ur: 'القدوس', meaning: 'The Holy', meaningUr: 'نہایت پاک' },
  { arabic: 'السَّلَامُ', en: 'As-Salam', ur: 'السلام', meaning: 'The Source of Peace', meaningUr: 'سلامتی کا سرچشمہ' },
  { arabic: 'الْمُؤْمِنُ', en: 'Al-Mu\'min', ur: 'المؤمن', meaning: 'The Guardian of Faith', meaningUr: 'ایمان دینے والا' },
  { arabic: 'الْمُهَيْمِنُ', en: 'Al-Muhaymin', ur: 'المہیمن', meaning: 'The Protector', meaningUr: 'نگران و محافظ' },
  { arabic: 'الْعَزِيْزُ', en: 'Al-Aziz', ur: 'العزیز', meaning: 'The Almighty', meaningUr: 'غالب و زبردست' },
  { arabic: 'الْجَبَّارُ', en: 'Al-Jabbar', ur: 'الجبار', meaning: 'The Compeller', meaningUr: 'جبر فرمانے والا' },
  { arabic: 'الْمُتَكَبِّرُ', en: 'Al-Mutakabbir', ur: 'المتکبر', meaning: 'The Supreme', meaningUr: 'بڑائی والا' },
  { arabic: 'الْخَالِقُ', en: 'Al-Khaliq', ur: 'الخالق', meaning: 'The Creator', meaningUr: 'پیدا کرنے والا' },
  { arabic: 'الْبَارِئُ', en: 'Al-Bari', ur: 'البارئ', meaning: 'The Maker', meaningUr: 'ٹھیک بنانے والا' },
  { arabic: 'الْمُصَوِّرُ', en: 'Al-Musawwir', ur: 'المصور', meaning: 'The Shaper of Beauty', meaningUr: 'صورت بنانے والا' },
  { arabic: 'الْغَفَّارُ', en: 'Al-Ghaffar', ur: 'الغفار', meaning: 'The Great Forgiver', meaningUr: 'بڑا بخشنے والا' },
  { arabic: 'الْقَهَّارُ', en: 'Al-Qahhar', ur: 'القهار', meaning: 'The Subduer', meaningUr: 'دبانے والا' },
  { arabic: 'الْوَهَّابُ', en: 'Al-Wahhab', ur: 'الوہاب', meaning: 'The Bestower', meaningUr: 'بے حساب دینے والا' },
  { arabic: 'الرَّزَّاقُ', en: 'Ar-Razzaq', ur: 'الرزاق', meaning: 'The Provider', meaningUr: 'روزی دینے والا' },
  { arabic: 'الْفَتَّاحُ', en: 'Al-Fattah', ur: 'الفتاح', meaning: 'The Opener', meaningUr: 'کھولنے والا' },
  { arabic: 'الْعَلِيْمُ', en: 'Al-Aleem', ur: 'العلیم', meaning: 'The All-Knowing', meaningUr: 'سب کچھ جاننے والا' },
  { arabic: 'الْقَابِضُ', en: 'Al-Qabid', ur: 'القابض', meaning: 'The Withholder', meaningUr: 'روک لینے والا' },
];

export default function AsmaUlHusna({ language }: { language: 'en' | 'ur' }) {
  const [search, setSearch] = useState('');

  const filtered = NAMES.filter(n =>
    n.en.toLowerCase().includes(search.toLowerCase()) ||
    n.arabic.includes(search) ||
    n.ur.includes(search)
  );

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-yellow-700 text-white rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-heading font-black flex items-center gap-2">
          <span>🕊️</span>
          <span>{language === 'en' ? '99 Names of Allah' : 'اللہ کے 99 نام'}</span>
        </h2>
        <p className="text-xs text-amber-200 mt-1">
          {language === 'en' ? 'Asma ul-Husna — The Beautiful Names' : 'اسماء الحسنیٰ — خوبصورت نام'}
        </p>
      </div>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder={language === 'en' ? 'Search names...' : 'نام تلاش کریں...'}
        className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition" />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-10 text-sm text-[var(--text-secondary)]">
            {language === 'en' ? 'No names found' : 'کوئی نام نہیں ملا'}
          </div>
        )}
        {filtered.map(n => (
          <div key={n.en} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group">
            <p className="text-right text-xl font-arabic text-[var(--primary)] dark:text-[var(--secondary)]" dir="rtl">
              {n.arabic}
            </p>
            <p className="text-sm font-bold text-[var(--text-primary)] mt-1">
              {language === 'en' ? n.en : n.ur}
            </p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              {language === 'en' ? n.meaning : n.meaningUr}
            </p>
            <p className="text-[10px] text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition">
              {language === 'en' ? 'Recite for barakah' : 'برکت کے لیے پڑھیں'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
