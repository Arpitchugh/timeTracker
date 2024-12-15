// dataHandler.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity, Project, Task } from './types';

// Storage keys
const ACTIVITIES_STORAGE_KEY = 'USER_ACTIVITIES';
const PROJECTS_STORAGE_KEY = 'USER_PROJECTS';

// -------------------- Activities Handling --------------------

// Save a single activity to local storage
export const saveActivityLocally = async (
	activity: Activity
): Promise<void> => {
	try {
		const storedActivities = await AsyncStorage.getItem(
			ACTIVITIES_STORAGE_KEY
		);
		const activities: Activity[] = storedActivities
			? JSON.parse(storedActivities)
			: [];
		activities.push(activity);
		await AsyncStorage.setItem(
			ACTIVITIES_STORAGE_KEY,
			JSON.stringify(activities)
		);
	} catch (error) {
		console.error('Error saving activity locally:', error);
	}
};

// Load all activities from local storage
export const loadActivities = async (): Promise<Activity[]> => {
	try {
		const storedActivities = await AsyncStorage.getItem(
			ACTIVITIES_STORAGE_KEY
		);
		if (storedActivities) {
			const parsedActivities: Activity[] = JSON.parse(
				storedActivities
			).map((activity: Activity) => ({
				...activity,
				date: new Date(activity.date),
			}));
			return parsedActivities;
		}
		return [];
	} catch (error) {
		console.error('Error loading activities:', error);
		return [];
	}
};

// Dummy function to send activity to backend
export const sendActivityToBackend = async (
	activity: Activity
): Promise<void> => {
	// TODO: Implement actual API call to your backend server
	return new Promise(resolve => {
		setTimeout(() => {
			console.log('Activity sent to backend (dummy)');
			resolve();
		}, 1000);
	});
};

// Sync all unsynced activities to the backend
export const syncActivities = async (activities: Activity[]): Promise<void> => {
	const unsyncedActivities = activities.filter(
		activity => !activity.isSynced
	);
	for (const activity of unsyncedActivities) {
		try {
			await sendActivityToBackend(activity);
			// After successful send, mark the activity as synced
			activity.isSynced = true;
		} catch (error) {
			console.error(
				`Failed to sync activity ${activity.id}:`,
				error
			);
		}
	}

	// Save the updated activities back to local storage
	try {
		await AsyncStorage.setItem(
			ACTIVITIES_STORAGE_KEY,
			JSON.stringify(activities)
		);
	} catch (error) {
		console.error('Error updating activities after sync:', error);
	}
};

// -------------------- Projects Handling --------------------

// Helper to ensure a project has default values for new fields if missing
const ensureProjectDefaults = (project: Project): Project => {
	return {
		...project,
		color: project.color ?? '#3CA6A6',
		totalTime: project.totalTime ?? 0,
		dateCreated: project.dateCreated ?? new Date(),
		dateModified: project.dateModified ?? new Date(),
		tasks:
			project.tasks?.map(task => ensureTaskDefaults(task)) ??
			[],
	};
};

// Helper to ensure a task has default values for new fields
const ensureTaskDefaults = (task: Task): Task => {
	return {
		...task,
		totalTime: task.totalTime ?? 0,
		dateCreated: task.dateCreated ?? new Date(),
		dateModified: task.dateModified ?? new Date(),
		subtasks:
			task.subtasks?.map(subtask =>
				ensureTaskDefaults(subtask)
			) ?? [],
	};
};

// Save projects to local storage
export const saveProjectsLocally = async (
	projects: Project[]
): Promise<void> => {
	try {
		// Ensure all projects and tasks have defaults before saving
		const normalizedProjects = projects.map(project =>
			ensureProjectDefaults(project)
		);
		await AsyncStorage.setItem(
			PROJECTS_STORAGE_KEY,
			JSON.stringify(normalizedProjects)
		);
	} catch (error) {
		console.error('Error saving projects locally:', error);
	}
};

