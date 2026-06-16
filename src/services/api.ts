const API = '/api';

async function fetchJSON(url: string) {
  const res = await fetch(`${API}${url}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'API error');
  return json.data;
}

async function postJSON(url: string, body: unknown) {
  const res = await fetch(`${API}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'API error');
  return json.data;
}

async function putJSON(url: string, body: unknown) {
  const res = await fetch(`${API}${url}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'API error');
  return json.data;
}

async function del(url: string) {
  const res = await fetch(`${API}${url}`, { method: 'DELETE' });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'API error');
  return json.data;
}

export const api = {
  // Events
  getTodayEvents: () => fetchJSON('/events/today'),
  getMonthEvents: (month: string) => fetchJSON(`/events/month/${month}`),
  getUpcomingEvents: () => fetchJSON('/events/upcoming'),

  // Hadith
  getDailyHadith: () => fetchJSON('/hadith/daily'),
  getRandomHadith: () => fetchJSON('/hadith/random'),

  // Duas
  getDuas: (category?: string) => fetchJSON(`/duas${category ? `?category=${category}` : ''}`),
  getDailyDua: () => fetchJSON('/duas/daily'),

  // Courses
  getCourses: () => fetchJSON('/courses'),
  getCourseBySlug: (slug: string) => fetchJSON(`/courses/${slug}`),

  // Admin
  getAdminStats: () => fetchJSON('/admin/stats'),
  getAdminUsers: () => fetchJSON('/admin/users'),
  createEvent: (data: unknown) => postJSON('/admin/events', data),
  updateEvent: (id: string, data: unknown) => putJSON(`/admin/events/${id}`, data),
  deleteEvent: (id: string) => del(`/admin/events/${id}`),
  createDua: (data: unknown) => postJSON('/admin/duas', data),
  updateDua: (id: string, data: unknown) => putJSON(`/admin/duas/${id}`, data),
  deleteDua: (id: string) => del(`/admin/duas/${id}`),
  createHadith: (data: unknown) => postJSON('/admin/hadith', data),
  updateHadith: (id: string, data: unknown) => putJSON(`/admin/hadith/${id}`, data),
  deleteHadith: (id: string) => del(`/admin/hadith/${id}`),
  createCourse: (data: unknown) => postJSON('/admin/courses', data),
  updateCourse: (id: string, data: unknown) => putJSON(`/admin/courses/${id}`, data),
  deleteCourse: (id: string) => del(`/admin/courses/${id}`),

  // Teachers
  getTeachers: () => fetchJSON('/admin/teachers'),
  createTeacher: (data: unknown) => postJSON('/admin/teachers', data),
  updateTeacher: (id: string, data: unknown) => putJSON(`/admin/teachers/${id}`, data),
  deleteTeacher: (id: string) => del(`/admin/teachers/${id}`),
};
