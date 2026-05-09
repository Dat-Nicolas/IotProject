import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { setThemeMode, toggleThemeMode } from '../redux/slices/themeSlice';
import { useAppTheme } from '../theme/ThemeContext';

/**
 * useTheme - Hook kết hợp ThemeContext (colors, mode, isDark) + Redux actions
 */
export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const themeContext = useAppTheme();

  return {
    ...themeContext,
    setThemeMode: (next: 'light' | 'dark') => dispatch(setThemeMode(next)),
    toggleThemeMode: () => dispatch(toggleThemeMode()),
  };
};
