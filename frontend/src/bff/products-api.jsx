/**
 * @fileoverview API функции для работы с продуктами пользователей
 * 
 * Этот файл содержит функции для взаимодействия с продуктами через JSON Server:
 * - Получение продуктов пользователя
 * - Создание новых продуктов
 * - Удаление продуктов
 * 
 * Все операции выполняются через HTTP запросы к db.json
 * 
 * @author CostChef Team
 * @version 1.0.0
 */

import apiClient from '../api/client';

/**
 * Получает все продукты пользователя
 * @param {string} userId - ID пользователя (не используется, так как токен содержит информацию о пользователе)
 * @returns {Promise<Array>} Массив продуктов пользователя
 */
export const getUserProducts = async (userId) => {
	try {
		const response = await apiClient.getProducts();
		if (response.success) {
			// Преобразуем данные для совместимости с frontend
			return (response.data || []).map(product => ({
				id: product._id,
				name: product.name,
				category_id: product.category_id,
				category_name: product.category_name,
				quantity: product.quantity,
				unit: product.unit,
				total_price: product.total_price,
				price_per_unit: product.price_per_unit,
				user_id: product.user_id,
				created_at: product.created_at,
				updated_at: product.updated_at
			}));
		}
		return [];
	} catch (error) {
		console.error('Ошибка при загрузке продуктов:', error);
		return [];
	}
};

/**
 * Создает новый продукт
 * @param {Object} productData - Данные продукта
 * @returns {Promise<Object>} Созданный продукт
 */
export const createProduct = async (productData) => {
	try {
		const response = await apiClient.createProduct(productData);
		if (response.success) {
			// Преобразуем данные для совместимости с frontend
			const product = {
				id: response.data._id,
				name: response.data.name,
				category_id: response.data.category_id,
				category_name: response.data.category_name,
				quantity: response.data.quantity,
				unit: response.data.unit,
				total_price: response.data.total_price,
				price_per_unit: response.data.price_per_unit,
				user_id: response.data.user_id,
				created_at: response.data.created_at,
				updated_at: response.data.updated_at
			};
			console.log('Продукт создан:', product);
			return product;
		}
		throw new Error('Ошибка создания продукта');
	} catch (error) {
		console.error('Ошибка при создании продукта:', error);
		throw error;
	}
};

/**
 * Удаляет продукт
 * @param {string} productId - ID продукта
 * @returns {Promise<boolean>} Успешность операции
 */
export const deleteProduct = async (productId) => {
	try {
		const response = await fetch(`http://localhost:3001/user_products/${productId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error('Ошибка удаления продукта');
		}

		console.log('Продукт удален из db.json:', productId);
		return true;
	} catch (error) {
		console.error('Ошибка при удалении продукта:', error);
		return false;
	}
};
