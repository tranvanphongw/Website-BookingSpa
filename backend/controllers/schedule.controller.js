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
    // Validate required fields
    const { MANV, NGAYLAM, GIOBATDAU, GIOKETTHUC } = req.body;
    
    if (!MANV || !NGAYLAM || !GIOBATDAU || !GIOKETTHUC) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: 'MANV, NGAYLAM, GIOBATDAU, GIOKETTHUC' 
      });
    }
    
    // Convert MANV to integer if it's a string
    const scheduleData = {
      ...req.body,
      MANV: typeof MANV === 'string' ? parseInt(MANV, 10) : MANV
    };
    
    await Schedule.create(scheduleData);
    res.status(201).json({ message: 'Schedule added successfully' });
  } catch (error) {
    console.error('addSchedule error:', error);
    res.status(500).json({ message: 'Failed to add schedule', error: error.message });
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
  getSchedulesByEmployee,
  getSchedulesByDate,
  addSchedule,
  updateSchedule,
  deleteSchedule
};
