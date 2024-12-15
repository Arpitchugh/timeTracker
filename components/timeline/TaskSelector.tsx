// TaskSelector.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types';

interface TaskSelectorProps {
	tasks: Task[];
	onSelectTask: (taskId: string) => void;
}

const TaskSelector: React.FC<TaskSelectorProps> = ({ tasks, onSelectTask }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>Select Task:</Text>
			<View style={styles.tasksContainer}>
				{tasks.map(task => (
					<TouchableOpacity
						key={task.id}
						style={[
							styles.taskButton,
							task.selected &&
								styles.selectedTaskButton,
						]}
						onPress={() =>
							onSelectTask(task.id)
						}
					>
						<Text
							style={[
								styles.taskText,
								task.selected &&
									styles.selectedTaskText,
							]}
						>
							{task.name}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginBottom: 20,
	},
	label: {
		fontSize: 18,
		fontWeight: '500',
		color: '#333',
		marginBottom: 10,
	},
	tasksContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
	},
	taskButton: {
		paddingVertical: 8,
		paddingHorizontal: 15,
		backgroundColor: '#e9ecef',
		borderRadius: 20,
	},
	selectedTaskButton: {
		backgroundColor: '#28a745',
	},
	taskText: {
		fontSize: 16,
		color: '#333',
	},
	selectedTaskText: {
		color: '#fff',
		fontWeight: '600',
	},
});

export default TaskSelector;
