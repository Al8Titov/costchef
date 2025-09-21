const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Авторизация
router.post('/login', authController.login);

// Регистрация
router.post('/register', authController.register);

// Получение информации о текущем пользователе
router.get('/me', auth, authController.getMe);

// Получение всех пользователей (только для админов)
router.get('/users', auth, authController.getUsers);

// Обновление профиля пользователя
router.put('/profile', auth, authController.updateProfile);

// Изменение пароля
router.put('/password', auth, authController.changePassword);

module.exports = router;
