import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Card } from '../components/common/Card';
import { Header } from '../components/common/Header';

export default function ScheduleScreen() {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Header title="Schedule" subtitle="Configure weekly operating windows" />
      <Card>
        {days.map((day) => (
          <Text key={day} style={styles.row}>
            {day}: 08:00 - 18:00
          </Text>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  content: {
    padding: 16,
  },
  row: {
    paddingVertical: 8,
    color: '#0A1A2A',
    fontSize: 14,
  },
});
