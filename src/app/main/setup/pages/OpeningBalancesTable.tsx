import { useAppSelector } from "app/store";
import { useNavigate } from "react-router-dom";

import {
  getRecords,
  selectRecords,
} from "../../setup/store/batchWiseOpeningSlice";

import {
  TableConfig,
  TableEvent,
} from "app/shared-components/data-table-widget/types/dataTypes";
import TablePageWidget from "app/shared-components/TablePageWidget";
import { User } from "../../general-management/types/dataTypes";
import { useAppDispatch } from "app/store";
import { deleteRecord } from "../../setup/store/batchWiseOpeningSlice";
/**
 * The UsersTablePage.
 */
function UsersTablePage() {
  const navigate = useNavigate();
  const data = useAppSelector(selectRecords);
  const dispatch = useAppDispatch();

  // const data = {pages:1,count:1,records:[{code:0o1001,description:"ACTIVE VIT" , Qty : 96}]};

  const title = "Batch Wise Opening Stock";
  const tableConfig: TableConfig = {
    selection: "none",
    rowActions: [
      { tooltip: "Edit", action: "onEdit", icon: "heroicons-outline:pencil" },
      {tooltip: 'Delete', action: 'onDelete', icon: 'heroicons-outline:trash'},

     
    ],
    columns: [
      { name: "code", title: "Code", type: "number", sort: false },
      { name: "description", title: "Description", type: "text", sort: false },

      { name: "quantity", title: "Quantity", type: "number", sort: false },
    ],
    dataSource: data,
    onSomeEvent: onTableEvent,
    // actions: this.actions,
    // events: this.events,
    perPage: 30,
    showAdd: true,
  };

  function onTableEvent(event: TableEvent) {
    console.log("onTableEvent", event);

    if (event.action == "create") {
      navigate(`/setup/opening-balances/form`);
    }

    if (event.event == "rowAction") {
      if (event.action == "onEdit") {
        const row = event.params.row as User;
        navigate(`/setup/opening-balances/form/${row._id}`);
      }
      if (event.action == "onDelete") {
        const row = event.params.row as User;
        dispatch(deleteRecord({ id: row._id }));
        dispatch(getRecords({}));
      }

    }
  }

  return (
    <TablePageWidget
      title={title}
      tableConfig={tableConfig}
      getRecords={getRecords}
    />
  );
}

export default UsersTablePage;
