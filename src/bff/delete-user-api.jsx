/**
 * @fileoverview API функции для каскадного удаления пользователей
 * 
 * Этот файл содержит функцию для полного удаления пользователя и всех связанных данных:
 * - Удаление всех блюд пользователя
 * - Удаление всех продуктов пользователя
 * - Удаление самого пользователя
 * 
 * Используется администратором для полной очистки данных пользователя
 * 
 * @author CostChef Team
 * @version 1.0.0
 */

/**
 * Удаляет пользователя и все связанные с ним данные
 * @param {string} userId - ID пользователя
 * @returns {Promise<boolean>} Успешность операции
 */
export const deleteUserWithCascade = async (userId) => {
	try {
		// 1. Удаляем все блюда пользователя
		const dishesResponse = await fetch(`http://localhost:3001/user_dishes?user_id=${userId}`);
		if (dishesResponse.ok) {
			const userDishes = await dishesResponse.json();
			for (const dish of userDishes) {
				await fetch(`http://localhost:3001/user_dishes/${dish.id}`, {
					method: 'DELETE',
				});
			}
			console.log(`Удалено ${userDishes.length} блюд пользователя ${userId}`);
		}

		// 2. Удаляем все продукты пользователя
		const productsResponse = await fetch(`http://localhost:3001/user_products?user_id=${userId}`);
		if (productsResponse.ok) {
			const userProducts = await productsResponse.json();
			for (const product of userProducts) {
				await fetch(`http://localhost:3001/user_products/${product.id}`, {
					method: 'DELETE',
				});
			}
			console.log(`Удалено ${userProducts.length} продуктов пользователя ${userId}`);
		}

		// 3. Удаляем самого пользователя
		const userResponse = await fetch(`http://localhost:3001/users/${userId}`, {
			method: 'DELETE',
		});

		if (!userResponse.ok) {
			throw new Error('Ошибка удаления пользователя');
		}

		console.log(`Пользователь ${userId} и все связанные данные удалены из db.json`);
		return true;
	} catch (error) {
		console.error('Ошибка при каскадном удалении пользователя:', error);
		throw error;
	}
};
