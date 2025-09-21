const express = require('express');
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

const router = express.Router();

// Получить все продукты пользователя
router.get('/', auth, productController.getProducts);

// Получить продукт по ID
router.get('/:id', auth, productController.getProductById);

// Создать новый продукт
router.post('/', auth, productController.createProduct);

// Обновить продукт
router.put('/:id', auth, productController.updateProduct);

// Удалить продукт
router.delete('/:id', auth, productController.deleteProduct);

// Получить категории продуктов
router.get('/categories/list', auth, productController.getCategories);

// Обновить количество продукта
router.patch('/:id/quantity', auth, productController.updateQuantity);

module.exports = router;
