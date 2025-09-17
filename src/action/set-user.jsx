import { ACTION_TYPE } from './action-type';
import PropTypes from 'prop-types';

/**
 * Action для установки пользователя в store
 * @param {Object} user - Объект пользователя
 * @param {string} user.id - ID пользователя
 * @param {string} user.login - Логин пользователя
 * @param {string} user.nickname - Никнейм пользователя
 * @param {string} user.email - Email пользователя
 * @param {number} user.role_id - ID роли пользователя
 * @param {string} user.session - Сессия пользователя
 * @returns {Object} Action объект
 */
export const setUser = (user) => ({
	type: ACTION_TYPE.SET_USER,
	payload: user,
});

setUser.propTypes = {
	user: PropTypes.shape({
		id: PropTypes.string.isRequired,
		login: PropTypes.string.isRequired,
		nickname: PropTypes.string,
		email: PropTypes.string,
		role_id: PropTypes.number.isRequired,
		session: PropTypes.string,
	}).isRequired,
};
