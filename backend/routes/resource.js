const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const resourceRouter = (Model, options = {}) => {
  const router = express.Router();
  router.get('/', async (req, res, next) => { try { const filter = options.filter ? options.filter(req) : {}; const items = await Model.find(filter).sort({ createdAt: -1 }); res.json({ items, data: items }); } catch (e) { next(e); } });
  router.get('/:id', async (req, res, next) => { try { const item = await Model.findById(req.params.id); if (!item) return res.status(404).json({ message: 'Resource not found' }); res.json(item); } catch (e) { next(e); } });
  router.post('/', auth, admin, async (req, res, next) => { try { res.status(201).json(await Model.create(req.body)); } catch (e) { next(e); } });
  router.put('/:id', auth, admin, async (req, res, next) => { try { const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!item) return res.status(404).json({ message: 'Resource not found' }); res.json(item); } catch (e) { next(e); } });
  router.patch('/:id', auth, admin, async (req, res, next) => { try { const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!item) return res.status(404).json({ message: 'Resource not found' }); res.json(item); } catch (e) { next(e); } });
  router.delete('/:id', auth, admin, async (req, res, next) => { try { const item = await Model.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ message: 'Resource not found' }); res.json({ message: 'Deleted' }); } catch (e) { next(e); } });
  return router;
};
module.exports = resourceRouter;
      
