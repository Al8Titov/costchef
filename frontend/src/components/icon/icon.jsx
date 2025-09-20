import styled from 'styled-components';
import PropTypes from 'prop-types';

const IconContainer = ({ className, id }) => (
	<div className={className}>
		<i className={`fa ${id}`} aria-hidden="true"></i>
	</div>
);

IconContainer.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string.isRequired,
};

export const Icon = styled(IconContainer)`
	font-size: ${({ size }) => size};
	margin: ${({ margin }) => margin};
`;
