export interface PrayerDay {
  date: string; // YYYY-MM-DD
  gregorianDate: string; // June 15, 2026
  hijriDate: string; // 29 Dhul-Hijjah 1447 AH
  dayName: string; // Monday
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface CityData {
  name: string;
  country: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  timezone: string;
  coords: {
    lat: number;
    lng: number;
    qibla: number; // Qibla angle in degrees from North
  };
}

export interface IslamicEvent {
  name: string;
  hijriDate: string;
  gregorianDate: string;
  daysRemaining: number;
  description: string;
  type: 'fard' | 'sunnah' | 'history' | 'celebration';
}

export interface AcademicCourse {
  id: string;
  title: string;
  arabicTitle?: string;
  duration: string;
  price: string;
  rating: number;
  studentsCount: number;
  image: string;
  isFreeTrial: boolean;
  tag: string;
  description: string;
}

export interface AcademyTeacher {
  name: string;
  role: string;
  credentials: string;
  avatar: string;
  experience: string;
}

export interface Testimonial {
  name: string;
  location: string;
  quote: string;
  avatar: string;
  rating: number;
}

export interface HistoryEvent {
  id: string;
  title: string;
  hijriDate: string;
  gregorianDate: string;
  shortDescription: string;
  fullDescription: string;
  impact: string;
  amal: string[];
  duaArabic?: string;
  duaTranslation?: string;
  audioUrl?: string;
}
