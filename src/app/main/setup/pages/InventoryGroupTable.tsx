import { useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";

import {
  getRecords,
  selectRecords,
} from '../../general-management/store/inventoryGroupSlice';

import { TableConfig, TableEvent } from 'app/shared-components/data-table-widget/types/dataTypes';
import TablePageWidget from 'app/shared-components/TablePageWidget';
import { User } from '../../general-management/types/dataTypes';
import { useEffect, useState } from 'react';


/**
 * The UsersTablePage.
 */
function UsersTablePage() {
	const navigate = useNavigate();
  const data = useAppSelector(selectRecords);
  console.log(data)


	// const data = {
  //   pages: 1,
  //   count: 1,
  //   records: [
  //     {
  //       code: 1,
  //       description: 'description',
  //       cnic: '61101-8189772-8',
  //       phone: '0320-2323223',
  //       mobile: '0320-2323223',
	// 	balBF:'as',
	// 	crlimit:324,
	// 	address:"g-7",
	// 	TPB:'T',
	// 	ntn:'32',
	// 	strn:''
  //     },
  //   ],
  // };

	const title = 'Inventory Group';
	const tableConfig: TableConfig = {
    selection: 'none',
    rowActions: [
      { tooltip: 'Edit', action: 'onEdit', icon: 'heroicons-outline:pencil' },
    ],
    columns: [
      { name: 'code', title: 'Code', type: 'text', sort: false },
      { name: 'description', title: 'Description', type: 'text', sort: false },
      // { name: 'cnic', title: 'CNIC', type: 'text', sort: false },
      // { name: 'phone', title: 'Phone', type: 'text', sort: false },
      // { name: 'mobile', title: 'Mobile', type: 'text', sort: false },
      // { name: 'balBF', title: 'Bal B/F', type: 'text', sort: false },
      // { name: 'crlimit', title: 'CR Limit', type: 'text', sort: false },
      // { name: 'address', title: 'Address', type: 'text', sort: false },
      // { name: 'TPB', title: 'T/P/B', type: 'text', sort: false },
      // { name: 'ntn', title: 'NTN', type: 'text', sort: false },
      // { name: 'strn', title: 'STRN', type: 'text', sort: false },
    ],
    dataSource: data && data,
    onSomeEvent: onTableEvent,
    // actions: this.actions,
    // events: this.events,
    perPage: 30,
    showAdd: true,
  };

	function onTableEvent(event: TableEvent) {
		console.log('onTableEvent', event);
		
		if (event.action == 'create') {
			navigate(`/setup/inventory-group/form`);
		}
		
		if (event.event == 'rowAction') {
			if (event.action == 'onEdit') {
				const row = event.params.row as User;
				navigate(`/setup/inventory-group/form/${row._id}`);

			}
		}
	}


	return (
		<TablePageWidget title={title} tableConfig={tableConfig} getRecords={getRecords}  />
	);
}

export default UsersTablePage;
