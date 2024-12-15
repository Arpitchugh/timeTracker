import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function TimeTracker() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.activity}>UI/UX Design</Text>
          <Text style={styles.subTask}>Landing page</Text>
        </View>
        <View>
          <Text style={styles.timer}>02:25:27</Text>
          <TouchableOpacity>
            <Text style={styles.stopButton}>STOP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#5DBDB6',
    borderRadius: 15,
    padding: 20,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activity: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  subTask: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  timer: {
    color: 'white',
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'right',
  },
  stopButton: {
    color: 'white',
    marginTop: 5,
  },
});
