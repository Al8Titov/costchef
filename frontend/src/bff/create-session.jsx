import { removeComment } from './session';
import { ROLE } from '../constans';

export const createSession = (roleId) => {
	const session = {
		logout() {
			Object.keys(session).forEach((key) => {
				delete session[key];
			});
		},
	};

	switch (roleId) {
		case ROLE.ADMIN: {
			session.removeComment = removeComment;
			break;
		}
		case ROLE.USER: {
			session.removeComment = removeComment;
			break;
		}
		default:
		// ничего не делать
	}
	return session;
};
