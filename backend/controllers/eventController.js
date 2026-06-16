import Event from '../models/Event.js';
import axios from 'axios';

const getHijriDateInfo = async () => {
  try {
    const response = await axios.get('http://api.aladhan.com/v1/gToH', {
      params: { date: new Date().toISOString().split('T')[0] },
    });
    const hijri = response.data.data.hijri;
    const monthNames = [
      'Muharram', 'Safar', 'Rabi ul Awwal', 'Rabi ul Thani',
      'Jumada al Awwal', 'Jumada al Thani', 'Rajab', 'Shaban',
      'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah',
    ];
    const monthNumber = parseInt(hijri.month.number);
    return {
      monthNumber,
      monthName: monthNames[monthNumber - 1],
      day: parseInt(hijri.day),
      year: parseInt(hijri.year),
      full: `${hijri.day} ${hijri.month.en} ${hijri.year}`,
      fullAr: `${hijri.day} ${hijri.month.ar} ${hijri.year}`,
    };
  } catch (error) {
    throw new Error('Failed to fetch Hijri date');
  }
};

export const getTodayEvents = async (req, res, next) => {
  try {
    const hijri = await getHijriDateInfo();
    const events = await Event.find({ monthNumber: hijri.monthNumber, day: hijri.day });

    res.json({
      success: true,
      data: {
        hijriDate: hijri,
        events: events.length > 0 ? events : [],
        message: events.length > 0 ? 'Events found for today' : 'No specific events today',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMonthEvents = async (req, res, next) => {
  try {
    const { monthName } = req.params;
    const monthNames = [
      'Muharram', 'Safar', 'Rabi ul Awwal', 'Rabi ul Thani',
      'Jumada al Awwal', 'Jumada al Thani', 'Rajab', 'Shaban',
      'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah',
    ];
    const monthNumber = monthNames.indexOf(monthName) + 1;

    if (monthNumber === 0) {
      res.status(400);
      throw new Error('Invalid month name');
    }

    const events = await Event.find({ monthNumber }).sort({ day: 1 });

    res.json({
      success: true,
      data: { month: monthName, monthNumber, events },
    });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingEvents = async (req, res, next) => {
  try {
    const hijri = await getHijriDateInfo();
    const limit = parseInt(req.query.limit) || 5;

    const events = await Event.find({
      $or: [
        { monthNumber: hijri.monthNumber, day: { $gte: hijri.day } },
        { monthNumber: { $gt: hijri.monthNumber } },
      ],
    })
      .sort({ monthNumber: 1, day: 1 })
      .limit(limit);

    res.json({
      success: true,
      data: { events },
    });
  } catch (error) {
    next(error);
  }
};
