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

/**
 * Получает все продукты пользователя
 * @param {string} userId - ID пользователя
 * @returns {Promise<Array>} Массив продуктов пользователя
 */
export const getUserProducts = async (userId) => {
	try {
		const response = await fetch(`http://localhost:3001/user_products?user_id=${userId}`);
		if (!response.ok) {
			throw new Error('Ошибка загрузки продуктов');
		}
		
		const products = await response.json();
		return products;
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
		const response = await fetch('http://localhost:3001/user_products', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(productData),
		});

		if (!response.ok) {
			throw new Error('Ошибка создания продукта');
		}

		const createdProduct = await response.json();
		console.log('Продукт создан в db.json:', createdProduct);
		return createdProduct;
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
