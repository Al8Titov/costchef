const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Авторизация
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: 'Login and password are required' });
    }

    const user = await User.findOne({ login });
    if (!user) {
      return res.status(401).json({ error: 'Такой пользователь не найден' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Неверный пароль' });
    }

    const token = jwt.sign(
      { userId: user._id, login: user.login, role_id: user.role_id },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        login: user.login,
        nickname: user.nickname,
        email: user.email,
        role_id: user.role_id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { login, password, nickname, email } = req.body;

    if (!login || !password || !nickname || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Проверяем, существует ли пользователь
    const existingUser = await User.findOne({ 
      $or: [{ login }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Такой логин или email уже занят' });
    }

    const user = new User({
      login,
      password,
      nickname,
      email,
      role_id: 1 // Обычный пользователь
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, login: user.login, role_id: user.role_id },
      config.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        login: user.login,
        nickname: user.nickname,
        email: user.email,
        role_id: user.role_id
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Получение информации о текущем пользователе
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Получение всех пользователей (только для админов)
router.get('/users', auth, async (req, res) => {
  try {
    // Проверяем, что пользователь - администратор
    if (req.user.role_id !== 0) {
      return res.status(403).json({ error: 'Недостаточно прав для просмотра пользователей' });
    }

    const users = await User.find({}).select('-password');
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
