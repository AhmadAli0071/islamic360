import Teacher from '../models/Teacher.js';
import Course from '../models/Course.js';

const teachers = [
  {
    name: 'Qari Ahmad',
    slug: 'qari-ahmad',
    qualifications: ['Qiraat Sanad', 'Tajweed Certification', 'M.A. Islamic Studies'],
    specializations: ['Tajweed', 'Qiraat', 'Quran Recitation'],
    experience: '10 years',
    bio: 'Qari Ahmad is a certified Tajweed expert with Ijazah in Qiraat. He has taught over 500 students the proper recitation of Quran.',
  },
  {
    name: 'Hafiza Ayesha',
    slug: 'hafiza-ayesha',
    qualifications: ['Hifz Certification', 'B.A. Islamic Studies', 'Tajweed Diploma'],
    specializations: ['Hifz Program', 'Quran Memorization', 'Tajweed'],
    experience: '8 years',
    bio: 'Hafiza Ayesha completed her Hifz at age 12 and has been teaching Hifz programs for 8 years. She specializes in helping students memorize Quran efficiently.',
  },
  {
    name: 'Maulana Bilal',
    slug: 'maulana-bilal',
    qualifications: ['M.A. Tafseer', 'Ph.D. Islamic Studies', 'Dars-e-Nizami'],
    specializations: ['Tafseer', 'Arabic Grammar', 'Islamic Jurisprudence'],
    experience: '15 years',
    bio: 'Maulana Bilal is a renowned Tafseer scholar with a Ph.D. in Islamic Studies. He has written commentaries on multiple surahs of the Quran.',
  },
  {
    name: 'Qariya Fatima',
    slug: 'qariya-fatima',
    qualifications: ['Tajweed Certification', 'Child Psychology Diploma', 'Hifz Certification'],
    specializations: ['Kids Education', 'Tajweed', 'Quran Stories'],
    experience: '6 years',
    bio: 'Qariya Fatima specializes in teaching Quran to children using engaging methods. She combines Tajweed with child-friendly approaches.',
  },
  {
    name: 'Sheikh Ibrahim',
    slug: 'sheikh-ibrahim',
    qualifications: ['Ph.D. Arabic Language', 'M.A. Islamic Studies', 'Arabic Literature'],
    specializations: ['Arabic Language', 'Linguistics', 'Quranic Arabic'],
    experience: '12 years',
    bio: 'Sheikh Ibrahim is an Arabic linguist with deep knowledge of Quranic Arabic. He helps students understand the Quran in its original language.',
  },
];

