import apiClient from '../api/client';

export const server = {
	async authorize(authLogin, authPassword) {
		try {
			const response = await apiClient.login(authLogin, authPassword);
			
			if (response.success) {
				return {
					error: null,
					res: {
						id: response.user.id,
						login: response.user.login,
						nickname: response.user.nickname,
						role_id: response.user.role_id,
						session: response.token, // Используем токен как сессию
					},
				};
			} else {
				return {
					error: response.error || 'Ошибка авторизации',
					res: null,
				};
			}
		} catch (error) {
			return {
				error: error.message || 'Ошибка авторизации',
				res: null,
			};
		}
	},

	async register(regLogin, regPassword, regNickname, regEmail) {
		try {
			const response = await apiClient.register(regLogin, regPassword, regNickname, regEmail);
			
			if (response.success) {
				return {
					error: null,
					res: {
						id: response.user.id,
						login: response.user.login,
						nickname: response.user.nickname,
						email: response.user.email,
						role_id: response.user.role_id,
						session: response.token, // Используем токен как сессию
					},
				};
			} else {
				return {
					error: response.error || 'Ошибка регистрации',
					res: null,
				};
			}
		} catch (error) {
			return {
				error: error.message || 'Ошибка регистрации',
				res: null,
			};
		}
	},
};
