// TimelineScreen.tsx

import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Alert,
	Modal,
	TouchableOpacity,
	TextInput,
	FlatList,
} from 'react-native';
import TimeTracker from './TimeTracker';
import ActivityList from './ActivityList';
import TaskSelector from './TaskSelector';
import { Project, Task, Activity } from '../types';
import {
	saveActivityLocally,
	loadActivities,
	syncActivities,
	loadProjects,
	saveProjectsLocally,
	addProject,
} from '../dataHandler';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed

const initialProject: Project = {
	id: 'project-1',
	name: 'ui/ux',
	tasks: [
		{ id: 'task-1', name: 'Landing Page', selected: true },
		{ id: 'task-2', name: 'User Flow', selected: false },
		// Add more tasks as needed
	],
};

const TimelineScreen: React.FC = () => {
	const [projects, setProjects] = useState<Project[]>([]);
	const [selectedProject, setSelectedProject] = useState<Project | null>(
		null
	);
	const [activities, setActivities] = useState<Activity[]>([]);
	const [currentTask, setCurrentTask] = useState<Task | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(true);
	const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
	const [newProjectName, setNewProjectName] = useState<string>('');

	// Load projects and activities from local storage when the component mounts
	useEffect(() => {
		const fetchData = async () => {
			const storedProjects = await loadProjects();
			if (storedProjects.length === 0) {
				// If no projects are stored, add the initial project
				await addProject(initialProject);
				setProjects([initialProject]);
				setSelectedProject(initialProject);
			} else {
				setProjects(storedProjects);
				setSelectedProject(storedProjects[0]);
			}

			const storedActivities = await loadActivities();
			setActivities(storedActivities);
		};
		fetchData();
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

	// Sync activities to backend when the network becomes available or activities change
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
		if (!selectedProject) {
			Alert.alert(
				'No Project Selected',
				'Please select a project before tracking.'
			);
			return;
		}

		const task = selectedProject.tasks.find(t => t.id === taskId);
		if (task) {
			const newActivity: Activity = {
				id: Date.now().toString(),
				projectId: selectedProject.id,
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
		if (!selectedProject) return;

		const updatedTasks = selectedProject.tasks.map(task =>
			task.id === taskId
				? { ...task, selected: true }
				: { ...task, selected: false }
		);
		const selected =
			updatedTasks.find(task => task.selected) || null;
		setCurrentTask(selected);

		// Update the selected project in state and storage
		const updatedProject: Project = {
			...selectedProject,
			tasks: updatedTasks,
		};
		const updatedProjects = projects.map(proj =>
			proj.id === updatedProject.id ? updatedProject : proj
		);
		setProjects(updatedProjects);
		saveProjectsLocally(updatedProjects);
	};

	// Handler to add a new project
	const handleAddProject = async () => {
		if (newProjectName.trim() === '') {
			Alert.alert(
				'Invalid Name',
				'Project name cannot be empty.'
			);
			return;
		}

		// Check if project with same name exists
		const existingProject = projects.find(
			proj =>
				proj.name.toLowerCase() ===
				newProjectName.trim().toLowerCase()
		);
		if (existingProject) {
			Alert.alert(
				'Duplicate Project',
				'A project with this name already exists.'
			);
			return;
		}

		const newProject: Project = {
			id: `project-${Date.now()}`,
			name: newProjectName.trim(),
			tasks: [], // Initialize with empty tasks or provide a way to add tasks
		};

		await addProject(newProject);
		const updatedProjects = [...projects, newProject];
		setProjects(updatedProjects);
		setSelectedProject(newProject);
		saveProjectsLocally(updatedProjects);

		setNewProjectName('');
		setIsDrawerVisible(false);
		Alert.alert(
			'Project Added',
			`Project "${newProject.name}" has been added.`
		);
	};

	// Handler to select a project from the list
	const handleSelectProject = (project: Project) => {
		setSelectedProject(project);

		// Update currentTask based on the new selected project
		const selectedTask =
			project.tasks.find(task => task.selected) || null;
		setCurrentTask(selectedTask);
		setIsDrawerVisible(false);
	};

	return (
		<View style={styles.container}>
			{/* Add Project Button */}
			<TouchableOpacity
				style={styles.addButton}
				onPress={() => setIsDrawerVisible(true)}
			>
				<Ionicons
					name='add-circle-outline'
					size={48}
					color='#28a745'
				/>
			</TouchableOpacity>

			<ScrollView
				contentContainerStyle={styles.scrollContainer}
			>
				<Text style={styles.title}>
					Project:{' '}
					{selectedProject
						? selectedProject.name
						: 'None'}
				</Text>

				{selectedProject && (
					<TaskSelector
						tasks={selectedProject.tasks}
						onSelectTask={handleSelectTask}
					/>
				)}

				<Text style={styles.subtitle}>
					Currently Selected Task:{' '}
					{currentTask
						? currentTask.name
						: 'None'}
				</Text>

				<TimeTracker
					currentTask={currentTask}
					onStop={handleTimerStop}
				/>

				<Text style={styles.sectionTitle}>Today</Text>
				<ActivityList activities={activities} />
			</ScrollView>

			{/* Add Project Drawer (Modal) */}
			<Modal
				visible={isDrawerVisible}
				animationType='slide'
				transparent={true}
				onRequestClose={() => setIsDrawerVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<Text style={styles.modalTitle}>
							Projects
						</Text>

						{/* List of Projects */}
						<FlatList
							data={projects}
							keyExtractor={item =>
								item.id
							}
							renderItem={({
								item,
							}) => (
								<TouchableOpacity
									style={[
										styles.projectItem,
										selectedProject?.id ===
											item.id &&
											styles.selectedProjectItem,
									]}
									onPress={() =>
										handleSelectProject(
											item
										)
									}
								>
									<Text
										style={[
											styles.projectText,
											selectedProject?.id ===
												item.id &&
												styles.selectedProjectText,
										]}
									>
										{
											item.name
										}
									</Text>
								</TouchableOpacity>
							)}
							ListEmptyComponent={
								<Text
									style={
										styles.emptyProjectText
									}
								>
									No
									projects
									available.
								</Text>
							}
							style={
								styles.projectList
							}
						/>

						{/* Add New Project */}
						<View
							style={
								styles.newProjectContainer
							}
						>
							<TextInput
								style={
									styles.input
								}
								placeholder='New Project Name'
								value={
									newProjectName
								}
								onChangeText={
									setNewProjectName
								}
							/>
							<TouchableOpacity
								style={
									styles.saveButton
								}
								onPress={
									handleAddProject
								}
							>
								<Text
									style={
										styles.saveButtonText
									}
								>
									Save
								</Text>
							</TouchableOpacity>
						</View>

						{/* Close Button */}
						<TouchableOpacity
							style={
								styles.closeButton
							}
							onPress={() =>
								setIsDrawerVisible(
									false
								)
							}
						>
							<Ionicons
								name='close'
								size={30}
								color='#333'
							/>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	scrollContainer: {
		paddingTop: 60,
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
	addButton: {
		position: 'absolute',
		top: 20,
		right: 20,
		zIndex: 10,
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
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'flex-end',
	},
	modalContainer: {
		backgroundColor: '#fff',
		padding: 20,
		borderTopRightRadius: 12,
		borderTopLeftRadius: 12,
		maxHeight: '80%',
	},
	modalTitle: {
		fontSize: 22,
		fontWeight: '600',
		marginBottom: 15,
		color: '#333',
		textAlign: 'center',
	},
	projectList: {
		marginBottom: 20,
	},
	projectItem: {
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 8,
		backgroundColor: '#f8f9fa',
		marginBottom: 10,
	},
	selectedProjectItem: {
		backgroundColor: '#28a745',
	},
	projectText: {
		fontSize: 18,
		color: '#333',
	},
	selectedProjectText: {
		color: '#fff',
		fontWeight: '600',
	},
	emptyProjectText: {
		fontSize: 16,
		color: '#666',
		textAlign: 'center',
		marginTop: 10,
	},
	newProjectContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	input: {
		flex: 1,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 15,
		paddingVertical: 8,
		marginRight: 10,
		fontSize: 16,
	},
	saveButton: {
		backgroundColor: '#28a745',
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 8,
	},
	saveButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	closeButton: {
		position: 'absolute',
		top: 15,
		right: 15,
	},
});

export default TimelineScreen;