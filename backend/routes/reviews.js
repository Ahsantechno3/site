const express = require('express');
const router = express.Router();
const { Review } = require('../models');
const genericController = require('../controllers/genericController')(Review);

router.route('/').get(async (req, res) => {
	try {
		const reviews = await Review.find()
			.populate('product', 'name')
			.populate('user', 'firstName lastName username email');
		res.json(reviews);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}).post(genericController.create);
router.route('/:id').get(genericController.getById).put(genericController.update).delete(genericController.remove);

module.exports = router;

