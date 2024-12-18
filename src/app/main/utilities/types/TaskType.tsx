/**
 * Sub Task Type
 */
type SubTask = {
	id?: string;
	title?: string;
	show?: boolean;
};

/**
 * Task Type
 */
export type TaskType = {
	id: string;
	type?: string;
	title?: string;
    text?:string;
	notes?: string;
	show?: boolean;
	dueDate?: Date;
	priority?: number;
	tags?: string[];
	assignedTo?: null | string;
	subTasks?: SubTask[];
	order?: number;
};

/**
 * Tasks Type
 */
export type TasksType = TaskType[];
