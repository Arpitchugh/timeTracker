import React from 'react';
import { View } from 'react-native';
import { ActivityItem } from './ActivityItem';

export function ActivityList() {
  return (
    <View>
      <ActivityItem
        title="Reading books"
        subtitle="Walter Isaacson - Steve Jobs"
        duration="02:24:50"
        color="#FF4B6E"
        completed
      />
      <ActivityItem
        title="Work - office"
        duration="06:14:24"
        color="#7B61FF"
      />
      <ActivityItem
        title="Work"
        subtitle="Daily meeting"
        duration="00:58:49"
        color="#7B61FF"
      />
      <ActivityItem
        title="Health"
        duration="00:38:22"
        color="#FFA726"
      />
    </View>
  );
}
