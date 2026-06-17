import { getPrayerTimesFromAPI } from '../services/prayerService.js';
import Hadith from '../models/Hadith.js';
import Wazifa from '../models/Wazifa.js';
import { PRAYER_DAY_MAP } from './hadithController.js';

export const getSchedule = async (req, res, next) => {
  try {
    const { city = 'Karachi', country = 'Pakistan' } = req.query;
    const schedule = await buildSchedule(city, country);
    res.json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
};

export const getPrayerTimesForNotification = async (req, res, next) => {
  try {
    const { city = 'Karachi', country = 'Pakistan' } = req.query;
    const schedule = await buildPrayerOnly(city, country);
    res.json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
};

export async function buildSchedule(city = 'Karachi', country = 'Pakistan') {
  const prayerData = await getPrayerTimesFromAPI(city, country);
  const dayOfYear = getDayOfYear();

  const prayerNotifications = await Promise.all(
    prayerData.prayers.filter(p => p.name !== 'Sunrise').map(async (prayer) => {
      const range = PRAYER_DAY_MAP[prayer.name];
      if (!range) return null;
      const prayerDay = range.start + (dayOfYear % (range.end - range.start + 1));
      const hadith = await Hadith.findOne({ dayOfYear: prayerDay }).lean();

      return {
        prayer: prayer.name,
        time: prayer.time,
        hadith: hadith ? {
          arabic: hadith.arabic,
          urdu: hadith.urdu,
          english: hadith.english,
          narrator: hadith.narrator,
          source: hadith.source,
        } : null,
      };
    })
  );

  const wazifa = await Wazifa.findOne({ dayOfYear }).lean();

  return {
    date: prayerData.date,
    hijri: prayerData.hijri,
    prayers: prayerNotifications.filter(Boolean),
    wazifa: wazifa ? {
      title: wazifa.title,
      arabic: wazifa.arabic,
      urdu: wazifa.urdu,
      english: wazifa.english,
      transliteration: wazifa.transliteration,
      count: wazifa.count,
      type: wazifa.type,
      benefit: wazifa.benefit,
    } : null,
  };
}

export async function buildPrayerOnly(city = 'Karachi', country = 'Pakistan') {
  const data = await getPrayerTimesFromAPI(city, country);
  const prayers = data.prayers.filter(p => p.name !== 'Sunrise');
  return { date: data.date, hijri: data.hijri, prayers };
}

const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};
