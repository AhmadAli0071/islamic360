import Event from '../models/Event.js';
import Dua from '../models/Dua.js';
import Hadith from '../models/Hadith.js';
import Course from '../models/Course.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalDuas = await Dua.countDocuments();
    const totalHadith = await Hadith.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalStudents = await Student.countDocuments();

    res.json({ success: true, data: { totalEvents, totalDuas, totalHadith, totalCourses, totalTeachers, totalStudents } });
  } catch (error) {
    next(error);
  }
};

// Events CRUD
export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) { res.status(404); throw new Error('Event not found'); }
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) { res.status(404); throw new Error('Event not found'); }
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    next(error);
  }
};

// Duas CRUD
export const createDua = async (req, res, next) => {
  try {
    const dua = await Dua.create(req.body);
    res.status(201).json({ success: true, data: dua });
  } catch (error) {
    next(error);
  }
};

export const updateDua = async (req, res, next) => {
  try {
    const dua = await Dua.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!dua) { res.status(404); throw new Error('Dua not found'); }
    res.json({ success: true, data: dua });
  } catch (error) {
    next(error);
  }
};

export const deleteDua = async (req, res, next) => {
  try {
    const dua = await Dua.findByIdAndDelete(req.params.id);
    if (!dua) { res.status(404); throw new Error('Dua not found'); }
    res.json({ success: true, message: 'Dua deleted' });
  } catch (error) {
    next(error);
  }
};

// Hadith CRUD
export const createHadith = async (req, res, next) => {
  try {
    const hadith = await Hadith.create(req.body);
    res.status(201).json({ success: true, data: hadith });
  } catch (error) {
    next(error);
  }
};

export const updateHadith = async (req, res, next) => {
  try {
    const hadith = await Hadith.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hadith) { res.status(404); throw new Error('Hadith not found'); }
    res.json({ success: true, data: hadith });
  } catch (error) {
    next(error);
  }
};

export const deleteHadith = async (req, res, next) => {
  try {
    const hadith = await Hadith.findByIdAndDelete(req.params.id);
    if (!hadith) { res.status(404); throw new Error('Hadith not found'); }
    res.json({ success: true, message: 'Hadith deleted' });
  } catch (error) {
    next(error);
  }
};

// Courses CRUD
export const getAdminCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate('teacher', 'name').sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
};

export const getAdminTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: teachers });
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) { res.status(404); throw new Error('Course not found'); }
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) { res.status(404); throw new Error('Course not found'); }
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    next(error);
  }
};

// Teachers CRUD
export const getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find({ isActive: true }).lean();
    res.json({ success: true, data: teachers });
  } catch (error) {
    next(error);
  }
};

export const createTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(201).json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

export const updateTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!teacher) { res.status(404); throw new Error('Teacher not found'); }
    res.json({ success: true, data: teacher });
  } catch (error) {
    next(error);
  }
};

export const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: students });
  } catch (error) {
    next(error);
  }
};

export const deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) { res.status(404); throw new Error('Teacher not found'); }
    res.json({ success: true, message: 'Teacher deleted' });
  } catch (error) {
    next(error);
  }
};
