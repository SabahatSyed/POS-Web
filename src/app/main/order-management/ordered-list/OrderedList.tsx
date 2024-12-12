import { useState } from "react";
import { useAppSelector } from "app/store";
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
import { useSelector } from "react-redux";

/**
 * The SubscriptionsTablePage.
 */
function OrderedList() {
  const navigate = useNavigate();
  const data = useAppSelector(selectOrders);
  const [selectedRow, setSelectedRow] = useState([]);
  const [clickedRow, setClickedRow] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const userData = useSelector(selectUser);	
  console.log("ss",userData)
  const title = "Order List";
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
      { name: "order_no", title: "Order Number", type: "text", sort: false },
      { name: "order_type", title: "Type", type: "text", sort: false },
      { name: "asin", title: "Asin", type: "asin", sort: false, align: "left" },
      { name: "status", title: "Status", type: "status", sort: false },
      {
        name: "quantity_ordered",
        title: "Quantity Ordered",
        type: "number",
        sort: false,
      },

      { name: "order_date", title: "Order Date", type: "date", sort: false },
      { name: userData?.data?.prep_center_id ? "user" : "prep_center", title: userData?.data?.prep_center_id ? "Seller" : "Prep Center", type: "text", sort: false },

      {
        name: "tracking_info",
        title: "Tracking Information",
        type: "text-clamp",
        sort: false,
      },
      {
        name: "quantity_received",
        title: "Quantity Received",
        type: "number",
        sort: false,
      },
      {
        name: "quantity_damaged",
        title: "Quantity Damaged",
        type: "number",
        sort: false,
      },
      {
        name: "received_date",
        title: "Received Date",
        type: "date",
        sort: false,
      },
      {
        name: "quantity_prepped",
        title: "Quantity Prepped",
        type: "number",
        sort: false,
      },
      {
        name: "percentage_prepped",
        title: "Percentage Prepped",
        type: "percentage",
        sort: false,
      },

      {
        name: "received_by",
        title: "Received By",
        type: "text",
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

    if (event.action == "create") {
      navigate(`/subscriptions/form`);
    }

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
      showForm={showForm}
      setShowForm={setShowForm}
      selectedRow={selectedRow}
      setSelectedRow={setSelectedRow}
      title={title}
      tableConfig={tableConfig}
      getRecords={getOrdersRecords}
    />
  );
}

export default OrderedList;
