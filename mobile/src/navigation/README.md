# Navigation Structure Documentation

## Overview

This document describes the standardized navigation structure for the mobile application. All routes are mapped consistently with proper URL patterns and type-safe navigation.

## Route Structure

### 1. Auth Routes (`/auth`)
- `auth/login` - Login screen
- `auth/register` - Registration screen

### 2. Dashboard Routes (`/dashboard`)
- `dashboard/home` - Main dashboard screen
- `dashboard/room/:roomId` - Room detail page
- `dashboard/control/:roomId` - Manual control for specific room
- `dashboard/config/:roomId` - Room configuration
- `dashboard/schedule/:roomId` - Schedule management
- `dashboard/activity/:roomId` - Activity history for room
- `dashboard/brands` - Brand selection screen

### 3. Profile Routes (`/profile`)
- `profile/home` - User profile screen

### 4. Tab Routes (Bottom Navigation)
- `dashboard` - Dashboard tab
- `profile` - Profile tab

## File Organization

```
src/navigation/
├── ROUTES.ts              # Centralized route constants
├── types.ts               # TypeScript type definitions
├── AppNavigator.tsx       # Root navigator (auth/main conditional)
├── AuthNavigator.tsx      # Auth stack navigator
├── MainNavigator.tsx      # Main tabs & stacks
└── useNavigation.ts       # Navigation hooks & helpers
```

## Usage Examples

### 1. Using Route Constants

```typescript
import { SCREEN_NAMES, ROUTES } from '@/navigation/ROUTES';

// Use screen names for navigation
<Stack.Screen name={SCREEN_NAMES.LOGIN} component={LoginScreen} />

// Use routes for URL patterns
const url = ROUTES.DASHBOARD.ROOM_DETAIL; // 'dashboard/room/:roomId'
```

### 2. Using Navigation Hooks

```typescript
import { useDashboardNavigation, navigationHelpers } from '@/navigation/useNavigation';

export const MyComponent = () => {
  const navigation = useDashboardNavigation();

  const handleNavigateToRoom = (roomId: string) => {
    navigation.navigate('RoomDetail', { roomId });
    // Or use helper
    navigationHelpers.goToRoomDetail(navigation, roomId);
  };

  return <Button onPress={() => handleNavigateToRoom('123')} />;
};
```

### 3. Type-Safe Navigation Props

```typescript
import { DashboardStackScreenProps } from '@/navigation/types';

type Props = DashboardStackScreenProps<'RoomDetail'>;

export const RoomDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { roomId } = route.params;
  // Type-safe access to roomId
};
```

## Screen Naming Convention

All screen names use PascalCase with descriptive names:
- `Login` - Auth login screen
- `Register` - Auth registration screen
- `DashboardHome` - Main dashboard
- `RoomDetail` - Individual room details
- `ManualControl` - Manual control panel
- `Configuration` - Configuration panel
- `Schedule` - Schedule management
- `ActivityHistory` - Activity history view
- `BrandSelection` - Brand selection
- `ProfileHome` - User profile

## URL Naming Convention

URL patterns follow REST conventions:
- All lowercase
- Kebab-case for multi-word routes
- Path parameters use `:paramName` format
- Examples: `dashboard/home`, `dashboard/room/:roomId`, `dashboard/config/:roomId`

## Navigation Stack Hierarchy

```
App
├── Auth Stack (when not authenticated)
│   ├── Login
│   └── Register
└── Main Stack (when authenticated)
    └── Tab Navigator
        ├── Dashboard Tab
        │   └── Dashboard Stack
        │       ├── DashboardHome
        │       ├── RoomDetail
        │       ├── ManualControl
        │       ├── Configuration
        │       ├── Schedule
        │       ├── BrandSelection
        │       └── ActivityHistory
        └── Profile Tab
            └── Profile Stack
                └── ProfileHome
```

## Best Practices

1. **Always use SCREEN_NAMES constants** instead of hardcoding screen names
   ```typescript
   // ✅ Good
   navigation.navigate(SCREEN_NAMES.ROOM_DETAIL, { roomId });
   
   // ❌ Bad
   navigation.navigate('RoomDetail', { roomId });
   ```

2. **Use navigation helper functions** for common navigation patterns
   ```typescript
   // ✅ Good
   navigationHelpers.goToRoomDetail(navigation, roomId);
   
   // ❌ Bad
   navigation.navigate('RoomDetail', { roomId });
   ```

3. **Leverage type-safe props** in screen components
   ```typescript
   // ✅ Good
   type Props = DashboardStackScreenProps<'RoomDetail'>;
   
   // ❌ Bad
   type Props = any;
   ```

4. **Import hooks for type safety**
   ```typescript
   // ✅ Good
   const navigation = useDashboardNavigation();
   
   // ❌ Bad
   const navigation = useNavigation();
   ```

## Adding New Routes

### 1. Add to ROUTES.ts
```typescript
export const NEW_ROUTES = {
  NEW_SCREEN: 'new/screen/:id',
} as const;
```

### 2. Update types.ts
```typescript
export type NewStackParamList = {
  NewScreen: { id: string };
};
```

### 3. Create Navigator
```typescript
const NewStack = createNativeStackNavigator<NewStackParamList>();

function NewStackNavigator() {
  return (
    <NewStack.Navigator>
      <NewStack.Screen name="NewScreen" component={NewScreenComponent} />
    </NewStack.Navigator>
  );
}
```

### 4. Add to MainNavigator or AppNavigator

## Deep Linking Support

The route patterns in `ROUTES.ts` are designed to support deep linking. Each route follows REST conventions making it easy to implement deep link handling:

- `dashboard/room/room123` → RoomDetail with roomId='room123'
- `dashboard/control/room456` → ManualControl with roomId='room456'
- etc.
