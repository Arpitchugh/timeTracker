// types.ts

export interface Task {
	id: string;
	name: string;
	selected: boolean;
	color: string;
	subTaskName: string;
}

export interface Project {
	id: string;
	name: string;
	tasks: Task[];
}

export interface Activity {
	id: string;
	projectId: string;
	taskId: string;
	taskName: string;
	timeSpent: string;
	date: Date;
	isSynced: boolean;
}
