import { Link } from 'react-router-dom';
import styled from "styled-components";

const ControlPanelContainer = ({ className }) => {
	return (
		<div className={className}>
			<StyledLink to="warehouse" className="logout">Склад</StyledLink>
			<StyledLink to="/dish/:id">Блюда</StyledLink>
			<StyledLink to="/users">Пользователи</StyledLink>
			<StyledLink to="/login">Войти</StyledLink>
		</div>
	);
};

const StyledLink = styled(Link)`
	background-color: #5685bcff;
	color: white;
	border: none;
	border-radius: 6px;
	padding: 7px 30px;
	font-size: 15px;
	font-weight: 500;
	cursor: pointer;
	text-decoration: none; /* убираем подчеркивание */
	display: inline-flex; /* чтобы transform и align работали */
	align-items: center;
	justify-content: center;

	box-shadow: 0 2px 6px rgba(7, 7, 7, 1);
	transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;

	&:hover {
		background-color: #325b8aff;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
		transform: translateY(-2px);
	}

	&:active {
		transform: scale(0.96);
	}
`;

export const ControlPanel = styled(ControlPanelContainer)`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 12px;

	button {
		background-color: #5685bcff;
		color: white;
		border: none;
		border-radius: 6px;
		padding: 7px 30px;
		font-size: 15px;
		font-weight: 500;
		cursor: pointer;

		box-shadow: 0 2px 6px rgba(7, 7, 7, 1);
		transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;

		&:hover {
			background-color: #325b8aff;
			box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
			transform: translateY(-2px);
		}

		&:active {
			transform: scale(0.96);
		}
	}
`;

