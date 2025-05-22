const ratingModel = require('../models/rating.model');

const getAllRatings = async (req, res) => {
  try {
    const ratings = await ratingModel.getAllRatings();
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve ratings!', error });
  }
};

const addRating = async (req, res) => {
  try {
    await ratingModel.addOrUpdateRating(req.body);
    res.json({ message: 'Đánh giá đã được lưu thành công!' });
  } catch (error) {
    res.status(500).json({
      error: 'Không thể lưu đánh giá',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const getRatingsByEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const ratings = await ratingModel.getRatingsByEmployee(parseInt(id));
    res.json(ratings);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch employee ratings',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const checkCanRate = async (req, res) => {
  try {
    const { makh, manv } = req.params;
    const canRateResult = await ratingModel.canRate(parseInt(makh), parseInt(manv));
    res.json({ canRate: canRateResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllRatings,
  addRating,
  getRatingsByEmployee,
  checkCanRate,
};
