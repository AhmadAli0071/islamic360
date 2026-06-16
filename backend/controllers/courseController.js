import Course from '../models/Course.js';
import Teacher from '../models/Teacher.js';

export const getCourses = async (req, res, next) => {
  try {
    const { category, teacher } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (teacher) filter.teacher = teacher;

    const courses = await Course.find(filter).populate('teacher', 'name qualifications specializations').lean();
    res.json({ success: true, data: courses, count: courses.length });
  } catch (error) {
    next(error);
  }
};

export const getCourseBySlug = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug }).populate('teacher').lean();
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};
