
export type TableDataResponse = {
    pages: number,
    count: number,
    records: any[]
}

export type TableAction = {
    action: 'none' | 'loadData',
    params?: {}
}

export type TableEvent = {
    event: 'none' | 'loadData' | 'rowSelection' | 'rowClick' | 'rowAction';
    action?: string;
    params?: any;
}

export type TableColumn = {
    name: string,
    title: string,
    sort?: boolean,
    type: 'text' | 'number' | 'currency' | 'boolean' | 'date' | 'datetime' | 'time' | 'chip' | 'active' | 'link' | 'progressbar',
    color?: (item: {}) => string,
    width?: string,
}

export type RowAction = {
    tooltip?: string,
    title?: string,
    icon?: string,
    action: string,
    bgColor?: string;
    color?: string;
    condition?: (row: any, action: string) => boolean;
}

export type TableConfig = {
    rowActions?: RowAction[],
    selection?: 'none' | 'single' | 'multiple',
    columns: TableColumn[],
	dataSource: any; // define type
    onSomeEvent?(event: TableEvent): void; //  event emitted (out)
    onAction?(action: TableAction): void; // action received (in)
    perPage?: number,
    showAdd?: boolean
}
