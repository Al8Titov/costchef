import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ControlPanel, Logo } from './components';
import { ROLE } from '../../constans';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const HeaderContainer = ({ className }) => {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch({ type: 'LOGOUT' });
		navigate('/');
	};

	return (
		<header className={className}>
			<Logo />
			<ControlPanel 
				user={user} 
				onLogout={handleLogout}
			/>
		</header>
	);
};

HeaderContainer.propTypes = {
	className: PropTypes.string,
};

export const Header = styled(HeaderContainer)`
	position: fixed;
	top: 0;
	width: 1350px;
	height: 80px;
	background: linear-gradient(135deg, #667eea 0%, #5a6fd8 30%, #4c63d2 60%, #3e57cc 100%);
	backdrop-filter: blur(20px);
	box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	border-bottom-left-radius: 20px;
	border-bottom-right-radius: 20px;

	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 30px;
	z-index: 100;
`;
