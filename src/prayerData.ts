import { CityData, IslamicEvent, AcademicCourse, AcademyTeacher, Testimonial, HistoryEvent } from './types';

// Interactive search list of cities with coordinates & prayer details
export const CITIES_DB: CityData[] = [
  {
    name: 'Mecca',
    country: 'Saudi Arabia',
    fajr: '04:12',
    sunrise: '05:38',
    dhuhr: '12:22',
    asr: '15:43',
    maghrib: '19:04',
    isha: '20:34',
    timezone: 'Asia/Riyadh',
    coords: { lat: 21.3891, lng: 39.8579, qibla: 251 }
  },
  {
    name: 'Karachi',
    country: 'Pakistan',
    fajr: '04:15',
    sunrise: '05:42',
    dhuhr: '12:30',
    asr: '15:52',
    maghrib: '19:18',
    isha: '20:45',
    timezone: 'Asia/Karachi',
    coords: { lat: 24.8607, lng: 67.0011, qibla: 268 }
  },
  {
    name: 'Lahore',
    country: 'Pakistan',
    fajr: '04:05',
    sunrise: '05:31',
    dhuhr: '12:18',
    asr: '15:40',
    maghrib: '19:05',
    isha: '20:31',
    timezone: 'Asia/Karachi',
    coords: { lat: 31.5497, lng: 74.3436, qibla: 265 }
  },
  {
    name: 'Islamabad',
    country: 'Pakistan',
    fajr: '03:52',
    sunrise: '05:20',
    dhuhr: '12:10',
    asr: '15:35',
    maghrib: '19:00',
    isha: '20:28',
    timezone: 'Asia/Karachi',
    coords: { lat: 33.6844, lng: 73.0479, qibla: 261 }
  },
  {
    name: 'Dhaka',
    country: 'Bangladesh',
    fajr: '04:10',
    sunrise: '05:35',
    dhuhr: '12:15',
    asr: '15:40',
    maghrib: '18:55',
    isha: '20:20',
    timezone: 'Asia/Dhaka',
    coords: { lat: 23.8103, lng: 90.4125, qibla: 279 }
  },
  {
    name: 'Mumbai',
    country: 'India',
    fajr: '04:30',
    sunrise: '05:55',
    dhuhr: '12:35',
    asr: '15:55',
    maghrib: '19:15',
    isha: '20:40',
    timezone: 'Asia/Kolkata',
    coords: { lat: 19.0760, lng: 72.8777, qibla: 276 }
  },
  {
    name: 'Delhi',
    country: 'India',
    fajr: '04:20',
    sunrise: '05:45',
    dhuhr: '12:25',
    asr: '15:50',
    maghrib: '19:05',
    isha: '20:30',
    timezone: 'Asia/Kolkata',
    coords: { lat: 28.7041, lng: 77.1025, qibla: 272 }
  },
  {
    name: 'Cairo',
    country: 'Egypt',
    fajr: '03:09',
    sunrise: '04:53',
    dhuhr: '11:58',
    asr: '15:34',
    maghrib: '19:00',
    isha: '20:37',
    timezone: 'Africa/Cairo',
    coords: { lat: 30.0444, lng: 31.2357, qibla: 136 }
  },
  {
    name: 'Istanbul',
    country: 'Turkey',
    fajr: '03:30',
    sunrise: '05:10',
    dhuhr: '12:20',
    asr: '16:00',
    maghrib: '19:30',
    isha: '21:00',
    timezone: 'Europe/Istanbul',
    coords: { lat: 41.0082, lng: 28.9784, qibla: 150 }
  },
  {
    name: 'Riyadh',
    country: 'Saudi Arabia',
    fajr: '04:00',
    sunrise: '05:25',
    dhuhr: '12:10',
    asr: '15:30',
    maghrib: '18:55',
    isha: '20:25',
    timezone: 'Asia/Riyadh',
    coords: { lat: 24.7136, lng: 46.6753, qibla: 248 }
  },
  {
    name: 'Dubai',
    country: 'UAE',
    fajr: '04:20',
    sunrise: '05:45',
    dhuhr: '12:30',
    asr: '16:00',
    maghrib: '19:15',
    isha: '20:40',
    timezone: 'Asia/Dubai',
    coords: { lat: 25.2048, lng: 55.2708, qibla: 260 }
  },
  {
    name: 'Kuala Lumpur',
    country: 'Malaysia',
    fajr: '05:10',
    sunrise: '06:35',
    dhuhr: '13:10',
    asr: '16:30',
    maghrib: '19:50',
    isha: '21:10',
    timezone: 'Asia/Kuala_Lumpur',
    coords: { lat: 3.1390, lng: 101.6869, qibla: 293 }
  },
  {
    name: 'Jakarta',
    country: 'Indonesia',
    fajr: '04:25',
    sunrise: '05:50',
    dhuhr: '12:25',
    asr: '15:45',
    maghrib: '19:00',
    isha: '20:25',
    timezone: 'Asia/Jakarta',
    coords: { lat: -6.2088, lng: 106.8456, qibla: 298 }
  },
  {
    name: 'London',
    country: 'United Kingdom',
    fajr: '02:50',
    sunrise: '04:43',
    dhuhr: '13:02',
    asr: '17:21',
    maghrib: '21:21',
    isha: '23:10',
    timezone: 'Europe/London',
    coords: { lat: 51.5074, lng: -0.1278, qibla: 119 }
  },
  {
    name: 'New York',
    country: 'United States',
    fajr: '03:48',
    sunrise: '05:24',
    dhuhr: '12:58',
    asr: '16:58',
    maghrib: '20:31',
    isha: '22:07',
    timezone: 'America/New_York',
    coords: { lat: 40.7128, lng: -74.0060, qibla: 58 }
  },
  {
    name: 'Toronto',
    country: 'Canada',
    fajr: '03:55',
    sunrise: '05:30',
    dhuhr: '13:05',
    asr: '17:05',
    maghrib: '20:40',
    isha: '22:15',
    timezone: 'America/Toronto',
    coords: { lat: 43.6532, lng: -79.3832, qibla: 58 }
  },
  {
    name: 'Sydney',
    country: 'Australia',
    fajr: '04:45',
    sunrise: '06:15',
    dhuhr: '12:55',
    asr: '16:20',
    maghrib: '19:35',
    isha: '21:05',
    timezone: 'Australia/Sydney',
    coords: { lat: -33.8688, lng: 151.2093, qibla: 277 }
  },
  {
    name: 'Medina',
    country: 'Saudi Arabia',
    fajr: '04:10',
    sunrise: '05:35',
    dhuhr: '12:20',
    asr: '15:40',
    maghrib: '19:05',
    isha: '20:30',
    timezone: 'Asia/Riyadh',
    coords: { lat: 24.4672, lng: 39.6112, qibla: 252 }
  },
];

