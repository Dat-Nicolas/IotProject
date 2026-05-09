import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { store, RootState } from './src/redux/store';
import { I18nProvider } from './src/locales';
import { ThemeProvider } from './src/theme/ThemeContext';

import './src/redux/api/authApi';
import './src/redux/api/roomApi';
import './src/redux/api/acApi';
import './src/redux/api/configApi';
import './src/redux/api/dashboardApi';
import './src/redux/api/logApi';

/**
 * ThemedStatusBar - Tự động đổi style theo theme mode từ Redux
 */
function ThemedStatusBar() {
  const mode = useSelector((state: RootState) => state.theme.mode);
  return <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />;
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <I18nProvider>
          <NavigationContainer>
            <ThemedStatusBar />
            <AppNavigator />
          </NavigationContainer>
        </I18nProvider>
      </ThemeProvider>
    </Provider>
  );
}
