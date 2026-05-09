import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { Card } from '../common/Card';

interface PeopleChartProps {
  points: Array<{ timestamp: string; peopleCount: number }>;
}

export const PeopleChart: React.FC<PeopleChartProps> = ({ points }) => {
  return (
    <Card>
      <Text style={styles.title}>People Trend</Text>
      {points.slice(-6).map((point) => (
        <View key={point.timestamp} style={styles.row}>
          <Text style={styles.time}>{new Date(point.timestamp).toLocaleTimeString()}</Text>
          <Text style={styles.value}>{point.peopleCount}</Text>
        </View>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  time: {
    color: colors.light.mutedText,
    fontSize: 13,
  },
  value: {
    color: colors.light.text,
    fontWeight: '600',
  },
});
