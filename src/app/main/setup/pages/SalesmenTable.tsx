import { useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";

import {
  getRecords,
  selectRecords,
} from '../../setup/store/salesmenSlice';

import { TableConfig, TableEvent } from 'app/shared-components/data-table-widget/types/dataTypes';
import TablePageWidget from 'app/shared-components/TablePageWidget';
import { User } from '../../general-management/types/dataTypes';


/**
 * The UsersTablePage.
 */
function UsersTablePage() {
	const navigate = useNavigate();
	const data = useAppSelector(selectRecords);
	console.log(data)

	// const data = {pages:1,count:1,records:[{code:1, name:"saira" , mobile:'0314-2727262' , phone:'051-735522' , cnic: '13522-75833874837' , address:'xyz' , commission: 'nill' , accountHead:'nill' }]};

	const title = 'Salesmen';
	const tableConfig: TableConfig = {
		selection: 'none',
		rowActions: [
			{'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons-outline:pencil'},
		],
		columns: [
			{name: 'code', title: 'Code', type: 'text', sort: false},
			{name: 'name', title: 'Name', type: 'text', sort: false},
			{name: 'mobile', title: 'Mobile', type: 'text', sort: false},
			{name: 'phone', title: 'Phone', type: 'text', sort: false},
			{name: 'cnic', title: 'CNIC', type: 'text', sort: false},
			{name: 'address', title: 'Address', type: 'text', sort: false},
			{name: 'commission', title: 'Commission', type: 'text', sort: false},
			{name: 'accountHead', title: 'AccountHead', type: 'text', sort: false},
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
			navigate(`/setup/salesmen/form`);
		}
		
		if (event.event == 'rowAction') {
			if (event.action == 'onEdit') {
				const row = event.params.row as User;
				navigate(`/setup/salesmen/form/${row._id}`);

			}
		}
	}

	return (
		<TablePageWidget title={title} tableConfig={tableConfig} getRecords={getRecords}  />
	);
}

export default UsersTablePage;
