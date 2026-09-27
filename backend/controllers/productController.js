const Product = require('../models/Product');

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
        const { name, slug, sku, description, price, stock, category } = req.body;

        const product = new Product({
            name,
            slug,
            sku,
            description,
            price,
            stock,
            category
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    createProduct
};

