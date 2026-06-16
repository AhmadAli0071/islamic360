import { Router } from 'express';
import {
  getAdminStats,
  createEvent, updateEvent, deleteEvent,
  createDua, updateDua, deleteDua,
  createHadith, updateHadith, deleteHadith,
  createCourse, updateCourse, deleteCourse,
  getTeachers, createTeacher, updateTeacher, deleteTeacher,
} from '../controllers/adminController.js';

const router = Router();

router.get('/stats', getAdminStats);

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
