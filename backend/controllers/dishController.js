const Dish = require('../models/Dish');
const Product = require('../models/Product');

/**
 * Контроллер для управления блюдами
 */
class DishController {
  /**
   * Получение всех блюд пользователя
   */
  async getDishes(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, search, category_id } = req.query;

      // Построение фильтра
      const filter = { user_id: userId };
      
      if (search) {
        filter.name = { $regex: search, $options: 'i' };
      }

      if (category_id) {
        filter.category_id = parseInt(category_id);
      }

      // Пагинация
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const dishes = await Dish.find(filter)
        .populate('ingredients.product_id', 'name unit price_per_unit')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Dish.countDocuments(filter);

      res.json({
        success: true,
        data: dishes,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Ошибка получения блюд:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }

  /**
   * Получение блюда по ID
   */
  async getDishById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const dish = await Dish.findOne({ _id: id, user_id: userId })
        .populate('ingredients.product_id', 'name unit price_per_unit');
      
      if (!dish) {
        return res.status(404).json({ 
          success: false,
          error: 'Блюдо не найдено' 
        });
      }

      res.json({
        success: true,
        data: dish
      });
    } catch (error) {
      console.error('Ошибка получения блюда:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }

  /**
   * Создание нового блюда
   */
  async createDish(req, res) {
    try {
      const { 
        name, 
        description, 
        process, 
        image_url, 
        weight, 
        category_id, 
        ingredients 
      } = req.body;
      const userId = req.user.id;

      // Валидация обязательных полей
      if (!name || !weight || !category_id || !ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ 
          success: false,
          error: 'Название, вес, категория и ингредиенты обязательны' 
        });
      }

      if (ingredients.length === 0) {
        return res.status(400).json({ 
          success: false,
          error: 'Блюдо должно содержать хотя бы один ингредиент' 
        });
      }

      // Проверка уникальности названия блюда для пользователя
      const existingDish = await Dish.findOne({ 
        name, 
        user_id: userId 
      });
      
      if (existingDish) {
        return res.status(400).json({ 
          success: false,
          error: 'Блюдо с таким названием уже существует' 
        });
      }

      // Валидация и расчет стоимости ингредиентов
      let totalCost = 0;
      const validatedIngredients = [];

      for (const ingredient of ingredients) {
        const { name, quantity, display_quantity, display_unit, price_per_unit, product_id } = ingredient;

        if (!name || !quantity || !display_quantity || !display_unit || !price_per_unit) {
          return res.status(400).json({ 
            success: false,
            error: 'Все поля ингредиента обязательны' 
          });
        }

        const cost = parseFloat(quantity) * parseFloat(price_per_unit);
        totalCost += cost;

        validatedIngredients.push({
          product_id: product_id || null,
          name,
          quantity: parseFloat(quantity),
          display_quantity: parseFloat(display_quantity),
          display_unit,
          price_per_unit: parseFloat(price_per_unit),
          cost
        });
      }

      const dish = new Dish({
        name,
        description,
        process,
        image_url: image_url || 'https://via.placeholder.com/280x150',
        weight: parseFloat(weight),
        cost_price: totalCost,
        category_id: parseInt(category_id),
        ingredients: validatedIngredients,
        user_id: userId
      });

      await dish.save();

      // Популяция ингредиентов для ответа
      await dish.populate('ingredients.product_id', 'name unit price_per_unit');

      res.status(201).json({
        success: true,
        message: 'Блюдо успешно создано',
        data: dish
      });
    } catch (error) {
      console.error('Ошибка создания блюда:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }

  /**
   * Обновление блюда
   */
  async updateDish(req, res) {
    try {
      const { id } = req.params;
      const { 
        name, 
        description, 
        process, 
        image_url, 
        weight, 
        category_id, 
        ingredients 
      } = req.body;
      const userId = req.user.id;

      // Поиск блюда
      const dish = await Dish.findOne({ _id: id, user_id: userId });
      
      if (!dish) {
        return res.status(404).json({ 
          success: false,
          error: 'Блюдо не найдено' 
        });
      }

      // Проверка уникальности названия (если изменилось)
      if (name && name !== dish.name) {
        const existingDish = await Dish.findOne({ 
          name, 
          user_id: userId,
          _id: { $ne: id }
        });
        
        if (existingDish) {
          return res.status(400).json({ 
            success: false,
            error: 'Блюдо с таким названием уже существует' 
          });
        }
      }

      // Если обновляются ингредиенты, пересчитываем стоимость
      let updateData = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (process !== undefined) updateData.process = process;
      if (image_url !== undefined) updateData.image_url = image_url;
      if (weight !== undefined) updateData.weight = parseFloat(weight);
      if (category_id !== undefined) updateData.category_id = parseInt(category_id);

      if (ingredients && Array.isArray(ingredients)) {
        if (ingredients.length === 0) {
          return res.status(400).json({ 
            success: false,
            error: 'Блюдо должно содержать хотя бы один ингредиент' 
          });
        }

        // Валидация и расчет стоимости ингредиентов
        let totalCost = 0;
        const validatedIngredients = [];

        for (const ingredient of ingredients) {
          const { name, quantity, display_quantity, display_unit, price_per_unit, product_id } = ingredient;

          if (!name || !quantity || !display_quantity || !display_unit || !price_per_unit) {
            return res.status(400).json({ 
              success: false,
              error: 'Все поля ингредиента обязательны' 
            });
          }

          const cost = parseFloat(quantity) * parseFloat(price_per_unit);
          totalCost += cost;

          validatedIngredients.push({
            product_id: product_id || null,
            name,
            quantity: parseFloat(quantity),
            display_quantity: parseFloat(display_quantity),
            display_unit,
            price_per_unit: parseFloat(price_per_unit),
            cost
          });
        }

        updateData.ingredients = validatedIngredients;
        updateData.cost_price = totalCost;
      }

      const updatedDish = await Dish.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('ingredients.product_id', 'name unit price_per_unit');

      res.json({
        success: true,
        message: 'Блюдо успешно обновлено',
        data: updatedDish
      });
    } catch (error) {
      console.error('Ошибка обновления блюда:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }

  /**
   * Удаление блюда
   */
  async deleteDish(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const dish = await Dish.findOneAndDelete({ _id: id, user_id: userId });
      
      if (!dish) {
        return res.status(404).json({ 
          success: false,
          error: 'Блюдо не найдено' 
        });
      }

      res.json({
        success: true,
        message: 'Блюдо успешно удалено'
      });
    } catch (error) {
      console.error('Ошибка удаления блюда:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }

  /**
   * Получение категорий блюд
   */
  async getCategories(req, res) {
    try {
      const categories = [
        { id: 1, name: 'Закуски' },
        { id: 2, name: 'Салаты' },
        { id: 3, name: 'Супы' },
        { id: 4, name: 'Основные блюда' },
        { id: 5, name: 'Десерты' },
        { id: 6, name: 'Напитки' },
        { id: 7, name: 'Другие' }
      ];
      
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
   * Расчет себестоимости блюда
   */
  async calculateCost(req, res) {
    try {
      const { ingredients } = req.body;

      if (!ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ 
          success: false,
          error: 'Список ингредиентов обязателен' 
        });
      }

      let totalCost = 0;
      const calculatedIngredients = [];

      for (const ingredient of ingredients) {
        const { name, quantity, price_per_unit } = ingredient;

        if (!name || !quantity || !price_per_unit) {
          return res.status(400).json({ 
            success: false,
            error: 'Название, количество и цена за единицу обязательны' 
          });
        }

        const cost = parseFloat(quantity) * parseFloat(price_per_unit);
        totalCost += cost;

        calculatedIngredients.push({
          ...ingredient,
          quantity: parseFloat(quantity),
          price_per_unit: parseFloat(price_per_unit),
          cost
        });
      }

      res.json({
        success: true,
        data: {
          ingredients: calculatedIngredients,
          total_cost: totalCost
        }
      });
    } catch (error) {
      console.error('Ошибка расчета стоимости:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }

  /**
   * Копирование блюда
   */
  async copyDish(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const originalDish = await Dish.findOne({ _id: id, user_id: userId });
      
      if (!originalDish) {
        return res.status(404).json({ 
          success: false,
          error: 'Блюдо не найдено' 
        });
      }

      // Создание копии с новым названием
      const copiedDish = new Dish({
        ...originalDish.toObject(),
        _id: undefined,
        name: `${originalDish.name} (копия)`,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date()
      });

      await copiedDish.save();
      await copiedDish.populate('ingredients.product_id', 'name unit price_per_unit');

      res.status(201).json({
        success: true,
        message: 'Блюдо успешно скопировано',
        data: copiedDish
      });
    } catch (error) {
      console.error('Ошибка копирования блюда:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }
}

module.exports = new DishController();
