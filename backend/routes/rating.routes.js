const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');

router.get('/', ratingController.getAllRatings);
router.post('/add', ratingController.addRating);
router.get('/employee/:id', ratingController.getRatingsByEmployee);
router.get('/can-rate/:makh/:manv', ratingController.checkCanRate);

module.exports = router;
