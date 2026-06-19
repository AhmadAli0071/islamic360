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

interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isActive?: boolean;
}

interface OrderData {
  _id: string;
  items: { product: { _id: string; name: string; image: string }; name: string; price: number; quantity: number }[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: string;
  createdAt: string;
}

interface Stats {
  totalEvents: number;
  totalDuas: number;
  totalHadith: number;
  totalCourses: number;
  totalTeachers: number;
  totalStudents: number;
  totalProducts: number;
  totalOrders: number;
}

const ADMIN_PIN = '135813';

export default function AdminPanel({ language, standalone }: { language: 'en' | 'ur'; standalone?: boolean }) {
  const [pinVerified, setPinVerified] = useState(() => sessionStorage.getItem('admin_pin') === ADMIN_PIN);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'courses' | 'teachers' | 'students' | 'products' | 'orders' | 'notifications'>('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<TeacherData | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [sendingNotif, setSendingNotif] = useState(false);
  const [notifSent, setNotifSent] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setPinVerified(true);
      sessionStorage.setItem('admin_pin', ADMIN_PIN);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  useEffect(() => {
    if (pinVerified) loadAll(); else setLoading(false);
  }, [pinVerified]);

  const loadAll = async () => {
    setLoading(true);
    try { setStats(await api.getAdminStats() as Stats); } catch (err) { console.error('Stats error:', err); }
    try { setCourses(await api.getAdminCourses() as CourseData[]); } catch (err) { console.error('Courses error:', err); }
    try { setTeachers(await api.getAdminTeachers() as TeacherData[]); } catch (err) { console.error('Teachers error:', err); }
    try { setProducts(await api.getAdminProducts() as ProductData[]); } catch (err) { console.error('Products error:', err); }
    try { setOrders(await api.getAdminOrders() as OrderData[]); } catch (err) { console.error('Orders error:', err); }
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

  const handleSaveProduct = async (data: Partial<ProductData> | FormData) => {
    try {
      if (editingProduct) {
        if (data instanceof FormData) {
          await api.updateProductWithImage(editingProduct._id, data);
        } else {
          await api.updateProduct(editingProduct._id, data);
        }
      } else {
        if (data instanceof FormData) {
          await api.createProductWithImage(data);
        } else {
          await api.createProduct(data);
        }
      }
      setShowForm(false);
      setEditingProduct(null);
      await loadAll();
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id);
      await loadAll();
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      await api.updateOrderStatus(id, { status });
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

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingNotif(true);
    try {
      await api.sendNotification({ title: notifTitle, body: notifBody });
      setNotifSent(true);
      setNotifTitle('');
      setNotifBody('');
      setTimeout(() => setNotifSent(false), 4000);
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setSendingNotif(false);
    }
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

  if (!pinVerified) {
    const pinScreen = (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
        <form onSubmit={handlePinSubmit} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 shadow-xl w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="text-4xl">🔐</div>
            <h2 className="text-lg font-heading font-bold text-[var(--text-primary)]">
              {language === 'en' ? 'Admin Access' : 'ایڈمن رسائی'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              {language === 'en' ? 'Enter PIN to access admin panel' : 'ایڈمن پینل کھولنے کے لیے پن درج کریں'}
            </p>
          </div>
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pinInput}
            onChange={e => { setPinInput(e.target.value); setPinError(false); }}
            className="w-full text-center text-2xl tracking-[0.5em] px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
            placeholder="••••••"
            autoFocus
          />
          {pinError && (
            <p className="text-red-500 text-xs text-center font-medium">
              {language === 'en' ? 'Incorrect PIN. Try again.' : 'غلط پن۔ دوبارہ کوشش کریں۔'}
            </p>
          )}
          <button type="submit" className="w-full py-2.5 bg-[var(--primary)] text-white text-sm font-bold rounded-xl hover:bg-[var(--primary-hover)] transition cursor-pointer">
            {language === 'en' ? 'Unlock' : 'انلاک کریں'}
          </button>
        </form>
      </div>
    );
    if (standalone) {
      return <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans antialiased">{pinScreen}</div>;
    }
    return pinScreen;
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
            { label: 'Products', value: stats.totalProducts, color: 'bg-orange-500' },
            { label: 'Orders', value: stats.totalOrders, color: 'bg-pink-500' },
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
      <div className="flex space-x-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
        {(['dashboard', 'courses', 'teachers', 'students', 'products', 'orders', 'notifications'] as const).map(s => (
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

      {/* PRODUCTS SECTION */}
      {activeSection === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-sm">{language === 'en' ? 'Manage Products' : 'مصنوعات کا انتظام'}</h3>
            <button onClick={() => { setEditingProduct(null); setShowForm(true); }} className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[var(--primary-hover)] transition">
              + {language === 'en' ? 'New Product' : 'نئی پروڈکٹ'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--background)] border-b border-[var(--border)] text-left">
                  <th className="p-3 font-bold text-[var(--text-secondary)]">Image</th>
                  <th className="p-3 font-bold text-[var(--text-secondary)]">Name</th>
                  <th className="p-3 font-bold text-[var(--text-secondary)]">Category</th>
                  <th className="p-3 font-bold text-[var(--text-secondary)]">Price</th>
                  <th className="p-3 font-bold text-[var(--text-secondary)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {products.map(p => (
                  <tr key={p._id} className="hover:bg-[var(--background)] transition">
                    <td className="p-3">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg">📦</div>
                      )}
                    </td>
                    <td className="p-3 font-semibold">{p.name}</td>
                    <td className="p-3 text-[var(--text-secondary)]">{p.category}</td>
                    <td className="p-3">Rs.{p.price}</td>
                    <td className="p-3">
                      <button onClick={() => { setEditingProduct(p); setShowForm(true); }} className="px-2 py-1 bg-amber-500 text-white rounded text-[10px] cursor-pointer mr-1">Edit</button>
                      <button onClick={() => handleDeleteProduct(p._id)} className="px-2 py-1 bg-red-500 text-white rounded text-[10px] cursor-pointer">Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PRODUCT FORM MODAL */}
          {showForm && activeSection === 'products' && (
            <ProductForm
              product={editingProduct}
              language={language}
              onSave={handleSaveProduct}
              onClose={() => { setShowForm(false); setEditingProduct(null); }}
            />
          )}
        </div>
      )}

      {/* ORDERS SECTION */}
      {activeSection === 'orders' && (
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-sm">{language === 'en' ? 'Manage Orders' : 'آرڈرز کا انتظام'}</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--background)] border-b border-[var(--border)] text-left">
                  <th className="p-3 font-bold text-[var(--text-secondary)]">Customer</th>
                  <th className="p-3 font-bold text-[var(--text-secondary)]">Phone</th>
                  <th className="p-3 font-bold text-[var(--text-secondary)]">Items</th>
                  <th className="p-3 font-bold text-[var(--text-secondary)]">Total</th>
                  <th className="p-3 font-bold text-[var(--text-secondary)]">Status</th>
                  <th className="p-3 font-bold text-[var(--text-secondary)]">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {orders.map(o => (
                  <tr key={o._id} className="hover:bg-[var(--background)] transition">
                    <td className="p-3 font-semibold">{o.customerName}</td>
                    <td className="p-3">{o.customerPhone}</td>
                    <td className="p-3 text-[var(--text-secondary)]">{o.items.map(i => i.name).join(', ')}</td>
                    <td className="p-3 font-bold">Rs.{o.totalAmount}</td>
                    <td className="p-3">
                      <select value={o.status} onChange={e => handleUpdateOrderStatus(o._id, e.target.value)}
                        className={`px-2 py-1 rounded text-[10px] font-bold border cursor-pointer ${
                          o.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                          o.status === 'confirmed' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                          o.status === 'shipped' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                          o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                          'bg-red-100 text-red-700 border-red-300'
                        }`}>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3 text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS SECTION */}
      {activeSection === 'notifications' && (
        <div className="space-y-4 max-w-lg">
          <h3 className="font-heading font-bold text-sm">{language === 'en' ? 'Send Notification' : 'نوٹیفیکیشن بھیجیں'}</h3>
          <p className="text-[10px] text-[var(--text-secondary)]">
            {language === 'en'
              ? 'Chrome notification sab users ko instantly bhej dega.'
              : 'تمام صارفین کو فوری Chrome نوٹیفیکیشن بھیجیں۔'}
          </p>
          <form onSubmit={handleSendNotification} className="space-y-3">
            <input
              value={notifTitle}
              onChange={e => setNotifTitle(e.target.value)}
              placeholder={language === 'en' ? 'Title' : 'عنوان'}
              required
              className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] placeholder-gray-400"
            />
            <textarea
              value={notifBody}
              onChange={e => setNotifBody(e.target.value)}
              placeholder={language === 'en' ? 'Body (optional)' : 'متن (اختیاری)'}
              rows={3}
              className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={sendingNotif}
              className="w-full py-2.5 bg-[var(--primary)] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[var(--primary-hover)] transition disabled:opacity-50"
            >
              {sendingNotif
                ? (language === 'en' ? 'Sending...' : 'بھیج رہا ہے...')
                : (language === 'en' ? '🔔 Send Notification' : '🔔 نوٹیفیکیشن بھیجیں')}
            </button>
          </form>
          {notifSent && (
            <div className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-semibold px-4 py-2 rounded-lg text-center">
              {language === 'en' ? '✅ Notification sent successfully!' : '✅ نوٹیفیکیشن کامیابی سے بھیج دیا گیا!'}
            </div>
          )}
        </div>
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

function ProductForm({ product, language, onSave, onClose }: {
  product: ProductData | null;
  language: 'en' | 'ur';
  onSave: (data: Partial<ProductData> | FormData) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [category, setCategory] = useState(product?.category || 'General');
  const [imageUrl, setImageUrl] = useState(product?.image || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(product?.image || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFile) {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('description', description);
      fd.append('price', price);
      fd.append('category', category);
      fd.append('image', imageFile);
      if (imageUrl && !imageUrl.startsWith('data:')) fd.append('imageUrl', imageUrl);
      onSave(fd);
    } else {
      onSave({ name, description, price: Number(price), category, image: imageUrl });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer text-lg">✕</button>
        <h3 className="font-heading font-bold text-sm mb-4">{product ? (language === 'en' ? 'Edit Product' : 'پروڈکٹ میں ترمیم') : (language === 'en' ? 'New Product' : 'نئی پروڈکٹ')}</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder={language === 'en' ? 'Product Name' : 'پروڈکٹ کا نام'} required className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)]" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={language === 'en' ? 'Description' : 'تفصیل'} required rows={3} className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)]" />
          <div className="grid grid-cols-2 gap-3">
            <input value={price} onChange={e => setPrice(e.target.value)} placeholder={language === 'en' ? 'Price (Rs.)' : 'قیمت (روپے)'} type="number" required className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)]" />
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)]">
              <option value="General">General</option>
              <option value="Books">Books</option>
              <option value="Clothing">Clothing</option>
              <option value="Home">Home</option>
              <option value="Digital">Digital</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--text-secondary)]">{language === 'en' ? 'Upload Image' : 'تصویر اپ لوڈ کریں'}</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-xs text-[var(--text-primary)] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-[var(--primary)] file:text-white cursor-pointer" />
          </div>
          {!imageFile && (
            <input value={imageUrl} onChange={e => { setImageUrl(e.target.value); setPreview(e.target.value); }} placeholder={language === 'en' ? 'Or paste image URL' : 'یا تصویر کا لنک ڈالیں'} className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)]" />
          )}
          {preview && <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-[var(--border)]" onError={e => (e.currentTarget.style.display = 'none')} />}
          <button type="submit" className="w-full py-2 bg-[var(--primary)] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[var(--primary-hover)] transition">
            {product ? (language === 'en' ? 'Update Product' : 'اپ ڈیٹ کریں') : (language === 'en' ? 'Create Product' : 'محفوظ کریں')}
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
