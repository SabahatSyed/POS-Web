import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';

import { memo } from 'react';
import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import format from 'date-fns/format';
import clsx from 'clsx';
import { useParams, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from 'app/store';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { getUsers, selectUsersRecords } from '../store/dataSlice';
import userRecordsType from '../types/UserManagementTypes';
import Tooltip from '@mui/material/Tooltip';
/**
 * The RecentTransactionsWidget widget.
 */
function UserRecentTransactiontable() {
	const userData = useAppSelector(selectUsersRecords);
	console.log("wd", userData)
	const { columns = [], rows = [] } = userData?.records || {} as userRecordsType;
	const [selectedRow, setSelectedRow] = useState<string | null>(null);
	const { userId } = useParams();
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const dispatch = useAppDispatch();

	const [page, setPage] = useState(0);
	function handleChangePage(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) {
		setPage(newPage);
		dispatch(getUsers({ pages: newPage + 1, limit: rowsPerPage }));
	}

	function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
		setRowsPerPage(+event.target.value);
	}

	return (
		<Paper className="flex lg:w-full  flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">


			<div className="table-responsive ">
				<Table className="simple lg:min-w-full w-full">
					<TableHead>
						<TableRow>
							{columns.map((column, index) => (
								<TableCell key={index}>
									<Typography
										color="text.secondary"
										className="font-semibold text-12 whitespace-nowrap"
									>
										{column}
									</Typography>
								</TableCell>
							))}
							<TableCell style={{ width: '90px' }}></TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{rows.map((row, index) => (
							<TableRow
								key={index}
								className={clsx(' p-2 table-row relative', {
									'shadow-2xl': selectedRow === index,
								})}
								onMouseEnter={() => setSelectedRow(index)}
								onMouseLeave={() => setSelectedRow(null)}
								style={{ height: '60px' }}
							>
								{Object.entries(row).map(([key, value]) => (
									<TableCell key={key} component="th" scope="row">
										<Typography>{value}</Typography>
									</TableCell>
								))}
								<TableCell>
									<div className="flex items-center justify-end" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', '@media (max-width: 600px)': { position: 'absolute', right: '16px', transform: 'translateY(-50%)' } }}>
										{selectedRow === index && (
											<Tooltip title="Edit" placement="bottom">
												<IconButton aria-label="edit">
													<Link to={`/users/form/${row._id}`} className="flex flex-col items-center text-sm">
														<FuseSvgIcon style={{ color: 'black', fontSize: '2px' }}>heroicons-outline:pencil</FuseSvgIcon>
													</Link>
												</IconButton>
											</Tooltip>
										)}
									</div>
								</TableCell>
							</TableRow>
						))}

					</TableBody>
				</Table>

			</div>
			{userData.pagination && (
				<TablePagination
					className="shrink-0 border-t-1"
					component="div"
					count={userData.pagination.total}  // Provide the total number of rows
					rowsPerPage={userData.pagination.limit}
					page={userData.pagination.page - 1}  // Material-UI expects zero-based indexing
					backIconButtonProps={{
						'aria-label': 'Previous Page'
					}}
					nextIconButtonProps={{
						'aria-label': 'Next Page'
					}}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			)}
		</Paper>
	);
}

export default memo(UserRecentTransactiontable);
