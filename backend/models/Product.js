const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'l', 'ml', 'pcs', 'tbsp', 'tsp']
  },
  price_per_unit: {
    type: Number,
    required: true,
    min: 0
  },
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
productSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Индексы для оптимизации поиска
productSchema.index({ user_id: 1, name: 1 });
productSchema.index({ user_id: 1, category: 1 });

module.exports = mongoose.model('Product', productSchema);
