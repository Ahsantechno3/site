const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const mongoose = require('mongoose');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const resolveReference = async (Model, value, label, required = false) => {
    if (value === undefined || value === null || value === '') {
        if (required) throw new Error(`${label} is required`);
        return undefined;
    }

    const reference = typeof value === 'object' ? value._id || value.name : value;
    if (mongoose.isValidObjectId(reference)) return reference;

    const record = await Model.findOne({
        name: { $regex: `^${escapeRegex(String(reference).trim())}$`, $options: 'i' }
    }).select('_id');

    if (!record) throw new Error(`${label} "${reference}" not found`);
    return record._id;
};

const createSlug = (name) => name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const normalizeProductInput = async (data) => {
    const normalized = { ...data };

    if (data.category !== undefined) {
        normalized.category = await resolveReference(Category, data.category, 'Category', true);
    }
    if (data.brand !== undefined) {
        normalized.brand = await resolveReference(Brand, data.brand, 'Brand');
    }
    if (!normalized.slug && normalized.name) {
        normalized.slug = createSlug(normalized.name);
    }

    return normalized;
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public/Admin
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('category brand');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Admin
const createProduct = async (req, res) => {
    try {
        const product = new Product(await normalizeProductInput(req.body));

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            await normalizeProductInput(req.body), 
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};

