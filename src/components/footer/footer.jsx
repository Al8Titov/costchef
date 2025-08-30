import { useEffect, useState } from 'react';
import styled from 'styled-components';

export const FooterContainer = ({ className }) => {
	const [city, setCity] = useState('');
	const [temperature, setTemperature] = useState('');
	const [weather, setWeather] = useState('');

	useEffect(() => {
		fetch(
			'https://api.openweathermap.org/data/2.5/weather?q=Moscow&units=metric&lang=ru&appid=ea15fb3ee15eb66fe685f89dd718c59c',
		)
			.then((data) => data.json())
			.then(({ name, main, weather }) => {
				setCity(name);
				setTemperature(Math.round(main.temp));
				setWeather(weather[0].description);
			});
	}, []);

	return (
		<div className={className}>
			<div>
				<div>Приложение для расчёта себестоимости блюда</div>
				<div>web@developer.ru</div>
			</div>

			<div className="right">
				<div>
					{city},{' '}
					{new Date().toLocaleDateString('ru', {
						day: 'numeric',
						month: 'long',
						year: 'numeric',
					})}
				</div>
				<div>
					{temperature} градусов, {weather}
				</div>
			</div>
		</div>
	);
};

export const Footer = styled(FooterContainer)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 70px;
	box-shadow: 0 1px 11px #000;
	background-color: #23488dff;
	font-weight: bold;
	padding: 0 20px;
	width: 1350px;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;

	.right {
		display: flex;
		flex-direction: column; 
		align-items: flex-end;
	}
`;
