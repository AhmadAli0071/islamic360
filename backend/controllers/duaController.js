import Dua from '../models/Dua.js';

export const getDuasByCategory = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) {
      filter.category = category;
    }
    const duas = await Dua.find(filter).sort({ _id: 1 });
    res.json({ success: true, data: duas, count: duas.length });
  } catch (error) {
    next(error);
  }
};

export const getDailyDua = async (req, res, next) => {
  try {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const count = await Dua.countDocuments();
    if (count === 0) {
      return res.json({ success: true, data: null, message: 'No duas available' });
    }
    const skip = dayOfYear % count;
    const dua = await Dua.findOne().skip(skip);
    res.json({ success: true, data: dua });
  } catch (error) {
    next(error);
  }
};

export const getDuaById = async (req, res, next) => {
  try {
    const dua = await Dua.findById(req.params.id);
    if (!dua) {
      res.status(404);
      throw new Error('Dua not found');
    }
    res.json({ success: true, data: dua });
  } catch (error) {
    next(error);
  }
};
