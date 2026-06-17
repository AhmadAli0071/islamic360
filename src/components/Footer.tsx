import React, { useState } from 'react';

interface FooterProps {
  language: 'en' | 'ur';
  onTabChange: (tab: string) => void;
}

export default function Footer({ language, onTabChange }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-emerald-950 text-emerald-100 py-12 px-4 transition-all duration-300 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* BRAND & INTRO */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🕌</span>
            <span className="text-xl font-heading font-bold text-amber-400">Theislamic360</span>
          </div>
          <p className="text-xs text-emerald-200/80 leading-relaxed">
            {language === 'en' 
              ? 'Theislamic360 is a premier Islamic Lifestyle companion designed to elevate daily worship with modern elements, reliable calculations, and certified education.' 
              : 'دی اسلامک 360 ایک جدید معلوماتی اور تعلیمی پورٹل ہے جو اہل ایمان کو بروقت نماز کی اوقات، قبلہ، قرآن اکیڈمی اور روزانہ مستند مواد فراہم کرتا ہے۔'}
          </p>
          <div className="flex items-center space-x-3.5 text-lg pt-1 text-amber-400">
            <span className="hover:scale-110 cursor-pointer transition">📘</span>
            <span className="hover:scale-110 cursor-pointer transition">📸</span>
            <span className="hover:scale-110 cursor-pointer transition">📳</span>
            <span className="hover:scale-110 cursor-pointer transition">🎥</span>
          </div>
        </div>

        {/* QUICK NAVIGATION LINKS */}
        <div>
          <h4 className="font-heading font-semibold text-sm text-white mb-4 border-b border-emerald-800 pb-2">
            {language === 'en' ? 'Core Subsections' : 'اہم ابواب'}
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => onTabChange('home')} className="hover:text-amber-400 transition cursor-pointer text-left w-full">
                🕌 {language === 'en' ? 'Homepage Dashboard' : 'مرکزی ڈیش بورڈ'}
              </button>
            </li>
            <li>
              <button onClick={() => onTabChange('prayer')} className="hover:text-amber-400 transition cursor-pointer text-left w-full">
                📅 {language === 'en' ? 'Prayer Times & Monthly' : 'نماز کے اوقات'}
              </button>
            </li>
            <li>
              <button onClick={() => onTabChange('academy')} className="hover:text-amber-400 transition cursor-pointer text-left w-full">
                📚 {language === 'en' ? 'Quran Academy Portal' : 'آن لائن قرآن اکیڈمی'}
              </button>
            </li>
            <li>
              <button onClick={() => onTabChange('calendar')} className="hover:text-amber-400 transition cursor-pointer text-left w-full">
                🗓️ {language === 'en' ? 'Islamic Hijri Calendar' : 'قمری ہجری کیلنڈر'}
              </button>
            </li>
          </ul>
        </div>

        {/* SUPPORT & DUAS */}
        <div>
          <h4 className="font-heading font-semibold text-sm text-white mb-4 border-b border-emerald-800 pb-2">
            {language === 'en' ? 'Community Resources' : 'کمیونٹی سورسز'}
          </h4>
          <ul className="space-y-2 text-xs text-emerald-200/85">
            <li>• {language === 'en' ? 'Daily Azkar & Supplications' : 'روزانہ کی دعائیں اور اذکار'}</li>
            <li>• {language === 'en' ? 'Correct Salat Guides' : 'مسنون نماز کے آسان طریقے'}</li>
            <li>• {language === 'en' ? 'Masnoon Tasbeeh Counter' : 'ڈیجیٹل تسبیح کاؤنٹر'}</li>
            <li>• {language === 'en' ? 'Zakat Calculator' : 'زکوٰۃ ادا کرنے کا حساب'}</li>
            <li>• {language === 'en' ? 'Verified Halal Foods' : 'حلال غذا کی معلومات'}</li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div className="space-y-4">
          <h4 className="font-heading font-semibold text-sm text-white mb-4 border-b border-emerald-800 pb-2">
            {language === 'en' ? 'Daily Islamic Bulletin' : 'روزانہ اسلامی اپڈیٹس'}
          </h4>
          <p className="text-xs text-emerald-200/80">
            {language === 'en' ? 'Get verified Duas, Hadith snippets, and local Islamic calendar dates directly in your inbox.' : 'روزانہ کے اذکار اور احادیث حاصل کرنے کے لیے سائن اپ کریں۔'}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="subscribers@ummah.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-lg bg-emerald-900 border border-emerald-800 text-white placeholder-emerald-400 focus:outline-none focus:border-amber-400 transition"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 text-emerald-950 font-bold hover:bg-amber-300 rounded-lg text-xs cursor-pointer transition uppercase tracking-wider"
            >
              Subscription Active
            </button>
          </form>
          {subscribed && (
            <div className="text-[11px] text-amber-300 animate-slideUp font-medium">
              ✓ JazakAllahu Khayran! Check your email for welcoming greetings.
            </div>
          )}
        </div>
        
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-emerald-900 flex flex-col md:flex-row items-center justify-between text-[11px] text-emerald-300/70 space-y-4 md:space-y-0">
        <div>
          © {new Date().getFullYear()} Theislamic360. All secular and digital rights reserved.
        </div>
        <div className="flex space-x-4">
          <a href="#terms" className="hover:text-amber-400">Privacy Clauses</a>
          <span>•</span>
          <a href="#safety" className="hover:text-amber-400">Content Accuracy Terms</a>
          <span>•</span>
          <a href="#credits" className="hover:text-amber-400">Feedback Portal</a>
        </div>
        <div className="font-medium text-amber-400/80">
          Made with ❤️ for the global Muslim Ummah
        </div>
      </div>
    </footer>
  );
}
