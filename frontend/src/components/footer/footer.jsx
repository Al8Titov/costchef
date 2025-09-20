import styled from 'styled-components';
import PropTypes from 'prop-types';

const FooterContainer = ({ className }) => {
	return (
		<footer className={className}>
			<div className="left">
				<div>CostChef - Расчёт себестоимости блюд</div>
				<div>© 2025 Все права защищены</div>
			</div>

			<div className="right">
				<div>
					{new Date().toLocaleDateString('ru', {
						day: 'numeric',
						month: 'long',
						year: 'numeric',
					})}
				</div>
				<div>Версия 1.0.0</div>
			</div>
		</footer>
	);
};

FooterContainer.propTypes = {
	className: PropTypes.string,
};

export const Footer = styled(FooterContainer)`
	position: fixed;
	bottom: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 70px;
	box-shadow: 0 -8px 32px rgba(11, 51, 180, 0.3);
	background: linear-gradient(135deg, #3e57cc 0%, #2d4bc4 30%, #1c3fbc 60%, #0b33b4 100%);
	font-weight: bold;
	padding: 0 20px;
	width: 1350px;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	z-index: 100;

	.left {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
`;
