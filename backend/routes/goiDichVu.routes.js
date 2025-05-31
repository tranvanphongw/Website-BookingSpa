const express = require('express');
const router = express.Router();
const goiDichVuController = require('../controllers/goiDichVu.controller');

router.get('/', goiDichVuController.getAllGoiDichVu);
router.get('/:MAGOI', goiDichVuController.getChiTietGoi);
router.post('/', goiDichVuController.addGoiDichVu);
router.put('/:id', goiDichVuController.updateGoiDichVu);
router.delete('/:id', goiDichVuController.deleteGoiDichVu);

module.exports = router;
