const express = require('express');
const controller = require('../controllers/productController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();
router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', auth, admin, controller.create);
router.put('/:id', auth, admin, controller.update);
router.patch('/:id', auth, admin, controller.update);
router.delete('/:id', auth, admin, controller.remove);
module.exports = router;
      
