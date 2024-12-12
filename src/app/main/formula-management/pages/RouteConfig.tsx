import lazyWithReducer from 'app/store/lazyWithReducer';
import reducer from '../store';

import BorroFormulaFormPage from './BorroFormulaForm';
import BlockPurchaseFormulaFormPage from './BlockPurchaseFormulaForm';
import ELCFormulaFormPage from './ELCFormulaForm';

const BorroFormulaTable = lazyWithReducer('formulaManagement', () => import('./BorroFormulaTable'), reducer);
const BlockPurchaseFormulaTable = lazyWithReducer('formulaManagement', () => import('./BlockPurchaseFormulaTable'), reducer);
const ELCFormulaTable = lazyWithReducer('formulaManagement', () => import('./ELCFormulaTable'), reducer);

/**
 * The route config.
 */
const RouteConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'borroformula/table',
			element: <BorroFormulaTable />,
			auth: ['Admin'],
		},
		{
			path: 'borroformula/form',
			element: <BorroFormulaFormPage />,
			auth: ['Admin'],
		},
		{
			path: 'borroformula/form/:id',
			element: <BorroFormulaFormPage />,
			auth: ['Admin'],
		},
		{
			path: 'blockpurchaseformula/table',
			element: <BlockPurchaseFormulaTable />,
			auth: ['Admin'],
		},
		{
			path: 'blockpurchaseformula/form',
			element: <BlockPurchaseFormulaFormPage />,
			auth: ['Admin'],
		},
		{
			path: 'blockpurchaseformula/form/:id',
			element: <BlockPurchaseFormulaFormPage />,
			auth: ['Admin'],
		},
		{
			path: 'elcformula/table',
			element: <ELCFormulaTable />,
			auth: ['Admin'],
		},
		{
			path: 'elcformula/form',
			element: <ELCFormulaFormPage />,
			auth: ['Admin'],
		},
		{
			path: 'elcformula/form/:id',
			element: <ELCFormulaFormPage />,
			auth: ['Admin'],
		},
		
	]
};

export default RouteConfig;
