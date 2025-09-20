import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ModalContainer = ({ 
	isOpen, 
	onClose, 
	children, 
	title, 
	className 
}) => {
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return createPortal(
		<Overlay className={className} onClick={onClose}>
			<ModalContent onClick={(e) => e.stopPropagation()}>
				{title && <ModalHeader>{title}</ModalHeader>}
				<ModalBody>{children}</ModalBody>
				<CloseButton onClick={onClose}>&times;</CloseButton>
			</ModalContent>
		</Overlay>,
		document.body
	);
};

ModalContainer.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
	title: PropTypes.string,
	className: PropTypes.string,
};

const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
`;

const ModalContent = styled.div`
	background: white;
	border-radius: 8px;
	padding: 20px;
	max-width: 90vw;
	max-height: 90vh;
	overflow-y: auto;
	position: relative;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.h2`
	margin: 0 0 20px 0;
	font-size: 24px;
	color: #333;
`;

const ModalBody = styled.div`
	margin-bottom: 20px;
`;

const CloseButton = styled.button`
	position: absolute;
	top: 10px;
	right: 15px;
	background: none;
	border: none;
	font-size: 24px;
	cursor: pointer;
	color: #666;
	
	&:hover {
		color: #333;
	}
`;

export const Modal = styled(ModalContainer)``;

