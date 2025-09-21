const Product = require('../models/Product');

/**
 * Контроллер для управления продуктами
 */
class ProductController {
  /**
   * Получение всех продуктов пользователя
   */
  async getProducts(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, search, category } = req.query;

      // Построение фильтра
      const filter = { user_id: userId };
      
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
        ];
      }

      if (category) {
        filter.category = category;
      }

      // Пагинация
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const products = await Product.find(filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Product.countDocuments(filter);

      res.json({
        success: true,
        data: products,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Ошибка получения продуктов:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }

  /**
   * Получение продукта по ID
   */
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const product = await Product.findOne({ _id: id, user_id: userId });
      
      if (!product) {
        return res.status(404).json({ 
          success: false,
          error: 'Продукт не найден' 
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Ошибка получения продукта:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }

  /**
   * Создание нового продукта
   */
  async createProduct(req, res) {
    try {
      const { name, category, unit, price_per_unit, quantity = 0 } = req.body;
      const userId = req.user.id;

      // Валидация обязательных полей
      if (!name || !category || !unit || price_per_unit === undefined) {
        return res.status(400).json({ 
          success: false,
          error: 'Название, категория, единица измерения и цена обязательны' 
        });
      }

      // Проверка уникальности названия продукта для пользователя
      const existingProduct = await Product.findOne({ 
        name, 
        user_id: userId 
      });
      
      if (existingProduct) {
        return res.status(400).json({ 
          success: false,
          error: 'Продукт с таким названием уже существует' 
        });
      }

      const product = new Product({
        name,
        category,
        unit,
        price_per_unit: parseFloat(price_per_unit),
        quantity: parseFloat(quantity),
        user_id: userId
      });

      await product.save();

      res.status(201).json({
        success: true,
        message: 'Продукт успешно создан',
        data: product
      });
    } catch (error) {
      console.error('Ошибка создания продукта:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }

  /**
   * Обновление продукта
   */
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, category, unit, price_per_unit, quantity } = req.body;
      const userId = req.user.id;

      // Поиск продукта
      const product = await Product.findOne({ _id: id, user_id: userId });
      
      if (!product) {
        return res.status(404).json({ 
          success: false,
          error: 'Продукт не найден' 
        });
      }

      // Проверка уникальности названия (если изменилось)
      if (name && name !== product.name) {
        const existingProduct = await Product.findOne({ 
          name, 
          user_id: userId,
          _id: { $ne: id }
        });
        
        if (existingProduct) {
          return res.status(400).json({ 
            success: false,
            error: 'Продукт с таким названием уже существует' 
          });
        }
      }

      // Обновление данных
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (category !== undefined) updateData.category = category;
      if (unit !== undefined) updateData.unit = unit;
      if (price_per_unit !== undefined) updateData.price_per_unit = parseFloat(price_per_unit);
      if (quantity !== undefined) updateData.quantity = parseFloat(quantity);

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Продукт успешно обновлен',
        data: updatedProduct
      });
    } catch (error) {
      console.error('Ошибка обновления продукта:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }

  /**
   * Удаление продукта
   */
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const product = await Product.findOneAndDelete({ _id: id, user_id: userId });
      
      if (!product) {
        return res.status(404).json({ 
          success: false,
          error: 'Продукт не найден' 
        });
      }

      res.json({
        success: true,
        message: 'Продукт успешно удален'
      });
    } catch (error) {
      console.error('Ошибка удаления продукта:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }

  /**
   * Получение категорий продуктов
   */
  async getCategories(req, res) {
    try {
      const userId = req.user.id;
      
      const categories = await Product.distinct('category', { user_id: userId });
      
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Ошибка получения категорий:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }

  /**
   * Обновление количества продукта на складе
   */
  async updateQuantity(req, res) {
    try {
      const { id } = req.params;
      const { quantity, operation = 'set' } = req.body; // operation: 'set', 'add', 'subtract'
      const userId = req.user.id;

      if (quantity === undefined) {
        return res.status(400).json({ 
          success: false,
          error: 'Количество обязательно' 
        });
      }

      const product = await Product.findOne({ _id: id, user_id: userId });
      
      if (!product) {
        return res.status(404).json({ 
          success: false,
          error: 'Продукт не найден' 
        });
      }

      let newQuantity;
      switch (operation) {
        case 'add':
          newQuantity = product.quantity + parseFloat(quantity);
          break;
        case 'subtract':
          newQuantity = product.quantity - parseFloat(quantity);
          if (newQuantity < 0) newQuantity = 0;
          break;
        case 'set':
        default:
          newQuantity = parseFloat(quantity);
          break;
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { quantity: newQuantity },
        { new: true }
      );

      res.json({
        success: true,
        message: 'Количество успешно обновлено',
        data: updatedProduct
      });
    } catch (error) {
      console.error('Ошибка обновления количества:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }
}

module.exports = new ProductController();
