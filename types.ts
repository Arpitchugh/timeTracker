// types.ts

export interface Task {
	id: string;
	name: string;
	selected: boolean;
}

export interface Project {
	id: string;
	name: string;
	tasks: Task[];
}

export interface Activity {
	id: string;
	taskId: string;
	taskName: string;
	timeSpent: string;
	date: Date;
	isSynced: boolean; // Indicates if the activity has been sent to the backend
}
