import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { server } from '../../bff';
import { Button, Input } from '../../components';
import { setUser } from '../../action/set-user';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const authFormSchema = yup.object().shape({
	login: yup
		.string()
		.required('Заполните логин')
		.matches(/^\w+$/, 'Неверный логин. Допускается только буквы и цифры')
		.min(3, 'Неверно заполнен логин. Минимум 3 символа')
		.max(15, 'Неверно заполнен логин. Максимум 15 символов'),
	password: yup
		.string()
		.required('Заполните пароль')
		.matches(
			/^[\w#%]+$/,
			'Неверный пароль. Допускается только буквы и цифры и знаки # и %',
		)
		.min(6, 'Неверно заполнен пароль. Минимум 6 символов')
		.max(30, 'Неверно заполнен пароль. Максимум 30 символов'),
});

const ErrorMessage = styled.div`
	color: red;
	font-size: 14px;
	margin-top: 10px;
`;

const AuthorizationContainer = ({ className }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
		},
		resolver: yupResolver(authFormSchema),
	});

	const [serverError, setServerError] = useState(null);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onSubmit = ({ login, password }) => {
		server.authorize(login, password).then(({ error, res }) => {
			if (error) {
				setServerError(`Ошибка запроса: ${error}`);
				return;
			}

			dispatch(setUser(res));
			navigate('/');
		});
	};

	const formError = errors?.login?.message || errors?.password?.message;

	const errorMessage = serverError || formError;

	return (
		<div className={className}>
			<h2>Авторизация</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<StyledInput
					type="text"
					placeholder="Логин..."
					{...register('login', {
						onChange: () => setServerError(null),
					})}
				/>
				<StyledInput
					type="password"
					placeholder="Пароль..."
					{...register('password', {
						onChange: () => setServerError(null),
					})}
				/>

				<div className="buttons">
					<StyledButton type="submit" variant="primary">
						Авторизация
					</StyledButton>
					<StyledButton as={Link} to="/register" variant="secondary">
						Регистрация
					</StyledButton>
				</div>

				{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
			</form>
		</div>
	);
};

AuthorizationContainer.propTypes = {
	className: PropTypes.string,
};

export const StyledButton = styled(Button)`
	width: 100%;
	text-align: center;
	border-radius: 6px;
	font-size: 15px;
	font-weight: 500;
	cursor: pointer;
	padding: 7px 30px;
	transition: all 0.2s ease;
	transform: translateY(0);

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
	}

	${({ variant }) =>
		variant === 'primary' &&
		`
      background-color: #5685bc;
      color: #fff;
      border: 3px solid #5685bc;
    `}

	${({ variant }) =>
		variant === 'secondary' &&
		`
      background-color: #fff;
      color: #5685bc;
      border: 1px solid #5685bc;

      &:hover {
        background-color: #5685bc;
        color: #fff;
      }
    `}
`;

export const StyledInput = styled(Input)`
	border-radius: 6px;
	transition: all 0.2s ease;
	transform: translateY(0);

	&:hover,
	&:focus {
		transform: translateY(-2px);
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
		outline: none;
	}
`;

export const Authorization = styled(AuthorizationContainer)`
	display: flex;
	flex-direction: column;
	align-items: center;

	& > form {
		display: flex;
		flex-direction: column;
		width: 260px;
		gap: 1px;

		.buttons {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}
	}
`;
