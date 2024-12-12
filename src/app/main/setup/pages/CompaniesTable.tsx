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

	const data = {pages:1,count:1,records:[{code:1, name:"hina", phone:"0333-6438340" , fax: '543672527' , address: 'xyz' , email:'xyz@mail.com'}]};

	const title = 'Companies';
	const tableConfig: TableConfig = {
		selection: 'none',
		rowActions: [
			{'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons-outline:pencil'},
		],
		columns: [
			{name: 'code', title: 'Code', type: 'text', sort: false},
			{name: 'name', title: 'Name', type: 'text', sort: false},
			{name: 'phone', title: 'Phone', type: 'text', sort: false},
			{name: 'fax', title: 'Fax', type: 'text', sort: false},
			{name: 'address', title: 'Address', type: 'text', sort: false},
			{name: 'email', title: 'Email', type: 'text', sort: false},
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
			navigate(`/setup/company-names/form`);
		}
		
		if (event.event == 'rowAction') {
			if (event.action == 'onEdit') {
				const row = event.params.row as User;
				navigate(`/setup/company-names/form/${row._id}`);

			}
		}
	}

	return (
		<TablePageWidget title={title} tableConfig={tableConfig} getRecords={getRecords}  />
	);
}

export default UsersTablePage;
