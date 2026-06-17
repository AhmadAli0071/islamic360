import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface CourseData {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  curriculum?: { week: number; topic: string }[];
  teacher?: { _id: string; name: string } | string;
  isActive?: boolean;
}

interface TeacherData {
  _id: string;
  name: string;
  slug: string;
  qualifications: string[];
  specializations: string[];
  experience: string;
  isActive?: boolean;
}

interface Stats {
  totalEvents: number;
  totalDuas: number;
  totalHadith: number;
  totalCourses: number;
  totalTeachers: number;
  totalStudents: number;
}

export default function AdminPanel({ language, standalone }: { language: 'en' | 'ur'; standalone?: boolean }) {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'courses' | 'teachers' | 'students'>('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<TeacherData | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try { setStats(await api.getAdminStats() as Stats); } catch (err) { console.error('Stats error:', err); }
    try { setCourses(await api.getAdminCourses() as CourseData[]); } catch (err) { console.error('Courses error:', err); }
    try { setTeachers(await api.getAdminTeachers() as TeacherData[]); } catch (err) { console.error('Teachers error:', err); }
    setLoading(false);
  };

  const handleSaveCourse = async (course: Partial<CourseData>) => {
    try {
      if (editingCourse) {
        await api.updateCourse(editingCourse._id, course);
      } else {
        await api.createCourse(course);
      }
      setShowForm(false);
      setEditingCourse(null);
      await loadAll();
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Delete this course?')) return;
    try {
      await api.deleteCourse(id);
      await loadAll();
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    }
  };

  const handleSaveTeacher = async (teacher: Partial<TeacherData>) => {
    try {
      if (editingTeacher) {
        await api.updateTeacher(editingTeacher._id, teacher);
      } else {
        await api.createTeacher(teacher);
      }
      setShowForm(false);
      setEditingTeacher(null);
      await loadAll();
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (!confirm('Delete this teacher?')) return;
    try {
      await api.deleteTeacher(id);
      await loadAll();
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    }
  };

  const openEditCourse = (course: CourseData) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const openNewCourse = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  if (loading) {
    const skeleton = (
      <div className="flex-1 space-y-6 max-w-5xl mx-auto px-4 pb-16">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </div>
    );
    if (standalone) {
      return <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans antialiased">{skeleton}</div>;
    }
    return skeleton;
  }

  const content = (
    <div className="flex-1 space-y-6 max-w-7xl mx-auto px-4 pb-16">
      {/* HEADER */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-heading font-black text-[var(--primary)] dark:text-[var(--secondary)] flex items-center space-x-2">
            <span>⚙️</span>
            <span>{language === 'en' ? 'Admin Panel — Quran Academy' : 'ایڈمن پینل — قرآن اکیڈمی'}</span>
          </h2>
          {standalone && (
            <a href="/" className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--primary)] hover:text-white transition no-underline cursor-pointer">
              {language === 'en' ? '← Back to Home' : '← مرکزی صفحہ'}
            </a>
          )}
        </div>
      </div>

      {/* STATS */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { label: 'Courses', value: stats.totalCourses, color: 'bg-emerald-500' },
            { label: 'Teachers', value: stats.totalTeachers, color: 'bg-blue-500' },
            { label: 'Students', value: stats.totalStudents, color: 'bg-teal-500' },
            { label: 'Events', value: stats.totalEvents, color: 'bg-amber-500' },
            { label: 'Duas', value: stats.totalDuas, color: 'bg-purple-500' },
            { label: 'Hadith', value: stats.totalHadith, color: 'bg-rose-500' },
          ].map(item => (
            <div key={item.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 text-center">
              <div className={`w-8 h-8 ${item.color} rounded-full mx-auto flex items-center justify-center text-white text-xs font-bold`}>
                {item.value}
              </div>
              <p className="text-xs font-semibold text-[var(--text-primary)] mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* NAV */}
      <div className="flex space-x-2 border-b border-[var(--border)] pb-2">
        {(['dashboard', 'courses', 'teachers', 'students'] as const).map(s => (
          <button key={s} onClick={() => { setActiveSection(s); setShowForm(false); }}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition cursor-pointer ${
              activeSection === s ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--background)]'
            }`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* COURSES SECTION */}
      {activeSection === 'courses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-sm">{language === 'en' ? 'Manage Courses' : 'کورسز کا انتظام'}</h3>
            <button onClick={openNewCourse} className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[var(--primary-hover)] transition">
              + {language === 'en' ? 'New Course' : 'نیا کورس'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--background)] border-b border-[var(--border)] text-left">
                  <th className="p-3 font-bold text-[var(--text-secondary)]">Title</th>
                  <th className="p-3 font-bold text-[var(--text-secondary)]">Category</th>
                  <th className="p-3 font-bold text-[var(--text-secondary)]">Price</th>
                  <th className="p-3 font-bold text-[var(--text-secondary)]">Duration</th>
                  <th className="p-3 font-bold text-[var(--text-secondary)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {courses.map(c => (
                  <tr key={c._id} className="hover:bg-[var(--background)] transition">
                    <td className="p-3 font-semibold">{c.title}</td>
                    <td className="p-3 text-[var(--text-secondary)]">{c.category}</td>
                    <td className="p-3">${c.price}/mo</td>
                    <td className="p-3 text-[var(--text-secondary)]">{c.duration}</td>
                    <td className="p-3">
                      <button onClick={() => openEditCourse(c)} className="px-2 py-1 bg-amber-500 text-white rounded text-[10px] cursor-pointer mr-1">Edit</button>
                      <button onClick={() => handleDeleteCourse(c._id)} className="px-2 py-1 bg-red-500 text-white rounded text-[10px] cursor-pointer">Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* COURSE FORM MODAL */}
          {showForm && (
            <CourseForm
              course={editingCourse}
              language={language}
              onSave={handleSaveCourse}
              onClose={() => { setShowForm(false); setEditingCourse(null); }}
            />
          )}
        </div>
      )}

      {/* TEACHERS SECTION */}
      {activeSection === 'teachers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-sm">{language === 'en' ? 'Manage Teachers' : 'اساتذہ کا انتظام'}</h3>
            <button onClick={() => { setEditingTeacher(null); setShowForm(true); }} className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[var(--primary-hover)] transition">
              + {language === 'en' ? 'New Teacher' : 'نیا استاد'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teachers.map(t => (
              <div key={t._id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold">{t.name}</h4>
                  <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{t.specializations?.join(', ')}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{t.experience}</p>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => { setEditingTeacher(t); setShowForm(true); }} className="px-2 py-1 bg-amber-500 text-white rounded text-[10px] cursor-pointer">Edit</button>
                  <button onClick={() => handleDeleteTeacher(t._id)} className="px-2 py-1 bg-red-500 text-white rounded text-[10px] cursor-pointer">Del</button>
                </div>
              </div>
            ))}
          </div>

          {/* TEACHER FORM MODAL */}
          {showForm && activeSection === 'teachers' && (
            <TeacherForm
              teacher={editingTeacher}
              language={language}
              onSave={handleSaveTeacher}
              onClose={() => { setShowForm(false); setEditingTeacher(null); }}
            />
          )}
        </div>
      )}

      {/* STUDENTS SECTION */}
      {activeSection === 'students' && (
        <StudentsList language={language} />
      )}
    </div>
  );

  if (standalone) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans antialiased">
        {content}
      </div>
    );
  }
  return content;
}

function StudentsList({ language }: { language: 'en' | 'ur' }) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStudents().then(setStudents).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-xs text-[var(--text-secondary)]">Loading...</div>;

  return (
    <div className="space-y-4">
      <h3 className="font-heading font-bold text-sm">{language === 'en' ? 'Student Enrollments' : 'طلبا کے اندراجات'}</h3>
      {students.length === 0 ? (
        <p className="text-xs text-[var(--text-secondary)]">{language === 'en' ? 'No enrollments yet.' : 'ابھی تک کوئی اندراج نہیں۔'}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[var(--background)] border-b border-[var(--border)] text-left">
                <th className="p-2 font-bold">Name</th>
                <th className="p-2 font-bold">Contact</th>
                <th className="p-2 font-bold">Course</th>
                <th className="p-2 font-bold">Slot</th>
                <th className="p-2 font-bold">Status</th>
                <th className="p-2 font-bold">Date</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id} className="border-b border-[var(--border)] hover:bg-[var(--background)]">
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.contact}</td>
                  <td className="p-2">{s.course}</td>
                  <td className="p-2">{s.preferredSlot}</td>
                  <td className="p-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      s.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                      s.status === 'enrolled' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-2 text-gray-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CourseForm({ course, language, onSave, onClose }: {
  course: CourseData | null;
  language: 'en' | 'ur';
  onSave: (data: Partial<CourseData>) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(course?.title || '');
  const [slug, setSlug] = useState(course?.slug || '');
  const [category, setCategory] = useState(course?.category || 'Quran');
  const [description, setDescription] = useState(course?.description || '');
  const [price, setPrice] = useState(course?.price?.toString() || '29');
  const [duration, setDuration] = useState(course?.duration || '12 Weeks');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, slug, category, description, price: Number(price), duration });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer text-lg">✕</button>
        <h3 className="font-heading font-bold text-sm mb-4">{course ? 'Edit Course' : 'New Course'}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)]" />
          <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="Slug (e.g. tajweed-course)" required className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)]" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)]">
            <option value="Quran">Quran</option>
            <option value="Tajweed">Tajweed</option>
            <option value="Hifz">Hifz</option>
            <option value="Tafseer">Tafseer</option>
            <option value="Kids">Kids</option>
            <option value="Arabic">Arabic</option>
          </select>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required rows={3} className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)]" />
          <div className="grid grid-cols-2 gap-3">
            <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price/month" type="number" required className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)]" />
            <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration" required className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)]" />
          </div>
          <button type="submit" className="w-full py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[var(--primary-hover)] transition">
            {course ? 'Update Course' : 'Create Course'}
          </button>
        </form>
      </div>
    </div>
  );
}

function TeacherForm({ teacher, language, onSave, onClose }: {
  teacher: TeacherData | null;
  language: 'en' | 'ur';
  onSave: (data: Partial<TeacherData>) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(teacher?.name || '');
  const [slug, setSlug] = useState(teacher?.slug || '');
  const [specializations, setSpecializations] = useState(teacher?.specializations?.join(', ') || '');
  const [experience, setExperience] = useState(teacher?.experience || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      slug,
      specializations: specializations.split(',').map(s => s.trim()).filter(Boolean),
      experience,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer text-lg">✕</button>
        <h3 className="font-heading font-bold text-sm mb-4">{teacher ? 'Edit Teacher' : 'New Teacher'}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)]" />
          <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="Slug (e.g. qari-ahmad)" required className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)]" />
          <input value={specializations} onChange={e => setSpecializations(e.target.value)} placeholder="Specializations (comma-separated)" className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)]" />
          <input value={experience} onChange={e => setExperience(e.target.value)} placeholder="Experience (e.g. 10 years)" required className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)]" />
          <button type="submit" className="w-full py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[var(--primary-hover)] transition">
            {teacher ? 'Update Teacher' : 'Create Teacher'}
          </button>
        </form>
      </div>
    </div>
  );
}
