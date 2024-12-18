import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import TablePagination from '@mui/material/TablePagination';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import format from 'date-fns/format';
import clsx from 'clsx';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {  Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
// import { useAppDispatch, useAppSelector } from 'app/store';
// import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';


import Button from '@mui/material/Button';
// import { useAppSelector } from 'app/store';
// import { selectUsersRecords } from '../store/dataSlice';
import { RowAction, TableConfig, TableDataResponse } from './types/dataTypes';
import { Avatar, Checkbox } from '@mui/material';

/**
 * The DataTableWidget widget.
 */
function FavDataTableWidget(props: TableConfig) {

	const { records, total } = props.dataSource as TableDataResponse;
	// console.log(records)  // why rendering too much

	const { columns, onSomeEvent, cursor,selection, selectedTableRow, setSelectedTableRow } = props;
	const [allChecked,setAllChecked]=useState(false)
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState<string[]>([]);
	const [selectedRow, setSelectedRow] = useState<string | null>(null);
	const [selectedClickedRow, setSelectedClickedRow] = useState<string | null>(null);
	// const [data, setData] = useState(records);
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [tableOrder, setTableOrder] = useState<{
		direction: 'asc' | 'desc';
		id: string;
	}>({
		direction: 'asc',
		id: ''
	});
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  const truncated = text.substr(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  if (lastSpaceIndex === -1) {
    return truncated; // Return the truncated string as is if no spaces are found
  }
  return truncated.substr(0, lastSpaceIndex);
};

	useEffect(()=>{
		if(allChecked){
			const response=records.map((row)=>row.favourite_id)
			setSelectedTableRow(response);
		}else{
			setSelectedTableRow([])
		}
	},[allChecked])
	function handleChangePage(event: React.MouseEvent<HTMLButtonElement> | null, page: number) {
		setPage(page+1);
		const params = { page: page+1, limit: rowsPerPage };
		onSomeEvent && onSomeEvent({ event: 'loadData', params: params });
	}
	
	function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
		setRowsPerPage(+event.target.value);
	
		const params = { page: page, limit: +event.target.value };
		onSomeEvent && onSomeEvent({ event: 'loadData', params: params });
	}

	function handleRowActionClick(action: RowAction, row: any) {

		const params = { row: row };
		onSomeEvent && onSomeEvent({ event: 'rowAction', action: action.action, params: params });
	}

	function handleRowClick(row: any, index:any) {
		setSelectedClickedRow(index.toString());
		const params = { row: row };
		onSomeEvent && onSomeEvent({ event: 'rowClick', params: params });
	}
	function handleRowLink(row: any, index: any) {
    setSelectedClickedRow(index.toString());
    const params = { row: row };
    onSomeEvent && onSomeEvent({ event: "rowLinkClick", params: params });
  }

  useEffect(() => {
    if (total % 10 === 0) {
      setPage(total / 10);
    }
  }, [total]);
	// if (loading) {
	// 	return (
	// 		<div className="flex items-center justify-center h-full">
	// 			<FuseLoading />
	// 		</div>
	// 	);
	// }

	if (records?.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h6"
				>
					There are no records!
				</Typography>
			</motion.div>
		);
	}

	return (
    <Paper className="flex flex-col flex-auto pb-24 shadow rounded-2xl overflow-hidden">
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

      <div className="table-responsive">
        <Table stickyHeader className="simple w-full min-w-full">
          <TableHead className="bg-secondary pt-24">
            <TableRow className="text-white">
              {selection === "single" && (
                <TableCell>
                  {" "}
                  <Checkbox
                  sx={{
                    "&.Mui-checked":{
                      color:"white"
                    }
                  }}
				  className='py-0 my-0'
                    onClick={() => {
                      setAllChecked(!allChecked);
                    }}
                    checked={
                      selectedTableRow.length > 0 &&
                      selectedTableRow.length === records.length
                    }
                  />
                </TableCell>
              )}
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  className={clsx(
                    "",
                    (column.type == "boolean" || column.type == "active") &&
                      "text-center",
                    (column.type == "date" || column.type == "datetime") &&
                      "w-[200px] ",
                    (column.type == "number" || column.type == "currency") &&
                      "text-center"
                  )}
                >
                  <Typography
                    color="text.secondary"
                    className="font-semibold text-12 whitespace-nowrap text-white "
                  >
                    {column.title}
                  </Typography>
                </TableCell>
              ))}
              {props.rowActions.length > 0 && (
                <TableCell>
                  <Typography
                    color="text.secondary"
                    className="font-semibold text-12 whitespace-nowrap"
                  ></Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {records &&
              records.map((row, index) => (
                <TableRow
                  key={index}
                  className={clsx("p-2  table-row ", {
                    "shadow-xl": selectedRow
                      ? selectedRow === index.toString()
                      : selectedClickedRow === index.toString(),
                    "cursor-pointer": cursor,
                  })}
                  onMouseEnter={() => {
                    setSelectedRow(index.toString());
                    setSelectedClickedRow(null);
                  }}
                  onMouseLeave={() => setSelectedRow(null)}
                  style={{ height: "60px" }}
                >
                  {selection === "single" && (
                    <TableCell sx={{ zIndex: "999" }}>
                      {" "}
                      <Checkbox
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedTableRow((prevSelectedRow) => {
                            const index = prevSelectedRow.indexOf(
                              row.favourite_id
                            );
                            if (index === -1) {
                              return [...prevSelectedRow, row.favourite_id];
                            } else {
                              return prevSelectedRow.filter(
                                (id) => id !== row.favourite_id
                              );
                            }
                          });
                        }}
                        checked={selectedTableRow.includes(row?.favourite_id)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column, index) => {
                    const value = row[column.name];
                    switch (column.type) {
                      case "boolean": {
                        return (
                          <TableCell
                            key={column.name}
                            component="th"
                            scope="row"
                            className="text-center"
                          >
                            <Typography>{value ? "Yes" : "No"}</Typography>
                          </TableCell>
                        );
                      }
                      case "notes": {
                        return (
                          <TableCell
                            key={column.name}
                            component="th"
                            scope="row"
                          >
                            <Typography
                              className={`border rounded-4 border-black p-2 border-opacity-[0.12] hover:border-opacity-[1] ${
                                value && value.length > 2
                                  ? "flex-col"
                                  : " flex-row-reverse"
                              } flex justify-between gap-1`}
                              onClick={(event: any) => {
                                handleRowClick(row, index);
                              }}
                            >
                              <div className="flex justify-end">
                                <EditOutlinedIcon className=" text-[16px]" />
                              </div>

                              {value && value.length > 20 ? (
                                <Tooltip title={value}>
                                  <Typography className="line-clamp-2 truncate">
                                    {truncateText(value, 30)}
                                    <br />
                                    {value.length > 30
                                      ? value.length > 60
                                        ? `${truncateText(
                                            value.substring(
                                              truncateText(value, 30).length
                                            ),
                                            30
                                          )}...`
                                        : truncateText(
                                            value.substring(
                                              truncateText(value, 30).length
                                            ),
                                            30
                                          )
                                      : null}
                                  </Typography>
                                </Tooltip>
                              ) : (
                                <Typography className="line-clamp-1 truncate">
                                  {value}
                                </Typography>
                              )}
                            </Typography>
                          </TableCell>
                        );
                      }

                      case "date": {
                        return (
                          <TableCell
                            key={column.name}
                            component="th"
                            scope="row"
                          >
                            {value && typeof value == "number" ? (
                              <Typography>
                                {format(new Date(value * 1000), "MMM dd, y")}
                              </Typography>
                            ) : (
                              <Typography>
                                {format(new Date(value), "MMM dd, y")}
                              </Typography>
                            )}
                          </TableCell>
                        );
                      }
                      case "image": {
                        return (
                          <TableCell
                            key={column.name}
                            // className='w-[80px]'
                            component="th"
                            scope="row"
                          >
                            {value ? (
                              <img
                                className=""
                                alt="user photo"
                                src={value}
                                style={{
                                  maxWidth: "none",
                                  width:75,
                                  height: 95,
                                  margin: 10,
                                  objectFit: 'cover'
                                }}
                              />
                            ) : (
                              <Typography>No Image Available</Typography>
                            )}
                          </TableCell>
                        );
                      }

                      case "datetime": {
                        return (
                          <TableCell
                            key={column.name}
                            component="th"
                            scope="row"
                          >
                            {value && typeof value == "number" ? (
                              <Typography>
                                {format(
                                  new Date(value * 1000),
                                  "MMM dd, y hh:mm a"
                                )}
                              </Typography>
                            ) : (
                              <Typography>
                                {format(new Date(value), "MMM dd, y hh:mm a")}
                              </Typography>
                            )}
                          </TableCell>
                        );
                      }
                      case "currency": {
                        return (
                          <TableCell
                            key={column.name}
                            component="th"
                            scope="row"
                            className="text-center"
                          >
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
                          <TableCell
                            key={column.name}
                            component="th"
                            scope="row"
                          >
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
                      case "asin": {
                        return (
                          <TableCell
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            key={column.name}
                            component="th"
                            className="pl-[20px] pr-[20px]"
                            scope="row"
                          >
                            <Link
                              target="_blank"
                              rel="noopener noreferrer"
                              to={`https://www.amazon.com/dp/${value}`}
                            >
                              <Typography className="underline">
                                {value}
                              </Typography>
                            </Link>
                          </TableCell>
                        );
                      }
                      case "link": {
                        return (
                          <TableCell
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            key={column.name}
                            component="th"
                            scope="row"
                          >
                            {/* <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={
                                value &&
                                value.startsWith("http")
                                  ? value
                                  : `https://${value}`
                              }
                            > */}
                            <Typography
                              className={`border rounded-4 border-black p-2 border-opacity-[0.12] hover:border-opacity-[1] ${"flex-row-reverse"} flex justify-between gap-1`}
                              onClick={(event: any) => {
                                handleRowLink(row, index);
                              }}
                            >
                              {" "}
                              <div className="flex justify-end">
                                <InsertLinkIcon className=""/>
                              </div>
                        
                            </Typography>

                            {/* </a> */}
                          </TableCell>
                        );
                      }
                      default: {
                        return (
                          <TableCell
                            key={column.name}
                            component="th"
                            scope="row"
                          >
                            <Tooltip title={value}>
                              <Typography className=" line-clamp-2">
                                {value}
                              </Typography>
                            </Tooltip>
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
                      {props.rowActions.map((action, actionIndex) => (
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
          className="shrink-0 border-t-1"
          component="div"
          count={total}
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

export default memo(FavDataTableWidget);
FavDataTableWidget.defaultProps={
	setSelectedTableRow:()=>{},
	setShowForm:()=>{},
	selectedTableRow:"",
}
