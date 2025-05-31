const express = require('express');
const router = express.Router();
const packageController = require('../controllers/package.controller');

router.get('/', packageController.getPackages);
router.get('/:MAGOI/details', packageController.getPackageDetails);

module.exports = router; 