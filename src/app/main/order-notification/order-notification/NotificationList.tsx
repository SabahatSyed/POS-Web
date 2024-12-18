import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "app/store";
import { useNavigate } from "react-router-dom";
import {
  TableConfig,
  TableEvent,
} from "app/shared-components/data-table-widget/types/dataTypes";
import TablePageWidget from "app/shared-components/TablePageWidget";
import { getOrdersRecords, selectOrders } from "../store/orderSlice";
import { selectUser, selectUserRole } from "app/store/user/userSlice";
import { OrderType } from "../types/OrderType";
import OrderedTableWidget from "./OrderedTableWidget";

/**
 * The SubscriptionsTablePage.
 */
function NotificationList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const data = useAppSelector(selectOrders);
  const [selectedRow, setSelectedRow] = useState([]);
  const [clickedRow, setClickedRow] = useState(null);
  
  const title = "Notifications";
  const tableConfig: TableConfig = {
    selection: "single",
    showAdd: false,
    rowActions: [
      // { 'tooltip': 'Click to view details', action: 'onClick', icon: 'heroicons-outline:eye' },
    ],
    columns: [
      { name: "image", title: "", type: "image", sort: false, align: "left" },
      {
        name: "item_name",
        title: "Product Name",
        type: "text-clamp",
        sort: false,
      },
      

      // {name: 'subs', title: 'Subscription', type: 'text', sort: false},
      // {name: 'name', title: 'Name', type: 'text', sort: false},
      //   { name: "quantity_received", title: "Quantity Received", type: "number", sort: false },
    ],
    dataSource: data,
    onSomeEvent: onTableEvent,
    // actions: this.actions,
    // events: this.events,
    perPage: 10,
    cursor: true,
  };

  function onTableEvent(event: TableEvent) {
    console.log("onTableEvent", event);

   

    if (event.event == "rowAction") {
      if (event.action == "onEdit") {
        // const row = event.params.row as OrderType;
        // navigate(`/plans/form/${row.order_id}`);
      }
    }
  }

  return (
    <OrderedTableWidget
      clickedRow={clickedRow}
      // showForm={showForm}
      // setShowForm={setShowForm}
      selectedRow={selectedRow}
      setSelectedRow={setSelectedRow}
      title={title}
      tableConfig={tableConfig}
      getRecords={getOrdersRecords}
    />
  );
}

export default NotificationList;
