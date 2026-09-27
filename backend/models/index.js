// models/index.js
const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Brand = require('./Brand');
const Order = require('./Order');
const Review = require('./Review');
const Coupon = require('./Coupon');
const Media = require('./Media');
const Setting = require('./Setting');

module.exports = {
  User,
  Product,
  Category,
  Brand,
  Order,
  Review,
  Coupon,
  Media,
  Setting
};