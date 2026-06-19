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

function getCurrentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function isFriday() {
  return new Date().getDay() === 5;
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

    const currentMinutes = getCurrentMinutes();

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

          // On Friday, send "Jummah" instead of "Dhuhr"
          let prayerName = prayer.prayer;
          if (isFriday() && prayer.prayer === 'Dhuhr') {
            prayerName = 'Jummah';
          }

          console.log(`Pushing prayer notification: ${prayerName}`);
          await sendPushToAllWithHadith(prayerName, prayer.hadith);
        }
      }

      // Wazifa between Fajr and Dhuhr
      if (schedule.prayers.length > 0) {
        const fajrTime = schedule.prayers.find(p => p.prayer === 'Fajr')?.time || '05:00';
        const dhuhrTime = schedule.prayers.find(p => p.prayer === 'Dhuhr')?.time || '12:30';
        const [fh, fm] = fajrTime.split(':').map(Number);
        const [dh, dm] = dhuhrTime.split(':').map(Number);
        const fajrMinutes = fh * 60 + fm;
        const dhuhrMinutes = dh * 60 + dm;
        // Send wazifa in the middle of Fajr-Dhuhr window
        const wazifaWindowStart = fajrMinutes + 30;
        const wazifaWindowEnd = dhuhrMinutes - 30;

        if (!sentWazifa && currentMinutes >= wazifaWindowStart && currentMinutes <= wazifaWindowEnd && schedule.wazifa) {
          sentWazifa = true;
          console.log('Pushing wazifa notification');
          await sendPushWazifa(schedule.wazifa);
        }
      }
    } catch (err) {
      console.error('Push cron error:', err.message);
    }
  });
}
