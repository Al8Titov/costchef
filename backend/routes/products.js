const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Получить все продукты пользователя
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ user_id: req.user._id })
      .sort({ created_at: -1 });
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Создать новый продукт
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      category_id,
      category_name,
      quantity,
      unit,
      total_price,
      price_per_unit
    } = req.body;

    if (!name || !category_id || !category_name || !quantity || !unit || !total_price || !price_per_unit) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const product = new Product({
      name,
      category_id,
      category_name,
      quantity,
      unit,
      total_price,
      price_per_unit,
      user_id: req.user._id
    });

    await product.save();

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Обновить продукт
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Удалить продукт
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
