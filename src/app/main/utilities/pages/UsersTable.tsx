import { useAppDispatch, useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";

import { deleteRecord, getRecords, selectRecords } from '../store/userDataSlice';

import { TableConfig, TableEvent } from 'app/shared-components/data-table-widget/types/dataTypes';
import TablePageWidget from 'app/shared-components/TablePageWidget';
import { User } from '../types/dataTypes';


/**
 * The UsersTablePage.
 */
function UsersTablePage() {
	const navigate = useNavigate();

	const data = useAppSelector(selectRecords);
	const dispatch = useAppDispatch()
	const title = 'Users';
	const tableConfig: TableConfig = {
		selection: 'none',
		rowActions: [
			{'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons-outline:pencil'},
			{'tooltip': 'Delete', action: 'onDelete', icon: 'heroicons-outline:trash'},

		],
		columns: [
			{name: 'name', title: 'Name', type: 'text', sort: false},
			{name: 'role', title: 'Role', type: 'text', sort: false},
			{name: 'email', title: 'Email', type: 'text', sort: false},
			{name: 'contact', title: 'Phone', type: 'text', sort: false},
			// {name: 'createdAt', title: 'Datetime', type: 'datetime', sort: false, width: 'w-50'},
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
			navigate(`/utilities/users/form`);
		}
		
		if (event.event == 'rowAction') {
			if (event.action == 'onEdit') {
				const row = event.params.row as User;
				navigate(`/utilities/users/form/${row._id}`);

			}
			if (event.action == 'onDelete') {
				const row = event.params.row as User;
				dispatch(deleteRecord(row._id))
				dispatch(getRecords({}))
				navigate(-1);

			}
		}
	}

	return (
		<TablePageWidget title={title} tableConfig={tableConfig} getRecords={getRecords}  />
	);
}

export default UsersTablePage;
