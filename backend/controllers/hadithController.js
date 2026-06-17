import Hadith from '../models/Hadith.js';

const UMMAH_API = 'https://ummahapi.com/api/hadith';
const CDN_API = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';
const SOURCE_MAP_UMMAH = {
  'Sahih Bukhari': 'bukhari',
  'Sahih Muslim': 'muslim',
  'Sunan Abi Dawud': 'abudawud',
  'Sunan an-Nasai': 'nasai',
  'Jami At-Tirmidhi': 'tirmidhi',
  'Sunan Ibn Majah': 'ibnmajah',
};
const SOURCE_MAP_CDN = {
  'Sahih Bukhari': 'ara-bukhari',
  'Sahih Muslim': 'ara-muslim',
  'Sunan Abi Dawud': 'ara-abudawud',
  'Sunan an-Nasai': 'ara-nasai',
  'Jami At-Tirmidhi': 'ara-tirmidhi',
  'Sunan Ibn Majah': 'ara-ibnmajah',
  'Musnad Ahmad': 'ara-ahmad',
};

async function fixArabic(hadith) {
  if (!hadith || !hadith.arabic || !/\?{3,}/.test(hadith.arabic)) return hadith;
  const ref = hadith.reference;
  if (!ref) return hadith;
  const edition = SOURCE_MAP_CDN[hadith.source];
  if (edition) {
    try {
      const url = `${CDN_API}/${edition}/${ref}.min.json`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data?.hadiths?.[0]?.text) hadith.arabic = data.hadiths[0].text;
      }
    } catch {}
  }
  if (!/\?{3,}/.test(hadith.arabic)) return hadith;
  const collection = SOURCE_MAP_UMMAH[hadith.source];
  if (collection) {
    try {
      const url = `${UMMAH_API}/${collection}/${ref}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data?.data?.arabic) hadith.arabic = data.data.arabic;
      }
    } catch {}
  }
  return hadith;
}

const PRAYER_DAY_MAP = {
  Fajr: { start: 1, end: 73 },
  Dhuhr: { start: 74, end: 146 },
  Asr: { start: 147, end: 219 },
  Maghrib: { start: 220, end: 292 },
  Isha: { start: 293, end: 365 },
};

export const getDailyHadith = async (req, res, next) => {
  try {
    const dayOfYear = getDayOfYear();
    for (let offset = 0; offset < 365; offset++) {
      const searchDay = ((dayOfYear - 1 + offset) % 365) + 1;
      let hadith = await Hadith.findOne({ dayOfYear: searchDay }).lean();
      if (!hadith) continue;
      const fixed = await fixArabic(hadith);
      if (fixed.arabic && !/\?{3,}/.test(fixed.arabic)) {
        return res.json({ success: true, data: { ...fixed, dayOfYear: searchDay } });
      }
    }
    return res.json({ success: true, data: null, message: 'No hadith available' });
  } catch (error) {
    next(error);
  }
};

export const getRandomHadith = async (req, res, next) => {
  try {
    const count = await Hadith.countDocuments();
    if (count === 0) {
      return res.json({ success: true, data: null, message: 'No hadith available' });
    }
    const random = Math.floor(Math.random() * count);
    const hadith = await Hadith.findOne().skip(random).lean();
    res.json({ success: true, data: await fixArabic(hadith) });
  } catch (error) {
    next(error);
  }
};

export const getHadithByPrayer = async (req, res, next) => {
  try {
    const { prayer } = req.query;
    const validPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    if (!prayer || !validPrayers.includes(prayer)) {
      res.status(400);
      throw new Error('Invalid prayer name. Use: Fajr, Dhuhr, Asr, Maghrib, Isha');
    }

    const range = PRAYER_DAY_MAP[prayer];
    const dayOfYear = getDayOfYear();
    const prayerDay = range.start + (dayOfYear % (range.end - range.start + 1));
    let hadith = await Hadith.findOne({ dayOfYear: prayerDay }).lean();

    if (!hadith) {
      const count = await Hadith.countDocuments();
      const skip = prayerDay % count;
      hadith = await Hadith.findOne().skip(skip).lean();
    }

    res.json({
      success: true,
      data: hadith ? { ...(await fixArabic(hadith)), prayer } : null,
    });
  } catch (error) {
    next(error);
  }
};

const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export { PRAYER_DAY_MAP };
