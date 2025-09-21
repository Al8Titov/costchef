// Инициализация MongoDB для приложения
db = db.getSiblingDB('recipe_app');

// Создаем пользователя приложения
db.createUser({
  user: 'recipe_app_user',
  pwd: 'recipe_app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'recipe_app'
    }
  ]
});

// Создаем коллекции и начальные данные
db.createCollection('users');
db.createCollection('products');
db.createCollection('dishes');

// Добавляем начальные роли
db.roles.insertMany([
  { _id: 1, name: 'Администратор', description: 'Полный доступ к системе' },
  { _id: 2, name: 'Пользователь', description: 'Обычный пользователь' }
]);

// Добавляем категории блюд
db.dish_categories.insertMany([
  { _id: 1, name: 'Завтрак', description: 'Блюда для завтрака' },
  { _id: 2, name: 'Обед', description: 'Блюда для обеда' },
  { _id: 3, name: 'Ужин', description: 'Блюда для ужина' },
  { _id: 4, name: 'Десерт', description: 'Сладкие блюда' },
  { _id: 5, name: 'Закуска', description: 'Легкие закуски' }
]);

// Добавляем категории продуктов
db.product_categories.insertMany([
  { _id: 1, name: 'Мясо и птица', description: 'Мясные продукты' },
  { _id: 2, name: 'Рыба и морепродукты', description: 'Морепродукты' },
  { _id: 3, name: 'Молочные продукты', description: 'Молоко, сыр, творог' },
  { _id: 4, name: 'Овощи', description: 'Свежие овощи' },
  { _id: 5, name: 'Фрукты', description: 'Свежие фрукты' },
  { _id: 6, name: 'Крупы и макароны', description: 'Зерновые продукты' },
  { _id: 7, name: 'Специи и приправы', description: 'Приправы и специи' },
  { _id: 8, name: 'Прочее', description: 'Другие продукты' }
]);

print('MongoDB инициализирован успешно!');
