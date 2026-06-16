import { Router } from 'express';
import {
  getAdminStats,
  createEvent, updateEvent, deleteEvent,
  createDua, updateDua, deleteDua,
  createHadith, updateHadith, deleteHadith,
  createCourse, updateCourse, deleteCourse,
  getTeachers, createTeacher, updateTeacher, deleteTeacher,
} from '../controllers/adminController.js';
import seedEvents from '../scripts/seedEvents.js';
import seedDuas from '../scripts/seedDuas.js';
import seedHadith from '../scripts/seedHadith.js';
import seedCourses from '../scripts/seedCourses.js';
import seedWazifas from '../scripts/seedWazifas.js';

const router = Router();

router.get('/stats', getAdminStats);

router.post('/seed', async (req, res) => {
  try {
    await seedEvents();
    await seedDuas();
    await seedHadith();
    await seedCourses();
    await seedWazifas();
    res.json({ success: true, message: 'All data seeded successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

router.post('/duas', createDua);
router.put('/duas/:id', updateDua);
router.delete('/duas/:id', deleteDua);

router.post('/hadith', createHadith);
router.put('/hadith/:id', updateHadith);
router.delete('/hadith/:id', deleteHadith);

router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

router.get('/teachers', getTeachers);
router.post('/teachers', createTeacher);
router.put('/teachers/:id', updateTeacher);
router.delete('/teachers/:id', deleteTeacher);

export default router;
