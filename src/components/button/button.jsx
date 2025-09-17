import styled from 'styled-components';
import PropTypes from 'prop-types';

const ButtonContainer = ({ 
	children, 
	className, 
	width, 
	size = 'medium',
	variant = 'primary',
	...props 
}) => {
	return (
		<button className={className} {...props}>
			{children}
		</button>
	);
};

ButtonContainer.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	width: PropTypes.string,
	size: PropTypes.oneOf(['small', 'medium', 'large']),
	variant: PropTypes.oneOf(['primary', 'secondary']),
};

export const Button = styled(ButtonContainer)`
	background: ${({ variant }) => 
		variant === 'primary' 
			? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
			: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'};
	color: ${({ variant }) => 
		variant === 'primary' ? 'white' : '#667eea'};
	border: ${({ variant }) => 
		variant === 'primary' ? 'none' : '2px solid #667eea'};
	border-radius: 12px;
	padding: ${({ size }) => {
		switch (size) {
			case 'small': return '8px 20px';
			case 'large': return '16px 48px';
			default: return '12px 32px';
		}
	}};
	font-size: ${({ size }) => {
		switch (size) {
			case 'small': return '14px';
			case 'large': return '20px';
			default: return '16px';
		}
	}};
	font-weight: 600;
	font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	cursor: pointer;
	width: ${({ width = 'auto' }) => width};
	text-decoration: none;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	position: relative;
	overflow: hidden;

	box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left 0.5s;
	}

	&:hover {
		background: ${({ variant }) => 
			variant === 'primary' 
				? 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
				: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
		color: white;
		box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
		transform: translateY(-3px);
		
		&::before {
			left: 100%;
		}
	}

	&:active {
		transform: translateY(-1px) scale(0.98);
		box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
		box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
		
		&:hover {
			transform: none;
			background: ${({ variant }) => 
				variant === 'primary' 
					? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
					: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'};
		}
	}
`;
