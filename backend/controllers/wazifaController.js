import Wazifa from '../models/Wazifa.js';

export const getDailyWazifa = async (req, res, next) => {
  try {
    const dayOfYear = getDayOfYear();
    let wazifa = await Wazifa.findOne({ dayOfYear }).lean();

    if (!wazifa) {
      const count = await Wazifa.countDocuments();
      if (count > 0) {
        const skip = dayOfYear % count;
        wazifa = await Wazifa.findOne().skip(skip).lean();
      }
    }

    if (!wazifa) {
      return res.json({ success: true, data: null, message: 'No wazifa available for today' });
    }

    res.json({ success: true, data: { ...wazifa, dayOfYear } });
  } catch (error) {
    next(error);
  }
};

export const getWazifaByDay = async (req, res, next) => {
  try {
    const day = parseInt(req.params.day);
    if (isNaN(day) || day < 1 || day > 365) {
      res.status(400);
      throw new Error('Day must be between 1 and 365');
    }

    const wazifa = await Wazifa.findOne({ dayOfYear: day }).lean();
    if (!wazifa) {
      res.status(404);
      throw new Error('Wazifa not found for this day');
    }

    res.json({ success: true, data: wazifa });
  } catch (error) {
    next(error);
  }
};

const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};
