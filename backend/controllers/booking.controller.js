const bookingModel = require('../models/booking.model');

async function getCustomers(req, res) {
  try {
    const customers = await bookingModel.getCustomers();
    res.json(customers);
  } catch (err) {
    console.error('Error in getCustomers:', err);
    res.status(500).json({ message: 'Failed to retrieve customers', error: err.message });
  }
}

async function getCustomerById(req, res) {
  try {
    const customer = await bookingModel.getCustomerById(req.params.MAKH);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    console.error('Error in getCustomerById:', err);
    res.status(500).json({ message: 'Failed to retrieve customer', error: err.message });
  }
}

async function getServiceTypes(req, res) {
  try {
    const types = await bookingModel.getServiceTypes();
    res.json(types);
  } catch (err) {
    console.error('Error in getServiceTypes:', err);
    res.status(500).json({ message: 'Failed to retrieve service types', error: err.message });
  }
}

async function getServices(req, res) {
  try {
    const services = await bookingModel.getServices(req.query.type);
    res.json(services);
  } catch (err) {
    console.error('Error in getServices:', err);
    res.status(500).json({ message: 'Failed to retrieve services', error: err.message });
  }
}

async function getEmployees(req, res) {
  try {
    const employees = await bookingModel.getEmployees();
    res.json(employees);
  } catch (err) {
    console.error('Error in getEmployees:', err);
    res.status(500).json({ message: 'Failed to retrieve employees', error: err.message });
  }
}

async function getBookings(req, res) {
  try {
    const bookings = await bookingModel.getBookings();
    res.json(bookings);
  } catch (err) {
    console.error('Error in getBookings:', err);
    res.status(500).json({ message: 'Failed to retrieve bookings', error: err.message });
  }
}

async function getBookingById(req, res) {
  try {
    const booking = await bookingModel.getBookingById(req.params.MALICH);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Convert datetime to ISO strings
    if (booking.THOIGIANBATDAU) booking.THOIGIANBATDAU = new Date(booking.THOIGIANBATDAU).toISOString();
    if (booking.THOIGIANKETTHUC) booking.THOIGIANKETTHUC = new Date(booking.THOIGIANKETTHUC).toISOString();

    res.json(booking);
  } catch (err) {
    console.error('Error in getBookingById:', err);
    res.status(500).json({ message: 'Failed to retrieve booking', error: err.message });
  }
}

async function createBooking(req, res) {
  try {
    await bookingModel.createBooking(req.body);
    res.status(201).json({ message: 'Created booking successfully' });
  } catch (err) {
    if (err.number === 2627 || err.number === 2601) {
      return res.status(400).json({
        message: 'Booking for this customer & service already exists.'
      });
    }
    console.error('Error in createBooking:', err);
    res.status(500).json({ message: 'Failed to create booking', error: err.message });
  }
}

async function updateBooking(req, res) {
  try {
    await bookingModel.updateBooking(req.body);
    res.json({ message: 'Booking updated successfully' });
  } catch (err) {
    console.error('Error in updateBooking:', err);
    res.status(500).json({ message: 'Failed to update booking', error: err.message });
  }
}

async function cancelBooking(req, res) {
  try {
    await bookingModel.cancelBooking(req.params.MALICH);
    res.json({ message: 'Booking and related payments deleted successfully' });
  } catch (err) {
    console.error('Error in cancelBooking:', err);
    res.status(500).json({ message: 'Failed to cancel booking', error: err.message });
  }
}

module.exports = {
  getCustomers,
  getCustomerById,
  getServiceTypes,
  getServices,
  getEmployees,
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
};
