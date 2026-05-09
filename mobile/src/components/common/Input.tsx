import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';

interface CustomInputProps extends Omit<TextInputProps, 'placeholderTextColor'> {
  // Custom props can be added here if needed
}

export const Input: React.FC<CustomInputProps> = (props) => {
  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholderTextColor={colors.light.mutedText}
        style={styles.input}
        editable={true}
        scrollEnabled={true}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.card,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  input: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.light.text,
  },
});
