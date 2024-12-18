import { useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";

import { getRecords, selectRecords } from '../store/agentDataSlice';

import { TableConfig, TableEvent } from 'app/shared-components/data-table-widget/types/dataTypes';
import TablePageWidget from 'app/shared-components/TablePageWidget';
import { Agent } from '../types/dataTypes';


/**
 * The TablePage.
 */
function AgentsTablePage() {
	const navigate = useNavigate();

	const data = useAppSelector(selectRecords);

	const title = 'Agents';
	const tableConfig: TableConfig = {
		selection: 'none',
		rowActions: [
			{'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons-outline:pencil'},
		],
		columns: [
			{name: 'name', title: 'Name', type: 'text', sort: false},
			{name: 'email', title: 'Email', type: 'text', sort: false},
			{name: 'phone', title: 'Phone', type: 'text', sort: false},
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
			navigate(`/agents/form`);
		}
		
		if (event.event == 'rowAction') {
			if (event.action == 'onEdit') {
				const row = event.params.row as Agent;
				navigate(`/agents/form/${row._id}`);

			}
		}
	}

	return (
		<TablePageWidget title={title} tableConfig={tableConfig} getRecords={getRecords}  />
	);
}

export default AgentsTablePage;
