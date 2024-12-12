import { useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";

import { getRecords, selectRecords } from '../store/newsletterDataSlice';

import { TableConfig, TableEvent } from 'app/shared-components/data-table-widget/types/dataTypes';
import TablePageWidget from 'app/shared-components/TablePageWidget';
import { Newsletter } from '../types/dataTypes';


/**
 * The NewsletterTablePage.
 */
function NewsletterTablePage() {
	const navigate = useNavigate();

	const data = useAppSelector(selectRecords);

	const title = 'Newsletter Subscriptions';
	const tableConfig: TableConfig = {
		selection: 'none',
		rowActions: [
			// {'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons-outline:pencil'},
		],
		columns: [
			{name: 'email', title: 'Email', type: 'text', sort: false},
			{name: 'createdAt', title: 'Datetime', type: 'datetime', sort: false, width: 'w-50'},
		],
		dataSource: data,
		onSomeEvent: onTableEvent,
		// actions: this.actions,
		// events: this.events,
		perPage: 30,
		showAdd: false
	}

	function onTableEvent(event: TableEvent) {
		console.log('onTableEvent', event);
		
		// if (event.action == 'create') {
		// 	navigate(`/users/form`);
		// }
		
		// if (event.event == 'rowAction') {
		// 	if (event.action == 'onEdit') {
		// 		const row = event.params.row as Newsletter;
		// 		navigate(`/users/form/${row._id}`);

		// 	}
		// }
	}

	return (
		<TablePageWidget title={title} tableConfig={tableConfig} getRecords={getRecords}  />
	);
}

export default NewsletterTablePage;
