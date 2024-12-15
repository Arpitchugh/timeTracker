import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Task } from '../types';

interface TimeTrackerProps {
	currentTask: Task | null;
	onStop: (taskId: string, elapsedTime: string) => Promise<void>;
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
		if (!currentTask) return;
		setIsRunning(true);
	};

	const handleStop = async () => {
		if (!currentTask) return;
		setIsRunning(false);
		await onStop(currentTask.id, formatTime(elapsedTime));
		setElapsedTime(0);
	};

	// Format time as HH:MM:SS
	const formatTime = (ms: number): string => {
		const totalSeconds = Math.floor(ms / 1000);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		const hh = hours.toString().padStart(2, '0');
		const mm = minutes.toString().padStart(2, '0');
		const ss = seconds.toString().padStart(2, '0');

		return `${hh}:${mm}:${ss}`;
	};

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor:
						currentTask?.color || '#3CA6A6',
				},
			]}
		>
			{currentTask ? (
				<>
					{/* Top row: Task name and Timer */}
					<View style={styles.topRow}>
						<Text style={styles.taskName}>
							{currentTask.name}
						</Text>
						<View
							style={
								styles.timerContainer
							}
						>
							<Text
								style={
									styles.timerText
								}
							>
								{formatTime(
									elapsedTime
								)}
							</Text>
							<View
								style={
									styles.timerLabels
								}
							>
								<Text
									style={
										styles.timerLabel
									}
								>
									HRS
								</Text>
								<Text
									style={
										styles.timerLabel
									}
								>
									MIN
								</Text>
								<Text
									style={
										styles.timerLabel
									}
								>
									SEC
								</Text>
							</View>
						</View>
					</View>

					{/* Middle row: Bullet point and subtask (example: "Landing page") */}
					<View style={styles.middleRow}>
						<View style={styles.bulletRow}>
							<View
								style={
									styles.bullet
								}
							/>
							<Text
								style={
									styles.subTaskName
								}
							>
								{currentTask.subTaskName ??
									'Landing page'}
							</Text>
						</View>

						<View
							style={
								styles.buttonContainer
							}
						>
							{isRunning ? (
								<Button
									title='STOP'
									onPress={
										handleStop
									}
									color='#fff'
								/>
							) : (
								<Button
									title='START'
									onPress={
										handleStart
									}
									color='#fff'
								/>
							)}
						</View>
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
		borderRadius: 8,
		padding: 15,
		marginBottom: 20,
		// Optional shadow for iOS / elevation for Android
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	topRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	taskName: {
		fontSize: 20,
		fontWeight: '600',
		color: '#fff',
	},
	timerContainer: {
		alignItems: 'flex-end',
	},
	timerText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#fff',
	},
	timerLabels: {
		flexDirection: 'row',
		marginTop: 2,
	},
	timerLabel: {
		marginHorizontal: 5,
		fontSize: 10,
		color: '#fff',
	},

	middleRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	bulletRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	bullet: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: '#fff',
		marginRight: 8,
	},
	subTaskName: {
		fontSize: 16,
		color: '#fff',
	},

	buttonContainer: {
		borderRadius: 4,
		overflow: 'hidden',
		backgroundColor: 'rgba(255, 255, 255, 0.3)',
	},

	noTaskMessage: {
		fontSize: 16,
		fontStyle: 'italic',
		color: '#666',
		textAlign: 'center',
	},
});

export default TimeTracker;
