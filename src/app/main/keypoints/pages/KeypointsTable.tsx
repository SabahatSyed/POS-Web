import { useAppDispatch, useAppSelector } from "app/store";
import { useNavigate } from "react-router-dom";

import {
  TableConfig,
  TableEvent,
} from "app/shared-components/data-table-widget/types/dataTypes";
import TablePageWidget from "app/shared-components/TablePageWidget";
import { deleteRecord, getRecords, selectRecords } from "../store/keypointsSlice";
import { Keypoint } from "../types/keypoints";
import { selectUser } from "app/store/user/userSlice";

/**
 * The MainGroupsTablePage.
 */
function KeypointsTablePage() {
  const navigate = useNavigate();
  const data = useAppSelector(selectRecords);
  const dispatch= useAppDispatch()

  const user = useAppSelector(selectUser);
  // const data = {pages:1,count:1,records:[{code:1,description:"description"}]};
  const companyType = user?.companyType; // Get the company type of the user
  const title =
    companyType === "optics" ? "Patient History" : "Tailor Measurements";

  const tableConfig: TableConfig = {
    shouldFilter: true,
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
      { name: "keypoints.name", title: "Name", type: "text", sort: false },
      { name: "keypoints.age", title: "Age", type: "text", sort: false },
      { name: "keypoints.gender", title: "gender", type: "text", sort: false },
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
      navigate(`/keypoints/form`);
    }

    if (event.event == "rowAction") {
      if (event.action == "onEdit") {
        const row = event.params.row as Keypoint;
        navigate(`/keypoints/form/${row._id}`);
      }
      if (event.action == "onDelete") {
        const row = event.params.row as Keypoint;
        // navigate(`/setup/main-group/form/${row._id}`);
		dispatch(deleteRecord({id:row._id}))
		dispatch(getRecords({}))
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

export default KeypointsTablePage;
