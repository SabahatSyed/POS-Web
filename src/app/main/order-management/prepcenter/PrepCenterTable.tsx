import { useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";


import { TableConfig, TableEvent } from 'app/shared-components/data-table-widget/types/dataTypes';
import TablePageWidget from 'app/shared-components/TablePageWidget';
import { SubscriptionType } from '../types/SubscriptionType';
import { deleteRecord, getPrepRecords, selectSubscriptions } from '../store/prepCenterSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';


/**
 * The PlansTablePage.
 */
function PrepCenterTable() {
	const navigate = useNavigate();
	const dispatch = useDispatch<any>()

	const data = useAppSelector(selectSubscriptions);
	console.log(data);
	
	const title = 'Prep Center';
	const tableConfig: TableConfig = {
    selection: "none",
    rowActions: [
      { tooltip: "Edit", action: "onEdit", icon: "heroicons-outline:pencil" },
      {
        tooltip: "Delete",
        action: "onDelete",
        icon: "heroicons-outline:trash",
      },
    ],
    columns: [
      { name: "name", title: "Name", type: "text", sort: false },
      { name: "email", title: "Email", type: "text", sort: false },
      { name: "phone", title: "Phone", type: "text", sort: false },
      { name: "address", title: "Address", type: "text", sort: false },
    ],
    dataSource: data,
    onSomeEvent: onTableEvent,
    // actions: this.actions,
    // events: this.events,
    perPage: 10,
    showAdd: true,
  };

	async function onTableEvent(event: TableEvent) {
		console.log('onTableEvent', event);
		
		if (event.action == 'create') {
			navigate(`/prep-center/form`);
		}
		
		if (event.event == 'rowAction') {
			if (event.action == 'onEdit') {
				const row = event.params.row as SubscriptionType;
				navigate(`/prep-center/form/${row.id}`);

			}
			if (event.action == 'onDelete') {
				const row = event.params.row as SubscriptionType;
				console.log(row)
				// await dispatch(deleteRecord({ id: row.id}))
				// .then((resp: any) => {
				// 	console.log(resp);
				// 	if (resp.error) {
				// 		dispatch(showMessage({ message: resp.error.message, variant: 'error' }));
				// 	}
				// 	else {
				// 		dispatch(showMessage({ message: 'Success', variant: 'success' }));
				// 		// history.push(`/product/${resp.payload.product_id}`)
				// 	}
				// });
			}
		}

		// dispatch(getPrepRecords({ id: null }))
		
	}

	return (
		<TablePageWidget  showLoader={false} deleteRecord={deleteRecord} title={title} tableConfig={tableConfig} getRecords={getPrepRecords}  />
	);
}

export default PrepCenterTable;
