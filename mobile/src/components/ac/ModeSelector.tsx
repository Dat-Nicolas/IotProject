import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

const MODES = ['COOL', 'DRY', 'FAN', 'AUTO'] as const;

type Mode = (typeof MODES)[number];

interface ModeSelectorProps {
  value: Mode;
  onChange: (mode: Mode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      {MODES.map((mode) => (
        <Pressable
          key={mode}
          onPress={() => onChange(mode)}
          style={[styles.modeChip, value === mode && styles.modeChipActive]}
        >
          <Text style={[styles.modeLabel, value === mode && styles.modeLabelActive]}>{mode}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.card,
  },
  modeChipActive: {
    borderColor: colors.light.primary,
    backgroundColor: '#E7F0FF',
  },
  modeLabel: {
    fontSize: 13,
    color: colors.light.text,
    fontWeight: '500',
  },
  modeLabelActive: {
    color: colors.light.primary,
    fontWeight: '700',
  },
});
