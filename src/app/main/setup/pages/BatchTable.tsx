import { useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";

import {
  getRecords,
  selectRecords,
} from '../../setup/store/batchSlice';

import { TableConfig, TableEvent } from 'app/shared-components/data-table-widget/types/dataTypes';
import TablePageWidget from 'app/shared-components/TablePageWidget';
import { User } from '../../general-management/types/dataTypes';
import {useAppDispatch} from 'app/store';
import {deleteRecord} from '../../setup/store/batchSlice';

/**
 * The UsersTablePage.
 */
function UsersTablePage() {
	const navigate = useNavigate();
	const data = useAppSelector(selectRecords);
	const dispatch = useAppDispatch()

	// const data = {pages:1,count:1,records:[{code:1,description:"description" , date:'06-sep-2024' , supplier:"SWISS ENERGY"}]};

	const title = 'Batch';
	const tableConfig: TableConfig = {
		selection: 'none',
		rowActions: [
			{'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons-outline:pencil'},
			{'tooltip': 'Delete', action: 'onDelete', icon: 'heroicons-outline:trash'},
		],
		columns: [
			{name: 'code', title: 'Code', type: 'text', sort: false},
			{name: 'description', title: 'Description', type: 'text', sort: false},
			{name: 'quantity', title: 'Quantity', type: 'text', sort: false},
			{name: 'revisedQuantity', title: 'Remaining Quantity', type: 'text', sort: false},
			{name: 'date', title: 'Date', type: 'datetime', sort: false , width: 'w-50'},
			{name: 'supplierCode', title: 'Supplier Code', type: 'text', sort: false},
			{name: 'supplierName', title: 'Supplier Name', type: 'text', sort: false},
			{name: 'inventoryInformation', title: 'Inventory Information', type: 'text', sort: false},

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
			navigate(`/setup/batch/form`);
		}
		
		if (event.event == 'rowAction') {
			if (event.action == 'onEdit') {
				const row = event.params.row as User;
				navigate(`/setup/batch/form/${row._id}`);

			}
			if (event.action == 'onDelete') {
				const row = event.params.row as User;
				dispatch(deleteRecord({ id: row._id }));
				dispatch(getRecords({}));
				// navigate(`/setup/batch/form/${row._id}`);
			}
		}
	}

	return (
		<TablePageWidget title={title} tableConfig={tableConfig} getRecords={getRecords}  />
	);
}

export default UsersTablePage;
