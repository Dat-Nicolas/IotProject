/**
 * Theme Module - Complete Design System
 * Centralized access to all design tokens
 */

import { colors, type ThemeMode, type ColorScheme } from './colors';
import { typography, fontFamily } from './typography';
import { spacing, radius, shadows, opacity } from './spacing';

export { colors, typography, fontFamily, spacing, radius, shadows, opacity };
export type { ThemeMode, ColorScheme };

/**
 * Complete theme object
 */
export const theme = {
  colors,
  typography,
  fontFamily,
  spacing,
  radius,
  shadows,
  opacity,
};

export type Theme = typeof theme;