export const ACADEMY_COURSES: AcademicCourse[] = [
  {
    id: 'course-1',
    title: 'Noorani Qaida for Beginners',
    arabicTitle: 'القاعدة النورانية الأساسية',
    duration: '3 Months (24 Lessons)',
    price: '$25/month',
    rating: 4.9,
    studentsCount: 1420,
    image: 'https://images.unsplash.com/photo-1609599006353-e629beabfeae?auto=format&fit=crop&q=80&w=600',
    isFreeTrial: true,
    tag: 'Beginner',
    description: 'Learn step-by-step Arabic letter pronunciation (Makharij) and foundational reading rules with certified instructors.'
  },
  {
    id: 'course-2',
    title: 'Tajweed Mastery Program',
    arabicTitle: 'إتقان التلاوة والتجويد',
    duration: '6 Months (48 Lessons)',
    price: '$35/month',
    rating: 4.8,
    studentsCount: 980,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    isFreeTrial: true,
    tag: 'Intermediate',
    description: 'Master the rules of Noon Sakinah, Meem Sakinah, Mudood, and safe recitative rhythms to beautify your Quranic delivery.'
  },
  {
    id: 'course-3',
    title: 'Quran Hifz & Memorization',
    arabicTitle: 'تحفيظ القرآن الكريم والضبط',
    duration: 'Flexible (Self-Paced)',
    price: '$45/month',
    rating: 5.0,
    studentsCount: 650,
    image: 'https://images.unsplash.com/photo-1584282479211-1c5c56d78776?auto=format&fit=crop&q=80&w=600',
    isFreeTrial: false,
    tag: 'Advanced',
    description: 'A customized, safe memorization pipeline with individual tracking, focused revision matrices, and dual certifications.'
  }
];

