const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const router = express.Router();
router.get('/', auth, admin, async (_req, res, next) => { try { const users = await User.find().select('-password').sort({ createdAt: -1 }); res.json({ items: users, users }); } catch (e) { next(e); } });
router.get('/:id', auth, admin, async (req, res, next) => { try { const user = await User.findById(req.params.id).select('-password'); if (!user) return res.status(404).json({ message: 'User not found' }); res.json(user); } catch (e) { next(e); } });
router.patch('/:id', auth, admin, async (req, res, next) => { try { const allowed = {}; ['role', 'isActive', 'isVerified', 'firstName', 'lastName', 'phone'].forEach((key) => { if (req.body[key] !== undefined) allowed[key] = req.body[key]; }); const user = await User.findByIdAndUpdate(req.params.id, allowed, { new: true, runValidators: true }).select('-password'); if (!user) return res.status(404).json({ message: 'User not found' }); res.json(user); } catch (e) { next(e); } });
module.exports = router;
      
