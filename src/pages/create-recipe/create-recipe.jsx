/**
 * @fileoverview Страница создания рецептов блюд
 * 
 * Этот файл содержит компонент для создания новых рецептов блюд:
 * - Выбор ингредиентов из склада пользователя
 * - Расчет себестоимости и веса блюда
 * - Модальное окно для добавления ингредиентов
 * - Валидация формы создания рецепта
 * 
 * @author CostChef Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Modal } from '../../components';
import { calculateDishCost, calculateDishWeight, formatPrice } from '../../utils/calculations';
import { generateId } from '../../utils/dataUtils';
import { createDish } from '../../bff/dishes-api';
import { getUserProducts } from '../../bff/products-api';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Компонент страницы создания рецепта
 * @param {string} className - CSS класс
 * @returns {JSX.Element} Страница создания рецепта
 */
const CreateRecipeContainer = ({ className }) => {
	const [dishName, setDishName] = useState('');
	const [ingredients, setIngredients] = useState([]);
	const [availableProducts, setAvailableProducts] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [ingredientQuantity, setIngredientQuantity] = useState('');
	const [ingredientUnit, setIngredientUnit] = useState('г');
	const [productSearch, setProductSearch] = useState('');
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const navigate = useNavigate();
	const currentUser = useSelector((state) => state.user);

	// Загружаем продукты со склада пользователя из db.json
	useEffect(() => {
		const loadProducts = async () => {
			if (!currentUser) return;
			
			try {
				const products = await getUserProducts(currentUser.id);
				setAvailableProducts(products);
				setFilteredProducts(products);
			} catch (error) {
				console.error('Ошибка загрузки продуктов:', error);
			}
		};

		loadProducts();
	}, [currentUser]);

	// Фильтрация продуктов по поиску
	useEffect(() => {
		if (productSearch.trim()) {
			const filtered = availableProducts.filter(product =>
				product.name.toLowerCase().includes(productSearch.toLowerCase())
			);
			setFilteredProducts(filtered);
		} else {
			setFilteredProducts(availableProducts);
		}
	}, [productSearch, availableProducts]);

	/**
	 * Обработчик открытия модального окна добавления ингредиента
	 */
	const handleOpenModal = () => {
		if (availableProducts.length === 0) {
			alert('У вас нет продуктов на складе. Сначала добавьте продукты на склад.');
			return;
		}
		setIsModalOpen(true);
		setSelectedProduct(null);
		setIngredientQuantity('');
		setIngredientUnit('г');
		setProductSearch('');
	};

	/**
	 * Обработчик закрытия модального окна
	 */
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedProduct(null);
		setIngredientQuantity('');
		setIngredientUnit('г');
		setProductSearch('');
	};

	/**
	 * Обработчик добавления ингредиента
	 */
	const handleAddIngredient = () => {
		if (!selectedProduct || !ingredientQuantity) {
			alert('Выберите продукт и укажите количество');
			return;
		}

		const quantity = parseFloat(ingredientQuantity);
		if (isNaN(quantity) || quantity <= 0) {
			alert('Введите корректное количество');
			return;
		}

		// Конвертируем единицы измерения в граммы для расчета
		let quantityInGrams = quantity;
		if (ingredientUnit === 'кг') {
			quantityInGrams = quantity * 1000;
		} else if (ingredientUnit === 'л') {
			quantityInGrams = quantity * 1000; // Предполагаем, что 1л = 1кг
		}

		const ingredient = {
			id: generateId(),
			product_id: selectedProduct.id,
			name: selectedProduct.name,
			quantity: quantityInGrams, // Храним в граммах
			display_quantity: quantity, // Для отображения
			display_unit: ingredientUnit, // Для отображения
			price_per_unit: selectedProduct.price_per_unit,
			cost: (quantityInGrams / 1000) * selectedProduct.price_per_unit // Стоимость в рублях
		};

		// Используем requestAnimationFrame для плавного обновления
		requestAnimationFrame(() => {
			setIngredients(prev => [...prev, ingredient]);
		});
		
		// Закрываем модалку с небольшой задержкой для плавности
		setTimeout(() => {
			handleCloseModal();
		}, 100);
	};

	/**
	 * Обработчик удаления ингредиента
	 * @param {string} ingredientId - ID ингредиента
	 */
	const handleRemoveIngredient = (ingredientId) => {
		setIngredients(prev => prev.filter(ing => ing.id !== ingredientId));
	};

	/**
	 * Валидация формы
	 */
	const validateForm = () => {
		const newErrors = {};

		if (!dishName.trim()) {
			newErrors.dishName = 'Название блюда обязательно';
		}

		if (ingredients.length === 0) {
			newErrors.ingredients = 'Добавьте хотя бы один ингредиент';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	/**
	 * Обработчик создания рецепта
	 */
	const handleCreateRecipe = async () => {
		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			// Рассчитываем себестоимость и вес
			const totalCost = ingredients.reduce((total, ingredient) => {
				return total + (ingredient.cost || 0);
			}, 0);
			
			const totalWeight = ingredients.reduce((total, ingredient) => {
				return total + (ingredient.quantity || 0); // quantity уже в граммах
			}, 0);

			const dish = {
				id: generateId(),
				name: dishName,
				description: '',
				process: '',
				image_url: 'https://via.placeholder.com/280x150',
				weight: totalWeight,
				cost_price: totalCost,
				category_id: 1,
				ingredients: ingredients,
				user_id: currentUser.id,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};

			// Сохраняем в db.json через API
			await createDish(dish);
			
			console.log('Создано блюдо:', dish);
			
			// Добавляем небольшую задержку для плавного перехода
			setTimeout(() => {
				navigate('/dishes');
			}, 200);
		} catch (error) {
			console.error('Ошибка при создании рецепта:', error);
			alert('Произошла ошибка при создании рецепта');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Рассчитываем общую стоимость и вес на основе ингредиентов
	const totalCost = ingredients.reduce((total, ingredient) => {
		return total + (ingredient.cost || 0);
	}, 0);
	
	const totalWeight = ingredients.reduce((total, ingredient) => {
		return total + (ingredient.quantity || 0); // quantity уже в граммах
	}, 0);

	return (
		<div className={className}>
			<PageHeader>
				<PageTitle>Создать рецепт</PageTitle>
			</PageHeader>

			<MainContainer>
				<FormSection>
					<FormGroup>
						<Label htmlFor="dishName">Название блюда *</Label>
						<StyledInput
							id="dishName"
							value={dishName}
							onChange={(e) => setDishName(e.target.value)}
							placeholder="Введите название блюда"
						/>
						{errors.dishName && <ErrorMessage>{errors.dishName}</ErrorMessage>}
					</FormGroup>

					<IngredientsSection>
						<IngredientsHeader>
							<SectionTitle>Ингредиенты *</SectionTitle>
							<AddButton onClick={handleOpenModal}>
								+ Добавить ингредиент
							</AddButton>
						</IngredientsHeader>

						{errors.ingredients && <ErrorMessage>{errors.ingredients}</ErrorMessage>}

						{ingredients.length > 0 ? (
							<IngredientsTable>
								<TableHeader>
									<TableRow>
										<HeaderCell>Продукт</HeaderCell>
										<HeaderCell>Количество</HeaderCell>
										<HeaderCell>Цена за единицу</HeaderCell>
										<HeaderCell>Стоимость</HeaderCell>
										<HeaderCell>Действия</HeaderCell>
									</TableRow>
								</TableHeader>
								<TableBody>
									{ingredients.map(ingredient => (
										<TableRow key={ingredient.id}>
											<TableCell>{ingredient.name}</TableCell>
											<TableCell>
												{ingredient.display_quantity} {ingredient.display_unit}
											</TableCell>
											<TableCell>
												{parseFloat(ingredient.price_per_unit.toFixed(2))} ₽/кг
											</TableCell>
											<TableCell>
												{parseFloat(ingredient.cost.toFixed(2))} ₽
											</TableCell>
											<TableCell>
												<RemoveButton 
													onClick={() => handleRemoveIngredient(ingredient.id)}
												>
													Удалить
												</RemoveButton>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</IngredientsTable>
						) : (
							<EmptyState>
								<EmptyIcon>🥘</EmptyIcon>
								<EmptyText>Добавьте ингредиенты для создания рецепта</EmptyText>
							</EmptyState>
						)}
					</IngredientsSection>

					<SummarySection>
						<SummaryItem>
							<SummaryLabel>Общий вес:</SummaryLabel>
							<SummaryValue>{parseFloat((totalWeight / 1000).toFixed(3))} кг</SummaryValue>
						</SummaryItem>
						<SummaryItem>
							<SummaryLabel>Себестоимость:</SummaryLabel>
							<SummaryValue>{parseFloat(totalCost.toFixed(2))} ₽</SummaryValue>
						</SummaryItem>
					</SummarySection>

					<FormActions>
						<Button 
							variant="secondary"
							onClick={() => navigate('/dishes')}
						>
							Отмена
						</Button>
						<Button 
							onClick={handleCreateRecipe}
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Создание...' : 'Создать рецепт'}
						</Button>
					</FormActions>
				</FormSection>
			</MainContainer>

			{/* Модальное окно добавления ингредиента */}
			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title="Добавить ингредиент"
			>
				<ModalContent>
					<ModalGroup>
						<ModalLabel>Найдите продукт на складе:</ModalLabel>
						<SearchContainer>
							<SearchInput
								type="text"
								value={productSearch}
								onChange={(e) => setProductSearch(e.target.value)}
								placeholder="Введите название продукта..."
							/>
							{productSearch && !selectedProduct && (
								<SearchResults>
									{filteredProducts.length > 0 ? (
										filteredProducts.map(product => (
											<SearchResultItem
												key={product.id}
												onClick={() => {
													setSelectedProduct(product);
													setProductSearch(product.name);
												}}
											>
												{product.name}
											</SearchResultItem>
										))
									) : (
										<NoResultsItem>
											Продукт не найден на складе
										</NoResultsItem>
									)}
								</SearchResults>
							)}
						</SearchContainer>
						{selectedProduct && (
							<SelectedProduct>
								<SelectedProductInfo>
									<SelectedProductName>Выбран: {selectedProduct.name}</SelectedProductName>
								<SelectedProductPrice>
									Цена: {parseFloat(selectedProduct.price_per_unit.toFixed(2))} ₽/кг
								</SelectedProductPrice>
								</SelectedProductInfo>
								<ClearButton onClick={() => {
									setSelectedProduct(null);
									setProductSearch('');
								}}>
									✕
								</ClearButton>
							</SelectedProduct>
						)}
					</ModalGroup>

					<ModalGroup>
						<ModalLabel>Количество:</ModalLabel>
						<ModalInput
							type="number"
							step="0.001"
							value={ingredientQuantity}
							onChange={(e) => setIngredientQuantity(e.target.value)}
							placeholder="Введите количество"
						/>
					</ModalGroup>

					<ModalGroup>
						<ModalLabel>Единица измерения:</ModalLabel>
						<ModalSelect
							value={ingredientUnit}
							onChange={(e) => setIngredientUnit(e.target.value)}
						>
							<option value="г">г</option>
							<option value="кг">кг</option>
							<option value="л">л</option>
							<option value="шт">шт</option>
						</ModalSelect>
					</ModalGroup>

					{selectedProduct && ingredientQuantity && (
						<CostPreview>
							<CostLabel>Стоимость:</CostLabel>
							<CostValue>
								{parseFloat(
									((parseFloat(ingredientQuantity) * (ingredientUnit === 'кг' ? 1 : 0.001)) * 
									selectedProduct.price_per_unit).toFixed(2)
								)} ₽
							</CostValue>
						</CostPreview>
					)}

					<ModalActions>
						<Button variant="secondary" onClick={handleCloseModal}>
							Отмена
						</Button>
						<Button onClick={handleAddIngredient}>
							Добавить ингредиент
						</Button>
					</ModalActions>
				</ModalContent>
			</Modal>
		</div>
	);
};

CreateRecipeContainer.propTypes = {
	className: PropTypes.string,
};

// Стили
const PageHeader = styled.div`
	margin-bottom: 20px;
`;

const PageTitle = styled.h1`
	font-size: 28px;
	font-weight: 600;
	color: #2c3e50;
	margin: 0;
`;

const MainContainer = styled.div`
	max-width: 1000px;
	margin: 0 auto;
`;

const FormSection = styled.div`
	background: white;
	padding: 30px;
	border-radius: 15px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
	margin-bottom: 25px;
`;

const Label = styled.label`
	display: block;
	font-weight: 500;
	color: #2c3e50;
	margin-bottom: 8px;
	font-size: 16px;
`;

const StyledInput = styled(Input)`
	width: 100%;
	padding: 12px 16px;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	font-size: 16px;
	
	&:focus {
		border-color: #5685bc;
		outline: none;
	}
`;

const IngredientsSection = styled.div`
	margin-bottom: 25px;
	
	/* Плавный переход при изменении содержимого */
	transition: all 0.2s ease-in-out;
`;

const IngredientsHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 15px;
`;

const SectionTitle = styled.h2`
	font-size: 20px;
	font-weight: 600;
	color: #2c3e50;
	margin: 0;
`;

const AddButton = styled(Button)`
	background: #27ae60;
	color: white;
	border: none;
	
	&:hover {
		background: #229954;
	}
`;

const IngredientsTable = styled.table`
	width: 100%;
	border-collapse: collapse;
	margin-top: 15px;
`;

const TableHeader = styled.thead`
	background: #f8f9fa;
`;

const TableRow = styled.tr`
	&:nth-child(even) {
		background: #f8f9fa;
	}
	
	&:hover {
		background: #e9ecef;
	}
	
	/* Плавная анимация появления */
	animation: slideIn 0.3s ease-out;
	
	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
`;

const HeaderCell = styled.th`
	padding: 15px;
	text-align: left;
	font-weight: 600;
	color: #2c3e50;
	border-bottom: 2px solid #e0e0e0;
`;

const TableBody = styled.tbody``;

const TableCell = styled.td`
	padding: 15px;
	border-bottom: 1px solid #e0e0e0;
	color: #2c3e50;
`;

const RemoveButton = styled(Button)`
	background: #e74c3c;
	color: white;
	border: none;
	padding: 8px 16px;
	font-size: 14px;
	
	&:hover {
		background: #c0392b;
	}
`;

const EmptyState = styled.div`
	text-align: center;
	padding: 40px 20px;
	color: #7f8c8d;
`;

const EmptyIcon = styled.div`
	font-size: 48px;
	margin-bottom: 15px;
`;

const EmptyText = styled.p`
	font-size: 16px;
	margin: 0;
`;

const SummarySection = styled.div`
	background: #f8f9fa;
	padding: 20px;
	border-radius: 8px;
	margin-bottom: 25px;
`;

const SummaryItem = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
	
	&:last-child {
		margin-bottom: 0;
		font-weight: 600;
		font-size: 18px;
		border-top: 2px solid #e0e0e0;
		padding-top: 10px;
	}
`;

const SummaryLabel = styled.span`
	color: #2c3e50;
`;

const SummaryValue = styled.span`
	color: #27ae60;
	font-weight: 600;
`;

const FormActions = styled.div`
	display: flex;
	gap: 15px;
	justify-content: flex-end;
`;

const ModalContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	
	/* Плавная анимация появления */
	animation: modalSlideIn 0.3s ease-out;
	
	@keyframes modalSlideIn {
		from {
			opacity: 0;
			transform: translateY(-20px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
`;

const ModalGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const ModalLabel = styled.label`
	font-weight: 500;
	color: #2c3e50;
	font-size: 14px;
`;

const ModalSelect = styled.select`
	padding: 10px 15px;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	font-size: 16px;
	background: white;
	
	&:focus {
		outline: none;
		border-color: #5685bc;
	}
`;

const ModalInput = styled.input`
	padding: 10px 15px;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	font-size: 16px;
	transition: all 0.2s ease-in-out;
	
	&:focus {
		outline: none;
		border-color: #5685bc;
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(86, 133, 188, 0.2);
	}
`;

const CostPreview = styled.div`
	background: #e8f5e8;
	padding: 15px;
	border-radius: 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const CostLabel = styled.span`
	font-weight: 500;
	color: #2c3e50;
`;

const CostValue = styled.span`
	font-weight: 600;
	color: #27ae60;
	font-size: 18px;
`;

const ModalActions = styled.div`
	display: flex;
	gap: 15px;
	justify-content: flex-end;
	margin-top: 10px;
`;

const ErrorMessage = styled.div`
	color: #e74c3c;
	font-size: 14px;
	margin-top: 5px;
`;

const SearchContainer = styled.div`
	position: relative;
	width: 100%;
`;

const SearchInput = styled.input`
	width: 100%;
	padding: 12px 16px;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	font-size: 16px;
	
	&:focus {
		outline: none;
		border-color: #5685bc;
	}
`;

const SearchResults = styled.div`
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: white;
	border: 1px solid #e0e0e0;
	border-top: none;
	border-radius: 0 0 8px 8px;
	max-height: 200px;
	overflow-y: auto;
	z-index: 1000;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SearchResultItem = styled.div`
	padding: 12px 16px;
	cursor: pointer;
	border-bottom: 1px solid #f0f0f0;
	
	&:hover {
		background: #f8f9fa;
	}
	
	&:last-child {
		border-bottom: none;
	}
`;

const SelectedProduct = styled.div`
	background: #e8f5e8;
	padding: 12px 16px;
	border-radius: 8px;
	margin-top: 10px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const SelectedProductInfo = styled.div`
	flex: 1;
`;

const SelectedProductName = styled.div`
	font-weight: 500;
	color: #2c3e50;
	margin-bottom: 4px;
`;

const SelectedProductPrice = styled.div`
	font-size: 14px;
	color: #27ae60;
`;

const ClearButton = styled.button`
	background: #e74c3c;
	color: white;
	border: none;
	border-radius: 50%;
	width: 24px;
	height: 24px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	transition: all 0.2s ease-in-out;
	
	&:hover {
		background: #c0392b;
		transform: scale(1.1);
	}
`;

const NoResultsItem = styled.div`
	padding: 12px 16px;
	color: #7f8c8d;
	font-style: italic;
	text-align: center;
`;

export const CreateRecipe = styled(CreateRecipeContainer)`
	padding: 20px;
	max-width: 1200px;
	margin: 0 auto;
	min-height: calc(100vh - 200px);
`;