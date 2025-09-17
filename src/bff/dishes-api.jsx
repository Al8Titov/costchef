/**
 * @fileoverview API функции для работы с блюдами пользователей
 * 
 * Этот файл содержит функции для взаимодействия с блюдами через JSON Server:
 * - Получение блюд пользователя
 * - Создание новых блюд
 * - Удаление блюд
 * 
 * Все операции выполняются через HTTP запросы к db.json
 * 
 * @author CostChef Team
 * @version 1.0.0
 */

/**
 * Получает все блюда пользователя
 * @param {string} userId - ID пользователя
 * @returns {Promise<Array>} Массив блюд пользователя
 */
export const getUserDishes = async (userId) => {
	try {
		const response = await fetch(`http://localhost:3001/user_dishes?user_id=${userId}`);
		if (!response.ok) {
			throw new Error('Ошибка загрузки блюд');
		}
		
		const dishes = await response.json();
		return dishes;
	} catch (error) {
		console.error('Ошибка при загрузке блюд:', error);
		return [];
	}
};

/**
 * Создает новое блюдо
 * @param {Object} dishData - Данные блюда
 * @returns {Promise<Object>} Созданное блюдо
 */
export const createDish = async (dishData) => {
	try {
		const response = await fetch('http://localhost:3001/user_dishes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dishData),
		});

		if (!response.ok) {
			throw new Error('Ошибка создания блюда');
		}

		const createdDish = await response.json();
		console.log('Блюдо создано в db.json:', createdDish);
		return createdDish;
	} catch (error) {
		console.error('Ошибка при создании блюда:', error);
		throw error;
	}
};

/**
 * Удаляет блюдо
 * @param {string} dishId - ID блюда
 * @returns {Promise<boolean>} Успешность операции
 */
export const deleteDish = async (dishId) => {
	try {
		const response = await fetch(`http://localhost:3001/user_dishes/${dishId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error('Ошибка удаления блюда');
		}

		console.log('Блюдо удалено из db.json:', dishId);
		return true;
	} catch (error) {
		console.error('Ошибка при удалении блюда:', error);
		return false;
	}
};
