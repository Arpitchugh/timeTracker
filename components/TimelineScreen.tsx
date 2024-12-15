import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TimeTracker } from './TimeTracker';
import { ActivityList } from './ActivityList';

export function TimelineScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timeline</Text>
      <Text style={styles.subtitle}>Tracking</Text>
      <TimeTracker />
      <Text style={styles.sectionTitle}>Today</Text>
      <ActivityList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 15,
  },
});
