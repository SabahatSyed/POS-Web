import { useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";
import { TableConfig, TableEvent } from 'app/shared-components/data-table-widget/types/dataTypes';
import TableComponentWidget from 'app/shared-components/TableComponentWidget';
import { getRecords, selectRecords } from '../../general-management/store/userDataSlice';

/**
 * The PrepCenterUsers.
 */
function PrepCenterUsers() {
	const navigate = useNavigate();

	const data = useAppSelector(selectRecords);

	const title = 'Prep Center Users';
	const tableConfig: TableConfig = {
		selection: 'none',
		rowActions: [
			{'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons-outline:pencil'},
		],
		columns: [
			{name: 'name', title: 'Name', type: 'text', sort: false},
			{name: 'role', title: 'Role', type: 'text', sort: false},
			{name: 'email', title: 'Email', type: 'text', sort: false},
			{name: 'phone', title: 'Phone', type: 'text', sort: false},
			{name: 'date_added', title: 'Datetime', type: 'datetime', sort: false, width: 'w-50'},
		],
		dataSource: data,
		onSomeEvent: onTableEvent,
		// actions: this.actions,
		// events: this.events,
		perPage: 10,
		showAdd: true,
	}

	function onTableEvent(event: TableEvent) {
		console.log('onTableEvent', event);
		
		if (event.action == 'create') {
			navigate(`/users/form`);
		}
		
		if (event.event == 'rowAction') {
			if (event.action == 'onEdit') {
				const row = event.params.row as any;
				navigate(`/users/form/${row.id}`);

			}
		}
	}

	return (
		<TableComponentWidget title={title} tableConfig={tableConfig} getRecords={getRecords}  />
	);
}

export default PrepCenterUsers;
