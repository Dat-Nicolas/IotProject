import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import RoomDetailScreen from '../screens/RoomDetailScreen';
import ManualControlScreen from '../screens/ManualControlScreen';
import ConfigurationScreen from '../screens/ConfigurationScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import BrandSelectionScreen from '../screens/BrandSelectionScreen';
import ActivityHistoryScreen from '../screens/ActivityHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Admin screens
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import UsersManagementScreen from '../screens/admin/UsersManagementScreen';
import ACManagementScreen from '../screens/admin/ACManagementScreen';
import BrandsManagementScreen from '../screens/admin/BrandsManagementScreen';
import SchedulesManagementScreen from '../screens/admin/SchedulesManagementScreen';

import { DashboardStackParamList, ProfileStackParamList, AdminStackParamList, MainTabParamList } from './types';
import { SCREEN_NAMES } from './ROUTES';

const Tab = createBottomTabNavigator<MainTabParamList>();
const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();

/**
 * Dashboard Stack Navigator
 * Contains all dashboard-related screens
 */
function DashboardStackNavigator() {
  return (
    <DashboardStack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <DashboardStack.Screen
        name={SCREEN_NAMES.DASHBOARD_HOME}
        component={DashboardScreen}
        options={{
          headerShown: false,
          title: 'Dashboard',
        }}
      />
      <DashboardStack.Screen
        name={SCREEN_NAMES.ROOM_DETAIL}
        component={RoomDetailScreen}
        options={{
          title: 'Room Detail',
          headerShown: true,
        }}
      />
      <DashboardStack.Screen
        name={SCREEN_NAMES.MANUAL_CONTROL}
        component={ManualControlScreen}
        options={{
          title: 'Manual Control',
          headerShown: true,
        }}
      />
      <DashboardStack.Screen
        name={SCREEN_NAMES.CONFIGURATION}
        component={ConfigurationScreen}
        options={{
          title: 'Configuration',
          headerShown: true,
        }}
      />
      <DashboardStack.Screen
        name={SCREEN_NAMES.SCHEDULE}
        component={ScheduleScreen}
        options={{
          title: 'Schedule',
          headerShown: true,
        }}
      />
      <DashboardStack.Screen
        name={SCREEN_NAMES.BRAND_SELECTION}
        component={BrandSelectionScreen}
        options={{
          title: 'Brand Selection',
          headerShown: true,
        }}
      />
      <DashboardStack.Screen
        name={SCREEN_NAMES.ACTIVITY_HISTORY}
        component={ActivityHistoryScreen}
        options={{
          title: 'Activity History',
          headerShown: true,
        }}
      />
    </DashboardStack.Navigator>
  );
}

/**
 * Profile Stack Navigator
 * Contains all profile-related screens
 */
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <ProfileStack.Screen
        name={SCREEN_NAMES.PROFILE_HOME}
        component={ProfileScreen}
        options={{
          headerShown: false,
          title: 'Profile',
        }}
      />
    </ProfileStack.Navigator>
  );
}

/**
 * Admin Stack Navigator
 * Contains all admin-related screens (only for ADMIN role)
 */
function AdminStackNavigator() {
  return (
    <AdminStack.Navigator screenOptions={{ headerShown: false }}>
      <AdminStack.Screen name={SCREEN_NAMES.ADMIN_HOME} component={AdminHomeScreen} />
      <AdminStack.Screen name={SCREEN_NAMES.ADMIN_USERS} component={UsersManagementScreen} />
      <AdminStack.Screen name={SCREEN_NAMES.ADMIN_ACS} component={ACManagementScreen} />
      <AdminStack.Screen name={SCREEN_NAMES.ADMIN_BRANDS} component={BrandsManagementScreen} />
      <AdminStack.Screen name={SCREEN_NAMES.ADMIN_SCHEDULES} component={SchedulesManagementScreen} />
    </AdminStack.Navigator>
  );
}

import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

/**
 * Main Tab Navigator
 * Root navigation with bottom tabs
 */
export default function MainNavigator() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarIcon: ({ color, size }) => {
          let icon = '🏠';
          if (route.name === SCREEN_NAMES.DASHBOARD_TAB) icon = '🏠';
          else if (route.name === SCREEN_NAMES.PROFILE_TAB) icon = '👤';
          else if (route.name === SCREEN_NAMES.ADMIN_TAB) icon = '⚙️';
          return <Text style={{ fontSize: size - 4, color }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen
        name={SCREEN_NAMES.DASHBOARD_TAB}
        component={DashboardStackNavigator}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name={SCREEN_NAMES.PROFILE_TAB}
        component={ProfileStackNavigator}
        options={{ title: 'Profile' }}
      />
      {isAdmin && (
        <Tab.Screen
          name={SCREEN_NAMES.ADMIN_TAB}
          component={AdminStackNavigator}
          options={{ title: 'Admin' }}
        />
      )}
    </Tab.Navigator>
  );
}
