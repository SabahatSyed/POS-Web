import { useEffect, useMemo, useState } from "react";
import _ from "@lodash";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "app/store";
import { Button, MenuItem, TextField, Typography } from "@mui/material";
import Input from "@mui/material/Input";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import DataTableWidget from "app/shared-components/data-table-widget/DataTableWidget";
import {
  TableConfig,
  TableEvent,
} from "app/shared-components/data-table-widget/types/dataTypes";
import ConfirmationDialog from "./ConfirmationDialog";
import { selectUser } from "app/store/user/userSlice";
import { useLocation } from "react-router";

/**
 * The TablePageWidget.
 */

type TablePageWidgetProps = {
  title: string;
  tableConfig: TableConfig;
  getRecords: any;
  deleteRecord?: any;
};

function TablePageWidget(props: TablePageWidgetProps) {
  const { title, tableConfig } = props;

  const data = props.tableConfig.dataSource;
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const currentPageId = location.pathname.split("/").pop().replaceAll("-", "");
  const canAdd = tableConfig.shouldFilter
    ? true
    : Object.entries(user?.pageAccess || {}).some(
        ([key, page]) => key.includes(currentPageId) && page.add
      );
  const getRecords = props.getRecords;
  const deleteRecord = props.deleteRecord;

  const onSomeEvent = tableConfig.onSomeEvent;
  // console.log(onSomeEvent);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const params = { page: 1, limit: tableConfig.perPage, search: searchText };
    setPagination(params);
    dispatch(getRecords(params));
  }, [dispatch, getRecords, tableConfig.perPage, searchText]);

  props.tableConfig.onSomeEvent = onTableEvent;

  function onTableEvent(event: TableEvent) {
    console.log("onTableEvent", event);

    if (event.event == "loadData") {
      setPagination(event.params);

      dispatch(getRecords(event.params));
    }

    if (event.event == "rowAction") {
      if (event.action == "onDelete") {
        const row = event.params.row;
        setSelectedRow(row);
        setDialogOpen(true);
      }
    }

    onSomeEvent && onSomeEvent(event);
  }

  function handleRefresh() {
    setLoading(true);
    dispatch(getRecords(pagination)).finally(() => {
      setLoading(false);
    });
  }

  function handleCreate() {
    onSomeEvent && onSomeEvent({ event: "none", action: "create" });
  }

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmDialog = () => {
    // Your confirmation logic goes here
    // e.g., perform some action and then close the dialog
    handleCloseDialog();
    if (deleteRecord) {
      dispatch(deleteRecord({ id: selectedRow._id })).then(() => {
        handleRefresh();
      });
    }
  };

  // const title = 'Roles';
  // const tableConfig: TableConfig = {
  // 	selection: 'none',
  // 	rowActions: [
  // 		{'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons_outline:pencil'},
  // 	],
  // 	columns: [
  // 		{name: 'name', title: 'Name', type: 'text', sort: false},
  // 		{name: 'createdAt', title: 'Datetime', type: 'datetime', sort: false, width: 'w-50'},
  // 	],
  // 	dataSource: data,
  // 	// actions: this.actions,
  // 	// events: this.events,
  // 	perPage: 30
  // }

  const header = (
    <div className="flex w-full container">
      <div className="flex  w-full sm:flex-row items-center justify-between p-24 md:p-32 pb-0 md:pb-0">
        <div className="flex flex-col w-fit flex-auto p-3">
          <Typography className="text-3xl font-semibold tracking-tight whitespace-nowrap text-ellipsis leading-8">
            {title}
          </Typography>
        </div>
        <div className="flex w-full items-center justify-end gap-4 mt-24 sm:mt-0 sm:mx-8 flex-wrap ">
          {/* Search Field */}
          <Paper
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
            className="flex items-center h-56 rounded-full border-1 shadow-0 w-full sm:w-auto flex-1 min-w-[200px] max-w-[400px]"
          >
            <FuseSvgIcon color="disabled" className="ml-3">
              heroicons-solid:search
            </FuseSvgIcon>
            <Input
              placeholder="Search"
              className="flex-1 px-2 py-1"
              disableUnderline
              value={searchText}
              onChange={(ev) => setSearchText(ev.target.value)}
              inputProps={{
                "aria-label": "Search",
              }}
              //   style={{ height: "100%" }}
            />
          </Paper>

          {/* T/P/B Field */}
          {/* <TextField
            select
            label="T/P/B"
            variant="outlined"
            className="bg-white rounded-full min-w-[200px] max-w-[400px] w-full sm:w-auto h-56"
            InputProps={{
              classes: { root: "h-full rounded-full" },
              style: { height: "100%" },
            }}
            SelectProps={{
              className: "rounded-full",
              style: { height: "100%", display: "flex", alignItems: "center" },
            }}
          >
            <MenuItem value="T">T</MenuItem>
            <MenuItem value="P">P</MenuItem>
            <MenuItem value="B">B</MenuItem>
          </TextField> */}

          {/* Create Button */}
          {canAdd && tableConfig.showAdd && (
            <Button
              className="inline-flex justify-start items-center min-w-max whitespace-nowrap bg-blue-gray-600 text-white hover:bg-blue-gray-700 hover:opacity-90"
              startIcon={
                <FuseSvgIcon size={20}>heroicons-solid:plus</FuseSvgIcon>
              }
              onClick={handleCreate}
            >
              Create
            </Button>
          )}

          {/* Refresh Button */}
          {/* <Button
            className={`flex items-center justify-center whitespace-nowrap px-4 py-2 rounded-full h-auto ${
              loading
                ? "pointer-events-none opacity-70 bg-gray-300"
                : "bg-primary hover:bg-blue-600"
            }`}
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <FuseSvgIcon size={15}>heroicons-solid:refresh</FuseSvgIcon>
              )
            }
            onClick={handleRefresh}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button> */}
        </div>
      </div>
    </div>
  );

  const content = (
    <>
      <div className="w-full px-24 md:px-32 pb-24">
        {useMemo(() => {
          const container = {
            show: {
              transition: {
                staggerChildren: 0.06,
              },
            },
          };

          const item = {
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          };

          return (
            !_.isEmpty(data) && (
              <motion.div
                className="w-full"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <div className="grid grid-cols-1  gap-32 w-full mt-32">
                  <motion.div
                    variants={item}
                    className="xl:col-span-2 flex flex-col flex-auto"
                  >
                    {/* table view here */}
                    <DataTableWidget {...tableConfig} />
                  </motion.div>
                </div>
              </motion.div>
            )
          );
        }, [data])}
      </div>
      {/* <ConfirmationDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDialog}
        title="Confirmation"
        content="Are you sure you want to perform this action?"
      /> */}
    </>
  );

  return <FusePageSimple header={header} content={content} />;
}

export default TablePageWidget;
