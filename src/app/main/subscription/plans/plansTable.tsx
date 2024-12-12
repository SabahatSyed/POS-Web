import { useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";


import { TableConfig, TableEvent } from 'app/shared-components/data-table-widget/types/dataTypes';
import TablePageWidget from 'app/shared-components/TablePageWidget';
import { SubscriptionType } from '../types/SubscriptionType';
import { deleteRecord, getSubscriptionRecords, selectSubscriptions } from '../store/subscriptionSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';


/**
 * The PlansTablePage.
 */
function PlansPage() {
	const navigate = useNavigate();
	const dispatch = useDispatch<any>()

	const data = useAppSelector(selectSubscriptions);

	const title = 'Subscription Plans';
	const tableConfig: TableConfig = {
		selection: 'none',
		rowActions: [
			{'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons-outline:pencil'},
			{'tooltip': 'Delete', action: 'onDelete', icon: 'heroicons-outline:trash'},
		],
		columns: [
			{name: 'name', title: 'Name', type: 'text', sort: false},
			{name: 'title', title: 'Title', type: 'text', sort: false},
			{name: 'monthly_price', title: 'Monthly Price', type: 'text', sort: false},
			{name: 'yearly_price', title: 'Yearly Price', type: 'text', sort: false},
            {name: 'is_active', title: 'Status', type: 'boolean', sort: false},
			{name: 'trial_days', title: 'Trial Days', type: 'number', sort: false},
		],
		dataSource: data,
		onSomeEvent: onTableEvent,
		// actions: this.actions,
		// events: this.events,
		perPage: 10,
		showAdd: true,
	}

	async function onTableEvent(event: TableEvent) {
		console.log('onTableEvent', event);
		
		if (event.action == 'create') {
			navigate(`/plans/form`);
		}
		
		if (event.event == 'rowAction') {
			if (event.action == 'onEdit') {
				const row = event.params.row as SubscriptionType;
				navigate(`/plans/form/${row.id}`);

			}
			// if (event.action == 'onDelete') {
			// 	const row = event.params.row as SubscriptionType;
			// 	await dispatch(deleteRecord({ id: row.id}))
			// 	.then((resp: any) => {
			// 		console.log(resp);
			// 		if (resp.error) {
			// 			dispatch(showMessage({ message: resp.error.message, variant: 'error' }));
			// 		}
			// 		else {
			// 			// dispatch(showMessage({ message: 'Success', variant: 'success' }));
			// 			// history.push(`/product/${resp.payload.product_id}`)
			// 		}
			// 	});
			// }
		}

		// dispatch(getSubscriptionRecords({ id: null }))
		
	}

	return (
		<TablePageWidget title={title} tableConfig={tableConfig} getRecords={getSubscriptionRecords} deleteRecord={deleteRecord} />
	);
}

export default PlansPage;
