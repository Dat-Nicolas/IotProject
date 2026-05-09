/**
 * Centralized Route Constants
 * Ensures consistent URL naming and navigation throughout the app
 */

// Auth Routes
export const AUTH_ROUTES = {
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
} as const;

// Dashboard Routes
export const DASHBOARD_ROUTES = {
  HOME: 'dashboard/home',
  ROOM_DETAIL: 'dashboard/room/:roomId',
  MANUAL_CONTROL: 'dashboard/control/:roomId',
  CONFIGURATION: 'dashboard/config/:roomId',
  SCHEDULE: 'dashboard/schedule/:roomId',
  ACTIVITY_HISTORY: 'dashboard/activity/:roomId',
  BRAND_SELECTION: 'dashboard/brands',
} as const;

// Profile Routes
export const PROFILE_ROUTES = {
  HOME: 'profile/home',
} as const;

// Admin Routes
export const ADMIN_ROUTES = {
  HOME: 'admin/home',
  USERS: 'admin/users',
  ACS: 'admin/acs',
  BRANDS: 'admin/brands',
  SCHEDULES: 'admin/schedules',
} as const;

// Tab Routes (Bottom Navigation)
export const TAB_ROUTES = {
  DASHBOARD: 'dashboard',
  PROFILE: 'profile',
  ADMIN: 'admin',
} as const;

// Stack Names
export const STACK_NAMES = {
  AUTH: 'AuthStack',
  MAIN: 'MainStack',
  DASHBOARD: 'DashboardStack',
  PROFILE: 'ProfileStack',
  ADMIN: 'AdminStack',
} as const;

// Screen Names (for navigation)
export const SCREEN_NAMES = {
  // Auth
  LOGIN: 'Login',
  REGISTER: 'Register',
  
  // Main
  DASHBOARD_TAB: 'DashboardTab',
  PROFILE_TAB: 'ProfileTab',
  ADMIN_TAB: 'AdminTab',
  
  // Dashboard Stack
  DASHBOARD_HOME: 'DashboardHome',
  ROOM_DETAIL: 'RoomDetail',
  MANUAL_CONTROL: 'ManualControl',
  CONFIGURATION: 'Configuration',
  SCHEDULE: 'Schedule',
  ACTIVITY_HISTORY: 'ActivityHistory',
  BRAND_SELECTION: 'BrandSelection',
  
  // Profile Stack
  PROFILE_HOME: 'ProfileHome',

  // Admin Stack
  ADMIN_HOME: 'AdminHome',
  ADMIN_USERS: 'AdminUsers',
  ADMIN_ACS: 'AdminACs',
  ADMIN_BRANDS: 'AdminBrands',
  ADMIN_SCHEDULES: 'AdminSchedules',
} as const;

export type AuthRoute = keyof typeof AUTH_ROUTES;
export type DashboardRoute = keyof typeof DASHBOARD_ROUTES;
export type ProfileRoute = keyof typeof PROFILE_ROUTES;
export type AdminRoute = keyof typeof ADMIN_ROUTES;
export type TabRoute = keyof typeof TAB_ROUTES;
