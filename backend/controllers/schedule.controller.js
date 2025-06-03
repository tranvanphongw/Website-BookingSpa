const Schedule = require('../models/schedule.model');

// Get all schedules
const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.getAll();
    res.json(schedules);
  } catch (error) {
    console.error('getAllSchedules error:', error);
    res.status(500).json({ message: 'Failed to retrieve schedules', error: error.message });
  }
};

// Get schedules by employee
const getSchedulesByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const schedules = await Schedule.getByEmployeeId(employeeId);
    res.json(schedules);
  } catch (error) {
    console.error('getSchedulesByEmployee error:', error);
    res.status(500).json({ message: 'Failed to retrieve employee schedules', error: error.message });
  }
};

// Get schedules by date
const getSchedulesByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const schedules = await Schedule.getByDate(date);
    res.json(schedules);
  } catch (error) {
    console.error('getSchedulesByDate error:', error);
    res.status(500).json({ message: 'Failed to retrieve schedules for date', error: error.message });
  }
};

// Add new schedule
const addSchedule = async (req, res) => {
  try {
    const { MANV, NGAYLAM, THOIGIANBATDAU, THOIGIANKETTHUC } = req.body;
    
    // Validate required fields
    if (!MANV || !NGAYLAM || !THOIGIANBATDAU || !THOIGIANKETTHUC) {
      return res.status(400).json({
        message: 'Missing required fields'
      });
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(THOIGIANBATDAU) || !timeRegex.test(THOIGIANKETTHUC)) {
      return res.status(400).json({
        message: 'Invalid time format. Use HH:mm format'
      });
    }

    // Create schedule data
    const scheduleData = {
      MANV: parseInt(MANV, 10),
      NGAYLAM,
      THOIGIANBATDAU: THOIGIANBATDAU.substring(0, 5),
      THOIGIANKETTHUC: THOIGIANKETTHUC.substring(0, 5),
      GHICHU: req.body.GHICHU || null,
      TRANGTHAI: req.body.TRANGTHAI || 1
    };

    await Schedule.create(scheduleData);
    res.status(201).json({ message: 'Schedule added successfully' });

  } catch (error) {
    console.error('addSchedule error:', error);
    res.status(500).json({ 
      message: 'Failed to add schedule', 
      error: error.message 
    });
  }
};

// Update schedule
const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    // Convert MANV to integer if it's a string
    const scheduleData = {
      ...req.body,
      MANV: typeof req.body.MANV === 'string' ? parseInt(req.body.MANV, 10) : req.body.MANV
    };
    
    await Schedule.update(id, scheduleData);
    res.json({ message: 'Schedule updated successfully' });
  } catch (error) {
    console.error('updateSchedule error:', error);
    res.status(500).json({ message: 'Failed to update schedule', error: error.message });
  }
};

// Delete schedule
const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    await Schedule.delete(id);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('deleteSchedule error:', error);
    res.status(500).json({ message: 'Failed to delete schedule', error: error.message });
  }
};

module.exports = {
  getAllSchedules,
  getSchedulesByDate,
  getSchedulesByEmployee,
  addSchedule,
  updateSchedule,
  deleteSchedule
};