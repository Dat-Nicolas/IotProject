import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../common/Button';
import { colors } from '../../theme/colors';

interface ACControllerProps {
  status: 'ON' | 'OFF';
  onToggle: () => void;
}

export const ACController: React.FC<ACControllerProps> = ({ status, onToggle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Power</Text>
      <Text style={styles.status}>{status}</Text>
      <Button label={status === 'ON' ? 'Turn OFF' : 'Turn ON'} onPress={onToggle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    color: colors.light.mutedText,
  },
  status: {
    color: colors.light.text,
    fontSize: 28,
    fontWeight: '700',
  },
});
