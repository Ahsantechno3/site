const express = require('express');
const router = express.Router();
const { Coupon } = require('../models');
const genericController = require('../controllers/genericController')(Coupon);

router.route('/').get(genericController.getAll).post(genericController.create);
router.route('/:id').get(genericController.getById).put(genericController.update).delete(genericController.remove);

module.exports = router;

