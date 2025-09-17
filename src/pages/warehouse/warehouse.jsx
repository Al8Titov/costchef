/**
 * @fileoverview Страница управления складом продуктов
 * 
 * Этот файл содержит компонент для управления складом продуктов:
 * - Отображение всех продуктов пользователя в таблице
 * - Добавление новых продуктов с категоризацией
 * - Удаление продуктов
 * - Фильтрация и сортировка продуктов
 * - Расчет цены за единицу измерения
 * 
 * @author CostChef Team
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Input, Modal } from '../../components';
import { formatPrice, formatWeight, calculatePricePerUnit } from '../../utils/calculations';
import { filterBySearch, sortByField, generateId, formatDate } from '../../utils/dataUtils';
import { getUserProducts, createProduct, deleteProduct } from '../../bff/products-api';
import styled from 'styled-components';

/**
 * Компонент страницы склада с таблицей продуктов
 * @param {string} className - CSS класс
 * @returns {JSX.Element} Страница склада
 */
const WarehouseContainer = ({ className }) => {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [sortOrder, setSortOrder] = useState('asc');
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [newProduct, setNewProduct] = useState({
		name: '',
		category_id: '',
		quantity: '',
		unit: 'kg',
		total_price: ''
	});
	const [errors, setErrors] = useState({});

	const currentUser = useSelector((state) => state.user);

	// Загружаем данные из db.json
	useEffect(() => {
		const loadProducts = async () => {
			if (!currentUser) return;
			
			try {
				const userProducts = await getUserProducts(currentUser.id);
				setProducts(userProducts);
				setFilteredProducts(userProducts);
			} catch (error) {
				console.error('Ошибка загрузки продуктов:', error);
			}
		};

		loadProducts();
	}, [currentUser]);

	// Фильтрация и сортировка
	useEffect(() => {
		let filtered = [...products];

		// Фильтр по поиску
		if (searchQuery) {
			filtered = filterBySearch(filtered, searchQuery, 'name');
		}

		// Сортировка
		filtered = sortByField(filtered, 'name', sortOrder);

		setFilteredProducts(filtered);
	}, [products, searchQuery, sortOrder]);

	const categories = [
		{ id: 1, name: 'Овощи' },
		{ id: 2, name: 'Мясо' },
		{ id: 3, name: 'Птица' },
		{ id: 4, name: 'Рыба-морепродукты' },
		{ id: 5, name: 'Бакалея' },
		{ id: 6, name: 'Молочка' },
		{ id: 7, name: 'Фрукты-ягоды' },
		{ id: 8, name: 'Напитки' },
		{ id: 9, name: 'Зелень' },
		{ id: 10, name: 'Специи' }
	];

	/**
	 * Обработчик изменения полей формы добавления продукта
	 * @param {Event} e - Событие изменения
	 */
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewProduct(prev => ({
			...prev,
			[name]: value
		}));
		
		// Очищаем ошибки при изменении
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: ''
			}));
		}
	};

	/**
	 * Валидирует форму добавления продукта
	 * @returns {boolean} Валидна ли форма
	 */
	const validateForm = () => {
		const newErrors = {};

		if (!newProduct.name.trim()) {
			newErrors.name = 'Название продукта обязательно';
		}

		if (!newProduct.category_id) {
			newErrors.category_id = 'Выберите категорию';
		}

		if (!newProduct.quantity || parseFloat(newProduct.quantity) <= 0) {
			newErrors.quantity = 'Введите корректное количество';
		}

		if (!newProduct.total_price || parseFloat(newProduct.total_price) <= 0) {
			newErrors.total_price = 'Введите корректную стоимость';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	/**
	 * Обработчик добавления нового продукта
	 * @param {Event} e - Событие отправки формы
	 */
	const handleAddProduct = async (e) => {
		e.preventDefault();
		
		if (!validateForm()) {
			return;
		}

		const category = categories.find(c => c.id === parseInt(newProduct.category_id));
		const pricePerUnit = calculatePricePerUnit(
			parseFloat(newProduct.total_price),
			parseFloat(newProduct.quantity),
			newProduct.unit
		);

		const product = {
			id: generateId(),
			name: newProduct.name,
			category_id: parseInt(newProduct.category_id),
			category_name: category.name,
			quantity: parseFloat(newProduct.quantity),
			unit: newProduct.unit,
			total_price: parseFloat(newProduct.total_price),
			price_per_unit: pricePerUnit,
			user_id: currentUser.id, // Привязываем к пользователю
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		};

		try {
			// Сохраняем в db.json через API
			const createdProduct = await createProduct(product);
			setProducts(prev => [createdProduct, ...prev]);
			setFilteredProducts(prev => [createdProduct, ...prev]);
			
			setNewProduct({
				name: '',
				category_id: '',
				quantity: '',
				unit: 'kg',
				total_price: ''
			});
			setIsAddModalOpen(false);
		} catch (error) {
			console.error('Ошибка при создании продукта:', error);
			alert('Ошибка при создании продукта');
		}
	};

	/**
	 * Обработчик удаления продукта
	 * @param {number} productId - ID продукта
	 */
	const handleDeleteProduct = async (productId) => {
		if (window.confirm('Вы уверены, что хотите удалить этот продукт?')) {
			try {
				const success = await deleteProduct(productId);
				if (success) {
					const updatedProducts = products.filter(product => product.id !== productId);
					setProducts(updatedProducts);
					setFilteredProducts(updatedProducts);
				}
			} catch (error) {
				console.error('Ошибка при удалении продукта:', error);
				alert('Ошибка при удалении продукта');
			}
		}
	};

	/**
	 * Обработчик открытия истории продукта
	 * @param {Object} product - Данные продукта
	 */
	const handleShowHistory = (product) => {
		setSelectedProduct(product);
		setIsHistoryModalOpen(true);
	};

	return (
		<div className={className}>
			<PageHeader>
				<PageTitle>Склад продуктов</PageTitle>
				<Button onClick={() => setIsAddModalOpen(true)} size="large">
					Добавить продукт
				</Button>
			</PageHeader>

			<FiltersSection>
				<SearchInput
					type="text"
					placeholder="Поиск по названию продукта..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<SortButton
					onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
				>
					Сортировка А-Я {sortOrder === 'asc' ? '↑' : '↓'}
				</SortButton>
			</FiltersSection>

			<TableContainer>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHeaderCell>Название продукта</TableHeaderCell>
							<TableHeaderCell>Категория</TableHeaderCell>
							<TableHeaderCell>Количество</TableHeaderCell>
							<TableHeaderCell>Цена за 1 кг/л/шт</TableHeaderCell>
							<TableHeaderCell>Общая стоимость</TableHeaderCell>
							<TableHeaderCell>Действия</TableHeaderCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredProducts.map(product => (
							<TableRow key={product.id}>
								<TableCell>{product.name}</TableCell>
								<TableCell>{product.category_name}</TableCell>
								<TableCell>
									{formatWeight(product.quantity, product.unit)}
								</TableCell>
								<TableCell>
									{formatPrice(product.price_per_unit)} ₽
								</TableCell>
								<TableCell>
									{formatPrice(product.total_price)} ₽
								</TableCell>
								<TableCell>
									<ActionButtons>
										<Button 
											size="small" 
											variant="secondary"
											onClick={() => handleShowHistory(product)}
										>
											История
										</Button>
										<Button 
											size="small" 
											variant="secondary"
											onClick={() => handleDeleteProduct(product.id)}
										>
											Удалить
										</Button>
									</ActionButtons>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{filteredProducts.length === 0 && (
				<EmptyState>
					<EmptyIcon>📦</EmptyIcon>
					<EmptyTitle>Продукты не найдены</EmptyTitle>
					<EmptyDescription>
						{searchQuery 
							? 'Попробуйте изменить поисковый запрос'
							: 'Добавьте свой первый продукт на склад'
						}
					</EmptyDescription>
				</EmptyState>
			)}

			{/* Модальное окно добавления продукта */}
			<Modal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				title="Добавить продукт"
			>
				<AddProductForm onSubmit={handleAddProduct}>
					<FormGroup>
						<Label htmlFor="name">Название продукта *</Label>
						<Input
							id="name"
							name="name"
							value={newProduct.name}
							onChange={handleInputChange}
							placeholder="Введите название продукта"
						/>
						{errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
					</FormGroup>

					<FormGroup>
						<Label htmlFor="category_id">Категория *</Label>
						<Select
							id="category_id"
							name="category_id"
							value={newProduct.category_id}
							onChange={handleInputChange}
						>
							<option value="">Выберите категорию</option>
							{categories.map(category => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</Select>
						{errors.category_id && <ErrorMessage>{errors.category_id}</ErrorMessage>}
					</FormGroup>

					<FormRow>
						<FormGroup>
							<Label htmlFor="quantity">Количество *</Label>
							<Input
								id="quantity"
								name="quantity"
								type="number"
								step="0.001"
								value={newProduct.quantity}
								onChange={handleInputChange}
								placeholder="0.000"
							/>
							{errors.quantity && <ErrorMessage>{errors.quantity}</ErrorMessage>}
						</FormGroup>

						<FormGroup>
							<Label htmlFor="unit">Единица измерения</Label>
							<Select
								id="unit"
								name="unit"
								value={newProduct.unit}
								onChange={handleInputChange}
							>
								<option value="kg">кг</option>
								<option value="l">л</option>
								<option value="шт">шт</option>
							</Select>
						</FormGroup>
					</FormRow>

					<FormGroup>
						<Label htmlFor="total_price">Общая стоимость *</Label>
						<Input
							id="total_price"
							name="total_price"
							type="number"
							step="0.01"
							value={newProduct.total_price}
							onChange={handleInputChange}
							placeholder="0.00"
						/>
						{errors.total_price && <ErrorMessage>{errors.total_price}</ErrorMessage>}
					</FormGroup>

					<FormActions>
						<Button 
							type="button" 
							variant="secondary"
							onClick={() => setIsAddModalOpen(false)}
						>
							Отмена
						</Button>
						<Button type="submit">
							Добавить продукт
						</Button>
					</FormActions>
				</AddProductForm>
			</Modal>

			{/* Модальное окно истории продукта */}
			<Modal
				isOpen={isHistoryModalOpen}
				onClose={() => setIsHistoryModalOpen(false)}
				title={`История: ${selectedProduct?.name}`}
			>
				<HistoryContent>
					<HistoryPlaceholder>
						📊 История покупок будет доступна в следующих версиях
					</HistoryPlaceholder>
					<HistoryInfo>
						<InfoItem>
							<InfoLabel>Текущее количество:</InfoLabel>
							<InfoValue>
								{selectedProduct && formatWeight(selectedProduct.quantity, selectedProduct.unit)}
							</InfoValue>
						</InfoItem>
						<InfoItem>
							<InfoLabel>Цена за единицу:</InfoLabel>
							<InfoValue>
								{selectedProduct && formatPrice(selectedProduct.price_per_unit)} ₽
							</InfoValue>
						</InfoItem>
						<InfoItem>
							<InfoLabel>Последнее обновление:</InfoLabel>
							<InfoValue>
								{selectedProduct && formatDate(selectedProduct.updated_at)}
							</InfoValue>
						</InfoItem>
					</HistoryInfo>
				</HistoryContent>
			</Modal>
		</div>
	);
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
`;

const SearchInput = styled.input`
	padding: 10px 15px;
	border: 2px solid #e0e0e0;
	border-radius: 8px;
	font-size: 16px;
	flex: 1;
	min-width: 300px;
	
	&:focus {
		outline: none;
		border-color: #5685bc;
	}
`;

const SortButton = styled(Button)`
	min-width: 150px;
`;

const TableContainer = styled.div`
	background: white;
	border-radius: 15px;
	overflow: hidden;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	margin-bottom: 40px;
`;

const Table = styled.table`
	width: 100%;
	border-collapse: collapse;
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
`;

const TableHeaderCell = styled.th`
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

const ActionButtons = styled.div`
	display: flex;
	gap: 10px;
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

const AddProductForm = styled.form`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
`;

const FormRow = styled.div`
	display: flex;
	gap: 20px;
`;

const Label = styled.label`
	font-weight: 500;
	color: #2c3e50;
	margin-bottom: 8px;
`;

const Select = styled.select`
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

const FormActions = styled.div`
	display: flex;
	gap: 20px;
	justify-content: flex-end;
	margin-top: 20px;
`;

const ErrorMessage = styled.div`
	color: #e74c3c;
	font-size: 14px;
	margin-top: 5px;
`;

const HistoryContent = styled.div`
	padding: 20px;
`;

const HistoryPlaceholder = styled.div`
	text-align: center;
	font-size: 18px;
	color: #7f8c8d;
	margin-bottom: 30px;
	padding: 40px;
	background: #f8f9fa;
	border-radius: 8px;
`;

const HistoryInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 15px;
`;

const InfoItem = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 0;
	border-bottom: 1px solid #e0e0e0;
`;

const InfoLabel = styled.span`
	font-weight: 500;
	color: #2c3e50;
`;

const InfoValue = styled.span`
	color: #7f8c8d;
`;

export const Warehouse = styled(WarehouseContainer)`
	padding: 20px;
	max-width: 1200px;
	margin: 0 auto;
`;
