import { Link } from 'react-router-dom';
import { Button } from '../../../button/button';
import { ROLE } from '../../../../constans';
import styled from 'styled-components';

/**
 * Панель управления с навигацией в зависимости от роли пользователя
 * @param {Object} props - Свойства компонента
 * @param {Object} props.user - Данные пользователя
 * @param {Function} props.onLogout - Функция выхода из системы
 * @param {string} props.className - CSS класс
 * @returns {JSX.Element} Панель управления
 */
const ControlPanelContainer = ({ user, onLogout, className }) => {
	const isAdmin = user?.role_id === ROLE.ADMIN;
	const isUser = user?.role_id === ROLE.USER;
	const isGuest = !user || user?.role_id === ROLE.GUEST;

	return (
		<div className={className}>
			{isGuest ? (
				<>
					<Button as={Link} to="/login">
						Войти
					</Button>
					<Button as={Link} to="/register">
						Регистрация
					</Button>
				</>
			) : (
				<>
					<Button as={Link} to="/dishes">
						Блюда
					</Button>
					<Button as={Link} to="/create-recipe">
						Создать рецепт
					</Button>
					<Button as={Link} to="/warehouse">
						Склад
					</Button>
					{isAdmin && (
						<Button as={Link} to="/users">
							Пользователи
						</Button>
					)}
					<Button onClick={onLogout}>
						Выход
					</Button>
				</>
			)}
		</div>
	);
};

export const ControlPanel = styled(ControlPanelContainer)`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 16px;
	
	button {
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.1);
		color: white;
		font-weight: 500;
		transition: all 0.3s ease;
		
		&:hover {
			background: rgba(255, 255, 255, 0.2);
			border-color: rgba(255, 255, 255, 0.3);
			transform: translateY(-2px);
			box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
		}
		
		&:active {
			transform: translateY(0);
		}
	}
`;
