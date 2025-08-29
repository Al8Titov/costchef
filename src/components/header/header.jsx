import { ControlPanel, Logo } from './components';
import styled from 'styled-components';

const HeaderContainer = ({ className }) => (
	<header className={className}>
		<Logo />
		<ControlPanel />
	</header>
);

export const Header = styled(HeaderContainer)`
	position: fixed;
	top: 0;
	width: 1350px;
	height: 120px;
	box-shadow: 0 1px 11px #000;
	border-bottom-left-radius: 20px;
	border-bottom-right-radius: 20px;
	background-color: #23488dff;

	display: flex;
	justify-content: space-between; /* логотип слева, кнопки справа */
	align-items: center;
	padding: 0 20px;
`;
