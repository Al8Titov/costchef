const express = require('express');
const Dish = require('../models/Dish');
const auth = require('../middleware/auth');

const router = express.Router();

// Получить все блюда пользователя
router.get('/', auth, async (req, res) => {
  try {
    const dishes = await Dish.find({ user_id: req.user._id })
      .populate('ingredients.product_id', 'name category_name')
      .sort({ created_at: -1 });
    
    res.json({
      success: true,
      data: dishes
    });
  } catch (error) {
    console.error('Get dishes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Получить одно блюдо
router.get('/:id', auth, async (req, res) => {
  try {
    const dish = await Dish.findOne({ 
      _id: req.params.id, 
      user_id: req.user._id 
    }).populate('ingredients.product_id', 'name category_name');

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    res.json({
      success: true,
      data: dish
    });
  } catch (error) {
    console.error('Get dish error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Создать новое блюдо
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      process,
      image_url,
      weight,
      cost_price,
      category_id,
      ingredients
    } = req.body;

    if (!name || !weight || !cost_price || !category_id) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const dish = new Dish({
      name,
      description: description || '',
      process: process || '',
      image_url: image_url || 'https://via.placeholder.com/280x150',
      weight,
      cost_price,
      category_id,
      ingredients,
      user_id: req.user._id
    });

    await dish.save();

    res.status(201).json({
      success: true,
      data: dish
    });
  } catch (error) {
    console.error('Create dish error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Обновить блюдо
router.put('/:id', auth, async (req, res) => {
  try {
    const dish = await Dish.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('ingredients.product_id', 'name category_name');

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    res.json({
      success: true,
      data: dish
    });
  } catch (error) {
    console.error('Update dish error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Удалить блюдо
router.delete('/:id', auth, async (req, res) => {
  try {
    const dish = await Dish.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id
    });

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    res.json({
      success: true,
      message: 'Dish deleted successfully'
    });
  } catch (error) {
    console.error('Delete dish error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
