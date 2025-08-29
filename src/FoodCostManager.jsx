import { Routes, Route } from 'react-router-dom';
import { Header } from './components'
import styled from 'styled-components';

const AppColumn = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 1350px;
	min-height: 100%;
	margin: 0 auto;
	background-color: #f4f3daff;
`;

const Content = styled.div`
	padding: 120px 0;
`;

const H2 = styled.h2`
	text-align: center;
`;


const Footer = () => <div>Футер</div>;



export const FoodCostManager = () => {
	return (
		<AppColumn>
			<Header />
			<Content>
				<H2>Контент страницы</H2>
				<Routes>
					<Route path="/" element={<div>Главная страница</div>} />
					<Route path="/login" element={<div>Авторизация</div>} />
					<Route path="/register" element={<div>Регистрация</div>} />
					<Route path="/users" element={<div>Пользователи</div>} />
					<Route path="/warehouse" element={<div>Склад</div>} />
					<Route path="/dish" element={<div>Новое блюдо</div>} />
					<Route path="/dish/:id" element={<div>Блюда</div>} />
					<Route path="*" element={<div>Ошибка</div>} />
				</Routes>
			</Content>
			<Footer />
		</AppColumn>
	);
};
