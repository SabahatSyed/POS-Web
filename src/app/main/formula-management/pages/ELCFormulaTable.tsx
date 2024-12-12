import { useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";

import { getRecords, selectRecords, deleteRecord } from '../store/elcFormulaDataSlice';

import { TableConfig, TableEvent } from 'app/shared-components/data-table-widget/types/dataTypes';
import TablePageWidget from 'app/shared-components/TablePageWidget';
import { ELCFormula } from '../types/dataTypes';


/**
 * The ELCTablePage.
 */
function ELCFormulaTablePage() {
	const navigate = useNavigate();

	const data = useAppSelector(selectRecords);

	const title = 'Equity Line Credit Formula';
	const tableConfig: TableConfig = {
		selection: 'none',
		rowActions: [
			{'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons-outline:pencil'},
			{'tooltip': 'Delete', action: 'onDelete', icon: 'heroicons-outline:trash'},
		],
		columns: [
			{name: 'name', title: 'Name', type: 'text', sort: false},
			{name: 'volume_multiplier', title: 'Volumn Multiplier (%)', type: 'number', sort: false},
			{name: 'discount', title: 'Discount (%)', type: 'number', sort: false},
			{name: 'commitment_amount', title: 'Commitment Amount ($)', type: 'number', sort: false},
			{name: 'commitment_shares', title: 'Commitment Shares', type: 'number', sort: false},
			{name: 'max_put_notice', title: 'Max Put Notice ($)', type: 'number', sort: false},
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
			navigate(`/elcformula/form`);
		}
		
		if (event.event == 'rowAction') {
			if (event.action == 'onEdit') {
				const row = event.params.row as ELCFormula;
				navigate(`/elcformula/form/${row._id}`);

			}
		}
	}

	return (
		<TablePageWidget title={title} tableConfig={tableConfig} getRecords={getRecords} deleteRecord={deleteRecord}  />
	);
}

export default ELCFormulaTablePage;
