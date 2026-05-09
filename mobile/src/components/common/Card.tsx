import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useAppTheme } from '../../theme/ThemeContext';
import { radius, spacing } from '../../theme/spacing';

export const Card: React.FC<ViewProps> = ({ style, children, ...rest }) => {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
});