// Load projects from local storage
export const loadProjects = async (): Promise<Project[]> => {
	try {
		const storedProjects = await AsyncStorage.getItem(
			PROJECTS_STORAGE_KEY
		);
		if (storedProjects) {
			const parsedProjects: Project[] = JSON.parse(
				storedProjects
			).map((project: Project) => ({
				...project,
				dateCreated: new Date(project.dateCreated),
				dateModified: new Date(project.dateModified),
				tasks:
					project.tasks?.map((t: Task) => ({
						...t,
						dateCreated: new Date(
							t.dateCreated
						),
						dateModified: new Date(
							t.dateModified
						),
						subtasks:
							t.subtasks?.map(st => ({
								...st,
								dateCreated:
									new Date(
										st.dateCreated
									),
								dateModified:
									new Date(
										st.dateModified
									),
							})) ?? [],
					})) ?? [],
			}));
			return parsedProjects;
		}
		return [];
	} catch (error) {
		console.error('Error loading projects:', error);
		return [];
	}
};

// Add a new project
export const addProject = async (newProject: Project): Promise<void> => {
	try {
		let projectToAdd = ensureProjectDefaults(newProject);
		const projects = await loadProjects();
		projects.push(projectToAdd);
		await saveProjectsLocally(projects);
	} catch (error) {
		console.error('Error adding new project:', error);
	}
};

// Add a new top-level task to a project
export const addTaskToProject = async (
	projectId: string,
	newTask: Task
): Promise<void> => {
	try {
		let taskToAdd = ensureTaskDefaults(newTask);
		const projects = await loadProjects();
		const updatedProjects = projects.map(project => {
			if (project.id === projectId) {
				const updatedProject: Project = {
					...project,
					tasks: [...project.tasks, taskToAdd],
					dateModified: new Date(), // update modified date
				};
				return updatedProject;
			}
			return project;
		});
		await saveProjectsLocally(updatedProjects);
	} catch (error) {
		console.error('Error adding task to project:', error);
	}
};

// Add a subtask to a given task (by ids)
export const addSubtaskToTask = async (
	projectId: string,
	taskId: string,
	newSubtask: Task
): Promise<void> => {
	try {
		let subtaskToAdd = ensureTaskDefaults(newSubtask);
		const projects = await loadProjects();

		const updatedProjects = projects.map(project => {
			if (project.id === projectId) {
				// We need to find the parent task and update it
				const updatedTasks = project.tasks.map(task => {
					if (task.id === taskId) {
						const updatedTask: Task = {
							...task,
							subtasks: [
								...(task.subtasks ??
									[]),
								subtaskToAdd,
							],
							dateModified:
								new Date(),
						};
						return updatedTask;
					}
					return task;
				});
				return {
					...project,
					tasks: updatedTasks,
					dateModified: new Date(),
				};
			}
			return project;
		});

		await saveProjectsLocally(updatedProjects);
	} catch (error) {
		console.error('Error adding subtask to task:', error);
	}
};

// Update a task within a project
// This is a generic update function that finds a task (and possibly its subtasks) by id and updates it.
export const updateTask = async (
	projectId: string,
	taskId: string,
	updates: Partial<Task>
): Promise<void> => {
	try {
		const projects = await loadProjects();
		const updatedProjects = projects.map(project => {
			if (project.id === projectId) {
				const updateTaskRecursive = (
					tasks: Task[]
				): Task[] => {
					return tasks.map(task => {
						if (task.id === taskId) {
							const updatedTask: Task =
								{
									...task,
									...updates,
									dateModified:
										new Date(),
								};
							return updatedTask;
						}
						if (
							task.subtasks &&
							task.subtasks.length > 0
						) {
							return {
								...task,
								subtasks: updateTaskRecursive(
									task.subtasks
								),
							};
						}
						return task;
					});
				};
				const updatedTasks = updateTaskRecursive(
					project.tasks
				);
				return {
					...project,
					tasks: updatedTasks,
					dateModified: new Date(),
				};
			}
			return project;
		});

		await saveProjectsLocally(updatedProjects);
	} catch (error) {
		console.error('Error updating task:', error);
	}
};
