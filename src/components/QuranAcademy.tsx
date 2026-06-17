import React, { useState, useEffect } from 'react';
import AdContainer from './AdContainer';

interface QuranAcademyProps {
  language: 'en' | 'ur';
}

type ApiCourse = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  teacher?: { name: string };
};

type ApiTeacher = {
  _id: string;
  name: string;
  slug: string;
  qualifications: string[];
  specializations: string[];
  experience: string;
  bio: string;
  image: string;
};

export default function QuranAcademy({ language }: QuranAcademyProps) {
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [teachers, setTeachers] = useState<ApiTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentContact, setStudentContact] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('Weekend Morning');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/courses').then(r => r.json()),
      fetch('/api/teachers').then(r => r.json()),
    ]).then(([coursesRes, teachersRes]) => {
      if (coursesRes.success) setCourses(coursesRes.data);
      if (teachersRes.success) setTeachers(teachersRes.data);
      if (coursesRes.data?.length) setSelectedCourse(coursesRes.data[0].title);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: studentName, contact: studentContact, course: selectedCourse, preferredSlot }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Submission failed');
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setBookingModal(false);
        setStudentName('');
        setStudentContact('');
      }, 4000);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const courseIcon = (category: string) => {
    const map: Record<string, string> = { Quran: '📖', Tajweed: '🎤', Hifz: '🧠', Tafseer: '📜', Kids: '🧸', Arabic: '📝' };
    return map[category] || '📖';
  };

  const courseTag = (category: string) => {
    const map: Record<string, string> = { Quran: 'Beginner', Tajweed: 'Intermediate', Hifz: 'Advanced', Tafseer: 'Advanced', Kids: 'Beginner' };
    return map[category] || 'Beginner';
  };


  if (loading) {
    return (
      <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-3xl" />
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-72 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            <div className="h-72 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            <div className="h-72 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16">
      <AdContainer id="ad-academy-header" size="728x90 Header Ad" type="leaderboard" />
      <section className="bg-gradient-to-r from-emerald-950 to-emerald-800 text-white rounded-3xl p-6 md:p-10 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left md:max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-900 border border-emerald-800 text-xs font-bold uppercase tracking-widest text-amber-400">
            <span>✨</span>
            <span>Online Quran Academy Portal</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tight text-white leading-tight">
            Learn Quran with Certified Al-Azhar Teachers
          </h2>
          <p className="text-xs md:text-sm text-emerald-200/90 leading-relaxed">
            One-on-one live classes customizable for kids, sisters, and busy professionals. Learn Noorani Qaida, Tajweed excellence, and full Quranic memorization programs with structured Ijazah certifications.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center md:justify-start gap-3">
            <button
              onClick={() => {
                if (courses.length) setSelectedCourse(courses[0].title);
                setBookingModal(true);
              }}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs transition uppercase tracking-wider cursor-pointer shadow-md"
            >
              Book One-on-One Free Trial
            </button>
            <a href="#teachers" className="px-6 py-3 rounded-xl bg-transparent border-2 border-white/20 hover:border-white/50 text-white text-xs font-bold transition text-center uppercase tracking-wider">
              Meet Our Scholars
            </a>
          </div>
        </div>
        <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative border-4 border-emerald-800/80">
          <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600" alt="Islamic learning" referrerPolicy="no-referrer" className="w-full h-full object-cover max-h-56" />
        </div>
      </section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '👥', title: '1-on-1 Classes', desc: 'Personalized private coaching' },
          { icon: '👩‍🏫', title: 'Female Teachers', desc: 'Secure rooms for sisters' },
          { icon: '🗓️', title: 'Flexible Times', desc: 'Reschedule classes anytime' },
          { icon: '🏅', title: 'Ijazah Certificates', desc: 'Highest verified Chains' },
        ].map(item => (
          <div key={item.title} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
            <span className="text-xl block">{item.icon}</span>
            <h4 className="text-xs font-bold text-[var(--text-primary)]">{item.title}</h4>
            <p className="text-[10px] text-[var(--text-secondary)]">{item.desc}</p>
          </div>
        ))}
      </div>
      <section className="space-y-4">
        <div>
          <h3 className="font-heading font-bold text-lg flex items-center space-x-2">
            <span>📚</span>
            <span>Academy Course Catalogs</span>
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Explore carefully compiled learning structures taught via secure interactive zoom dashboards.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course._id} className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition group">
              <div className="bg-gradient-to-r from-emerald-950 to-emerald-800 p-5 text-center">
                <span className="text-4xl block">{courseIcon(course.category)}</span>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mt-2">{courseTag(course.category)}</span>
                <h4 className="text-white text-sm font-semibold mt-1">{course.title}</h4>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold leading-tight group-hover:text-[var(--primary)] dark:group-hover:text-amber-400 transition">{course.title}</h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{course.description}</p>
                </div>
                <div className="border-t border-[var(--border)] pt-3.5 space-y-3">
                  <div className="flex justify-between items-center text-[11px] text-gray-500 font-mono">
                    <span className="flex items-center space-x-1">
                      <span>⏱️</span>
                      <span>{course.duration}</span>
                    </span>
                    <span className="text-amber-500 font-bold">★ 4.9 ({Math.floor(Math.random() * 500 + 200)} Students)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-gray-400 block leading-none">Starting from</span>
                      <span className="text-xs font-black text-emerald-700 dark:text-amber-400">${course.price}/month</span>
                    </div>
                    <button
                      onClick={() => { setSelectedCourse(course.title); setBookingModal(true); }}
                      className="px-4 py-2 bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary-hover)] rounded-xl text-xs cursor-pointer transition shadow-xs"
                    >
                      Book Trial Class
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <AdContainer id="ad-academy-content" size="728x90 Banner" type="leaderboard" />
      <section id="teachers" className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-5 transition-colors duration-300">
        <div className="text-center max-w-md mx-auto space-y-1.5">
          <span className="text-amber-500 text-lg">🎓</span>
          <h3 className="font-heading font-black text-base">Meet Our Highly Certified Scholars</h3>
          <p className="text-xs text-[var(--text-secondary)]">Our teachers hold accredited degrees and hold direct oral transmission certificates (Sanad) of Tajweed reciting styles.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teachers.map(teacher => (
            <div key={teacher._id} className="p-4 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[var(--text-primary)]">{teacher.name}</h4>
                <div className="text-[10px] font-semibold text-emerald-600 dark:text-amber-400 uppercase tracking-widest">{teacher.specializations?.join(', ') || 'Quran Instructor'}</div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{teacher.qualifications?.join(', ') || teacher.bio}</p>
                <div className="text-[10px] text-gray-400 font-mono pt-1">{teacher.experience}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <div className="text-center max-w-sm mx-auto space-y-1">
          <h3 className="font-heading font-bold text-base">Verified Parent & Student feedback</h3>
          <p className="text-xs text-[var(--text-secondary)]">What brothers and sisters say about academy results</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { name: 'Anas Bilal', location: 'London, UK', quote: 'My children love their lessons on Nazam360. The Noorani Qaida teacher is incredibly supportive, patient, and uses visual tools that keep them excited.', rating: 5 },
            { name: 'Sarah Khan', location: 'Toronto, Canada', quote: 'Being able to take private Tajweed courses online with certified Egyptian instructors has completely changed my relationship with the Holy Quran.', rating: 5 },
          ].map(t => (
            <div key={t.name} className="p-5 bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl shadow-xs space-y-3 relative transition-colors duration-300">
              <div>
                <h4 className="text-xs font-bold flex items-center gap-2"><span>👤</span>{t.name}</h4>
                <span className="text-[10px] text-gray-400">{t.location}</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed italic">"{t.quote}"</p>
              <div className="text-amber-500 text-[10px] font-bold">★★★★★ {t.rating}.0/5</div>
            </div>
          ))}
        </div>
      </section>
      {bookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setBookingModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer text-lg font-bold">✕</button>
            {bookingSuccess ? (
              <div className="text-center py-6 space-y-3">
                <span className="text-5xl block animate-bounce">📅</span>
                <h3 className="font-heading font-bold text-lg text-emerald-600 dark:text-emerald-400">Seat Registration Pending!</h3>
                <p className="text-xs text-[var(--text-secondary)]">JazakAllahu Khayran! An academic coordinator will reach out to you via call or WhatsApp within <span className="font-bold text-amber-500">2-6 hours</span> to confirm trial zoom schedules.</p>
                <div className="h-1.5 w-12 bg-emerald-700 mx-auto rounded-full"></div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <span className="text-3xl">📚</span>
                  <h3 className="font-heading font-bold text-base mt-2 text-[var(--primary)] dark:text-[var(--secondary)]">Schedule Free 1-on-1 Trial Class</h3>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">No credit card or payments required for your first 3 sessions.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Selected Curriculum</label>
                  <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]">
                    {courses.map(c => <option key={c._id} value={c.title}>{c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Student's Name (or Parent's Name)</label>
                  <input type="text" required placeholder="e.g. Bilal Khan" value={studentName} onChange={e => setStudentName(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">WhatsApp / Contact Number</label>
                  <input type="tel" required placeholder="e.g. +1 (555) 019-2834" value={studentContact} onChange={e => setStudentContact(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Preferred Weekly Class Schedule</label>
                  <select value={preferredSlot} onChange={e => setPreferredSlot(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]">
                    <option value="Weekend Morning">Weekend Morning (Sat-Sun)</option>
                    <option value="Weekday Evening">Weekday Evening (Mon-Fri)</option>
                    <option value="Custom Flexible">Custom Flexible / Slot Custom</option>
                  </select>
                </div>
                {submitError && <p className="text-red-500 text-xs text-center">{submitError}</p>}
                <button type="submit" disabled={submitting} className="w-full py-2.5 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-xs transition duration-200 uppercase tracking-widest cursor-pointer shadow-md disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Send Reservation Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
