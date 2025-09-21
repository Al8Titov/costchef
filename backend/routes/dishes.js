const express = require('express');
const dishController = require('../controllers/dishController');
const auth = require('../middleware/auth');

const router = express.Router();

// Получить все блюда пользователя
router.get('/', auth, dishController.getDishes);

// Получить блюдо по ID
router.get('/:id', auth, dishController.getDishById);

// Создать новое блюдо
router.post('/', auth, dishController.createDish);

// Обновить блюдо
router.put('/:id', auth, dishController.updateDish);

// Удалить блюдо
router.delete('/:id', auth, dishController.deleteDish);

// Получить категории блюд
router.get('/categories/list', auth, dishController.getCategories);

// Расчет себестоимости блюда
router.post('/calculate-cost', auth, dishController.calculateCost);

// Копировать блюдо
router.post('/:id/copy', auth, dishController.copyDish);

module.exports = router;
