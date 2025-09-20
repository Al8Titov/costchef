const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  display_quantity: {
    type: Number,
    required: true,
    min: 0
  },
  display_unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'l', 'ml', 'pcs', 'tbsp', 'tsp']
  },
  price_per_unit: {
    type: Number,
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  }
});

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  process: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  image_url: {
    type: String,
    trim: true,
    default: 'https://via.placeholder.com/280x150'
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  cost_price: {
    type: Number,
    required: true,
    min: 0
  },
  category_id: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4, 5, 6, 7] // Dish categories from db.json
  },
  ingredients: [ingredientSchema],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Обновление updated_at при изменении
dishSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Dish', dishSchema);
