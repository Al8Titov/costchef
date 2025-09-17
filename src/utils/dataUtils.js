/**
 * @fileoverview Утилиты для работы с данными приложения
 * 
 * Этот файл содержит вспомогательные функции для:
 * - Генерации уникальных ID
 * - Форматирования дат
 * - Работы с localStorage
 * - Фильтрации и сортировки данных
 * - Проверки ролей пользователей
 * 
 * @author CostChef Team
 * @version 1.0.0
 */

/**
 * Получает данные из localStorage
 * @param {string} key - Ключ для получения данных
 * @param {*} defaultValue - Значение по умолчанию
 * @returns {*} Данные из localStorage или значение по умолчанию
 */
export const getFromStorage = (key, defaultValue = null) => {
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : defaultValue;
	} catch (error) {
		console.error('Ошибка при получении данных из localStorage:', error);
		return defaultValue;
	}
};

/**
 * Сохраняет данные в localStorage
 * @param {string} key - Ключ для сохранения
 * @param {*} value - Значение для сохранения
 * @returns {boolean} Успешность операции
 */
export const saveToStorage = (key, value) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch (error) {
		console.error('Ошибка при сохранении в localStorage:', error);
		return false;
	}
};

/**
 * Удаляет данные из localStorage
 * @param {string} key - Ключ для удаления
 * @returns {boolean} Успешность операции
 */
export const removeFromStorage = (key) => {
	try {
		localStorage.removeItem(key);
		return true;
	} catch (error) {
		console.error('Ошибка при удалении из localStorage:', error);
		return false;
	}
};

/**
 * Фильтрует массив по поисковому запросу
 * @param {Array} items - Массив для фильтрации
 * @param {string} searchQuery - Поисковый запрос
 * @param {string} field - Поле для поиска
 * @returns {Array} Отфильтрованный массив
 */
export const filterBySearch = (items, searchQuery, field = 'name') => {
	if (!searchQuery || !items) {
		return items || [];
	}
	
	const query = searchQuery.toLowerCase().trim();
	return items.filter(item => 
		item[field] && item[field].toLowerCase().includes(query)
	);
};

/**
 * Сортирует массив по полю
 * @param {Array} items - Массив для сортировки
 * @param {string} field - Поле для сортировки
 * @param {string} direction - Направление сортировки ('asc' или 'desc')
 * @returns {Array} Отсортированный массив
 */
export const sortByField = (items, field, direction = 'asc') => {
	if (!items || !Array.isArray(items)) {
		return [];
	}
	
	return [...items].sort((a, b) => {
		const aValue = a[field];
		const bValue = b[field];
		
		if (aValue < bValue) {
			return direction === 'asc' ? -1 : 1;
		}
		if (aValue > bValue) {
			return direction === 'asc' ? 1 : -1;
		}
		return 0;
	});
};

/**
 * Генерирует уникальный ID
 * @returns {string} Уникальный ID
 */
export const generateId = () => {
	return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Форматирует дату для отображения
 * @param {string|Date} date - Дата для форматирования
 * @returns {string} Отформатированная дата
 */
export const formatDate = (date) => {
	try {
		const dateObj = new Date(date);
		return dateObj.toLocaleDateString('ru-RU', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	} catch (error) {
		console.error('Ошибка при форматировании даты:', error);
		return 'Неизвестно';
	}
};

/**
 * Проверяет, является ли пользователь администратором
 * @param {Object} user - Объект пользователя
 * @returns {boolean} Является ли пользователь администратором
 */
export const isAdmin = (user) => {
	return user && user.role_id === 0;
};

/**
 * Проверяет, является ли пользователь обычным пользователем
 * @param {Object} user - Объект пользователя
 * @returns {boolean} Является ли пользователь обычным пользователем
 */
export const isUser = (user) => {
	return user && user.role_id === 1;
};

/**
 * Проверяет, является ли пользователь гостем
 * @param {Object} user - Объект пользователя
 * @returns {boolean} Является ли пользователь гостем
 */
export const isGuest = (user) => {
	return !user || user.role_id === 2;
};

