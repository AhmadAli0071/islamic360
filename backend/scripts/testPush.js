import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '..', '.env') });

import connectDB from '../config/db.js';
import { sendPushToAll } from '../services/pushService.js';

async function run() {
  await connectDB();
  console.log('Sending test Fajr push notification...');
  const result = await sendPushToAll(
    '🕌 Fajr ka waqt hogaya',
    'Fajr ki namaz ka waqt hai. 10 second alarm ke saath test notification.',
    'test-fajr-push',
    10,
  );
  console.log(`Result: ${result.sent} sent / ${result.total} total subscribers`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
