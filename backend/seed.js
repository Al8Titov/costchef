const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config');
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Очищаем существующих пользователей
    await User.deleteMany({});

    // Создаем тестовых пользователей
    const users = [
      {
        login: 'admin',
        nickname: 'Администратор',
        email: 'admin@costchef.ru',
        password: 'admin123',
        role_id: 0,
        registered_at: new Date('2025-08-28T10:00:00Z')
      },
      {
        login: 'anton123',
        nickname: 'anton',
        email: 'anton123@example.com',
        password: 'qwe123',
        role_id: 1,
        registered_at: new Date('2052-08-08T06:46:00Z')
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.login}`);
    }

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeed = async () => {
  await connectDB();
  await seedUsers();
};

runSeed();
