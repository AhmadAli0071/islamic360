import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

import prayerRoutes from './routes/prayerRoutes.js';
import qiblaRoutes from './routes/qiblaRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import duaRoutes from './routes/duaRoutes.js';
import hadithRoutes from './routes/hadithRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import wazifaRoutes from './routes/wazifaRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import hijriRoutes from './routes/hijriRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import enrollRoutes from './routes/enrollRoutes.js';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = dirname(fileURLToPath(import.meta.url));

connectDB();

app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https:", "https://cdn.adsterra.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "https:"],
      frameSrc: ["'self'", "https:"],
      workerSrc: ["'self'", "blob:"],
    },
  },
}));
app.use(compression());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve built frontend (for production deployment on Render)
const distPath = join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Islamic360 API is running' });
});

app.use('/api/prayers', prayerRoutes);
app.use('/api/qibla', qiblaRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/duas', duaRoutes);
app.use('/api/hadith', hadithRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/wazifas', wazifaRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hijri', hijriRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/enroll', enrollRoutes);

// Fallback: serve index.html for any non-API route (SPA)
app.get('*', (req, res) => {
  res.sendFile(join(distPath, 'index.html'));
});

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Islamic360 server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err.message);
  app.listen(PORT, () => {
    console.log(`Islamic360 server running on port ${PORT} (without database)`);
  });
});

export default app;
