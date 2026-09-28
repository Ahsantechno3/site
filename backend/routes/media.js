const express = require('express');
const router = express.Router();
const { Media } = require('../models');
const genericController = require('../controllers/genericController')(Media);

router.route('/').get(genericController.getAll).post(genericController.create);
router.route('/:id').get(genericController.getById).put(genericController.update).delete(genericController.remove);

module.exports = router;

