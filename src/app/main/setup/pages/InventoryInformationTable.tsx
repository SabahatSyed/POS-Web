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
function UsersTablePage() {
	const navigate = useNavigate();

	const data = {pages:1,count:1,records:[{code:1, name:"saira",description:"description" , packsize: 20 , purchaseprice : 721 , tradeprice:1658  }]};

	const title = 'Inventory Information';
	const tableConfig: TableConfig = {
		selection: 'none',
		rowActions: [
			{'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons-outline:pencil'},
		],
		columns: [
			{name: 'code', title: 'Code', type: 'text', sort: false},
			{name: 'name', title: 'Name', type: 'text', sort: false},
			{name: 'description', title: 'Description', type: 'text', sort: false},
			{name: 'packsize', title: 'Pack Size', type: 'number', sort: false},
			{name: 'purchaseprice', title: 'Purchase Price', type: 'number', sort: false},
			{name: 'tradeprice', title: 'Trade Price', type: 'number', sort: false},

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
			navigate(`/setup/inventory-information/form`);
		}
		
		if (event.event == 'rowAction') {
			if (event.action == 'onEdit') {
				const row = event.params.row as User;
				navigate(`/setup/inventory-information/form/${row._id}`);

			}
		}
	}

	return (
		<TablePageWidget title={title} tableConfig={tableConfig} getRecords={getRecords}  />
	);
}

export default UsersTablePage;
