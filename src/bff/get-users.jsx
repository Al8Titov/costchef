export const getUsers = async () => {
	try {
		// Загружаем пользователей из db.json через json-server
		const response = await fetch('http://localhost:3001/users');
		if (!response.ok) {
			throw new Error('Ошибка загрузки пользователей');
		}
		
		const users = await response.json();
		
		// Преобразуем данные для отображения
		return users.map(user => ({
			id: user.id,
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
