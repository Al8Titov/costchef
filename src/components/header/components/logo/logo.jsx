import { Link } from 'react-router-dom';
import { Icon } from '../../../../components'
import styled from 'styled-components';

const LargeText = styled.div`
	font-size: 48px;
	font-weight: 600;
	margin-top: 16px;
	line-height: 45px;
	text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3); /* лёгкая тень для объёма */
`;

const SmallText = styled.div`
	font-size: 17px;
	font-weight: 400;
	margin-top: 1px;
	text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.3); /* лёгкая тень для объёма */
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

export const Logo = styled(LogoContainer)`
	display: flex;
	margin-top: -4px;
	filter: drop-shadow(2px 2px 4px rgba(255, 255, 255, 0.3));
	color: #000;
	text-decoration: none;
`;
