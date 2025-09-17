import { useState, useEffect, useCallback } from 'react';
import { getUsers } from '../bff/get-users';

/**
 * Хук для управления пользователями
 * @returns {Object} Объект с пользователями и функциями управления
 */
export const useUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	/**
	 * Загружает пользователей из базы данных
	 */
	const loadUsers = useCallback(async () => {
		setLoading(true);
		setError(null);
		
		try {
			const usersData = await getUsers();
			setUsers(usersData);
		} catch (err) {
			console.error('Ошибка загрузки пользователей:', err);
			setError('Ошибка загрузки пользователей');
		} finally {
			setLoading(false);
		}
	}, []);

	/**
	 * Обновляет список пользователей
	 */
	const refreshUsers = useCallback(() => {
		loadUsers();
	}, [loadUsers]);

	// Загружаем пользователей при монтировании компонента
	useEffect(() => {
		loadUsers();
	}, [loadUsers]);

	return {
		users,
		loading,
		error,
		refreshUsers,
		loadUsers
	};
};
