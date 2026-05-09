import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { clamp } from '../../utils/helpers';
import { colors } from '../../theme/colors';

interface TemperatureDialProps {
  value: number;
  onChange: (next: number) => void;
}

export const TemperatureDial: React.FC<TemperatureDialProps> = ({ value, onChange }) => {
  const decrease = () => onChange(clamp(value - 1, 16, 32));
  const increase = () => onChange(clamp(value + 1, 16, 32));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Temperature</Text>
      <View style={styles.row}>
        <Pressable style={styles.button} onPress={decrease}>
          <Text style={styles.buttonLabel}>-</Text>
        </Pressable>
        <Text style={styles.value}>{value}°C</Text>
        <Pressable style={styles.button} onPress={increase}>
          <Text style={styles.buttonLabel}>+</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    color: colors.light.mutedText,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  value: {
    color: colors.light.text,
    fontSize: 22,
    fontWeight: '700',
  },
});
