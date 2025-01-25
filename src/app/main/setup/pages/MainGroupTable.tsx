import { useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";

import {
  getRecords,
  selectRecords,
} from '../../setup/store/mainGroupSlice';

import { TableConfig, TableEvent } from 'app/shared-components/data-table-widget/types/dataTypes';
import TablePageWidget from 'app/shared-components/TablePageWidget';
import { MainGroup } from '../../general-management/types/dataTypes';


/**
 * The MainGroupsTablePage.
 */
function MainGroupsTablePage() {
	const navigate = useNavigate();
	const data = useAppSelector(selectRecords);

	// const data = {pages:1,count:1,records:[{code:1,description:"description"}]};

	const title = 'Main Group';
	const tableConfig: TableConfig = {
		selection: 'none',
		rowActions: [
			{'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons-outline:pencil'},
		],
		columns: [
			{name: 'code', title: 'Code', type: 'text', sort: false},
			{name: 'description', title: 'Description', type: 'text', sort: false},
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
			navigate(`/setup/main-group/form`);
		}
		
		if (event.event == 'rowAction') {
			if (event.action == 'onEdit') {
				const row = event.params.row as MainGroup;
				navigate(`/setup/main-group/form/${row._id}`);

			}
		}
	}

	return (
		<TablePageWidget title={title} tableConfig={tableConfig} getRecords={getRecords}  />
	);
}

export default MainGroupsTablePage;
