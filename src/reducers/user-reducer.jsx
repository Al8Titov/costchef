import { ACTION_TYPE } from '../action';
import { ROLE } from '../constans';
import { getFromStorage, saveToStorage } from '../utils/dataUtils';

// Восстанавливаем пользователя из localStorage при инициализации
const getInitialUserState = () => {
	const savedUser = getFromStorage('user', null);
	return savedUser || {
		id: null,
		login: null,
		role_id: ROLE.GUEST,
		session: null,
	};
};

const initialUserState = getInitialUserState();

/**
 * Редуктор для управления состоянием пользователя
 * @param {Object} state - Текущее состояние
 * @param {Object} action - Действие
 * @returns {Object} Новое состояние
 */
export const userReducer = (state = initialUserState, action) => {
	switch (action.type) {
		case ACTION_TYPE.SET_USER: {
			const newUser = {
				...state,
				...action.payload,
			};
			// Сохраняем пользователя в localStorage
			saveToStorage('user', newUser);
			return newUser;
		}
		case 'LOGOUT': {
			// Очищаем localStorage при выходе
			localStorage.removeItem('user');
			return {
				id: null,
				login: null,
				role_id: ROLE.GUEST,
				session: null,
			};
		}
		default:
			return state;
	}
};