export const ACADEMY_TEACHERS: AcademyTeacher[] = [
  {
    name: 'Sheikh Ahmad Al-Azhari',
    role: 'Senior Tajweed Instructor',
    credentials: 'M.A. in Islamic Studies, Al-Azhar University',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    experience: '12+ Years Teaching Experience'
  },
  {
    name: 'Ustadha Fatima Siddiqui',
    role: 'Hifz and Qaida Specialist',
    credentials: 'Ijazah in Hafs \'an \'Asim with High Chain (Sanad)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    experience: '8+ Years Teaching Experience'
  }
];

export const STUDENT_TESTIMONIALS: Testimonial[] = [
  {
    name: 'Anas Bilal',
    location: 'London, UK',
    quote: 'My children love their lessons on Nazam360. The Noorani Qaida teacher is incredibly supportive, patient, and uses visual tools that keep them excited.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    rating: 5
  },
  {
    name: 'Sarah Khan',
    location: 'Toronto, Canada',
    quote: 'Being able to take private Tajweed courses online with certified Egyptian instructors has completely changed my relationship with the Holy Quran.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    rating: 5
  }
];

export const HISTORY_EVENTS: HistoryEvent[] = [
  {
    id: 'history-1',
    title: 'Water Cut Off in Karbala',
    hijriDate: '7 Muharram',
    gregorianDate: 'January 15 (Traditional Reference)', // Fits prompt description
    shortDescription: 'The water supply to Hazrat Imam Hussain (R.A.) and his household was stopped by Yazid\'s forces, worsening conditions before Ashura.',
    fullDescription: 'On the 7th of Muharram, Umar ibn Sa\'d received instructions from Ubayd Allah ibn Ziyad to blockade the Euphrates riverbank. Imam Hussain\'s (R.A.) camp was cut off from clean water supply in the desert of Karbala. The extreme physical deprivation suffered by the family, especially the young children, is remembered as one of the most poignant trials of Islamic history, demonstrating absolute steadfastness in the face of tyranny.',
    impact: 'Established the ultimate standard of patience (Sabr) and justice in Islamic conscious history.',
    amal: [
      'Recite Salawat (Allahumma Salli Ala Muhammad) 100 times to honor the Household of the Prophet.',
      'Reflect on the patience of the Ahl al-Bayt and avoid water wastage.',
      'Provide water to the needy or place water bowls for birds and small animals.'
    ],
    duaArabic: 'إِنَّا لِلَّٰهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ. اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي وَأَخْلِفْ لِي خَيْرًا مِنْهَا',
    duaTranslation: '"Indeed we belong to Allah, and indeed we shall return to Him. O Allah, reward me in my affliction and compensate me with something better than it."',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Safe, standard sample mock mp3 file
  },
  {
    id: 'history-2',
    title: 'Completion of the Kaaba\'s Reconstruction',
    hijriDate: '29 Dhul-Hijjah',
    gregorianDate: 'June 15 (Modern Current Date)',
    shortDescription: 'The sacred reconstruction of the Holy Kaaba by Prophet Ibrahim (A.S.) and Hazrat Ismail (A.S.) as described in Quranic texts.',
    fullDescription: 'Prophet Ibrahim (A.S.) alongside his firstborn Hazrat Ismail (A.S.) completed raising the ancient foundations of the Holy Kaaba in Mecca, building the first house dedicated solely to monotheistic worship on Earth. The station was designated by Almighty Allah for the pilgrimage (Hajj) of mankind.',
    impact: 'Established the spiritual epicenter, the Qiblah direction, and the cornerstone of global Islamic unity.',
    amal: [
      'Recite Du\'a of Ibrahim: "Rabbana Taqabbal Minna" (Our Lord, accept this from us) 33 times.',
      'Make intentions to perform Hajj or Umrah soon.',
      'Offer two rak\'ats of Nafal prayer facing the Qiblah with absolute devotion.'
    ],
    duaArabic: 'رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ',
    duaTranslation: '"Our Lord, accept [this] from us. Indeed You are the Hearing, the Knowing."'
  },
  {
    id: 'history-3',
    title: 'The Great Victory at Badr',
    hijriDate: '17 Ramadan',
    gregorianDate: 'Mid-April Reference',
    shortDescription: 'The legendary Battle of Badr where Muslims triumphed against overwhelming odds, establishing security.',
    fullDescription: 'In the second year after Higrah, 313 ill-equipped Muslim companions triumphed against a mechanised army of over 1,000 Quraysh warriors at the Wells of Badr. Blessed with divine assistance and led directly by Prophet Muhammad (PBUH), the stunning victory secured the sovereignty of the nascent Medina community state forever.',
    impact: 'Vindicated true monotheistic faith, broke the aura of pagan invincibility, and launched a global legacy of courage.',
    amal: [
      'Recite Surat Al-Anfal verses detailing Badr to study courage.',
      'Offer charity to families of martyrs and underprivileged soldiers worldwide.',
      'Increase Istighfar (seeking forgiveness) to fortify spiritual purity.'
    ],
    duaArabic: 'اللَّهُمَّ أَنْجِزْ لِي مَا وَعَدْتَنِي ، اللَّهُمَّ آتِ مَا وَعَدْتَنِي',
    duaTranslation: '"O Allah, fulfill for me that which You have promised me. O Allah, bring about what You have promised."'
  }
];

