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
    title: 'Islamic New Year — 1 Muharram',
    hijriDate: '1 Muharram',
    gregorianDate: 'June 16 (Traditional Reference)',
    shortDescription: 'The beginning of the Hijri calendar year, marking the migration (Hijrah) of Prophet Muhammad (PBUH) from Mecca to Medina.',
    fullDescription: '1 Muharram marks the start of the Islamic lunar calendar, established during the caliphate of Umar ibn al-Khattab (R.A.). The Hijri calendar takes its epoch from the migration (Hijrah) of Prophet Muhammad (PBUH) from Mecca to Medina in 622 CE — one of the most pivotal events in Islamic history that transformed a persecuted community into the foundation of a just civilization.',
    impact: 'The Hijri calendar serves as a timeless reminder of the sacrifice and faith of the early Muslims who left their homes for the sake of Allah.',
    amal: [
      'Recite the New Moon Du\'a upon sighting the crescent.',
      'Make sincere intentions (Niyyah) for the new year ahead.',
      'Fast on the Day of Ashura (10 Muharram) and preferably also on 9th or 11th.'
    ],
    duaArabic: 'اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْأَمْنِ وَالْإِيمَانِ وَالسَّلَامَةِ وَالْإِسْلَامِ',
    duaTranslation: '"O Allah, bring it upon us with security, faith, safety, and Islam."',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'history-2',
    title: 'Entry of Imam Hussain (R.A.) into Karbala',
    hijriDate: '2 Muharram',
    gregorianDate: 'June 20 (Traditional Reference)',
    shortDescription: 'Imam Hussain (R.A.) and his blessed caravan arrived at the plain of Karbala, where they would make their historic stand.',
    fullDescription: 'On the 2nd of Muharram 61 AH, Imam Hussain (R.A.) along with his family and companions arrived at the land of Karbala. Upon being informed of the location, the Holy Imam exclaimed "Karbala" (trial and affliction). Despite knowing the hardship ahead, he chose to stay and uphold the principles of justice and truth against the illegitimate rule of Yazid.',
    impact: 'The choice of standing against tyranny at Karbala became an eternal symbol of resistance for all oppressed peoples.',
    amal: [
      'Recite Ziyarat Ashura or send salutations upon the Prophet\'s family.',
      'Make sincere intention to always stand for truth, even when alone.',
      'Give charity in the name of the Ahl al-Bayt.'
    ],
    duaArabic: 'اللَّهُمَّ اجْعَلْنِي مَعَ الْحُسَيْنِ فِي الدُّنْيَا وَالْآخِرَةِ',
    duaTranslation: '"O Allah, place me with Hussain in this world and the Hereafter."'
  },
  {
    id: 'history-3',
    title: 'Army of Umar ibn Sa\'d Arrives at Karbala',
    hijriDate: '3 Muharram',
    gregorianDate: 'June 21 (Traditional Reference)',
    shortDescription: 'Umar ibn Sa\'d arrived with a large army, sent by Ubayd Allah ibn Ziyad to confront Imam Hussain (R.A.) at Karbala.',
    fullDescription: 'On the 3rd of Muharram, Umar ibn Sa\'d arrived at Karbala with an army of 4,000 soldiers, later swelling to over 30,000. He was appointed by Ubayd Allah ibn Ziyad to either extract allegiance from Imam Hussain (R.A.) or fight him. Despite his initial reluctance, Umar ibn Sa\'d chose worldly reward over principle, setting the stage for one of history\'s greatest tragedies.',
    impact: 'The choice of worldly power over truth by Umar ibn Sa\'d stands as a warning about the dangers of compromising faith for material gain.',
    amal: [
      'Recite Salawat 100 times sending peace upon the Prophet and his family.',
      'Reflect on the importance of standing firm in one\'s principles.',
      'Make du\'a for strength to choose truth over worldly benefits.'
    ],
    duaArabic: 'رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِلْقَوْمِ الظَّالِمِينَ',
    duaTranslation: '"Our Lord, make us not a trial for the wrongdoing people."'
  },
  {
    id: 'history-4',
    title: 'Imam Hussain\'s Sermon — Path of Truth',
    hijriDate: '4 Muharram',
    gregorianDate: 'June 22 (Traditional Reference)',
    shortDescription: 'Imam Hussain (R.A.) addressed his companions, declaring his unwavering commitment to truth and allowing anyone to leave freely.',
    fullDescription: 'On the 4th of Muharram, Imam Hussain (R.A.) gathered his companions and delivered a powerful sermon. He declared that the enemy sought only him, and that anyone who wished to leave could do so under the cover of night without any obligation. His companions, however, responded with unwavering loyalty, declaring "By Allah, we will never abandon you!" This night solidified the bond of faith and sacrifice that would carry them through the days ahead.',
    impact: 'Demonstrated true leadership — a leader who puts his followers\' safety above his own mission.',
    amal: [
      'Reflect on the meaning of true loyalty and sacrifice.',
      'Make intention to be among those who stand by truth till the end.',
      'Recite Surat Al-Asr and ponder on its message.'
    ],
    duaArabic: 'اللَّهُمَّ ثَبِّتْ قُلُوبَنَا عَلَى دِينِكَ',
    duaTranslation: '"O Allah, make our hearts firm upon Your religion."'
  },
  {
    id: 'history-5',
    title: 'Hazrat Zainab (R.A.) — The Shield of Karbala',
    hijriDate: '5 Muharram',
    gregorianDate: 'June 23 (Traditional Reference)',
    shortDescription: 'Hazrat Zainab (R.A.) began her role as the caretaker and protector of the Imam\'s mission after her brother.',
    fullDescription: 'By the 5th of Muharram, the camp of Imam Hussain (R.A.) was fully besieged by Yazid\'s forces. Hazrat Zainab (R.A.), the daughter of Fatima (R.A.) and Ali (R.A.), emerged as the pillar of strength for the women and children in the camp. Her unwavering faith and eloquence would later carry the message of Karbala to the courts of Kufa and Damascus, forever preserving the legacy of Ashura.',
    impact: 'Demonstrated the critical role of women in preserving Islamic history and spreading the message of truth.',
    amal: [
      'Recite Salawat 100 times honoring the family of the Prophet.',
      'Reflect on the strength and patience of Hazrat Zainab (R.A.).',
      'Support women\'s Islamic education initiatives.'
    ],
    duaArabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا',
    duaTranslation: '"Our Lord, pour upon us patience and plant firmly our feet."'
  },
  {
    id: 'history-6',
    title: 'Habib ibn Madhahir Joins Imam Hussain',
    hijriDate: '6 Muharram',
    gregorianDate: 'June 24 (Traditional Reference)',
    shortDescription: 'Habib ibn Madhahir, a loyal companion, arrived to support Imam Hussain (R.A.) despite the overwhelming enemy forces.',
    fullDescription: 'On the 6th of Muharram, Habib ibn Madhahir al-Asadi, an elderly and devoted companion of the Prophet\'s household, arrived in Karbala with a small band of supporters. Despite the overwhelming numbers of the enemy army, Habib declared his unwavering loyalty to Imam Hussain (R.A.), stating, "I would rather die with you than live under oppression." His arrival brought strength to the small camp, even as the siege tightened and negotiations failed.',
    impact: 'Habib\'s sacrifice reminds us that true faith means standing with truth regardless of the odds or personal cost.',
    amal: [
      'Recite Salawat 100 times sending peace upon the Prophet\'s family.',
      'Reflect on the value of loyalty and faithfulness.',
      'Make du\'a to be blessed with righteous companions.'
    ],
    duaArabic: 'اللَّهُمَّ ارْزُقْنَا مَوَدَّةَ أَهْلِ بَيْتِ نَبِيِّكَ',
    duaTranslation: '"O Allah, grant us the love of the household of Your Prophet."'
  },
  {
    id: 'history-7',
    title: 'Water Cut Off in Karbala',
    hijriDate: '7 Muharram',
    gregorianDate: 'June 25 (Traditional Reference)',
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
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'history-8',
    title: 'Encirclement of Imam Hussain\'s Camp',
    hijriDate: '8 Muharram',
    gregorianDate: 'June 26 (Traditional Reference)',
    shortDescription: 'Yazid\'s forces completely surrounded Imam Hussain\'s camp, sealing all escape routes and preparing for battle.',
    fullDescription: 'By the 8th of Muharram, the forces of Yazid had completely encircled the camp of Imam Hussain (R.A.). Umar ibn Sa\'d ordered his troops to tighten the noose, positioning archers and cavalry around the small encampment. Despite being vastly outnumbered and completely cut off from water and supplies, the spirit of the camp remained unbroken. The night fell with an eerie silence, knowing that the final confrontation was now inevitable.',
    impact: 'Shows the depth of oppression faced by the Ahl al-Bayt and their unbreakable faith in the face of certain death.',
    amal: [
      'Recite Astaghfirullah 100 times seeking forgiveness.',
      'Reflect on the importance of trust in Allah during difficult times.',
      'Make du\'a for the oppressed Muslims around the world.'
    ],
    duaArabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    duaTranslation: '"Sufficient for us is Allah, and He is the best Disposer of affairs."'
  },
  {
    id: 'history-9',
    title: 'Tasu\'a — The Night of Vigil',
    hijriDate: '9 Muharram',
    gregorianDate: 'June 27 (Traditional Reference)',
    shortDescription: 'The night before Ashura — Imam Hussain and his companions spent the entire night in worship, preparing to meet their Lord.',
    fullDescription: 'The 9th of Muharram, known as Tasu\'a, was a night of profound spiritual significance. Imam Hussain (R.A.) requested a one-night reprieve from Umar ibn Sa\'d to spend in worship. The camp spent the entire night in prayer, recitation of the Quran, and supplication. The sound of worship echoed through the desert as the small band of believers prepared to meet their Creator. Shimr ibn Dhil-Jawshan brought a guarantee of safety for some relatives, but Imam Hussain (R.A.) refused any offer that excluded his companions, declaring, "I will never abandon my companions."',
    impact: 'Tasu\'a stands as a symbol of absolute loyalty — a leader who refuses personal safety without his companions.',
    amal: [
      'Fast on Tasu\'a (9th Muharram) following the Sunnah.',
      'Spend the night in worship and recitation of the Quran.',
      'Make sincere repentance and seek forgiveness for all sins.'
    ],
    duaArabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ حُسْنَ الْخَاتِمَةِ',
    duaTranslation: '"O Allah, I ask You for a good end."'
  },
  {
    id: 'history-10',
    title: 'Day of Ashura — The Ultimate Sacrifice',
    hijriDate: '10 Muharram',
    gregorianDate: 'June 28 (Traditional Reference)',
    shortDescription: 'The martyrdom of Imam Hussain (R.A.) and his loyal companions on the plains of Karbala — the zenith of sacrifice for truth.',
    fullDescription: 'On the 10th of Muharram 61 AH (October 10, 680 CE), Imam Hussain (R.A.) and approximately 72 of his family members and companions were martyred on the scorching plains of Karbala after days of thirst and siege. Despite the tragedy, Imam Hussain\'s unwavering stand against tyranny ensured that the true spirit of Islam would never be extinguished. His final moments were spent in prostration, and his sacrifice became a beacon of courage, justice, and faith for all generations.',
    impact: 'Ashura stands as the most profound symbol of sacrifice for justice in Islamic history, inspiring countless movements for truth worldwide.',
    amal: [
      'Fast on the 9th and 10th of Muharram (or 10th and 11th) following the Sunnah.',
      'Recite Surat Al-Ikhlas 1000 times.',
      'Give generously to orphans and the needy.',
      'Reflect on the meaning of sacrifice and renew your commitment to truth.'
    ],
    duaArabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    duaTranslation: '"Sufficient for us is Allah, and He is the best Disposer of affairs."'
  },
  {
    id: 'history-11',
    title: 'Completion of the Kaaba\'s Reconstruction',
    hijriDate: '29 Dhul-Hijjah',
    gregorianDate: 'June 15 (Traditional Reference)',
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
    id: 'history-12',
    title: 'The Great Victory at Badr',
    hijriDate: '17 Ramadan',
    gregorianDate: 'Mid-April Reference',
    shortDescription: 'The legendary Battle of Badr where Muslims triumphed against overwhelming odds, establishing security.',
    fullDescription: 'In the second year after Hijrah, 313 ill-equipped Muslim companions triumphed against a mechanised army of over 1,000 Quraysh warriors at the Wells of Badr. Blessed with divine assistance and led directly by Prophet Muhammad (PBUH), the stunning victory secured the sovereignty of the nascent Medina community state forever.',
    impact: 'Vindicated true monotheistic faith, broke the aura of pagan invincibility, and launched a global legacy of courage.',
    amal: [
      'Recite Surat Al-Anfal verses detailing Badr to study courage.',
      'Offer charity to families of martyrs and underprivileged soldiers worldwide.',
      'Increase Istighfar (seeking forgiveness) to fortify spiritual purity.'
    ],
    duaArabic: 'اللَّهُمَّ أَنْجِزْ لِي مَا وَعَدْتَنِي ، اللَّهُمَّ آتِ مَا وَعَدْتَنِي',
    duaTranslation: '"O Allah, fulfill for me that which You have promised me. O Allah, bring about what You have promised."'
  },
  // Safar
  {
    id: 'history-13',
    title: 'Arbaeen — 40th Day After Ashura',
    hijriDate: '20 Safar',
    gregorianDate: 'July 7 (Traditional Reference)',
    shortDescription: 'The 40th day commemorating the martyrs of Karbala, when the surviving family of Imam Hussain (R.A.) returned to Karbala.',
    fullDescription: 'Arbaeen marks 40 days after the martyrdom of Imam Hussain (R.A.) at Karbala. According to tradition, the surviving family members — including Imam Zain al-Abidin (A.S.) and Hazrat Zainab (R.A.) — returned to Karbala to perform Ziyarat (visitation) of the martyrs. Arbaeen is one of the largest peaceful gatherings in the world, with millions walking to Karbala to pay homage.',
    impact: 'Arbaeen symbolizes the enduring legacy of Karbala and the triumph of truth over tyranny.',
    amal: [
      'Recite Ziyarat Arbaeen if possible.',
      'Send Salawat upon the Prophet and his family 100 times.',
      'Reflect on the message of perseverance and faith.'
    ],
    duaArabic: 'السَّلَامُ عَلَيْكَ يَا أَبَا عَبْدِ اللَّهِ وَعَلَى الْأَرْوَاحِ الَّتِي حَلَّتْ بِفِنَائِكَ',
    duaTranslation: '"Peace be upon you, O Abu Abdillah, and upon the souls that gathered in your courtyard."'
  },
  {
    id: 'history-14',
    title: 'Death of Prophet Muhammad (PBUH)',
    hijriDate: '28 Safar',
    gregorianDate: 'August 14 (Traditional Reference)',
    shortDescription: 'The beloved Prophet Muhammad (PBUH) passed away in Medina, marking the end of direct divine revelation on Earth.',
    fullDescription: 'On 28 Safar 11 AH (8 June 632 CE), Prophet Muhammad (PBUH) passed away in the city of Medina at the age of 63. His final days were spent in the apartment of his beloved wife Aisha (R.A.). His last words were "Al-rafiq al-a\'la" (The Highest Companion). His passing plunged the Muslim community into grief, but his legacy — the Quran and Sunnah — remains the eternal guide for humanity.',
    impact: 'The Seal of the Prophets completed his mission, leaving behind the Quran and his Sunnah as guidance for all mankind until the end of time.',
    amal: [
      'Recite Salawat (Durood) 100 times sending peace upon the Prophet.',
      'Read Seerah (biography) of the Prophet to learn from his life.',
      'Make sincere intention to follow the Sunnah in daily life.'
    ],
    duaArabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
    duaTranslation: '"O Allah, send peace upon Muhammad and upon the family of Muhammad."'
  },
  // Rabi al-Awwal
  {
    id: 'history-15',
    title: 'The Hijrah — Migration to Medina',
    hijriDate: '1 Rabi al-Awwal',
    gregorianDate: 'August 18 (Traditional Reference)',
    shortDescription: 'Prophet Muhammad (PBUH) migrated from Mecca to Medina, marking the turning point for the early Muslim community.',
    fullDescription: 'In 622 CE (13 years after Prophethood), Prophet Muhammad (PBUH) and his companion Abu Bakr (R.A.) secretly left Mecca for Medina after a plot to assassinate the Prophet was discovered. The Hijrah marks the establishment of the first Islamic state in Medina and serves as the epoch of the Islamic calendar. The people of Medina (Ansar) welcomed the Prophet with open arms, and the foundation of a just society was laid.',
    impact: 'The Hijrah transformed the Muslim community from a persecuted minority into the foundation of a civilization based on justice and faith.',
    amal: [
      'Reflect on the sacrifices of the Muhajirun (migrants).',
      'Make du\'a for those who leave their homes for the sake of Allah.',
      'Support refugees and displaced people.'
    ],
    duaArabic: 'رَبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ',
    duaTranslation: '"My Lord, cause me to enter a goodly entrance and to exit a goodly exit."'
  },
  {
    id: 'history-16',
    title: 'Mawlid al-Nabi — Birth of Prophet Muhammad (PBUH)',
    hijriDate: '12 Rabi al-Awwal',
    gregorianDate: 'August 29 (Traditional Reference)',
    shortDescription: 'The birth of the Prophet Muhammad (PBUH), a mercy to all creation, in the blessed city of Mecca.',
    fullDescription: 'Prophet Muhammad (PBUH) was born on 12 Rabi al-Awwal in the Year of the Elephant (approximately 570 CE) in Mecca. His father Abdullah had passed away before his birth, and his mother Amina died when he was six. He was raised by his grandfather Abdul Muttalib and later his uncle Abu Talib. His birth brought light to the world, and he would grow to become the final messenger of Allah, bringing the Quran to humanity.',
    impact: 'The birth of the Prophet Muhammad (PBUH) is the greatest event in human history, as he brought the final divine guidance for all of humanity.',
    amal: [
      'Recite abundant Salawat upon the Prophet.',
      'Read about his noble character and Seerah.',
      'Celebrate by feeding others and showing extra kindness.'
    ],
    duaArabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ',
    duaTranslation: '"O Allah, send peace upon our master Muhammad and upon the family of our master Muhammad."'
  },
  // Rabi al-Thani
  {
    id: 'history-17',
    title: 'Death of Hazrat Fatima (R.A.)',
    hijriDate: '10 Rabi al-Thani',
    gregorianDate: 'September 26 (Traditional Reference)',
    shortDescription: 'The beloved daughter of Prophet Muhammad (PBUH), Hazrat Fatima al-Zahra (R.A.), passed away in Medina.',
    fullDescription: 'Hazrat Fatima al-Zahra (R.A.), the youngest daughter of Prophet Muhammad (PBUH) and Khadijah (R.A.), passed away at the age of approximately 18-27 years, just months after her father\'s death. She was the wife of Imam Ali (R.A.), and the mother of Imam Hasan (R.A.) and Imam Hussain (R.A.). Known for her piety, charity, and devotion, she is considered the leader of the women of Paradise.',
    impact: 'Hazrat Fatima\'s life remains a timeless model of piety, patience, and devotion for all Muslim women.',
    amal: [
      'Recite Tasbih of Fatima (SubhanAllah 33, Alhamdulillah 33, Allahu Akbar 34).',
      'Give charity in her name.',
      'Reflect on her simple and devoted life.'
    ],
    duaArabic: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَاللَّهُ أَكْبَرُ',
    duaTranslation: '"Glory be to Allah, all praise be to Allah, and Allah is the Greatest."'
  },
  // Jumada al-Ula
  {
    id: 'history-18',
    title: 'Birth of Hazrat Zainab (R.A.)',
    hijriDate: '15 Jumada al-Ula',
    gregorianDate: 'October 30 (Traditional Reference)',
    shortDescription: 'The birth of Hazrat Zainab (R.A.), the courageous daughter of Imam Ali (R.A.) and Hazrat Fatima (R.A.).',
    fullDescription: 'Hazrat Zainab (R.A.) was born in Medina to Imam Ali (R.A.) and Hazrat Fatima (R.A.), the daughter of Prophet Muhammad (PBUH). She grew up in the household of revelation and became known for her eloquence, wisdom, and unwavering faith. Her role after the tragedy of Karbala — protecting the captives and delivering powerful sermons in the courts of Kufa and Damascus — preserved the message of Imam Hussain\'s sacrifice for all time.',
    impact: 'Hazrat Zainab (R.A.) is a timeless symbol of courage, eloquence, and faith in the face of unimaginable adversity.',
    amal: [
      'Recite Salawat 100 times honoring the family of the Prophet.',
      'Reflect on the strength and eloquence of Hazrat Zainab.',
      'Support women\'s education in Islamic studies.'
    ],
    duaArabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا',
    duaTranslation: '"Our Lord, pour upon us patience and plant firmly our feet."'
  },
  // Jumada al-Thaniya
  {
    id: 'history-19',
    title: 'Birth of Hazrat Fatima al-Zahra (R.A.)',
    hijriDate: '20 Jumada al-Thaniya',
    gregorianDate: 'December 3 (Traditional Reference)',
    shortDescription: 'The birth of Hazrat Fatima (R.A.), the radiant daughter of Prophet Muhammad (PBUH) and the mother of the Ahl al-Bayt.',
    fullDescription: 'Hazrat Fatima al-Zahra (R.A.), meaning "the radiant one," was born to Prophet Muhammad (PBUH) and Khadijah (R.A.) in Mecca. She is one of the four perfect women of all time according to Islamic tradition. The Prophet said, "Fatima is part of me; whoever angers her angers me." Her marriage to Imam Ali (R.A.) united the Prophet\'s household, and her descendants continue the lineage of the Prophet to this day.',
    impact: 'Hazrat Fatima (R.A.) represents the highest spiritual station attainable by women and remains an eternal role model.',
    amal: [
      'Perform the Tasbih of Fatima (34, 33, 33).',
      'Give charity in her blessed name.',
      'Send abundant Salawat upon the Prophet and his family.'
    ],
    duaArabic: 'رَضِيتُ بِاللَّهِ رَبًّا وَبِمُحَمَّدٍ نَبِيًّا وَبِفَاطِمَةَ سَيِّدَةً',
    duaTranslation: '"I am pleased with Allah as my Lord, Muhammad as my Prophet, and Fatima as my leader."'
  },
  // Rajab
  {
    id: 'history-20',
    title: 'Birth of Imam Ali (R.A.)',
    hijriDate: '13 Rajab',
    gregorianDate: 'January 23 (Traditional Reference)',
    shortDescription: 'The birth of Imam Ali ibn Abi Talib (R.A.), the cousin and son-in-law of Prophet Muhammad (PBUH), inside the Holy Kaaba.',
    fullDescription: 'Imam Ali (R.A.) was born on 13 Rajab inside the Holy Kaaba in Mecca — a unique honor in Islamic history. He was the first child to accept Islam, the cousin of the Prophet, and later his son-in-law through marriage to Fatima (R.A.). Known as "Asadullah" (Lion of Allah), he was renowned for his bravery, wisdom, and deep knowledge of the Quran. He would later become the fourth Caliph of Islam.',
    impact: 'Imam Ali (R.A.) is revered for his unparalleled knowledge, bravery, and justice, serving as a model of Islamic leadership.',
    amal: [
      'Read and reflect on the Nahj al-Balaghah (sayings of Imam Ali).',
      'Recite Salawat 100 times.',
      'Make du\'a for knowledge and wisdom.'
    ],
    duaArabic: 'اللَّهُمَّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا',
    duaTranslation: '"O Allah, increase me in knowledge and grant me understanding."'
  },
  {
    id: 'history-21',
    title: 'Isra and Mi\'raj — The Night Journey',
    hijriDate: '27 Rajab',
    gregorianDate: 'February 6 (Traditional Reference)',
    shortDescription: 'Prophet Muhammad (PBUH) was taken on a miraculous journey from Mecca to Jerusalem and ascended to the heavens.',
    fullDescription: 'On the 27th of Rajab, Prophet Muhammad (PBUH) was transported from the Sacred Mosque in Mecca to Al-Aqsa Mosque in Jerusalem (Isra), and then ascended through the heavens (Mi\'raj) to the presence of Allah. During this journey, the five daily prayers were ordained. The Prophet met earlier prophets and witnessed Paradise and Hell. This event strengthened the faith of the believers and established the connection between the two holy sanctuaries.',
    impact: 'The Mi\'raj established the five daily prayers as the cornerstone of Islamic worship and affirmed the link between Mecca and Jerusalem.',
    amal: [
      'Offer extra prayers, especially at night (Tahajjud).',
      'Recite Surah Al-Isra and reflect on its meanings.',
      'Make sincere repentance and du\'a.'
    ],
    duaArabic: 'سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا',
    duaTranslation: '"Exalted is He who took His servant by night from al-Masjid al-Haram to al-Masjid al-Aqsa."'
  },
  // Shaban
  {
    id: 'history-22',
    title: 'Birth of Imam Hussain (R.A.)',
    hijriDate: '3 Shaban',
    gregorianDate: 'February 12 (Traditional Reference)',
    shortDescription: 'The birth of Imam Hussain (R.A.), the grandson of Prophet Muhammad (PBUH) and the prince of the youth of Paradise.',
    fullDescription: 'Imam Hussain (R.A.) was born on 3 Shaban 4 AH in Medina to Imam Ali (R.A.) and Hazrat Fatima (R.A.). The Prophet Muhammad (PBUH) named him Hussain and held him with great affection, declaring, "Hussain is from me, and I am from Hussain." He would grow to become the central figure of Karbala, whose stand against tyranny would echo through the centuries as the ultimate symbol of sacrifice for justice.',
    impact: 'Imam Hussain\'s birth brought joy to the Prophet\'s household, and his life became a beacon of courage for all generations.',
    amal: [
      'Recite abundant Salawat upon the Prophet and his family.',
      'Learn about the life and teachings of Imam Hussain.',
      'Make intention to uphold justice and truth in all matters.'
    ],
    duaArabic: 'اللَّهُمَّ اجْعَلْنِي مَعَ الْحُسَيْنِ فِي الدُّنْيَا وَالْآخِرَةِ',
    duaTranslation: '"O Allah, place me with Hussain in this world and the Hereafter."'
  },
  {
    id: 'history-23',
    title: 'Shab-e-Barat — Night of Forgiveness',
    hijriDate: '15 Shaban',
    gregorianDate: 'February 24 (Traditional Reference)',
    shortDescription: 'The blessed night of the middle of Shaban, when Allah\'s mercy descends and sins are forgiven.',
    fullDescription: 'Shab-e-Barat (Laylat al-Bara\'ah) is the 15th night of Shaban. The Prophet Muhammad (PBUH) said that on this night, Allah looks upon His creation and forgives all believers except those who associate partners with Him or harbor hatred in their hearts. It is a night of intense worship, prayer, and seeking forgiveness. Many Muslims spend the night in prayer, recitation of the Quran, and making du\'a for their deceased loved ones.',
    impact: 'Shab-e-Barat offers believers a profound opportunity for spiritual renewal and forgiveness before the arrival of Ramadan.',
    amal: [
      'Spend the night in prayer and recitation of the Quran.',
      'Fast on the 15th of Shaban following the Sunnah.',
      'Visit the graves of loved ones and make du\'a for them.'
    ],
    duaArabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    duaTranslation: '"O Allah, You are Forgiving and love forgiveness, so forgive me."'
  },
  // Ramadan
  {
    id: 'history-24',
    title: 'Death of Hazrat Khadijah (R.A.)',
    hijriDate: '10 Ramadan',
    gregorianDate: 'March 20 (Traditional Reference)',
    shortDescription: 'The death of Hazrat Khadijah (R.A.), the first wife of Prophet Muhammad (PBUH) and the first person to accept Islam.',
    fullDescription: 'Hazrat Khadijah bint Khuwaylid (R.A.), the first wife of Prophet Muhammad (PBUH), passed away in Ramadan of the 10th year of Prophethood (619 CE), about three years before the Hijrah. She was the first person to believe in the Prophet\'s message and stood by him through the most difficult years of persecution. Her wealth was used to support the early Muslim community. The Prophet called the year of her death "The Year of Sorrow."',
    impact: 'Hazrat Khadijah\'s unwavering faith and support laid the foundation for the early Muslim community.',
    amal: [
      'Recite Salawat 100 times in her honor.',
      'Give charity to support widows and orphans.',
      'Reflect on the sacrifices of the early believers.'
    ],
    duaArabic: 'رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ',
    duaTranslation: '"Our Lord, forgive us and our brothers who preceded us in faith."'
  },
  {
    id: 'history-25',
    title: 'Martyrdom of Imam Ali (R.A.)',
    hijriDate: '21 Ramadan',
    gregorianDate: 'March 31 (Traditional Reference)',
    shortDescription: 'Imam Ali ibn Abi Talib (R.A.) was martyred while praying in the mosque of Kufa during the blessed nights of Ramadan.',
    fullDescription: 'On the 19th of Ramadan 40 AH, Imam Ali (R.A.) was struck on the head with a poisoned sword by Abd al-Rahman ibn Muljim while leading the Fajr prayer in the mosque of Kufa. He passed away on the 21st of Ramadan at the age of approximately 63. His martyrdom came during a period of great turmoil, yet his legacy of justice, knowledge, and spiritual wisdom continues to inspire Muslims across all traditions.',
    impact: 'Imam Ali\'s martyrdom in the mosque while praying exemplifies his absolute devotion to Allah until his last breath.',
    amal: [
      'Recite abundant Salawat upon the Prophet and his family.',
      'Reflect on the virtues of Imam Ali — knowledge, bravery, and justice.',
      'Increase prayers and charity during the last ten days of Ramadan.'
    ],
    duaArabic: 'فَوَزْ وَرَبِّ الْكَعْبَةِ',
    duaTranslation: '"By the Lord of the Kaaba, I have succeeded."'
  },
  {
    id: 'history-26',
    title: 'Laylat al-Qadr — The Night of Power',
    hijriDate: '27 Ramadan',
    gregorianDate: 'April 6 (Traditional Reference)',
    shortDescription: 'The night when the Quran was first revealed — better than a thousand months.',
    fullDescription: 'Laylat al-Qadr (The Night of Decree) is the most blessed night of the year, occurring in the last ten nights of Ramadan, most commonly observed on the 27th. On this night, the Quran was first revealed to Prophet Muhammad (PBUH) through Angel Jibril. Worship on this night is better than 1,000 months of worship. The angels descend with blessings, and destinies for the coming year are decreed.',
    impact: 'The revelation of the Quran on Laylat al-Qadr changed the course of human history forever.',
    amal: [
      'Spend the night in prayer, Quran recitation, and du\'a.',
      'Recite "Allahumma innaka afuwwun tuhibbul afwa fa\'fu anni" abundantly.',
      'Give charity and seek forgiveness throughout the last ten nights.'
    ],
    duaArabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
    duaTranslation: '"O Allah, You are Forgiving and love forgiveness, so forgive me."'
  },
  // Shawwal
  {
    id: 'history-27',
    title: 'Eid al-Fitr — The Festival of Breaking Fast',
    hijriDate: '1 Shawwal',
    gregorianDate: 'April 10 (Traditional Reference)',
    shortDescription: 'The joyous celebration marking the end of Ramadan, a day of gratitude, charity, and community.',
    fullDescription: 'Eid al-Fitr is celebrated on the 1st of Shawwal, marking the completion of the blessed month of Ramadan. It is a day of joy, gratitude, and community. Muslims begin the day with a special Eid prayer and give Zakat al-Fitr (obligatory charity) before the prayer so that the needy may also celebrate. The Prophet Muhammad (PBUH) said, "For the one who fasts, there are two joys: the joy when he breaks his fast, and the joy when he meets his Lord."',
    impact: 'Eid al-Fitr strengthens community bonds and ensures that the blessings of Ramadan reach everyone, including the less fortunate.',
    amal: [
      'Pay Zakat al-Fitr before the Eid prayer.',
      'Attend the Eid congregation and prayer.',
      'Exchange greetings and spend time with family and friends.'
    ],
    duaArabic: 'تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ',
    duaTranslation: '"May Allah accept from us and from you."'
  },
  {
    id: 'history-28',
    title: 'Battle of Uhud',
    hijriDate: '7 Shawwal',
    gregorianDate: 'April 16 (Traditional Reference)',
    shortDescription: 'The Muslims defended Medina against the Quraysh at Mount Uhud, a battle of profound lessons in obedience and perseverance.',
    fullDescription: 'The Battle of Uhud took place on 7 Shawwal 3 AH (March 23, 625 CE) when the Quraysh of Mecca marched on Medina with 3,000 soldiers to avenge their defeat at Badr. The Prophet Muhammad (PBUH) led 1,000 Muslims to Mount Uhud. Initially victorious, the tide turned when the archers disobeyed the Prophet\'s orders to hold their position, leading to heavy Muslim losses including the Prophet\'s uncle Hamza (R.A.). Despite the setback, the battle taught lasting lessons about discipline, obedience, and steadfastness.',
    impact: 'Uhud taught the Muslim community that victory comes from Allah alone and that disobedience to the leader has severe consequences.',
    amal: [
      'Read Surah Al-Imran verses related to Uhud.',
      'Reflect on the importance of obedience to Allah and His messenger.',
      'Make du\'a for steadfastness in faith.'
    ],
    duaArabic: 'رَبَّنَا لَا تَجْعَلْنَا فِتْنَةً لِلَّذِينَ كَفَرُوا وَاغْفِرْ لَنَا',
    duaTranslation: '"Our Lord, make us not a trial for the disbelievers and forgive us, our Lord."'
  },
  // Dhul-Qa'dah
  {
    id: 'history-29',
    title: 'Treaty of Hudaybiyyah',
    hijriDate: '1 Dhul-Qa\'dah',
    gregorianDate: 'May 9 (Traditional Reference)',
    shortDescription: 'The historic peace treaty between Prophet Muhammad (PBUH) and the Quraysh of Mecca, a strategic turning point for Islam.',
    fullDescription: 'In Dhul-Qa\'dah 6 AH, Prophet Muhammad (PBUH) set out with 1,400 Muslims for Umrah but was stopped at Hudaybiyyah by the Quraysh. After negotiations, the Treaty of Hudaybiyyah was signed, initially seeming unfavorable to Muslims. However, the 10-year peace allowed Islam to spread rapidly, and within two years, the number of believers doubled. The treaty is described in the Quran as a "clear victory."',
    impact: 'The Treaty of Hudaybiyyah demonstrated the power of peaceful diplomacy and strategic patience, leading to the conquest of Mecca.',
    amal: [
      'Reflect on the wisdom of patience in difficult negotiations.',
      'Read Surah Al-Fath (The Victory) which was revealed after this treaty.',
      'Make du\'a for peace and unity among Muslims.'
    ],
    duaArabic: 'إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا',
    duaTranslation: '"Indeed, We have given you a clear victory."'
  },
  {
    id: 'history-30',
    title: 'Birth of Imam Ali al-Ridha (A.S.)',
    hijriDate: '11 Dhul-Qa\'dah',
    gregorianDate: 'May 19 (Traditional Reference)',
    shortDescription: 'The birth of Imam Ali ibn Musa al-Ridha (A.S.), the eighth Imam known for his profound knowledge and piety.',
    fullDescription: 'Imam Ali al-Ridha (A.S.) was born on 11 Dhul-Qa\'dah 148 AH in Medina. He was renowned for his extensive knowledge of Islamic sciences and was appointed as the crown prince by the Abbasid Caliph al-Ma\'mun, though he never actively sought power. His debates with scholars of various faiths demonstrated the intellectual depth of Islamic civilization. His shrine in Mashhad, Iran, is one of the most visited pilgrimage sites in the world.',
    impact: 'Imam al-Ridha\'s legacy of knowledge and interfaith dialogue continues to inspire scholars and seekers of truth.',
    amal: [
      'Seek knowledge and reflect on Islamic teachings.',
      'Visit or learn about the shrine of Imam al-Ridha in Mashhad.',
      'Send Salawat upon the Prophet and his family.'
    ],
    duaArabic: 'رَبِّ زِدْنِي عِلْمًا',
    duaTranslation: '"My Lord, increase me in knowledge."'
  },
  // Dhul-Hijjah (additional events beyond existing 29 Dhul-Hijjah)
  {
    id: 'history-31',
    title: 'Day of Arafah — The Height of Hajj',
    hijriDate: '9 Dhul-Hijjah',
    gregorianDate: 'June 15 (Traditional Reference)',
    shortDescription: 'The most sacred day of the Islamic year, when pilgrims stand on the plain of Arafat and sins are forgiven.',
    fullDescription: 'The 9th of Dhul-Hijjah is the Day of Arafah, the climax of the Hajj pilgrimage. Pilgrims gather on the plain of Arafat from noon until sunset, engaged in prayer, supplication, and repentance. The Prophet Muhammad (PBUH) said, "There is no day on which Allah frees more people from the Fire than the Day of Arafah." For those not performing Hajj, fasting on this day expiates the sins of the previous and coming year.',
    impact: 'The Day of Arafah represents the ultimate act of worship and submission to Allah, uniting millions in a single act of devotion.',
    amal: [
      'Fast on the Day of Arafah (9th Dhul-Hijjah).',
      'Make abundant du\'a and repentance throughout the day.',
      'Recite the Tahleel (La ilaha illallah) and Takbeer abundantly.'
    ],
    duaArabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    duaTranslation: '"There is no god but Allah, alone, without partner."'
  },
  {
    id: 'history-32',
    title: 'Eid al-Adha — Festival of Sacrifice',
    hijriDate: '10 Dhul-Hijjah',
    gregorianDate: 'June 16 (Traditional Reference)',
    shortDescription: 'The celebration of Prophet Ibrahim\'s (A.S.) unwavering obedience to Allah through the symbolic sacrifice.',
    fullDescription: 'Eid al-Adha on 10 Dhul-Hijjah commemorates Prophet Ibrahim\'s (A.S.) willingness to sacrifice his son Ismail (A.S.) in obedience to Allah\'s command. As he was about to carry out the sacrifice, Allah replaced Ismail with a ram. Muslims around the world perform the Eid prayer and sacrifice an animal, distributing the meat to family, friends, and the needy. This day coincides with the final rites of Hajj in Mecca.',
    impact: 'Eid al-Adha embodies the highest level of faith — complete submission to the will of Allah.',
    amal: [
      'Attend the Eid prayer in congregation.',
      'Perform Qurbani (animal sacrifice) if able.',
      'Share meat with family, neighbors, and the poor.'
    ],
    duaArabic: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ',
    duaTranslation: '"In the name of Allah, and Allah is the Greatest."'
  },
  {
    id: 'history-33',
    title: 'Event of Ghadir Khumm',
    hijriDate: '18 Dhul-Hijjah',
    gregorianDate: 'June 24 (Traditional Reference)',
    shortDescription: 'The Prophet Muhammad (PBUH) declared Imam Ali (R.A.) as his successor at Ghadir Khumm during the farewell pilgrimage.',
    fullDescription: 'On 18 Dhul-Hijjah 10 AH, during the return from the Farewell Pilgrimage, Prophet Muhammad (PBUH) stopped at Ghadir Khumm and delivered a famous sermon. He declared, "Of whomsoever I am the master (mawla), this Ali is also his master." This event is celebrated by Shia Muslims as the formal designation of Imam Ali (R.A.) as the Prophet\'s successor, while Sunni Muslims revere it as a declaration of Ali\'s close relationship and virtue.',
    impact: 'Ghadir Khumm stands as one of the most significant events in early Islamic history regarding the succession of leadership.',
    amal: [
      'Recite Salawat upon the Prophet and his family abundantly.',
      'Reflect on the teachings of the Prophet\'s farewell sermon.',
      'Make du\'a for unity among the Muslim Ummah.'
    ],
    duaArabic: 'اللَّهُمَّ وَالِ مَنْ وَالَاهُ وَعَادِ مَنْ عَادَاهُ',
    duaTranslation: '"O Allah, befriend those who befriend him and oppose those who oppose him."'
  },
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
  const day = date.getDate();
  const month = date.getMonth();
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
    if (day === 23) return '8 Muharram 1448 AH';
    if (day === 24) return '9 Muharram 1448 AH';
    if (day === 25) return '10 Muharram 1448 AH';
    return `${day - 15} Muharram 1448 AH`;
  }

  return '29 Dhul-Hijjah 1447 AH';
}

/** Extract "D Month" from a full Hijri string like "4 Muharram 1448 AH" */
export function extractDayMonth(full: string): string {
  const parts = full.split(' ');
  return parts.slice(0, 2).join(' ');
}

/** Find the history event matching today's Hijri date */
export function findTodayHistoryEvent(todayHijriDayMonth: string): HistoryEvent | undefined {
  return HISTORY_EVENTS.find(e => e.hijriDate === todayHijriDayMonth);
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
