import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from '../../components';
import { ROLE } from '../../constans';
import { isGuest } from '../../utils/dataUtils';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const HomeContainer = ({ className }) => {
	const user = useSelector((state) => state.user);
	const isUserGuest = isGuest(user);

	return (
		<div className={className}>
			<HeroSection>
				<HeroContent>
					<HeroTitle>
						{isUserGuest 
							? 'Добро пожаловать в CostChef' 
							: `Добро пожаловать, ${user.nickname || user.login}!`
						}
					</HeroTitle>
					<HeroSubtitle>
						Удобный инструмент для расчёта себестоимости блюд
					</HeroSubtitle>
					<HeroDescription>
						Мы поможем шеф-поварам, барменам и поварам быстро 
						анализировать затраты на ингредиенты, контролировать 
						склад и оптимизировать меню. Приложение рассчитывает 
						точную стоимость и вес блюда на основе ваших продуктов.
					</HeroDescription>
					<FutureFeatures>
						<strong>В будущем:</strong> мобильная версия, интеграция 
						с калорийностью и экспорт в PDF.
					</FutureFeatures>
					{isUserGuest ? (
						<AuthButtons>
							<Button as={Link} to="/login" size="large">
								Войти
							</Button>
							<Button as={Link} to="/register" variant="secondary" size="large">
								Регистрироваться
							</Button>
						</AuthButtons>
					) : (
						<ActionButtons>
							<Button as={Link} to="/create-recipe" size="large">
								Создать рецепт
							</Button>
							<Button as={Link} to="/dishes" variant="secondary" size="large">
								Мои блюда
							</Button>
						</ActionButtons>
					)}
				</HeroContent>
				<HeroImage>
					<PlaceholderImage>
						🍽️
					</PlaceholderImage>
				</HeroImage>
			</HeroSection>

			<FeaturesSection>
				<SectionTitle>Преимущества CostChef</SectionTitle>
				<FeaturesGrid>
					<FeatureCard>
						<FeatureIcon>📊</FeatureIcon>
						<FeatureTitle>Точные расчёты</FeatureTitle>
						<FeatureDescription>
							Автоматический расчёт себестоимости и веса блюд 
							с точностью до копейки
						</FeatureDescription>
					</FeatureCard>
					<FeatureCard>
						<FeatureIcon>📱</FeatureIcon>
						<FeatureTitle>Простой интерфейс</FeatureTitle>
						<FeatureDescription>
							Интуитивно понятное управление без сложных настроек
						</FeatureDescription>
					</FeatureCard>
					<FeatureCard>
						<FeatureIcon>📦</FeatureIcon>
						<FeatureTitle>Управление складом</FeatureTitle>
						<FeatureDescription>
							Контролируйте остатки продуктов и их стоимость
						</FeatureDescription>
					</FeatureCard>
					<FeatureCard>
						<FeatureIcon>👥</FeatureIcon>
						<FeatureTitle>Многопользовательский</FeatureTitle>
						<FeatureDescription>
							Каждый пользователь имеет свой склад и рецепты
						</FeatureDescription>
					</FeatureCard>
					<FeatureCard>
						<FeatureIcon>📈</FeatureIcon>
						<FeatureTitle>Аналитика</FeatureTitle>
						<FeatureDescription>
							Отслеживайте изменения цен и оптимизируйте меню
						</FeatureDescription>
					</FeatureCard>
					<FeatureCard>
						<FeatureIcon>🔒</FeatureIcon>
						<FeatureTitle>Безопасность</FeatureTitle>
						<FeatureDescription>
							Ваши данные защищены и хранятся локально
						</FeatureDescription>
					</FeatureCard>
				</FeaturesGrid>
			</FeaturesSection>
		</div>
	);
};

HomeContainer.propTypes = {
	className: PropTypes.string,
};

const HeroSection = styled.section`
	display: flex;
	align-items: center;
	gap: 60px;
	margin-bottom: 80px;
	padding: 40px 0;
`;

const HeroContent = styled.div`
	flex: 1;
	max-width: 600px;
`;

const HeroTitle = styled.h1`
	font-size: 48px;
	font-weight: 700;
	color: #2c3e50;
	margin-bottom: 20px;
	line-height: 1.2;
`;

const HeroSubtitle = styled.h2`
	font-size: 24px;
	font-weight: 500;
	color: #34495e;
	margin-bottom: 20px;
`;

const HeroDescription = styled.p`
	font-size: 16px;
	line-height: 1.6;
	color: #7f8c8d;
	margin-bottom: 20px;
`;

const FutureFeatures = styled.p`
	font-size: 14px;
	color: #95a5a6;
	margin-bottom: 40px;
	font-style: italic;
`;

const AuthButtons = styled.div`
	display: flex;
	gap: 20px;
`;

const ActionButtons = styled.div`
	display: flex;
	gap: 20px;
`;

const HeroImage = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const PlaceholderImage = styled.div`
	width: 300px;
	height: 200px;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 80px;
	box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const FeaturesSection = styled.section`
	padding: 60px 0;
`;

const SectionTitle = styled.h2`
	font-size: 36px;
	font-weight: 600;
	text-align: center;
	color: #2c3e50;
	margin-bottom: 50px;
`;

const FeaturesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 30px;
`;

const FeatureCard = styled.div`
	background: white;
	padding: 30px;
	border-radius: 15px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	text-align: center;
	transition: transform 0.3s ease, box-shadow 0.3s ease;
	
	&:hover {
		transform: translateY(-5px);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
	}
`;

const FeatureIcon = styled.div`
	font-size: 48px;
	margin-bottom: 20px;
`;

const FeatureTitle = styled.h3`
	font-size: 20px;
	font-weight: 600;
	color: #2c3e50;
	margin-bottom: 15px;
`;

const FeatureDescription = styled.p`
	font-size: 14px;
	line-height: 1.6;
	color: #7f8c8d;
`;

export const Home = styled(HomeContainer)`
	padding: 20px;
	max-width: 1200px;
	margin: 0 auto;
`;

