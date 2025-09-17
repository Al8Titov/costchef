/**
 * @fileoverview Утилиты для расчетов себестоимости и веса блюд
 * 
 * Этот файл содержит функции для различных расчетов:
 * - Расчет себестоимости блюд
 * - Расчет веса блюд
 * - Форматирование цен и весов
 * - Конвертация единиц измерения
 * 
 * @author CostChef Team
 * @version 1.0.0
 */

/**
 * Рассчитывает себестоимость блюда на основе ингредиентов
 * @param {Array} ingredients - Массив ингредиентов с количеством и ценой
 * @returns {number} Себестоимость блюда
 */
export const calculateDishCost = (ingredients) => {
	if (!ingredients || !Array.isArray(ingredients)) {
		return 0;
	}

	return ingredients.reduce((total, ingredient) => {
		const quantity = parseFloat(ingredient.quantity) || 0;
		const pricePerUnit = parseFloat(ingredient.price_per_unit) || 0;
		return total + (quantity * pricePerUnit);
	}, 0);
};

/**
 * Рассчитывает общий вес блюда
 * @param {Array} ingredients - Массив ингредиентов с количеством
 * @returns {number} Общий вес блюда в граммах
 */
export const calculateDishWeight = (ingredients) => {
	if (!ingredients || !Array.isArray(ingredients)) {
		return 0;
	}

	return ingredients.reduce((total, ingredient) => {
		const quantity = parseFloat(ingredient.quantity) || 0;
		const unit = ingredient.unit || 'kg';
		
		// Конвертируем в граммы
		let weightInGrams = quantity;
		if (unit === 'kg') {
			weightInGrams = quantity * 1000;
		} else if (unit === 'l') {
			weightInGrams = quantity * 1000; // Предполагаем, что 1л = 1кг
		}
		// Для 'шт' оставляем как есть (предполагаем граммы)
		
		return total + weightInGrams;
	}, 0);
};

/**
 * Рассчитывает цену за единицу продукта
 * @param {number} totalPrice - Общая стоимость покупки
 * @param {number} quantity - Количество
 * @param {string} unit - Единица измерения
 * @returns {number} Цена за единицу
 */
export const calculatePricePerUnit = (totalPrice, quantity, unit) => {
	if (!totalPrice || !quantity || quantity <= 0) {
		return 0;
	}
	
	return totalPrice / quantity;
};

/**
 * Форматирует число до 2 знаков после запятой
 * @param {number} value - Значение для форматирования
 * @returns {string} Отформатированное значение
 */
export const formatPrice = (value) => {
	return parseFloat(value || 0).toFixed(2);
};

/**
 * Форматирует вес в зависимости от единицы измерения
 * @param {number} value - Значение веса
 * @param {string} unit - Единица измерения
 * @returns {string} Отформатированный вес
 */
export const formatWeight = (value, unit) => {
	const numValue = parseFloat(value || 0);
	
	if (unit === 'kg') {
		if (numValue < 1) {
			return `${Math.round(numValue * 1000)} гр`;
		}
		return `${numValue.toFixed(3)} кг`;
	} else if (unit === 'l') {
		return `${numValue.toFixed(3)} л`;
	} else if (unit === 'шт') {
		return `${Math.round(numValue)} шт`;
	}
	
	return `${numValue.toFixed(2)} ${unit}`;
};

/**
 * Конвертирует единицы измерения
 * @param {number} value - Значение
 * @param {string} fromUnit - Исходная единица
 * @param {string} toUnit - Целевая единица
 * @returns {number} Конвертированное значение
 */
export const convertUnits = (value, fromUnit, toUnit) => {
	if (fromUnit === toUnit) {
		return value;
	}
	
	const numValue = parseFloat(value || 0);
	
	// Конвертируем в граммы
	let grams = numValue;
	if (fromUnit === 'kg') {
		grams = numValue * 1000;
	} else if (fromUnit === 'l') {
		grams = numValue * 1000; // Предполагаем 1л = 1кг
	}
	
	// Конвертируем из граммов в целевую единицу
	if (toUnit === 'kg') {
		return grams / 1000;
	} else if (toUnit === 'l') {
		return grams / 1000; // Предполагаем 1л = 1кг
	} else if (toUnit === 'шт') {
		return Math.round(grams); // Предполагаем, что штуки = граммы
	}
	
	return grams;
};

