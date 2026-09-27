const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();
const tokenFor = (user) => jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const publicUser = (user) => ({ id: user._id, username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, isActive: user.isActive, isVerified: user.isVerified });

router.post('/register', async (req, res, next) => { try { const { username, email, password, firstName, lastName } = req.body; if (!username || !email || !password) return res.status(400).json({ message: 'username, email and password are required' }); const user = await User.create({ username, email, password, firstName, lastName }); res.status(201).json({ user: publicUser(user), token: tokenFor(user) }); } catch (e) { next(e); } });
router.post('/login', async (req, res, next) => { try { const user = await User.findOne({ email: String(req.body.email || '').toLowerCase() }).select('+password'); if (!user || !(await user.comparePassword(req.body.password || ''))) return res.status(401).json({ message: 'Invalid email or password' }); res.json({ user: publicUser(user), token: tokenFor(user) }); } catch (e) { next(e); } });
router.get('/me', auth, (req, res) => res.json({ user: publicUser(req.user) }));
module.exports = router;
      
