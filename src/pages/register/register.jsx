import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { server } from '../../bff';
import { Button, Input } from '../../components';
import { setUser } from '../../action/set-user';
import { generateId } from '../../utils/dataUtils';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const registerFormSchema = yup.object().shape({
	login: yup
		.string()
		.required('Заполните логин')
		.matches(/^\w+$/, 'Неверный логин. Допускается только буквы и цифры')
		.min(3, 'Неверно заполнен логин. Минимум 3 символа')
		.max(15, 'Неверно заполнен логин. Максимум 15 символов'),
	nickname: yup
		.string()
		.required('Заполните никнейм')
		.min(2, 'Никнейм должен содержать минимум 2 символа')
		.max(20, 'Никнейм должен содержать максимум 20 символов')
		.matches(/^[a-zA-Zа-яА-Я0-9_]+$/, 'Никнейм может содержать только буквы, цифры и _'),
	password: yup
		.string()
		.required('Заполните пароль')
		.min(6, 'Пароль должен содержать минимум 6 символов')
		.max(30, 'Пароль должен содержать максимум 30 символов'),
	confirmPassword: yup
		.string()
		.required('Подтвердите пароль')
		.oneOf([yup.ref('password')], 'Пароли не совпадают'),
});

const ErrorMessage = styled.div`
	color: #e74c3c;
	font-size: 14px;
	margin-top: 10px;
`;

/**
 * Компонент страницы регистрации
 * @param {string} className - CSS класс
 * @returns {JSX.Element} Страница регистрации
 */
const RegisterContainer = ({ className }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			login: '',
			nickname: '',
			password: '',
			confirmPassword: '',
		},
		resolver: yupResolver(registerFormSchema),
	});

	const [serverError, setServerError] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	/**
	 * Обработчик отправки формы регистрации
	 * @param {Object} data - Данные формы
	 */
	const onSubmit = async ({ login, nickname, password }) => {
		setIsSubmitting(true);
		setServerError(null);

		try {
			console.log('Попытка регистрации:', { login, nickname, password });
			
			const { error, res } = await server.register(login, password, nickname, `${login}@example.com`);

			if (error) {
				setServerError(error);
				return;
			}

			// Автоматически входим после регистрации
			dispatch(setUser(res));
			navigate('/');
		} catch (error) {
			console.error('Ошибка при регистрации:', error);
			setServerError('Произошла ошибка при регистрации');
		} finally {
			setIsSubmitting(false);
		}
	};

	const formError = errors?.login?.message || errors?.nickname?.message || errors?.password?.message || errors?.confirmPassword?.message;
	const errorMessage = serverError || formError;

	return (
		<div className={className}>
			<RegisterForm onSubmit={handleSubmit(onSubmit)}>
				<FormTitle>Регистрация</FormTitle>
				
				<FormGroup>
					<Label htmlFor="login">Логин *</Label>
					<StyledInput
						id="login"
						type="text"
						placeholder="Введите логин..."
						{...register('login', {
							onChange: () => setServerError(null),
						})}
					/>
				</FormGroup>

				<FormGroup>
					<Label htmlFor="nickname">Никнейм (отображаемое имя) *</Label>
					<StyledInput
						id="nickname"
						type="text"
						placeholder="Например: ChefJohn"
						{...register('nickname', {
							onChange: () => setServerError(null),
						})}
					/>
				</FormGroup>

				<FormGroup>
					<Label htmlFor="password">Пароль *</Label>
					<StyledInput
						id="password"
						type="password"
						placeholder="Введите пароль..."
						{...register('password', {
							onChange: () => setServerError(null),
						})}
					/>
				</FormGroup>

				<FormGroup>
					<Label htmlFor="confirmPassword">Подтверждение пароля *</Label>
					<StyledInput
						id="confirmPassword"
						type="password"
						placeholder="Подтвердите пароль..."
						{...register('confirmPassword', {
							onChange: () => setServerError(null),
						})}
					/>
				</FormGroup>

				<FormActions>
					<StyledButton type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
					</StyledButton>
					<StyledButton as={Link} to="/login" variant="secondary">
						Уже есть аккаунт? Войти
					</StyledButton>
				</FormActions>

				{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
			</RegisterForm>
		</div>
	);
};

RegisterContainer.propTypes = {
	className: PropTypes.string,
};

const RegisterForm = styled.form`
	display: flex;
	flex-direction: column;
	width: 400px;
	gap: 20px;
	background: white;
	padding: 40px;
	border-radius: 20px;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
	font-size: 28px;
	font-weight: 700;
	color: #2c3e50;
	margin: 0 0 20px 0;
	text-align: center;
`;

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const Label = styled.label`
	font-weight: 500;
	color: #2c3e50;
	font-size: 14px;
`;

const StyledInput = styled(Input)`
	padding: 12px 16px;
	border: 2px solid #e0e0e0;
	border-radius: 12px;
	font-size: 16px;
	transition: all 0.3s ease;
	
	&:focus {
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}
`;

const FormActions = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin-top: 10px;
`;

const StyledButton = styled(Button)`
	width: 100%;
	text-align: center;
	border-radius: 12px;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	padding: 12px 24px;
	transition: all 0.3s ease;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}
`;

export const Register = styled(RegisterContainer)`
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 80vh;
	padding: 20px;
`;
