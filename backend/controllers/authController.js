const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

/**
 * Контроллер для аутентификации пользователей
 */
class AuthController {
  /**
   * Вход пользователя в систему
   */
  async login(req, res) {
    try {
      const { login, password } = req.body;

      // Валидация входных данных
      if (!login || !password) {
        return res.status(400).json({ 
          success: false,
          error: 'Логин и пароль обязательны' 
        });
      }

      // Поиск пользователя
      const user = await User.findOne({ login });
      if (!user) {
        return res.status(401).json({ 
          success: false,
          error: 'Пользователь с таким логином не найден' 
        });
      }

      // Проверка пароля
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ 
          success: false,
          error: 'Неверный пароль' 
        });
      }

      // Генерация JWT токена
      const token = jwt.sign(
        { 
          userId: user._id, 
          login: user.login, 
          role_id: user.role_id 
        },
        config.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Успешный вход в систему',
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
      console.error('Ошибка входа:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }

  /**
   * Регистрация нового пользователя
   */
  async register(req, res) {
    try {
      const { login, password, nickname, email } = req.body;

      // Валидация входных данных
      if (!login || !password || !nickname || !email) {
        return res.status(400).json({ 
          success: false,
          error: 'Все поля обязательны для заполнения' 
        });
      }

      // Проверка длины пароля
      if (password.length < 6) {
        return res.status(400).json({ 
          success: false,
          error: 'Пароль должен содержать минимум 6 символов' 
        });
      }

      // Проверка уникальности логина и email
      const existingUser = await User.findOne({ 
        $or: [{ login }, { email }] 
      });
      
      if (existingUser) {
        const field = existingUser.login === login ? 'логин' : 'email';
        return res.status(400).json({ 
          success: false,
          error: `Пользователь с таким ${field} уже существует` 
        });
      }

      // Создание нового пользователя
      const user = new User({
        login,
        password,
        nickname,
        email,
        role_id: 1 // Обычный пользователь
      });

      await user.save();

      // Генерация JWT токена
      const token = jwt.sign(
        { 
          userId: user._id, 
          login: user.login, 
          role_id: user.role_id 
        },
        config.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'Пользователь успешно зарегистрирован',
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
      console.error('Ошибка регистрации:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }

  /**
   * Получение информации о текущем пользователе
   */
  async getMe(req, res) {
    try {
      res.json({
        success: true,
        user: req.user
      });
    } catch (error) {
      console.error('Ошибка получения пользователя:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }

  /**
   * Получение всех пользователей (только для администраторов)
   */
  async getUsers(req, res) {
    try {
      // Проверка прав администратора
      if (req.user.role_id !== 0) {
        return res.status(403).json({ 
          success: false,
          error: 'Недостаточно прав для просмотра пользователей' 
        });
      }

      const users = await User.find({}).select('-password');
      
      res.json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      console.error('Ошибка получения пользователей:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }

  /**
   * Обновление профиля пользователя
   */
  async updateProfile(req, res) {
    try {
      const { nickname, email } = req.body;
      const userId = req.user.id;

      // Проверка уникальности email
      if (email) {
        const existingUser = await User.findOne({ 
          email, 
          _id: { $ne: userId } 
        });
        
        if (existingUser) {
          return res.status(400).json({ 
            success: false,
            error: 'Пользователь с таким email уже существует' 
          });
        }
      }

      // Обновление данных пользователя
      const updateData = {};
      if (nickname) updateData.nickname = nickname;
      if (email) updateData.email = email;

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ 
          success: false,
          error: 'Пользователь не найден' 
        });
      }

      res.json({
        success: true,
        message: 'Профиль успешно обновлен',
        user
      });
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }

  /**
   * Изменение пароля пользователя
   */
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          success: false,
          error: 'Текущий и новый пароль обязательны' 
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ 
          success: false,
          error: 'Новый пароль должен содержать минимум 6 символов' 
        });
      }

      // Получение пользователя с паролем
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ 
          success: false,
          error: 'Пользователь не найден' 
        });
      }

      // Проверка текущего пароля
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ 
          success: false,
          error: 'Неверный текущий пароль' 
        });
      }

      // Обновление пароля
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Пароль успешно изменен'
      });
    } catch (error) {
      console.error('Ошибка изменения пароля:', error);
      res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
      });
    }
  }
}

module.exports = new AuthController();
