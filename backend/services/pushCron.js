import cron from 'node-cron';
import { sendPushToAllWithHadith, sendPushWazifa } from './push.js';
import { buildSchedule } from '../controllers/notificationController.js';

const PRAYER_DAY_MAP = {
  Fajr: 0, Dhuhr: 1, Asr: 2, Maghrib: 3, Isha: 4,
};

let sentPrayers = new Set();
let sentWazifa = false;
let lastDate = '';

function getTodayKey() {
  return new Date().toDateString();
}

export function startPushCron() {
  console.log('Push cron started — checks every 30 seconds');

  cron.schedule('*/30 * * * * *', async () => {
    const todayKey = getTodayKey();
    if (lastDate !== todayKey) {
      sentPrayers = new Set();
      sentWazifa = false;
      lastDate = todayKey;
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    try {
      const schedule = await buildSchedule('Karachi', 'Pakistan');
      if (!schedule) return;

      // Check each prayer (skip Sunrise)
      for (const prayer of schedule.prayers) {
        const [h, m] = prayer.time.split(':').map(Number);
        const prayerMinutes = h * 60 + m;
        const diff = currentMinutes - prayerMinutes;

        if (diff >= 0 && diff <= 2 && !sentPrayers.has(prayer.prayer)) {
          sentPrayers.add(prayer.prayer);
          console.log(`Pushing prayer notification: ${prayer.prayer}`);
          await sendPushToAllWithHadith(prayer.prayer, prayer.hadith);
        }
      }

      // Wazifa between Fajr (5:00) and Dhuhr (12:30)
      if (!sentWazifa && currentMinutes >= 300 && currentMinutes <= 750 && schedule.wazifa) {
        sentWazifa = true;
        console.log('Pushing wazifa notification');
        await sendPushWazifa(schedule.wazifa);
      }
    } catch (err) {
      console.error('Push cron error:', err.message);
    }
  });
}
