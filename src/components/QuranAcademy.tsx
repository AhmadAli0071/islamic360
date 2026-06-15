import React, { useState } from 'react';
import { ACADEMY_COURSES, ACADEMY_TEACHERS, STUDENT_TESTIMONIALS } from '../prayerData';
import AdContainer from './AdContainer';

interface QuranAcademyProps {
  language: 'en' | 'ur';
}

export default function QuranAcademy({ language }: QuranAcademyProps) {
  const [bookingModal, setBookingModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(ACADEMY_COURSES[0].title);
  const [studentName, setStudentName] = useState('');
  const [studentContact, setStudentContact] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('Weekend Morning');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName && studentContact) {
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setBookingModal(false);
        setStudentName('');
        setStudentContact('');
      }, 4000);
    }
  };

  return (
    <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16">
      
      {/* AD PLACEMENT: Leaderboard in header */}
      <AdContainer id="ad-academy-header" size="728x90 Header Ad" type="leaderboard" />

      {/* CORE HERO INTRO */}
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
                setSelectedCourse('Noorani Qaida for Beginners');
                setBookingModal(true);
              }}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs transition uppercase tracking-wider cursor-pointer shadow-md"
            >
              Book One-on-One Free Trial
            </button>
            <a
              href="#teachers"
              className="px-6 py-3 rounded-xl bg-transparent border-2 border-white/20 hover:border-white/50 text-white text-xs font-bold transition text-center uppercase tracking-wider"
            >
              Meet Our Scholars
            </a>
          </div>
        </div>

        <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative border-4 border-emerald-800/80">
          <img 
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600" 
            alt="Islamic learning"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover max-h-56"
          />
        </div>
      </section>

      {/* REASSURANCE POINTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '👥', title: '1-on-1 Classes', desc: 'Personalized private coaching' },
          { icon: '👩‍🏫', title: 'Female Teachers', desc: 'Secure rooms for sisters' },
          { icon: '🗓️', title: 'Flexible Times', desc: 'Reschedule classes anytime' },
          { icon: '🏅', title: 'Ijazah Certificates', desc: 'Highest verified Chains' }
        ].map(item => (
          <div key={item.title} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-center space-y-1">
            <span className="text-xl block">{item.icon}</span>
            <h4 className="text-xs font-bold text-[var(--text-primary)]">{item.title}</h4>
            <p className="text-[10px] text-[var(--text-secondary)]">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* CORE COURSE CARDS */}
      <section className="space-y-4">
        <div>
          <h3 className="font-heading font-bold text-lg flex items-center space-x-2">
            <span>📚</span>
            <span>Academy Course Catalogs</span>
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Explore carefully compiled learning structures taught via secure interactive zoom dashboards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ACADEMY_COURSES.map(course => (
            <div 
              key={course.id} 
              className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition group"
            >
              <div className="relative h-44 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    {course.tag}
                  </span>
                  <h4 className="text-white text-sm font-semibold font-arabic leading-none mt-1">
                    {course.arabicTitle}
                  </h4>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold leading-tight group-hover:text-[var(--primary)] dark:group-hover:text-amber-400 transition">
                    {course.title}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="border-t border-[var(--border)] pt-3.5 space-y-3">
                  <div className="flex justify-between items-center text-[11px] text-gray-500 font-mono">
                    <span className="flex items-center space-x-1">
                      <span>⏱️</span>
                      <span>{course.duration}</span>
                    </span>
                    <span className="text-amber-500 font-bold">
                      ★ {course.rating.toFixed(1)} ({course.studentsCount} Students)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-gray-400 block leading-none">Starting from</span>
                      <span className="text-xs font-black text-emerald-700 dark:text-amber-400">{course.price}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCourse(course.title);
                        setBookingModal(true);
                      }}
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

      {/* AD PLACEMENT: Between course cards */}
      <AdContainer id="ad-academy-content" size="728x90 Banner" type="leaderboard" />

      {/* TEACHERS PROFILES SECTION */}
      <section id="teachers" className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm space-y-5 transition-colors duration-300">
        <div className="text-center max-w-md mx-auto space-y-1.5">
          <span className="text-amber-500 text-lg">🎓</span>
          <h3 className="font-heading font-black text-base">Meet Our Highly Certified Scholars</h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Our teachers hold accredited degrees and hold direct oral transmission certificates (Sanad) of Tajweed reciting styles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ACADEMY_TEACHERS.map(teacher => (
            <div 
              key={teacher.name} 
              className="flex flex-col sm:flex-row items-center sm:items-start p-4 bg-[var(--background)] rounded-2xl border border-[var(--border)] gap-4"
            >
              <img 
                src={teacher.avatar} 
                alt={teacher.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-amber-500/30"
              />
              <div className="text-center sm:text-left space-y-1">
                <h4 className="text-xs font-bold text-[var(--text-primary)]">{teacher.name}</h4>
                <div className="text-[10px] font-semibold text-emerald-600 dark:text-amber-400 uppercase tracking-widest">{teacher.role}</div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{teacher.credentials}</p>
                <div className="text-[10px] text-gray-400 font-mono pt-1">{teacher.experience}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS CAROUSEL */}
      <section className="space-y-4">
        <div className="text-center max-w-sm mx-auto space-y-1">
          <h3 className="font-heading font-bold text-base">Verified Parent & Student feedback</h3>
          <p className="text-xs text-[var(--text-secondary)]">What brothers and sisters say about academy results</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {STUDENT_TESTIMONIALS.map(t => (
            <div 
              key={t.name} 
              className="p-5 bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl shadow-xs space-y-3.5 relative transition-colors duration-300"
            >
              <span className="text-4xl absolute -top-1.5 right-4 opacity-15 select-none leading-none">“</span>
              
              <div className="flex items-center space-x-3.5">
                <img 
                  src={t.avatar} 
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover shrink-0" 
                />
                <div>
                  <h4 className="text-xs font-bold">{t.name}</h4>
                  <span className="text-[10px] text-gray-400">{t.location}</span>
                </div>
              </div>

              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed italic">
                "{t.quote}"
              </p>

              <div className="text-amber-500 text-[10px] font-bold">
                ★★★★★ Rated ({t.rating}.0 / 5)
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKING MODAL */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setBookingModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer text-lg font-bold"
            >
              ✕
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-3">
                <span className="text-5xl block animate-bounce">📅</span>
                <h3 className="font-heading font-bold text-lg text-emerald-600 dark:text-emerald-400">
                  Seat Registration Pending!
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  JazakAllahu Khayran! An academic coordinator will reach out to you via call or WhatsApp within <span className="font-bold text-amber-500">2-6 hours</span> to confirm trial zoom schedules.
                </p>
                <div className="h-1.5 w-12 bg-emerald-700 mx-auto rounded-full"></div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <span className="text-3xl">📚</span>
                  <h3 className="font-heading font-bold text-base mt-2 text-[var(--primary)] dark:text-[var(--secondary)]">
                    Schedule Free 1-on-1 Trial Class
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    No credit card or payments required for your first 3 sessions.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Selected Curriculum</label>
                  <select
                    value={selectedCourse}
                    onChange={e => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                  >
                    {ACADEMY_COURSES.map(c => (
                      <option key={c.id} value={c.title}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Student's Name (or Parent's Name)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bilal Khan"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] animate-fadeIn"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">WhatsApp / Contact Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 (555) 019-2834"
                    value={studentContact}
                    onChange={e => setStudentContact(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Preferred Weekly Class Schedule</label>
                  <select
                    value={preferredSlot}
                    onChange={e => setPreferredSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                  >
                    <option value="Weekend Morning">Weekend Morning (Sat-Sun)</option>
                    <option value="Weekday Evening">Weekday Evening (Mon-Fri)</option>
                    <option value="Custom Flexible">Custom Flexible / Slot Custom</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-xs transition duration-200 uppercase tracking-widest cursor-pointer shadow-md"
                >
                  Send Reservation Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
