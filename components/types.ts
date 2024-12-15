// types.ts

export interface Task {
	id: string;
	name: string;
	description?: string;
	color?: string;
	totalTime: number; // in milliseconds or seconds (depending on your choice)
	dateCreated: Date;
	dateModified: Date;
	subtasks?: Task[]; // recursive definition for nesting
	isCompleted?: boolean;
	tags?: string[];
}

export interface Project {
	id: string;
	name: string;
	description?: string;
	color: string;
	totalTime: number; // sum of all tasks’ times
	dateCreated: Date;
	dateModified: Date;
	tasks: Task[];
	archived?: boolean;
	tags?: string[];
}

export interface Activity {
	id: string;
	projectId: string;
	taskId: string;
	taskName: string;
	timeSpent: string; // string like "2h 5m" or "02:05:00" or simply store as number in seconds
	date: Date;
	isSynced: boolean;

	projectName?: string;
	notes?: string;
}
