import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal } from '../../components';
import { formatDate, isAdmin } from '../../utils/dataUtils';
import { useUsers } from '../../hooks/useUsers';
import { deleteUserWithCascade } from '../../bff/delete-user-api';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const UsersContainer = ({ className }) => {
	const currentUser = useSelector((state) => state.user);
	const { users, loading, error, refreshUsers } = useUsers();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [editForm, setEditForm] = useState({
		role_id: ''
	});

	// Проверяем права доступа
	if (!isAdmin(currentUser)) {
		return (
			<div className={className}>
				<AccessDenied>
					<AccessDeniedIcon>🚫</AccessDeniedIcon>
					<AccessDeniedTitle>Доступ запрещён</AccessDeniedTitle>
					<AccessDeniedMessage>
						Эта страница доступна только администраторам
					</AccessDeniedMessage>
				</AccessDenied>
			</div>
		);
	}

	useEffect(() => {
		const interval = setInterval(() => {
			refreshUsers();
		}, 5000);

		return () => clearInterval(interval);
	}, [refreshUsers]);

	const roles = [
		{ id: 0, name: 'Администратор' },
		{ id: 1, name: 'Пользователь' },
		{ id: 2, name: 'Гость' }
	];

	const handleEditRole = (user) => {
		setSelectedUser(user);
		setEditForm({ role_id: user.role_id.toString() });
		setIsEditModalOpen(true);
	};

	const handleRoleChange = (e) => {
		setEditForm(prev => ({
			...prev,
			role_id: e.target.value
		}));
	};

	const handleSaveRole = () => {
		if (!selectedUser) return;

		const newRoleId = parseInt(editForm.role_id);
		const newRole = roles.find(r => r.id === newRoleId);

		setUsers(prev => prev.map(user => 
			user.id === selectedUser.id 
				? { 
					...user, 
					role_id: newRoleId, 
					role_name: newRole.name 
				}
				: user
		));

		setIsEditModalOpen(false);
		setSelectedUser(null);
	};

	const handleDeleteUser = async (userId) => {
		if (userId === currentUser.id) {
			alert('Вы не можете удалить свой аккаунт');
			return;
		}

		if (window.confirm('Вы уверены, что хотите удалить этого пользователя? Это действие удалит пользователя и все его блюда и продукты на складе.')) {
			try {
				await deleteUserWithCascade(userId);
				refreshUsers();
				alert('Пользователь и все связанные данные успешно удалены');
			} catch (error) {
				console.error('Ошибка при удалении пользователя:', error);
				alert('Ошибка при удалении пользователя');
			}
		}
	};

	const getUserStatus = (user) => {
		if (user.is_online) {
			return 'Онлайн';
		}
		return `Был в сети ${formatDate(user.last_activity)}`;
	};

	/**
	 * Получает цвет статуса пользователя
	 * @param {Object} user - Данные пользователя
	 * @returns {string} Цвет статуса
	 */
	const getStatusColor = (user) => {
		return user.is_online ? '#27ae60' : '#7f8c8d';
	};

	return (
		<div className={className}>
			<PageHeader>
				<PageTitle>Управление пользователями</PageTitle>
				<PageDescription>
					Управление ролями и правами доступа пользователей
				</PageDescription>
				<RefreshButton onClick={refreshUsers} disabled={loading}>
					{loading ? 'Обновление...' : 'Обновить список'}
				</RefreshButton>
			</PageHeader>

			{error && (
				<ErrorMessage>
					<ErrorIcon>⚠️</ErrorIcon>
					{error}
					<RetryButton onClick={refreshUsers}>Повторить</RetryButton>
				</ErrorMessage>
			)}

			{loading && users.length === 0 && (
				<LoadingMessage>
					<LoadingSpinner>⏳</LoadingSpinner>
					Загрузка пользователей...
				</LoadingMessage>
			)}

			<TableContainer>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHeaderCell>Пользователь</TableHeaderCell>
							<TableHeaderCell>Роль</TableHeaderCell>
							<TableHeaderCell>Дата регистрации</TableHeaderCell>
							<TableHeaderCell>Статус</TableHeaderCell>
							<TableHeaderCell>Действия</TableHeaderCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map(user => (
							<TableRow key={user.id}>
								<TableCell>
									<UserInfo>
										<UserName>{user.login}</UserName>
										{user.id === currentUser.id && (
											<CurrentUserBadge>Вы</CurrentUserBadge>
										)}
									</UserInfo>
								</TableCell>
								<TableCell>
									<RoleBadge roleId={user.role_id}>
										{user.role_name}
									</RoleBadge>
								</TableCell>
								<TableCell>{formatDate(user.registered_at)}</TableCell>
								<TableCell>
									<StatusText color={getStatusColor(user)}>
										{getUserStatus(user)}
									</StatusText>
								</TableCell>
								<TableCell>
									<ActionButtons>
										{user.id !== currentUser.id && (
											<Button 
												size="small" 
												variant="secondary"
												onClick={() => handleDeleteUser(user.id)}
											>
												Удалить
											</Button>
										)}
									</ActionButtons>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{users.length === 0 && (
				<EmptyState>
					<EmptyIcon>👥</EmptyIcon>
					<EmptyTitle>Пользователи не найдены</EmptyTitle>
					<EmptyDescription>
						В системе пока нет зарегистрированных пользователей
					</EmptyDescription>
				</EmptyState>
			)}

			{/* Модальное окно редактирования роли */}
			<Modal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				title={`Изменить роль: ${selectedUser?.login}`}
			>
				<EditRoleForm>
					<FormGroup>
						<Label htmlFor="role_id">Роль пользователя</Label>
						<RoleSelect
							id="role_id"
							value={editForm.role_id}
							onChange={handleRoleChange}
						>
							{roles.map(role => (
								<option key={role.id} value={role.id}>
									{role.name}
								</option>
							))}
						</RoleSelect>
					</FormGroup>

					<UserInfo>
						<InfoItem>
							<InfoLabel>Текущая роль:</InfoLabel>
							<InfoValue>{selectedUser?.role_name}</InfoValue>
						</InfoItem>
						<InfoItem>
						</InfoItem>
						<InfoItem>
							<InfoLabel>Дата регистрации:</InfoLabel>
							<InfoValue>{selectedUser && formatDate(selectedUser.registered_at)}</InfoValue>
						</InfoItem>
					</UserInfo>

					<FormActions>
						<Button 
							variant="secondary"
							onClick={() => setIsEditModalOpen(false)}
						>
							Отмена
						</Button>
						<Button onClick={handleSaveRole}>
							Сохранить изменения
						</Button>
					</FormActions>
				</EditRoleForm>
			</Modal>
		</div>
	);
};

UsersContainer.propTypes = {
	className: PropTypes.string,
};

const PageHeader = styled.div`
	margin-bottom: 30px;
`;

const PageTitle = styled.h1`
	font-size: 32px;
	font-weight: 600;
	color: #2c3e50;
	margin: 0 0 10px 0;
`;

const PageDescription = styled.p`
	font-size: 16px;
	color: #7f8c8d;
	margin: 0;
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

const UserInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
`;

const UserName = styled.span`
	font-weight: 500;
`;

const CurrentUserBadge = styled.span`
	background: #5685bc;
	color: white;
	padding: 2px 8px;
	border-radius: 12px;
	font-size: 12px;
	font-weight: 500;
`;

const RoleBadge = styled.span`
	padding: 4px 12px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: 500;
	background: ${({ roleId }) => {
		switch (roleId) {
			case 0: return '#e74c3c';
			case 1: return '#3498db';
			case 2: return '#95a5a6';
			default: return '#95a5a6';
		}
	}};
	color: white;
`;

const StatusText = styled.span`
	color: ${({ color }) => color};
	font-weight: 500;
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

const AccessDenied = styled.div`
	text-align: center;
	padding: 100px 20px;
`;

const AccessDeniedIcon = styled.div`
	font-size: 80px;
	margin-bottom: 30px;
`;

const AccessDeniedTitle = styled.h2`
	font-size: 32px;
	color: #e74c3c;
	margin: 0 0 20px 0;
`;

const AccessDeniedMessage = styled.p`
	font-size: 18px;
	color: #7f8c8d;
	margin: 0;
`;

const EditRoleForm = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

const FormGroup = styled.div`
	display: flex;
	flex-direction: column;
`;

const Label = styled.label`
	font-weight: 500;
	color: #2c3e50;
	margin-bottom: 8px;
`;

const RoleSelect = styled.select`
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

const FormActions = styled.div`
	display: flex;
	gap: 20px;
	justify-content: flex-end;
	margin-top: 20px;
`;

const RefreshButton = styled(Button)`
	margin-top: 10px;
	background: #27ae60;
	color: white;
	border: none;
	min-width: 140px; /* Фиксированная ширина чтобы не дёргалось */
	text-align: center;
	
	&:hover {
		background: #229954;
	}
	
	&:disabled {
		background: #95a5a6;
		cursor: not-allowed;
	}
`;

const ErrorMessage = styled.div`
	background: #f8d7da;
	color: #721c24;
	padding: 15px;
	border-radius: 8px;
	margin-bottom: 20px;
	display: flex;
	align-items: center;
	gap: 10px;
`;

const ErrorIcon = styled.span`
	font-size: 20px;
`;

const RetryButton = styled(Button)`
	margin-left: auto;
	background: #dc3545;
	color: white;
	border: none;
	
	&:hover {
		background: #c82333;
	}
`;

const LoadingMessage = styled.div`
	text-align: center;
	padding: 40px;
	color: #7f8c8d;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
`;

const LoadingSpinner = styled.span`
	font-size: 24px;
	animation: spin 1s linear infinite;
	
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
`;

export const Users = styled(UsersContainer)`
	padding: 20px;
	max-width: 1200px;
	margin: 0 auto;
`;

