import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

// Auth Stack Parameters
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Dashboard Stack Parameters
export type DashboardStackParamList = {
  DashboardHome: undefined;
  RoomDetail: { roomId: string };
  ManualControl: { roomId: string };
  Configuration: { roomId: string };
  Schedule: { roomId: string };
  BrandSelection: undefined;
  ActivityHistory: { roomId: string };
};

// Profile Stack Parameters
export type ProfileStackParamList = {
  ProfileHome: undefined;
};

// Admin Stack Parameters
export type AdminStackParamList = {
  AdminHome: undefined;
  AdminUsers: undefined;
  AdminACs: undefined;
  AdminBrands: undefined;
  AdminSchedules: undefined;
};

// Main Tab Parameters  
export type MainTabParamList = {
  DashboardTab: undefined;
  ProfileTab: undefined;
  AdminTab: undefined;
};

// Root Navigation Parameters (for deep linking)
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

// Screen Props Types for type-safe navigation
export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type DashboardStackScreenProps<T extends keyof DashboardStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<DashboardStackParamList, T>,
  BottomTabScreenProps<MainTabParamList, 'DashboardTab'>
>;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, T>,
  BottomTabScreenProps<MainTabParamList, 'ProfileTab'>
>;

export type AdminStackScreenProps<T extends keyof AdminStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<AdminStackParamList, T>,
  BottomTabScreenProps<MainTabParamList, 'AdminTab'>
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<MainTabParamList, T>;
