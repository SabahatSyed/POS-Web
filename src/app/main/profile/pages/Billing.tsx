import { useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";
import { TableConfig, TableEvent } from 'app/shared-components/data-table-widget/types/dataTypes';
import TablePageWidget from 'app/shared-components/TablePageWidget';
import { PaymentType } from '../../subscription/types/PaymentMethodType';
import { deleteRecord, getRecords, selectPayments } from '../../subscription/store/paymentsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';
import { getInvoicesRecords, selectInvoices } from '../../subscription/store/InvoiceSlice';
import { useEffect } from 'react';
/**
 * The RolesTablePage.
 */
interface BiilingProps{
	user_id: string;
}
const InvoicesTable:React.FC<BiilingProps>=({user_id})=> {
	const navigate = useNavigate();
	const dispatch = useDispatch<any>()
	const data = useAppSelector(selectInvoices);
	useEffect(()=>{
		dispatch(getInvoicesRecords({id:null, userId:user_id}));
	},[dispatch])
	const title = 'Payments';
	const tableConfig: TableConfig = {
		selection: 'none',
		showAdd: false,
		rowActions: [
		],
		columns: [
			{name: 'payment_date', title: 'Date', type: 'datetime', sort: false, },
			// {name: 'subs', title: 'Subscription', type: 'text', sort: false},
			// {name: 'name', title: 'Name', type: 'text', sort: false},
			{name: 'bill_mode', title: 'Subscription', type: 'text', sort: false},
			{name: 'payment_status', title: 'Status', type: 'text', sort: false},
			{name: 'actual_amount', title: 'Actual Amount', type: 'currency', sort: false},
			{name: 'discount', title: 'Discount', type: 'currency', sort: false},
			{name: 'total_amount', title: 'Discounted Amount', type: 'currency', sort: false},

		],
		dataSource: data,
		onSomeEvent: onTableEvent,
		// actions: this.actions,
		// events: this.events,
		perPage: 10,
	}

	function onTableEvent(event: TableEvent) {
		// console.log('onTableEvent', event);

		if (event.action == 'create') {
			navigate(`/roles/form`);
		}
		
		if (event.event == 'rowAction') {
			if (event.action == 'onDelete') {
				const row = event.params.row as PaymentType;
				dispatch(deleteRecord({ id:row.id }))
				.then((resp: any) => {
				  console.log(resp);
				  if (resp.error) {
					dispatch(showMessage({ message: resp.error.message, variant: 'error' }));
				  }
				  else {
					dispatch(showMessage({ message: 'Success', variant: 'success' }));
				  }
				});
			}
		}
	}

	return (
		<TablePageWidget subtitle='Keep track of all your subscription payments' queryParams={{userId:user_id}} title={title} tableConfig={tableConfig} getRecords={getInvoicesRecords}  />
	);
}

export default InvoicesTable;
