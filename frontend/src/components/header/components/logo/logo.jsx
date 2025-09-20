import { Link } from 'react-router-dom';
import { Icon } from '../../../../components';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const LargeText = styled.div`
	font-size: 32px;
	font-weight: 700;
	margin-top: 0;
	line-height: 1.2;
	font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
`;

const SmallText = styled.div`
	font-size: 14px;
	font-weight: 400;
	margin-top: 4px;
	font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	color: rgba(255, 255, 255, 0.9);
`;

export const LogoContainer = ({ className }) => (
	<Link className={className} to="/">
		<Icon id="fa-bar-chart" size="70px" margin="0 10px 0 0" />
		<div>
			<LargeText>Калькулятор блюд</LargeText>
			<SmallText>Лёгкий способ рассчитать себестоимость рецепта</SmallText>
		</div>
	</Link>
);

LogoContainer.propTypes = {
	className: PropTypes.string,
};

export const Logo = styled(LogoContainer)`
	display: flex;
	align-items: center;
	margin-top: -4px;
	filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
	color: white;
	text-decoration: none;
	transition: transform 0.3s ease;
	
	&:hover {
		transform: scale(1.05);
	}
`;
