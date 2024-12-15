// TimelineScreen.tsx (Updated)

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import TimeTracker from './TimeTracker';
import ActivityList from './ActivityList';
import TaskSelector from './TaskSelector'; // Import the TaskSelector

// ... (interfaces and selectedProject remain the same)

// Define interfaces for Project and Task
interface Task {
	id: string;
	name: string;
	selected: boolean;
}

interface Project {
	id: string;
	name: string;
	tasks: Task[];
}

interface Activity {
	id: string;
	taskId: string;
	taskName: string;
	timeSpent: string;
	date: Date;
}

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

	const handleTimerStop = (taskId: string, elapsedTime: string) => {
		const task = project.tasks.find(t => t.id === taskId);
		if (task) {
			const newActivity: Activity = {
				id: Date.now().toString(),
				taskId: task.id,
				taskName: task.name,
				timeSpent: elapsedTime,
				date: new Date(),
			};
			setActivities(prev => [newActivity, ...prev]);
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
		// Optionally, update the project state if it's managed globally
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

// ... (styles remain the same)

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
