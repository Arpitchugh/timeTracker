// ActivityList.tsx

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Activity } from '../types';

interface ActivityListProps {
	activities: Activity[];
}

const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
	const renderItem = ({ item }: { item: Activity }) => (
		<View style={styles.activityItem}>
			<View style={styles.activityHeader}>
				<Text style={styles.activityTaskName}>
					{item.taskName}
				</Text>
				<Text style={styles.activityTime}>
					{item.timeSpent}
				</Text>
			</View>
			<Text style={styles.activityDate}>
				{item.date.toLocaleDateString()} at{' '}
				{item.date.toLocaleTimeString([], {
					hour: '2-digit',
					minute: '2-digit',
				})}
			</Text>
			{!item.isSynced && (
				<Text style={styles.unsynced}>Not Synced</Text>
			)}
		</View>
	);

	return (
		<View style={styles.listContainer}>
			{activities.length === 0 ? (
				<Text style={styles.emptyMessage}>
					No activities tracked yet today.
				</Text>
			) : (
				<FlatList
					data={activities}
					keyExtractor={item => item.id}
					renderItem={renderItem}
					ItemSeparatorComponent={() => (
						<View
							style={styles.separator}
						/>
					)}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	listContainer: {
		paddingVertical: 10,
	},
	activityItem: {
		backgroundColor: '#f1f3f5',
		padding: 15,
		borderRadius: 8,
	},
	activityHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 5,
	},
	activityTaskName: {
		fontSize: 18,
		fontWeight: '600',
		color: '#333',
	},
	activityTime: {
		fontSize: 16,
		color: '#28a745',
		fontWeight: '500',
	},
	activityDate: {
		fontSize: 14,
		color: '#666',
	},
	unsynced: {
		fontSize: 12,
		color: '#dc3545',
		fontStyle: 'italic',
		marginTop: 5,
	},
	emptyMessage: {
		fontSize: 16,
		color: '#666',
		fontStyle: 'italic',
		textAlign: 'center',
		marginTop: 20,
	},
	separator: {
		height: 10,
	},
});

export default ActivityList;
