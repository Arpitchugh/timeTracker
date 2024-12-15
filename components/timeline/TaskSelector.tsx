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
import { Ionicons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed

interface TaskSelectorProps {
	tasks: Task[];
	onSelectTask: (taskId: string) => void;
}

const TaskSelector: React.FC<TaskSelectorProps> = ({ tasks, onSelectTask }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>Select Task:</Text>
			<FlatList
				data={tasks}
				keyExtractor={item => item.id}
				horizontal
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={[
							styles.taskButton,
							item.selected &&
								styles.selectedTaskButton,
						]}
						onPress={() =>
							onSelectTask(item.id)
						}
					>
						<Text
							style={[
								styles.taskText,
								item.selected &&
									styles.selectedTaskText,
							]}
						>
							{item.name}
						</Text>
						{item.selected && (
							<Ionicons
								name='checkmark-circle'
								size={20}
								color='#fff'
								style={
									styles.checkIcon
								}
							/>
						)}
					</TouchableOpacity>
				)}
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
