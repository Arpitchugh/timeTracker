// dataHandler.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity, Project } from './types';

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
	// Example using fetch:
	/*
  try {
    const response = await fetch('https://your-backend-api.com/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activity),
    });
    if (!response.ok) {
      throw new Error('Failed to send activity to backend');
    }
    // If successful, you might want to update isSynced flag
  } catch (error) {
    console.error('Error sending activity to backend:', error);
  }
  */

	// For now, we'll simulate a successful send with a timeout
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

// Save projects to local storage
export const saveProjectsLocally = async (
	projects: Project[]
): Promise<void> => {
	try {
		await AsyncStorage.setItem(
			PROJECTS_STORAGE_KEY,
			JSON.stringify(projects)
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
		return storedProjects ? JSON.parse(storedProjects) : [];
	} catch (error) {
		console.error('Error loading projects:', error);
		return [];
	}
};

// Add a new project
export const addProject = async (newProject: Project): Promise<void> => {
	try {
		const projects = await loadProjects();
		projects.push(newProject);
		await saveProjectsLocally(projects);
	} catch (error) {
		console.error('Error adding new project:', error);
	}
};
