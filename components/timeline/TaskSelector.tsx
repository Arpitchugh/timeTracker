// TaskSelector.tsx

import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	FlatList,
} from 'react-native';
import { Task } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface TaskSelectorProps {
	tasks: Task[];
	onSelectTask: (taskId: string) => void;
	currentTask: Task | null;
}

const TaskSelector: React.FC<TaskSelectorProps> = ({
	tasks,
	onSelectTask,
	currentTask,
}) => {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>Select Task:</Text>
			<FlatList
				data={tasks}
				keyExtractor={item => item.id}
				horizontal
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => {
					const isSelected =
						currentTask?.id === item.id;
					return (
						<TouchableOpacity
							style={[
								styles.taskButton,
								isSelected &&
									styles.selectedTaskButton,
							]}
							onPress={() =>
								onSelectTask(
									item.id
								)
							}
						>
							<Text
								style={[
									styles.taskText,
									isSelected &&
										styles.selectedTaskText,
								]}
							>
								{item.name}
							</Text>
							{isSelected && (
								<Ionicons
									name='checkmark-circle'
									size={
										20
									}
									color='#fff'
									style={
										styles.checkIcon
									}
								/>
							)}
						</TouchableOpacity>
					);
				}}
				contentContainerStyle={styles.tasksContainer}
			/>
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
		flexWrap: 'nowrap',
		gap: 10,
	},
	taskButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 15,
		backgroundColor: '#e9ecef',
		borderRadius: 20,
		marginRight: 10,
		position: 'relative',
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
	checkIcon: {
		marginLeft: 5,
	},
});

export default TaskSelector;
