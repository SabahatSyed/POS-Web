import { useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";


import { TableConfig, TableEvent } from 'app/shared-components/data-table-widget/types/dataTypes';
import TablePageWidget from 'app/shared-components/TablePageWidget';
import { getOrdersRecords, selectOrders } from '../store/orderSlice';
import { OrderType } from '../types/OrderType';


/**
 * The SubscriptionsTablePage.
 */
function SubscriptionsPage() {
	const navigate = useNavigate();

	const data = useAppSelector(selectOrders);
	const title = 'User Subscriptions';
	const tableConfig: TableConfig = {
		selection: 'none',
		rowActions: [
			// {'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons-outline:pencil'},
		],
		columns: [
			{name: 'name', title: 'Name', type: 'text', sort: false},
			{name: 'bill_mode', title: 'Plan', type: 'text', sort: false},
			{name: 'subs', title: 'Subscription', type: 'text', sort: false},
			{name: 'order_price', title: 'Price', type: 'price', sort: false},
            {name: 'order_status', title: 'Status', type: 'boolean', sort: false},
			// {name: 'next_check_time', title: 'Active Till', type: 'datetime', sort: false},

			// {name: 'trial_day', title: 'trial Day', type: 'datetime', sort: false, width: 'w-50'},
		],
		dataSource: data,
		onSomeEvent: onTableEvent,
		// actions: this.actions,
		// events: this.events,
		perPage: 10,
		showAdd: false,
	}

	function onTableEvent(event: TableEvent) {
		console.log('onTableEvent', event);
		
		if (event.action == 'create') {
			navigate(`/subscriptions/form`);
		}
		
		if (event.event == 'rowAction') {
			if (event.action == 'onEdit') {
				// const row = event.params.row as OrderType;
				// navigate(`/plans/form/${row.order_id}`);

			}
		}
	}

	return (
		<TablePageWidget title={title} tableConfig={tableConfig} getRecords={getOrdersRecords}  />
	);
}

export default SubscriptionsPage;
