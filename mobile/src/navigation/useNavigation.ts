/**
 * Navigation Utilities
 * Helper functions for type-safe navigation throughout the app
 */

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SCREEN_NAMES } from './ROUTES';
import {
  AuthStackParamList,
  DashboardStackParamList,
  ProfileStackParamList,
  MainTabParamList,
} from './types';

/**
 * Navigation type definitions for convenience
 */
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type DashboardNavigationProp = NativeStackNavigationProp<DashboardStackParamList>;
export type ProfileNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;
export type TabNavigationProp = NavigationProp<MainTabParamList>;

/**
 * Hook to use auth navigation
 */
export const useAuthNavigation = () => {
  return useNavigation<AuthNavigationProp>();
};

/**
 * Hook to use dashboard navigation
 */
export const useDashboardNavigation = () => {
  return useNavigation<DashboardNavigationProp>();
};

/**
 * Hook to use profile navigation
 */
export const useProfileNavigation = () => {
  return useNavigation<ProfileNavigationProp>();
};

/**
 * Hook to use tab navigation
 */
export const useTabNavigation = () => {
  return useNavigation<TabNavigationProp>();
};

/**
 * Navigation helper functions
 */
export const navigationHelpers = {
  // Auth navigation
  goToLogin: (navigation: AuthNavigationProp) => {
    navigation.navigate(SCREEN_NAMES.LOGIN);
  },
  goToRegister: (navigation: AuthNavigationProp) => {
    navigation.navigate(SCREEN_NAMES.REGISTER);
  },

  // Dashboard navigation
  goToDashboard: (navigation: DashboardNavigationProp) => {
    navigation.navigate(SCREEN_NAMES.DASHBOARD_HOME);
  },
  goToRoomDetail: (navigation: DashboardNavigationProp, roomId: string) => {
    navigation.navigate(SCREEN_NAMES.ROOM_DETAIL, { roomId });
  },
  goToManualControl: (navigation: DashboardNavigationProp, roomId: string) => {
    navigation.navigate(SCREEN_NAMES.MANUAL_CONTROL, { roomId });
  },
  goToConfiguration: (navigation: DashboardNavigationProp, roomId: string) => {
    navigation.navigate(SCREEN_NAMES.CONFIGURATION, { roomId });
  },
  goToSchedule: (navigation: DashboardNavigationProp, roomId: string) => {
    navigation.navigate(SCREEN_NAMES.SCHEDULE, { roomId });
  },
  goToBrandSelection: (navigation: DashboardNavigationProp) => {
    navigation.navigate(SCREEN_NAMES.BRAND_SELECTION);
  },
  goToActivityHistory: (navigation: DashboardNavigationProp, roomId: string) => {
    navigation.navigate(SCREEN_NAMES.ACTIVITY_HISTORY, { roomId });
  },

  // Tab navigation
  goToDashboardTab: (navigation: TabNavigationProp) => {
    navigation.navigate(SCREEN_NAMES.DASHBOARD_TAB);
  },
  goToProfileTab: (navigation: TabNavigationProp) => {
    navigation.navigate(SCREEN_NAMES.PROFILE_TAB);
  },
};
