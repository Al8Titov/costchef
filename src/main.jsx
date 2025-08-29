import ReactDOM from 'react-dom/client';
import {BrowserRouter } from 'react-router-dom';
import { FoodCostManager } from './FoodCostManager.jsx';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<BrowserRouter>
		<FoodCostManager />
	</BrowserRouter>
);
