import Teacher from '../models/Teacher.js';

export const getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find({ isActive: true }).lean();
    res.json({ success: true, data: teachers });
  } catch (error) {
    next(error);
  }
};
