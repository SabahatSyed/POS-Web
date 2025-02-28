import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import { memo } from "react";
import format from "date-fns/format";
import clsx from "clsx";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from 'app/store';
// import withRouter from '@fuse/core/withRouter';
import FuseLoading from "@fuse/core/FuseLoading";

import Button from "@mui/material/Button";
// import { useAppSelector } from 'app/store';
// import { selectUsersRecords } from '../store/dataSlice';
import { RowAction, TableConfig, TableDataResponse } from "./types/dataTypes";
import { useAppSelector } from "app/store";
import { selectUser } from "app/store/user/userSlice";
import { get } from "lodash";
import { selectMainThemeLight } from "app/store/fuse/settingsSlice";

/**
 * The DataTableWidget widget.
 */
function DataTableWidget(props: TableConfig) {
  const { records } = props.dataSource as TableDataResponse;
  // console.log(records)  // why rendering too much
  const theme = useAppSelector(selectMainThemeLight)
  console.log("thems",theme)
  const { columns, onSomeEvent } = props;
  const user = useAppSelector(selectUser);
  const location = useLocation();
  const currentPageId = location.pathname.split("/").pop().replaceAll("-", "");
  const canEdit = Object.entries(user?.pageAccess || {}).some(
    ([key, page]) => key.includes(currentPageId) && page?.update
  );

  const canDelete = Object.entries(user?.pageAccess || {}).some(
    ([key, page]) => key.includes(currentPageId) && page?.delete
  );

  console.log("can delete", canDelete, canEdit, currentPageId);


  const filteredButtons = props.shouldFilter
    ? props.rowActions
    : props.rowActions.filter(
        (button) =>
          (button.action === "onEdit" && canEdit) ||
          (button.action === "onDelete" && canDelete)
      );
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  // const [data, setData] = useState(records);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableOrder, setTableOrder] = useState<{
    direction: "asc" | "desc";
    id: string;
  }>({
    direction: "asc",
    id: "",
  });

  function handleChangePage(
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) {
    setPage(+page);

    const params = { page: +page, limit: rowsPerPage };
    onSomeEvent && onSomeEvent({ event: "loadData", params: params });
  }

  function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(+event.target.value);

    const params = { page: page, limit: +event.target.value };
    onSomeEvent && onSomeEvent({ event: "loadData", params: params });
  }

  function handleRowActionClick(action: RowAction, row: any) {
    const params = { row: row };
    onSomeEvent &&
      onSomeEvent({
        event: "rowAction",
        action: action.action,
        params: params,
      });
  }

  function handleRowClick(row: any) {
    const params = { row: row };
    onSomeEvent && onSomeEvent({ event: "rowClick", params: params });
  }

  // if (loading) {
  // 	return (
  // 		<div className="flex items-center justify-center h-full">
  // 			<FuseLoading />
  // 		</div>
  // 	);
  // }

  if (records.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h6">
          There are no records!
        </Typography>
      </motion.div>
    );
  }

  return (
    <Paper className="flex flex-col flex-auto  pb-24 shadow rounded-2xl overflow-hidden">
      {/* <div>
				<Typography className="mr-16 text-lg font-medium tracking-tight leading-6 truncate">
					Recent transactions
				</Typography>
				<Typography
					className="font-medium"
					color="text.secondary"
				>
					1 pending, 4 completed
				</Typography>
			</div> */}

      <div className="table-responsive ">
        <Table className="simple w-full min-w-full">
          <TableHead sx={{background: theme.palette.secondary.main, color:theme.palette.secondary.contrastText}} >
            <TableRow>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  className={clsx(
                    "",
                    (column.type == "boolean" || column.type == "active") &&
                      "text-center",
                    (column.type == "date" || column.type == "datetime") &&
                      "w-[200px] text-center",
                    (column.type == "number" || column.type == "currency") &&
                      "text-right"
                  )}
                >
                  <Typography className="font-semibold text-white text-12 whitespace-nowrap text-center ">
                    {column.title}
                  </Typography>
                </TableCell>
              ))}
              {props.rowActions.length > 0 && (
                <TableCell>
                  <Typography
                    color="text.secondary"
                    className="font-semibold text-12 whitespace-nowrap text-center"
                  ></Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody sx={{background:"white"}}>
            {records.map((row, index) => (
              <TableRow
                key={index}
                className={clsx("p-2 table-row ", {
                  "shadow-xl": selectedRow === index.toString(),
                })}
                onMouseEnter={() => setSelectedRow(index.toString())}
                onMouseLeave={() => setSelectedRow(null)}
                style={{ height: "60px" }}
                onClick={(event: any) => {
                  handleRowClick(row);
                }}
              >
                {columns.map((column, index) => {
                  const value = row[column.name] || get(row, column.name);
				  
                  switch (column.type) {
                    case "boolean": {
                      return (
                        <TableCell key={column.name} component="th" scope="row">
                          <Typography>{value ? "Yes" : "No"}</Typography>
                        </TableCell>
                      );
                    }
                    case "date": {
                      return (
                        <TableCell key={column.name} component="th" scope="row">
                          {value ? (
                            <Typography className="text-center whitespace-nowrap">
                              {format(new Date(value), "MMM dd, y")}
                            </Typography>
                          ) : (
                            ""
                          )}
                        </TableCell>
                      );
                    }
                    case "datetime": {
                      return (
                        <TableCell key={column.name} component="th" scope="row">
                          {value ? (
                            <Typography className="text-center whitespace-nowrap">
                              {format(new Date(value), "MMM dd, y hh:mm a")}
                            </Typography>
                          ) : (
                            ""
                          )}
                        </TableCell>
                      );
                    }
                    case "currency": {
                      return (
                        <TableCell key={column.name} component="th" scope="row">
                          <Typography>
                            {value.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </Typography>
                        </TableCell>
                      );
                    }
                    case "active": {
                      return (
                        <TableCell key={column.name} component="th" scope="row">
                          <Typography
                            className={clsx(
                              "inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase",
                              value === false &&
                                "bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50",
                              value === true &&
                                "bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50"
                            )}
                          >
                            {value ? "Active" : "Inactive"}
                          </Typography>
                        </TableCell>
                      );
                    }
                    default: {
                      return (
                        <TableCell key={column.name} component="th" scope="row">
                          <Typography className="text-center whitespace-nowrap">
                            {value}
                          </Typography>
                        </TableCell>
                      );
                    }
                  }
                })}
                <TableCell className="w-[2px]">
                  <div
                    className={`flex items-center w-50 justify-end ${
                      selectedRow === index.toString() ? "show-actions" : ""
                    }`}
                  >
                    {filteredButtons?.map((action, actionIndex) => (
                      <div
                        key={actionIndex}
                        style={{
                          opacity: selectedRow === index.toString() ? 1 : 0,
                          transition: "opacity 0.3s ease-in-out",
                          marginLeft: "auto",
                        }}
                      >
                        <Tooltip title={action.tooltip} placement="bottom">
                          <IconButton
                            aria-label="edit"
                            onClick={(event: any) => {
                              event.stopPropagation();
                              handleRowActionClick(action, row);
                            }}
                          >
                            <FuseSvgIcon size={20} className="text-black">
                              {action.icon}
                            </FuseSvgIcon>
                          </IconButton>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          className="shrink-0 border-t-1 bg-white"
          component="div"
          count={records.length}
          rowsPerPage={rowsPerPage}
          page={page - 1}
          backIconButtonProps={{
            "aria-label": "Previous Page",
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page",
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {/* <div className="pt-24">
					<Button variant="outlined">See all transactions</Button>
				</div> */}
      </div>
    </Paper>
  );
}

export default memo(DataTableWidget);
