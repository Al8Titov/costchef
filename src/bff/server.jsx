import { getUser } from './get-user';
import { addUser } from './add-user';
import { sessions } from './sessions';
// import { createSession } from './create-session';

export const server = {
	async authorize(authLogin, authPassword) {
		const user = await getUser(authLogin);

		if (!user) {
			return {
				error: 'Такой пользователь не найден',
				res: null,
			};
		}

		if (authPassword !== user.password) {
			return {
				error: 'Неверный пароль',
				res: null,
			};
		}

		return {
			error: null,
			res: {
				id: user.id,
				login: user.login,
				role_id: user.role_id,
				session: sessions.create(user),
			},
		};
	},

	async register(regLogin, regPassword, regNickname, regEmail) {
		const user = await getUser(regLogin);

		if (user) {
			return {
				error: 'Такой логин уже занят',
				res: null,
			};
		}

		const newUser = await addUser(regLogin, regPassword, regNickname, regEmail);

		return {
			error: null,
			res: {
				id: newUser.id,
				login: newUser.login,
				nickname: newUser.nickname,
				email: newUser.email,
				role_id: newUser.role_id,
				session: sessions.create(newUser),
			},
		};
	},
};
