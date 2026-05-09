/**
 * ThemeContext - Cung cấp màu sắc động cho toàn ứng dụng
 * Đọc mode từ Redux store và expose ColorScheme phù hợp
 */
import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { colors, ColorScheme } from './colors';

interface ThemeContextValue {
  isDark: boolean;
  colors: ColorScheme;
  mode: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  colors: colors.light,
  mode: 'light',
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const isDark = mode === 'dark';

  const value: ThemeContextValue = {
    isDark,
    colors: colors[mode],
    mode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Hook để lấy theme hiện tại (màu sắc + mode)
 */
export const useAppTheme = (): ThemeContextValue => useContext(ThemeContext);
