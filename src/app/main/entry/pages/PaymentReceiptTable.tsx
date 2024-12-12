import { useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";

import {
  getRecords,
  selectRecords,
} from '../../general-management/store/userDataSlice';

import { TableConfig, TableEvent } from 'app/shared-components/data-table-widget/types/dataTypes';
import TablePageWidget from 'app/shared-components/TablePageWidget';
import { User } from '../../general-management/types/dataTypes';


/**
 * The UsersTablePage.
 */
function PaymentReceiptTable() {
	const navigate = useNavigate();

	const data = {pages:1,count:1,records:[{payment : 34000 , billno:"232-328228" }]};

	const title = 'Payment Receipts';
	const tableConfig: TableConfig = {
		selection: 'none',
		rowActions: [
			{'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons-outline:pencil'},
		],
		columns: [
			{name: 'payment', title: 'Payment', type: 'number', sort: false},
			{name: 'billno', title: 'Bill No', type: 'text', sort: false},
			// {name: 'date', title: 'Date', type: 'datetime', sort: false , width: 'w-50'},
			// {name: 'supplier', title: 'Supplier', type: 'text', sort: false},

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
			navigate(`/entry/payment-receipt`);
		}
		
		if (event.event == 'rowAction') {
			if (event.action == 'onEdit') {
				const row = event.params.row as User;
				navigate(`/entry/payment-receipt`);

			}
		}
	}

	return (
		<TablePageWidget title={title} tableConfig={tableConfig} getRecords={getRecords}  />
	);
}

export default PaymentReceiptTable;
