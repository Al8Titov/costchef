/**
 * @fileoverview Главный компонент приложения CostChef
 * 
 * Этот файл содержит основной компонент приложения, который:
 * - Настраивает маршрутизацию между страницами
 * - Определяет общую структуру приложения (шапка, контент, футер)
 * - Управляет основными стилями приложения
 * 
 * @author CostChef Team
 * @version 1.0.0
 */

import { Routes, Route } from 'react-router-dom';
import { Header, Footer } from './components';
import { Authorization, Register, Home, Dishes, CreateRecipe, Warehouse, Users } from './pages';
import styled from 'styled-components';

const AppColumn = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 1350px;
	min-height: 100vh;
	margin: 0 auto;
	background-color: #f4f3daff;
`;

const Content = styled.div`
	padding: 100px 0 90px 0;
	flex: 1;
`;

/**
 * Основной компонент приложения CostChef
 * @returns {JSX.Element} Приложение
 */
export const FoodCostManager = () => {
	return (
		<AppColumn>
			<Header />
			<Content>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Authorization />} />
					<Route path="/register" element={<Register />} />
					<Route path="/dishes" element={<Dishes />} />
					<Route path="/create-recipe" element={<CreateRecipe />} />
					<Route path="/warehouse" element={<Warehouse />} />
					<Route path="/users" element={<Users />} />
					<Route path="*" element={<div>Страница не найдена</div>} />
				</Routes>
			</Content>
			<Footer />
		</AppColumn>
	);
};
