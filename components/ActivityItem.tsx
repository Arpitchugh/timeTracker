import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ActivityItemProps = {
  title: string;
  subtitle?: string;
  duration: string;
  color: string;
  completed?: boolean;
};

export function ActivityItem({ title, subtitle, duration, color, completed }: ActivityItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.durationContainer}>
        <Text style={styles.duration}>{duration}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    color: '#666',
    marginTop: 2,
  },
  durationContainer: {
    backgroundColor: '#F0F0F0',
    padding: 8,
    borderRadius: 20,
  },
  duration: {
    color: '#666',
  },
});
