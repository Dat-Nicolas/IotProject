import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';

interface StatusBadgeProps {
  status: 'ON' | 'OFF' | 'AUTO' | 'MANUAL';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isOn = status === 'ON' || status === 'AUTO';

  return (
    <View style={[styles.badge, { backgroundColor: isOn ? colors.light.secondary : colors.light.border }]}>
      <Text style={[styles.label, { color: isOn ? '#fff' : colors.light.text }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.xl,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '600',
    fontSize: 12,
  },
});
