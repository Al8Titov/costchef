import { forwardRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const InputContainer = forwardRef(({ className, width, ...props }, ref) => {
	return <input className={className} ref={ref} {...props} />;
});

InputContainer.propTypes = {
	className: PropTypes.string,
	width: PropTypes.string,
};

export const Input = styled(InputContainer)`
	width: ${({ width = '100%' }) => width};
	height: 31px;
	padding: 0 15px;
	border: none;
	border-radius: 6px;
	margin: 0 0 10px;
	font-size: 16px;

	box-shadow: 0 2px 6px rgba(7, 7, 7, 0.3);
	transition: all 0.2s ease;

	&:focus {
		outline: none;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
		border: 1px solid #325b8aff;
	}
`;
