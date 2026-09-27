const Product = require('../models/Product');

const normalizeProduct = (body) => ({
  ...body,
  slug: body.slug || body.name?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  status: body.status || 'draft',
  images: Array.isArray(body.images) ? body.images : [],
  tags: Array.isArray(body.tags) ? body.tags : []
});

const getProducts = async (req, res, next) => {
  try {
    const { search, category, status = 'active', featured, limit = 24, page = 1 } = req.query;
    const query = {};
    if (status !== 'all') query.status = status;
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) query.$text = { $search: search };
    const size = Math.min(Math.max(Number(limit) || 24, 1), 100);
    const currentPage = Math.max(Number(page) || 1, 1);
    const [products, total] = await Promise.all([
      Product.find(query).populate('category brand').sort({ createdAt: -1 }).skip((currentPage - 1) * size).limit(size).lean(),
      Product.countDocuments(query)
    ]);
    res.json({ products, pagination: { page: currentPage, limit: size, total, pages: Math.ceil(total / size) } });
  } catch (error) { next(error); }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] }).populate('category brand');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) { next(error); }
};

const createProduct = async (req, res, next) => {
  try { res.status(201).json(await Product.create(normalizeProduct(req.body))); }
  catch (error) { next(error); }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, normalizeProduct(req.body), { new: true, runValidators: true }).populate('category brand');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) { next(error); }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { status: 'inactive' }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product archived', product });
  } catch (error) { next(error); }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
