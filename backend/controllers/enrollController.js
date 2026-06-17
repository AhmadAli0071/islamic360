import Student from '../models/Student.js';

export const createEnrollment = async (req, res, next) => {
  try {
    const { name, contact, course, preferredSlot } = req.body;
    if (!name || !contact || !course) {
      res.status(400);
      throw new Error('Name, contact and course are required');
    }
    const student = await Student.create({ name, contact, course, preferredSlot });
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};
