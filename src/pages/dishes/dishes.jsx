/**
 * @fileoverview Страница просмотра блюд пользователя
 * 
 * Этот файл содержит компонент для отображения всех блюд пользователя:
 * - Карточки блюд с информацией о весе и себестоимости
 * - Фильтрация и сортировка блюд
 * - Модальное окно с подробной информацией
 * - Удаление блюд
 * 
 * @author CostChef Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal } from '../../components';
import { formatPrice, formatWeight } from '../../utils/calculations';
import { getUserDishes, deleteDish } from '../../bff/dishes-api';
import PropTypes from 'prop-types';

/**
 * Форматирует вес блюда в граммах в читаемый вид
 * @param {number} weightInGrams - Вес в граммах
 * @returns {string} Отформатированный вес
 */
const formatDishWeight = (weightInGrams) => {
	const weight = parseFloat(weightInGrams || 0);
	
	if (weight < 1000) {
		return `${Math.round(weight)} г`;
	} else {
		return `${parseFloat((weight / 1000).toFixed(3))} кг`;
	}
};
import { filterBySearch, sortByField, getFromStorage } from '../../utils/dataUtils';
import styled from 'styled-components';

/**
 * Компонент страницы блюд с карточками и фильтрами
 * @param {string} className - CSS класс
 * @returns {JSX.Element} Страница блюд
 */
