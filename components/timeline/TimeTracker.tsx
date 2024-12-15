// TimeTracker.tsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Task } from '../types';

interface TimeTrackerProps {
	currentTask: Task | null;
	onStop: (taskId: string, elapsedTime: string) => void;
}

const TimeTracker: React.FC<TimeTrackerProps> = ({ currentTask, onStop }) => {
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [elapsedTime, setElapsedTime] = useState<number>(0); // in milliseconds
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (isRunning) {
			const start = Date.now() - elapsedTime;
			intervalRef.current = setInterval(() => {
				setElapsedTime(Date.now() - start);
			}, 1000);
		} else if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isRunning, elapsedTime]);

	const handleStart = () => {
		if (!currentTask) {
			return;
		}
		setIsRunning(true);
	};

	const handleStop = () => {
		setIsRunning(false);
		onStop(currentTask!.id, formatTime(elapsedTime));
		setElapsedTime(0);
	};

	const formatTime = (ms: number): string => {
		const totalSeconds = Math.floor(ms / 1000);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;
		return `${
			hours > 0 ? hours + 'h ' : ''
		}${minutes}m ${seconds}s`;
	};

	return (
		<View style={styles.container}>
			{currentTask ? (
				<>
					<Text style={styles.taskName}>
						Tracking: {currentTask.name}
					</Text>
					<Text style={styles.timer}>
						{formatTime(elapsedTime)}
					</Text>
					<View style={styles.buttons}>
						{!isRunning ? (
							<Button
								title='Start'
								onPress={
									handleStart
								}
								color='#28a745'
							/>
						) : (
							<Button
								title='Stop'
								onPress={
									handleStop
								}
								color='#dc3545'
							/>
						)}
					</View>
				</>
			) : (
				<Text style={styles.noTaskMessage}>
					Please select at least one task to start
					tracking.
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#f8f9fa',
		padding: 20,
		borderRadius: 8,
		marginBottom: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	taskName: {
		fontSize: 20,
		fontWeight: '600',
		marginBottom: 10,
		color: '#333',
	},
	timer: {
		fontSize: 32,
		fontWeight: 'bold',
		marginBottom: 20,
		color: '#000',
		textAlign: 'center',
	},
	noTaskMessage: {
		fontSize: 16,
		fontStyle: 'italic',
		color: '#666',
		textAlign: 'center',
	},
	buttons: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
});

export default TimeTracker;
