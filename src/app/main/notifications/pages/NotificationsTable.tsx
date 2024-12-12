import { useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";

import { getRecords, selectRecords } from '../store/notificationDataSlice';

import { TableConfig, TableEvent } from 'app/shared-components/data-table-widget/types/dataTypes';
import TablePageWidget from 'app/shared-components/TablePageWidget';
import { Notification } from '../types/dataTypes';


/**
 * The TablePage.
 */
function NotificationsTable() {
	const navigate = useNavigate();

	const data = useAppSelector(selectRecords);

	const title = 'Notifications';
	const tableConfig: TableConfig = {
		selection: 'none',
		rowActions: [
			// {'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons-outline:pencil'},
		],
		columns: [
			{name: 'title', title: 'Type', type: 'text', sort: false},
			{name: 'description', title: 'Stock', type: 'text', sort: false},
			{name: 'time', title: 'Datetime', type: 'datetime', sort: false, width: 'w-50'},
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
			// navigate(`/agents/form`);
		}

		if (event.event == 'rowClick') {
			const row = event.params.row as Notification;

				
		}
		
		if (event.event == 'rowAction') {

		}
	}

	return (
		<TablePageWidget title={title} tableConfig={tableConfig} getRecords={getRecords}  />
	);
}

export default NotificationsTable;