const DishesContainer = ({ className }) => {
	const [dishes, setDishes] = useState([]);
	const [filteredDishes, setFilteredDishes] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [sortOrder, setSortOrder] = useState('asc');
	const [selectedDish, setSelectedDish] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const currentUser = useSelector((state) => state.user);

	// Загружаем данные из db.json
	useEffect(() => {
		const loadDishes = async () => {
			if (!currentUser) return;
			
			try {
				const userDishes = await getUserDishes(currentUser.id);
				setDishes(userDishes);
				setFilteredDishes(userDishes);
			} catch (error) {
				console.error('Ошибка загрузки блюд:', error);
			}
		};

		loadDishes();
	}, [currentUser]);

	// Фильтрация и сортировка
	useEffect(() => {
		let filtered = [...dishes];

		// Фильтр по поиску
		if (searchQuery) {
			filtered = filterBySearch(filtered, searchQuery, 'name');
		}

		// Фильтр по категории
		if (selectedCategory) {
			filtered = filtered.filter(dish => 
				dish.category_id === parseInt(selectedCategory)
			);
		}

		// Сортировка
		filtered = sortByField(filtered, 'name', sortOrder);

		setFilteredDishes(filtered);
	}, [dishes, searchQuery, selectedCategory, sortOrder]);

	/**
	 * Обработчик открытия модального окна с деталями блюда
	 * @param {Object} dish - Данные блюда
	 */
	const handleDishClick = (dish) => {
		setSelectedDish(dish);
		setIsModalOpen(true);
	};

	/**
	 * Обработчик удаления блюда
	 * @param {number} dishId - ID блюда
	 */
	const handleDeleteDish = async (dishId) => {
		if (window.confirm('Вы уверены, что хотите удалить это блюдо?')) {
			try {
				const success = await deleteDish(dishId);
				if (success) {
					const updatedDishes = dishes.filter(dish => dish.id !== dishId);
					setDishes(updatedDishes);
					setFilteredDishes(updatedDishes);
				}
			} catch (error) {
				console.error('Ошибка при удалении блюда:', error);
				alert('Ошибка при удалении блюда');
			}
		}
	};

	const categories = [
		{ id: 1, name: 'Супы' },
		{ id: 2, name: 'Салаты' },
		{ id: 3, name: 'Горячее' },
		{ id: 4, name: 'Гарнир' },
		{ id: 5, name: 'Холодные закуски' },
		{ id: 6, name: 'Горячие закуски' },
		{ id: 7, name: 'Десерты' }
	];

	return (
		<div className={className}>
			<PageHeader>
				<PageTitle>Мои блюда</PageTitle>
				<Button as="a" href="/create-recipe" size="large">
					Создать рецепт
				</Button>
			</PageHeader>

			<FiltersSection>
				<SearchInput
					type="text"
					placeholder="Поиск по названию..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<CategorySelect
					value={selectedCategory}
					onChange={(e) => setSelectedCategory(e.target.value)}
				>
					<option value="">Все категории</option>
					{categories.map(category => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</CategorySelect>
				<SortButton
					onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
				>
					Сортировка А-Я {sortOrder === 'asc' ? '↑' : '↓'}
				</SortButton>
			</FiltersSection>

			<DishesGrid>
				{filteredDishes.map(dish => (
					<DishCard key={dish.id}>
						<DishContent>
							<DishName>{dish.name}</DishName>
							<PhotoPlaceholder>
								📷 Фотографии блюд будут доступны в будущих версиях
							</PhotoPlaceholder>
							<DishInfo>
								<DishWeight>
									Вес: {formatDishWeight(dish.weight)}
								</DishWeight>
								<DishCost>
									Себестоимость: {parseFloat(dish.cost_price.toFixed(2))} ₽
								</DishCost>
							</DishInfo>
							<DishActions>
								<ActionButton 
									title="Подробнее"
									onClick={() => handleDishClick(dish)}
								>
									📋
								</ActionButton>
								<ActionButton 
									title="Редактировать"
									variant="edit"
									onClick={() => handleDishClick(dish)}
								>
									✏️
								</ActionButton>
								<ActionButton 
									title="Удалить"
									variant="delete"
									onClick={() => handleDeleteDish(dish.id)}
								>
									🗑️
								</ActionButton>
							</DishActions>
						</DishContent>
					</DishCard>
				))}
			</DishesGrid>

			{filteredDishes.length === 0 && (
				<EmptyState>
					<EmptyIcon>🍽️</EmptyIcon>
					<EmptyTitle>Блюда не найдены</EmptyTitle>
					<EmptyDescription>
						{searchQuery || selectedCategory 
							? 'Попробуйте изменить фильтры поиска'
							: 'Создайте своё первое блюдо'
						}
					</EmptyDescription>
				</EmptyState>
			)}

			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title={selectedDish?.name}
			>
				{selectedDish && (
					<DishDetails>
						<DishDetailImage src={selectedDish.image_url} alt={selectedDish.name} />
						<DishDetailInfo>
							<DetailItem>
								<DetailLabel>Описание:</DetailLabel>
								<DetailValue>{selectedDish.description}</DetailValue>
							</DetailItem>
							<DetailItem>
								<DetailLabel>Вес:</DetailLabel>
								<DetailValue>{formatDishWeight(selectedDish.weight)}</DetailValue>
							</DetailItem>
							<DetailItem>
								<DetailLabel>Себестоимость:</DetailLabel>
								<DetailValue>{parseFloat(selectedDish.cost_price.toFixed(2))} ₽</DetailValue>
							</DetailItem>
							<DetailItem>
								<DetailLabel>Технология приготовления:</DetailLabel>
								<DetailValue>{selectedDish.process}</DetailValue>
							</DetailItem>
							<DetailItem>
								<DetailLabel>Ингредиенты:</DetailLabel>
								<IngredientsList>
									{selectedDish.ingredients?.map((ingredient, index) => (
										<IngredientItem key={index}>
											{ingredient.name} - {ingredient.display_quantity} {ingredient.display_unit}
										</IngredientItem>
									))}
								</IngredientsList>
							</DetailItem>
						</DishDetailInfo>
					</DishDetails>
				)}
			</Modal>
		</div>
	);
};

DishesContainer.propTypes = {
	className: PropTypes.string,
};

const PageHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30px;
`;

const PageTitle = styled.h1`
	font-size: 32px;
	font-weight: 600;
	color: #2c3e50;
	margin: 0;
`;

const FiltersSection = styled.div`
	display: flex;
	gap: 20px;
	margin-bottom: 30px;
	align-items: center;
	flex-wrap: wrap;
`;

const SearchInput = styled.input`
	padding: 10px 15px;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	font-size: 16px;
	flex: 1;
	min-width: 200px;
	
	&:focus {
		outline: none;
		border-color: #5685bc;
	}
`;

const CategorySelect = styled.select`
	padding: 10px 15px;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	font-size: 16px;
	background: white;
	min-width: 150px;
	
	&:focus {
		outline: none;
		border-color: #5685bc;
	}
`;

const SortButton = styled(Button)`
	min-width: 150px;
`;

const DishesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, 360px);
	gap: 30px;
	margin-bottom: 40px;
	justify-content: center;
`;

const DishCard = styled.div`
	background: white;
	border-radius: 15px;
	overflow: visible; /* Изменено с hidden на visible для подсказок */
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	transition: transform 0.3s ease, box-shadow 0.3s ease;
	width: 360px;
	height: 240px;
	position: relative; /* Добавлено для правильного позиционирования подсказок */
	
	&:hover {
		transform: translateY(-5px);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
	}
`;

const DishImage = styled.img`
	width: 100%;
	height: 200px;
	object-fit: cover;
`;

const DishContent = styled.div`
	padding: 20px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const DishName = styled.h3`
	font-size: 20px;
	font-weight: 600;
	color: #2c3e50;
	margin: 0 0 10px 0;
`;

const PhotoPlaceholder = styled.div`
	font-size: 12px;
	color: #95a5a6;
	text-align: center;
	padding: 8px;
	background: #f8f9fa;
	border-radius: 6px;
	margin-bottom: 10px;
	font-style: italic;
`;

const DishInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
	margin-bottom: 15px;
`;

const DishWeight = styled.p`
	font-size: 14px;
	color: #7f8c8d;
	margin: 0;
`;

const DishCost = styled.p`
	font-size: 16px;
	font-weight: 600;
	color: #27ae60;
	margin: 0;
`;

const DishActions = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 5px;
	margin-top: 15px;
`;

const ActionButton = styled.button`
	width: 30px;
	height: 30px;
	border: none;
	border-radius: 50%;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	transition: all 0.2s ease-in-out;
	position: relative;
	
	/* Базовые стили */
	background: #f8f9fa;
	color: #6c757d;
	
	/* Стили для разных вариантов */
	${props => props.variant === 'edit' && `
		background: #ffc107;
		color: #212529;
	`}
	
	${props => props.variant === 'delete' && `
		background: #dc3545;
		color: white;
	`}
	
	&:hover {
		transform: scale(1.1);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}
	
	/* Подсказка при наведении */
	&::after {
		content: attr(title);
		position: absolute;
		bottom: -35px;
		left: 50%;
		transform: translateX(-50%);
		background: #333;
		color: white;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 12px;
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		z-index: 9999; /* Увеличен z-index для отображения поверх всех элементов */
	}
	
	&:hover::after {
		opacity: 1;
	}
`;

const EmptyState = styled.div`
	text-align: center;
	padding: 60px 20px;
`;

const EmptyIcon = styled.div`
	font-size: 64px;
	margin-bottom: 20px;
`;

const EmptyTitle = styled.h3`
	font-size: 24px;
	color: #2c3e50;
	margin: 0 0 10px 0;
`;

const EmptyDescription = styled.p`
	font-size: 16px;
	color: #7f8c8d;
	margin: 0;
`;

const DishDetails = styled.div`
	display: flex;
	gap: 20px;
`;

const DishDetailImage = styled.img`
	width: 200px;
	height: 150px;
	object-fit: cover;
	border-radius: 8px;
`;

const DishDetailInfo = styled.div`
	flex: 1;
`;

const DetailItem = styled.div`
	margin-bottom: 15px;
`;

const DetailLabel = styled.strong`
	display: block;
	color: #2c3e50;
	margin-bottom: 5px;
`;

const DetailValue = styled.span`
	color: #7f8c8d;
`;

const IngredientsList = styled.ul`
	margin: 5px 0 0 0;
	padding-left: 20px;
`;

const IngredientItem = styled.li`
	margin-bottom: 5px;
	color: #7f8c8d;
`;

export const Dishes = styled(DishesContainer)`
	padding: 20px;
	max-width: 1200px;
	margin: 0 auto;
`;
