import { useAppSelector } from 'app/store';
import { useNavigate } from "react-router-dom";

import { getRecords, selectRecords } from '../store/dealDataSlice';

import { TableConfig, TableEvent } from 'app/shared-components/data-table-widget/types/dataTypes';
import TablePageWidget from 'app/shared-components/TablePageWidget';
import { Deal } from '../types/dataTypes';
import { useAppDispatch } from 'app/store';

import { openCardDialog } from '../../scrumboard/store/cardSlice';
import { getBoard } from '../../scrumboard/store/boardSlice';
import { getCards } from '../../scrumboard/store/cardsSlice';
import { getLists } from '../../scrumboard/store/listsSlice';
import { getLabels } from '../../scrumboard/store/labelsSlice';
import BoardCardDialog from '../../scrumboard/board/dialogs/card/BoardCardDialog';


/**
 * The TablePage.
 */
function DealsTablePage() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const data = useAppSelector(selectRecords);
	
	const title = 'Requests';
	const tableConfig: TableConfig = {
		selection: 'none',
		rowActions: [
			// {'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons-outline:pencil'},
		],
		columns: [
			{name: 'transaction_type', title: 'Type', type: 'text', sort: false},
			{name: 'stock', title: 'Stock', type: 'text', sort: false},
			{name: 'term_table', title: 'Terms', type: 'text', sort: false},
			{name: 'status', title: 'Stage', type: 'text', sort: false},
			{name: 'createdAt', title: 'Datetime', type: 'datetime', sort: false, width: 'w-50'},
		],
		dataSource: data,
		onSomeEvent: onTableEvent,
		// actions: this.actions,
		// events: this.events,
		perPage: 30,
		showAdd: true,
	}

	async function openDealDialog(row: any) {
		const boardId = row.boardId;

		await dispatch(getBoard(boardId));
		// await dispatch(getCards(boardId));
		// await dispatch(getLists(boardId));
		// await dispatch(getLabels(boardId));
	
		dispatch(openCardDialog(row));
	}

	function onTableEvent(event: TableEvent) {
		console.log('onTableEvent', event);
		
		if (event.action == 'create') {
			// navigate(`/agents/form`);
		}

		if (event.event == 'rowClick') {
			const row = event.params.row as Deal;

			openDealDialog(row)
						
		}
		
		if (event.event == 'rowAction') {

		}
	}

	return (
		<>
			<TablePageWidget title={title} tableConfig={tableConfig} getRecords={getRecords}  />
			<BoardCardDialog />
		</>
	);
}

export default DealsTablePage;
