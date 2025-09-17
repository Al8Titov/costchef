export const getUser = async (loginToFind) => {
	try {
		// Загружаем пользователя из db.json через json-server
		const response = await fetch(`http://localhost:3001/users?login=${loginToFind}`);
		if (!response.ok) {
			throw new Error('Ошибка загрузки пользователя');
		}
		
		const users = await response.json();
		return users.length > 0 ? users[0] : null;
	} catch (error) {
		console.error('Ошибка при загрузке пользователя:', error);
		return null;
	}
};