export const UPCOMING_EVENTS: IslamicEvent[] = [
  {
    name: 'Islamic New Year (1 Muharram 1448 AH)',
    hijriDate: '1 Muharram 1448 AH',
    gregorianDate: 'June 16, 2026',
    daysRemaining: 1,
    description: 'Marks the official spiritual transition into the new Hijri calendar year of 1448.',
    type: 'celebration'
  },
  {
    name: 'Day of Ashura (10 Muharram)',
    hijriDate: '10 Muharram 1448 AH',
    gregorianDate: 'June 25, 2026',
    daysRemaining: 10,
    description: 'Commemorates the salvation of Prophet Musa (A.S.) from Pharaoh, and the martyrdom of Imam Hussain (R.A.) at Karbala.',
    type: 'fard'
  },
  {
    name: 'Mawlid al-Nabi (12 Rabi al-Awwal)',
    hijriDate: '12 Rabi al-Awwal 1448 AH',
    gregorianDate: 'August 24, 2026',
    daysRemaining: 70,
    description: 'The birth of our beloved Prophet Muhammad (Peace Be Upon Him), a mercy to all creation.',
    type: 'sunnah'
  }
];

// Mock conversion for display
export function getHijriDateString(date: Date): string {
  // Let us approximate Hijri date for June 15, 2026 as 29 Dhul-Hijjah 1447 AH
  // Return interactive dates based on day
  const day = date.getDate();
  const month = date.getMonth(); // 5 for June
  const year = date.getFullYear();

  if (year === 2026 && month === 5) {
    if (day === 15) return '29 Dhul-Hijjah 1447 AH';
    if (day === 16) return '1 Muharram 1448 AH';
    if (day === 17) return '2 Muharram 1448 AH';
    if (day === 18) return '3 Muharram 1448 AH';
    if (day === 19) return '4 Muharram 1448 AH';
    if (day === 20) return '5 Muharram 1448 AH';
    if (day === 21) return '6 Muharram 1448 AH';
    if (day === 22) return '7 Muharram 1448 AH';
    return `${day - 15} Muharram 1448 AH`;
  }
  
  // Custom backup for fallback user interactions
  return '29 Dhul-Hijjah 1447 AH';
}

export function getFullDayName(date: Date): string {
  const days = [
    'Yaum al-Ahad (Sunday)',
    'Yaum al-Ithnayn (Monday)',
    'Yaum al-Thulatha (Tuesday)',
    'Yaum al-Arbiad (Wednesday)',
    'Yaum al-Khamis (Thursday)',
    'Yaum al-Jum\'ah (Friday)',
    'Yaum al-Sabt (Saturday)'
  ];
  return days[date.getDay()];
}
