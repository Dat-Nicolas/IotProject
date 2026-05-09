/**
 * Spacing Scale - 4px base unit
 * Consistent spacing for layouts and components
 */

export const spacing = {
  xs: 4,      // Very small gaps
  sm: 8,      // Small gaps
  md: 12,     // Medium gaps (default)
  lg: 16,     // Large gaps
  xl: 24,     // Extra large gaps
  xxl: 32,    // 2x extra large
  xxxl: 48,   // 3x extra large
};

/**
 * Border Radius - rounded corners
 */
export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

/**
 * Shadows - depth and elevation
 */
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};

/**
 * Opacity values - for overlays and disabled states
 */
export const opacity = {
  disabled: 0.5,
  hover: 0.8,
  focus: 0.95,
};