const courses = [
  {
    title: 'Quran Reading (Beginners)',
    slug: 'quran-reading-beginners',
    category: 'Quran',
    description: 'Learn to read the Quran properly from the basics. This course covers Arabic alphabet, pronunciation, and basic Quran reading rules.',
    price: 29,
    duration: '12 Weeks',
    curriculum: [
      { week: 1, topic: 'Arabic Alphabet', description: 'Introduction to Arabic letters and their pronunciation' },
      { week: 2, topic: 'Joining Letters', description: 'Learning how letters connect to form words' },
      { week: 3, topic: 'Basic Vowels (Fatha, Kasra, Damma)', description: 'Understanding short vowel marks' },
      { week: 4, topic: 'Long Vowels (Madd)', description: 'Learning elongation rules' },
      { week: 5, topic: 'Sukoon & Shaddah', description: 'Understanding stop and emphasis marks' },
      { week: 6, topic: 'Tanween', description: 'Learning nunation rules' },
      { week: 7, topic: 'Madd Rules', description: 'Detailed rules of elongation' },
      { week: 8, topic: 'Practice with Juz 30 (Part 1)', description: 'Reading short surahs from Juz 30' },
      { week: 9, topic: 'Practice with Juz 30 (Part 2)', description: 'Continued practice with longer surahs' },
      { week: 10, topic: 'Reading Fluency', description: 'Building speed and accuracy in reading' },
      { week: 11, topic: 'Tajweed Basics', description: 'Introduction to basic Tajweed rules' },
      { week: 12, topic: 'Final Assessment', description: 'Reading test and certification' },
    ],
  },
  {
    title: 'Tajweed ul Quran',
    slug: 'tajweed-ul-quran',
    category: 'Tajweed',
    description: 'Master the art of Quranic recitation with proper Tajweed rules. This course covers all rules of Tajweed with practical application.',
    price: 39,
    duration: '16 Weeks',
    curriculum: [
      { week: 1, topic: 'Introduction to Tajweed', description: 'Importance of Tajweed and basic concepts' },
      { week: 2, topic: 'Makharij (Points of Articulation)', description: 'Learning where each letter is pronounced from' },
      { week: 3, topic: 'Sifaat (Characteristics of Letters)', description: 'Understanding permanent and temporary qualities' },
      { week: 4, topic: 'Rules of Noon Sakinah & Tanween', description: 'Izhar, Idgham, Iqlab, Ikhfa' },
      { week: 5, topic: 'Rules of Meem Sakinah', description: 'Idgham Shafawi, Ikhfa Shafawi, Izhar Shafawi' },
      { week: 6, topic: 'Rules of Laam & Ra', description: 'Tafkheem and Tarqeeq of Laam and Ra' },
      { week: 7, topic: 'Madd (Elongation) Rules', description: 'Types of Madd and their durations' },
      { week: 8, topic: 'Qalqalah', description: 'Echoing letters and their rules' },
      { week: 9, topic: 'Waqf (Stopping) Rules', description: 'Where and how to stop properly' },
      { week: 10, topic: 'Ibtida (Starting) Rules', description: 'How to begin recitation after stopping' },
      { week: 11, topic: 'Practice with Juz 1', description: 'Applying Tajweed rules to Juz 1' },
      { week: 12, topic: 'Practice with Juz 15', description: 'Advanced application of rules' },
      { week: 13, topic: 'Practice with Juz 30', description: 'Perfecting recitation of short surahs' },
      { week: 14, topic: 'Tarteel & Khushu', description: 'Beautiful recitation with concentration' },
      { week: 15, topic: 'Complete Quran Review', description: 'Reviewing all rules with full Quran' },
      { week: 16, topic: 'Final Assessment & Ijazah', description: 'Final exam and certification' },
    ],
  },
  {
    title: 'Hifz Program',
    slug: 'hifz-program',
    category: 'Hifz',
    description: 'Complete Quran memorization program with daily progress tracking, revision system, and personalized attention.',
    price: 49,
    duration: '24-36 Months',
    curriculum: [
      { week: 1, topic: 'Assessment & Planning', description: 'Evaluate current level and create memorization plan' },
      { week: 2, topic: 'Juz 30 (Part 1)', description: 'Begin memorizing short surahs' },
      { week: 3, topic: 'Juz 30 (Part 2)', description: 'Continue with medium surahs' },
      { week: 4, topic: 'Juz 30 Complete', description: 'Complete and revise Juz 30' },
      { week: 5, topic: 'Juz 1 - Al-Fatiha & Al-Baqarah', description: 'Start memorizing from the beginning' },
      { week: 6, topic: 'Memorization Techniques', description: 'Learning effective memorization methods' },
      { week: 7, topic: 'Daily Sabaq (New Lesson)', description: 'Daily memorization of new verses' },
      { week: 8, topic: 'Weekly Revision', description: 'Revise memorized portions weekly' },
      { week: 9, topic: 'Monthly Revision', description: 'Comprehensive monthly revision' },
      { week: 10, topic: 'Juz 2 & 3', description: 'Continue with Al-Baqarah' },
      { week: 11, topic: 'Tajweed in Hifz', description: 'Ensure correct pronunciation while memorizing' },
      { week: 12, topic: 'Revision System Setup', description: 'Establish permanent revision routine' },
    ],
  },
  {
    title: 'Tafseer Course',
    slug: 'tafseer-course',
    category: 'Tafseer',
    description: 'Deep understanding of the Quran through Tafseer. Study the meaning, context, and lessons from the Quran.',
    price: 35,
    duration: '20 Weeks',
    curriculum: [
      { week: 1, topic: 'Introduction to Tafseer', description: 'History and methodology of Tafseer' },
      { week: 2, topic: 'Surah Al-Fatiha', description: 'Comprehensive Tafseer of the Opening Chapter' },
      { week: 3, topic: 'Surah Al-Baqarah (Part 1)', description: 'Verses 1-100 - Stories and lessons' },
      { week: 4, topic: 'Surah Al-Baqarah (Part 2)', description: 'Verses 101-200 - Laws and guidance' },
      { week: 5, topic: 'Surah Al-Baqarah (Part 3)', description: 'Verses 201-286 - Final lessons' },
      { week: 6, topic: 'Surah Aal-e-Imran', description: 'Family of Imran - lessons from Ahlul Kitab' },
      { week: 7, topic: 'Surah An-Nisa', description: 'Women\'s rights and family laws' },
      { week: 8, topic: 'Surah Al-Maidah', description: 'Completion of religion and covenants' },
      { week: 9, topic: 'Surah Al-Anam & Al-Araf', description: 'Tawheed and stories of prophets' },
      { week: 10, topic: 'Surah Yusuf', description: 'The best of stories - lessons in patience' },
      { week: 11, topic: 'Surah Al-Kahf', description: 'Protection from trials - lessons for modern times' },
      { week: 12, topic: 'Surah Maryam & Ta-Ha', description: 'Stories of prophets and Tawheed' },
      { week: 13, topic: 'Surah Al-Anbiya & Al-Hajj', description: 'Accountability and worship' },
      { week: 14, topic: 'Surah An-Nur & Al-Furqan', description: 'Social ethics and criterion of truth' },
      { week: 15, topic: 'Surah Luqman to Sad', description: 'Wisdom and stories of the unseen' },
      { week: 16, topic: 'Surah Az-Zumar to Al-Mulk', description: 'Death, resurrection and paradise' },
      { week: 17, topic: 'Juz 30 Tafseer', description: 'Comprehensive study of the last Juz' },
      { week: 18, topic: 'Themes of the Quran', description: 'Major themes across the entire Quran' },
      { week: 19, topic: 'Quranic Arabic Overview', description: 'Key Arabic concepts for deeper understanding' },
      { week: 20, topic: 'Final Project & Certification', description: 'Present Tafseer of a chosen surah' },
    ],
  },
  {
    title: 'Kids Quran Classes',
    slug: 'kids-quran-classes',
    category: 'Kids',
    description: 'Fun and engaging Quran classes for children aged 5-12. Includes stories, memorization, and basic Tajweed.',
    price: 25,
    duration: '16 Weeks',
    curriculum: [
      { week: 1, topic: 'Introduction to Quran', description: 'What is the Quran? Loving Allah and His book' },
      { week: 2, topic: 'Arabic Letters Fun', description: 'Learning letters through games and activities' },
      { week: 3, topic: 'Short Surahs - Al-Fatiha', description: 'Memorize Surah Al-Fatiha with meaning' },
      { week: 4, topic: 'Surah Al-Ikhlas & Al-Falaq', description: 'Protection surahs memorization' },
      { week: 5, topic: 'Surah An-Nas', description: 'Memorization and meaning' },
      { week: 6, topic: 'Basic Pronunciation', description: 'Correct pronunciation of Arabic letters' },
      { week: 7, topic: 'Stories from the Quran', description: 'Prophet stories in simple language' },
      { week: 8, topic: 'Surah Al-Asr & Al-Kawthar', description: 'Memorization and lessons' },
      { week: 9, topic: 'Surah Al-Masad & An-Nasr', description: 'Memorization and stories' },
      { week: 10, topic: 'Wudu & Prayer', description: 'Learning how to pray for kids' },
      { week: 11, topic: 'Surah Al-Maun & Quraish', description: 'Memorization and moral lessons' },
      { week: 12, topic: 'Surah Al-Fil & Al-Humazah', description: 'Memorization with animal stories' },
      { week: 13, topic: 'Duas for Daily Life', description: 'Learning simple duas for everyday use' },
      { week: 14, topic: 'Surah At-Takathur & Al-Qariah', description: 'Memorization and lessons about akhirah' },
      { week: 15, topic: 'Review All Surahs', description: 'Complete review of memorized surahs' },
      { week: 16, topic: 'Quran Quiz & Certificate', description: 'Fun competition and graduation' },
    ],
  },
];

const seedCourses = async () => {
  try {
    await Teacher.deleteMany({});
    await Course.deleteMany({});

    const createdTeachers = await Teacher.insertMany(teachers);
    console.log(`${teachers.length} Teachers seeded successfully`);

    const coursesWithTeachers = courses.map((course, index) => ({
      ...course,
      teacher: createdTeachers[index % createdTeachers.length]._id,
    }));

    await Course.insertMany(coursesWithTeachers);
    console.log(`${courses.length} Courses seeded successfully`);
  } catch (error) {
    console.error('Error seeding courses:', error.message);
    throw error;
  }
};

export default seedCourses;
