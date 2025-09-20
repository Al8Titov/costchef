import apiClient from '../api/client';

export const getUsers = async () => {
	try {
		// Получаем всех пользователей (только админы могут видеть всех пользователей)
		const response = await apiClient.getAllUsers();
		
		if (!response.success) {
			throw new Error('Недостаточно прав для просмотра пользователей');
		}

		// Преобразуем данные для отображения
		return response.data.map(user => ({
			id: user._id,
			login: user.login,
			nickname: user.nickname || user.login,
			email: user.email || `${user.login}@example.com`,
			role_id: user.role_id,
			role_name: getRoleName(user.role_id),
			registered_at: user.registered_at,
			is_online: Math.random() > 0.5, // Случайный статус для демонстрации
			last_activity: new Date().toISOString()
		}));
	} catch (error) {
		console.error('Ошибка при загрузке пользователей:', error);
		throw error;
	}
};

const getRoleName = (roleId) => {
	const roles = {
		0: 'Администратор',
		1: 'Пользователь', 
		2: 'Гость'
	};
	return roles[roleId] || 'Неизвестно';
};
