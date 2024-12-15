// TimelineScreen.tsx (Updated)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import TimeTracker from './TimeTracker';
import ActivityList from './ActivityList';
import TaskSelector from './TaskSelector';
import { Project, Task, Activity } from '../types';
import {
	saveActivityLocally,
	loadActivities,
	syncActivities,
} from '../dataHandler';
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo

const selectedProject: Project = {
	id: 'project-1',
	name: 'ui/ux',
	tasks: [
		{ id: 'task-1', name: 'Landing Page', selected: true },
		{ id: 'task-2', name: 'User Flow', selected: false },
		// Add more tasks as needed
	],
};

const TimelineScreen: React.FC = () => {
	const [project] = useState<Project>(selectedProject);
	const [activities, setActivities] = useState<Activity[]>([]);
	const [currentTask, setCurrentTask] = useState<Task | null>(
		project.tasks.find(task => task.selected) || null
	);
	const [isConnected, setIsConnected] = useState<boolean>(true);

	// Load activities from local storage when the component mounts
	useEffect(() => {
		const fetchActivities = async () => {
			const storedActivities = await loadActivities();
			setActivities(storedActivities);
		};
		fetchActivities();
	}, []);

	// Listen for network status changes
	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener(state => {
			setIsConnected(state.isConnected ?? false);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	// Sync activities to backend when the network becomes available
	useEffect(() => {
		const synchronize = async () => {
			if (isConnected) {
				await syncActivities(activities);
				Alert.alert(
					'Sync Complete',
					'All activities have been synced.'
				);
			}
		};
		synchronize();
	}, [isConnected, activities]);

	// Handler to add a new completed activity when the timer stops
	const handleTimerStop = async (taskId: string, elapsedTime: string) => {
		const task = project.tasks.find(t => t.id === taskId);
		if (task) {
			const newActivity: Activity = {
				id: Date.now().toString(),
				taskId: task.id,
				taskName: task.name,
				timeSpent: elapsedTime,
				date: new Date(),
				isSynced: false, // Initially not synced
			};
			const updatedActivities = [newActivity, ...activities];
			setActivities(updatedActivities);

			// Save the new activity locally
			await saveActivityLocally(newActivity);

			if (isConnected) {
				try {
					await syncActivities(updatedActivities);
					Alert.alert(
						'Timer Stopped',
						`Logged ${elapsedTime} for ${task.name} and synced.`
					);
				} catch (error) {
					Alert.alert(
						'Timer Stopped',
						`Logged ${elapsedTime} for ${task.name}. Failed to sync.`
					);
				}
			} else {
				Alert.alert(
					'Timer Stopped',
					`Logged ${elapsedTime} for ${task.name}. Will sync when online.`
				);
			}
		}
	};

	const handleSelectTask = (taskId: string) => {
		const updatedTasks = project.tasks.map(task =>
			task.id === taskId
				? { ...task, selected: true }
				: { ...task, selected: false }
		);
		const selected =
			updatedTasks.find(task => task.selected) || null;
		setCurrentTask(selected);
		// If managing project state globally, update the project state here
	};

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.title}>
				Project: {project.name}
			</Text>
			<TaskSelector
				tasks={project.tasks}
				onSelectTask={handleSelectTask}
			/>

			<Text style={styles.subtitle}>
				Currently Selected Task:{' '}
				{currentTask ? currentTask.name : 'None'}
			</Text>

			<TimeTracker
				currentTask={currentTask}
				onStop={handleTimerStop}
			/>

			<Text style={styles.sectionTitle}>Today</Text>
			<ActivityList activities={activities} />
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		paddingTop: 60,
		paddingHorizontal: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 5,
		color: '#333',
	},
	subtitle: {
		fontSize: 18,
		color: '#666',
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: '500',
		marginTop: 20,
		marginBottom: 15,
		color: '#333',
	},
});

export default TimelineScreen;
