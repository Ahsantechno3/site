const mongoose = require('mongoose');
const Product = require('../models/Product');

const list = async (req, res, next) => { try { const page = Math.max(Number(req.query.page) || 1, 1); const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100); const filter = {}; if (req.query.status) filter.status = req.query.status; if (req.query.category && mongoose.isValidObjectId(req.query.category)) filter.category = req.query.category; if (req.query.search) filter.$text = { $search: req.query.search }; const [items, total] = await Promise.all([Product.find(filter).populate('category brand').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Product.countDocuments(filter)]); res.json({ items, products: items, page, limit, total, pages: Math.ceil(total / limit) }); } catch (e) { next(e); } };
const get = async (req, res, next) => { try { const item = await Product.findById(req.params.id).populate('category brand'); if (!item) return res.status(404).json({ message: 'Product not found' }); res.json(item); } catch (e) { next(e); } };
const create = async (req, res, next) => { try { const item = await Product.create(req.body); res.status(201).json(item); } catch (e) { next(e); } };
const update = async (req, res, next) => { try { const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('category brand'); if (!item) return res.status(404).json({ message: 'Product not found' }); res.json(item); } catch (e) { next(e); } };
const remove = async (req, res, next) => { try { const item = await Product.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ message: 'Product not found' }); res.json({ message: 'Product deleted' }); } catch (e) { next(e); } };
module.exports = { list, get, create, update, remove, getProducts: list, createProduct: create };
      
