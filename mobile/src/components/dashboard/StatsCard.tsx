import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from '../common/Card';
import { colors } from '../../theme/colors';

interface StatsCardProps {
  label: string;
  value: string | number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value }) => {
  return (
    <Card style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  label: {
    color: colors.light.mutedText,
    fontSize: 13,
    marginBottom: 6,
  },
  value: {
    color: colors.light.text,
    fontSize: 24,
    fontWeight: '700',
  },
});
