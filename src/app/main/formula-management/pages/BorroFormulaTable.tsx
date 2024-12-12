import { useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";

import { getRecords, selectRecords, deleteRecord } from '../store/borroFormulaDataSlice';

import { TableConfig, TableEvent } from 'app/shared-components/data-table-widget/types/dataTypes';
import TablePageWidget from 'app/shared-components/TablePageWidget';
import { BorroFormula } from '../types/dataTypes';


/**
 * The TablePage.
 */
function BorroFormulaTablePage() {
	const navigate = useNavigate();

	const data = useAppSelector(selectRecords);

	const title = 'Borro Formula';
	const tableConfig: TableConfig = {
		selection: 'none',
		rowActions: [
			{'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons-outline:pencil'},
			{'tooltip': 'Delete', action: 'onDelete', icon: 'heroicons-outline:trash'},
		],
		columns: [
			{name: 'name', title: 'Name', type: 'text', sort: false},
			{name: 'ltv_multiplier', title: 'Estimated LTV (%)', type: 'number', sort: false},
			{name: 'ir_multiplier', title: 'Estimated Interest (%)', type: 'number', sort: false},
			{name: 'term_table', title: 'Term Length', type: 'text', sort: false},
			{name: 'term_multiplier', title: 'Term Multiplier (%)', type: 'number', sort: false},
			{name: 'createdAt', title: 'Datetime', type: 'datetime', sort: false, width: 'w-50'},
		],
		dataSource: data,
		onSomeEvent: onTableEvent,
		// actions: this.actions,
		// events: this.events,
		perPage: 30,
		showAdd: true,
	}

	function onTableEvent(event: TableEvent) {
		console.log('onTableEvent', event);
		
		if (event.action == 'create') {
			navigate(`/borroformula/form`);
		}
		
		if (event.event == 'rowAction') {
			if (event.action == 'onEdit') {
				const row = event.params.row as BorroFormula;
				navigate(`/borroformula/form/${row._id}`);

			}
		}
	}

	return (
		<TablePageWidget title={title} tableConfig={tableConfig} getRecords={getRecords} deleteRecord={deleteRecord}  />
	);
}

export default BorroFormulaTablePage;
