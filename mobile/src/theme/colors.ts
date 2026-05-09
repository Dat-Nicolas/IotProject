/**
 * Theme Colors - Designed for Vietnamese Market
 * Modern, accessible colors suitable for users in Vietnam
 */

export const colors = {
  light: {
    // Background - Soft, clean white with slight warmth
    background: '#F8F9FA',
    card: '#FFFFFF',
    
    // Text - Dark colors for excellent readability
    text: '#1A2332',
    mutedText: '#6B7280',
    
    // Primary - Modern blue (popular in Vietnam)
    primary: '#0066CC',
    primaryLight: '#E8F0FF',
    primaryDark: '#0052A3',
    
    // Secondary - Accent green (energy/nature theme)
    secondary: '#10B981',
    secondaryLight: '#D1FAE5',
    
    // Status colors
    success: '#059669',
    danger: '#DC2626',
    warning: '#D97706',
    info: '#0891B2',
    
    // UI Elements
    border: '#E5E7EB',
    divider: '#F3F4F6',
    disabled: '#D1D5DB',
    
    // Temperature colors
    tempCold: '#3B82F6',
    tempWarm: '#F59E0B',
    tempHot: '#EF4444',
  },
  dark: {
    // Background
    background: '#0F172A',
    card: '#1E293B',
    
    // Text
    text: '#F1F5F9',
    mutedText: '#CBD5E1',
    
    // Primary
    primary: '#60A5FA',
    primaryLight: '#1E3A8A',
    primaryDark: '#1E40AF',
    
    // Secondary
    secondary: '#34D399',
    secondaryLight: '#064E3B',
    
    // Status
    success: '#10B981',
    danger: '#F87171',
    warning: '#FBBF24',
    info: '#06B6D4',
    
    // UI Elements
    border: '#334155',
    divider: '#1E293B',
    disabled: '#475569',
    
    // Temperature colors
    tempCold: '#60A5FA',
    tempWarm: '#F59E0B',
    tempHot: '#F87171',
  },
};

export type ThemeMode = keyof typeof colors;
export type ColorScheme = typeof colors.light;
