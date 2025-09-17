import { generateDate } from './generate-date';
import { generateId } from '../utils/dataUtils';

export const addUser = async (login, password, nickname, email) => {
	const newUser = {
		id: generateId(),
		login,
		nickname,
		email,
		password,
		registered_at: generateDate(),
		role_id: 1, // Обычный пользователь
		products: [],
		dishes: []
	};

	// Сохраняем пользователя в db.json через json-server API
	try {
		const response = await fetch('http://localhost:3001/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newUser),
		});

		if (!response.ok) {
			throw new Error('Ошибка сохранения пользователя');
		}

		const savedUser = await response.json();
		console.log('Пользователь сохранен в db.json:', savedUser);
		return savedUser;
	} catch (error) {
		console.error('Ошибка при сохранении пользователя:', error);
		throw error;
	}
};
