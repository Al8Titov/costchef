import apiClient from '../api/client';

/**
 * @fileoverview API функции для работы с блюдами пользователей
 * 
 * Этот файл содержит функции для взаимодействия с блюдами через новый backend API:
 * - Получение блюд пользователя
 * - Создание новых блюд
 * - Удаление блюд
 * 
 * Все операции выполняются через HTTP запросы к Express API
 * 
 * @author CostChef Team
 * @version 2.0.0
 */

/**
 * Получает все блюда пользователя
 * @param {string} userId - ID пользователя (не используется, так как токен содержит информацию о пользователе)
 * @returns {Promise<Array>} Массив блюд пользователя
 */
export const getUserDishes = async (userId) => {
	try {
		const response = await apiClient.getDishes();
		if (response.success) {
			// Преобразуем данные для совместимости с frontend
			return (response.data || []).map(dish => ({
				id: dish._id,
				name: dish.name,
				description: dish.description,
				process: dish.process,
				image_url: dish.image_url,
				weight: dish.weight,
				cost_price: dish.cost_price,
				category_id: dish.category_id,
				ingredients: dish.ingredients,
				user_id: dish.user_id,
				created_at: dish.created_at,
				updated_at: dish.updated_at
			}));
		}
		return [];
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
		const response = await apiClient.createDish(dishData);
		if (response.success) {
			// Преобразуем данные для совместимости с frontend
			const dish = {
				id: response.data._id,
				name: response.data.name,
				description: response.data.description,
				process: response.data.process,
				image_url: response.data.image_url,
				weight: response.data.weight,
				cost_price: response.data.cost_price,
				category_id: response.data.category_id,
				ingredients: response.data.ingredients,
				user_id: response.data.user_id,
				created_at: response.data.created_at,
				updated_at: response.data.updated_at
			};
			console.log('Блюдо создано:', dish);
			return dish;
		}
		throw new Error('Ошибка создания блюда');
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
		const response = await apiClient.deleteDish(dishId);
		if (response.success) {
			console.log('Блюдо удалено:', dishId);
			return true;
		}
		return false;
	} catch (error) {
		console.error('Ошибка при удалении блюда:', error);
		return false;
	}
};
