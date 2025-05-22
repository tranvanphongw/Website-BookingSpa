const paymentModel = require('../models/payment.model');

const getAllPayments = async (req, res) => {
  try {
    const payments = await paymentModel.getAllPayments();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve payments!', error });
  }
};

const addPayment = async (req, res) => {
  try {
    const { insertedId, receipt } = await paymentModel.addPayment(req.body);
    res.status(201).json({
      message: 'Payment added successfully!',
      MATHANHTOAN: insertedId,
      receipt
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to add payment!', error });
  }
};

const deletePayment = async (req, res) => {
  try {
    const { MATHANHTOAN } = req.params;
    await paymentModel.deletePayment(MATHANHTOAN);
    res.status(200).json({ message: 'Payment deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete payment!', error });
  }
};

module.exports = { getAllPayments, addPayment, deletePayment };
