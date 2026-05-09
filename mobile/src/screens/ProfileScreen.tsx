import React, { useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Card } from '../components/common/Card';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { baseApi } from '../redux/api/baseApi';
import { useTheme } from '../hooks/useTheme';
import { clearAuth } from '../redux/slices/authSlice';
import { AppDispatch } from '../redux/store';

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { colors, isDark, toggleThemeMode } = useTheme();
  const animatedValue = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  // Sync animation với theme state (khi state thay đổi từ bên ngoài)
  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: isDark ? 1 : 0,
      useNativeDriver: false,
      tension: 120,
      friction: 8,
    }).start();
  }, [isDark]);

  const handleToggle = () => {
    toggleThemeMode();
  };

  const handleLogout = () => {
    dispatch(clearAuth());
    dispatch(baseApi.util.resetApiState());
    Alert.alert('Đã đăng xuất', 'Bạn đã đăng xuất thành công');
  };

  // Interpolate thumb position
  const thumbTranslate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 26],
  });

  // Interpolate track color
  const trackColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#D1D5DB', '#1E40AF'],
  });

  const infoRows = [
    { label: 'Họ tên', value: user?.fullName ?? '-' },
    { label: 'Email', value: user?.email ?? '-' },
    { label: 'Vai trò', value: user?.role ?? '-' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Header title="Hồ sơ" subtitle="Tài khoản và tuỳ chọn" />

      {/* Thông tin tài khoản */}
      <Card>
        {infoRows.map((row) => (
          <View key={row.label} style={[styles.infoRow, { borderBottomColor: colors.divider }]}>
            <Text style={[styles.infoLabel, { color: colors.mutedText }]}>{row.label}</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{row.value}</Text>
          </View>
        ))}
      </Card>

      {/* Card đổi giao diện */}
      <Card>
        <View style={styles.themeRow}>
          <View style={styles.themeInfo}>
            <Text style={[styles.themeTitle, { color: colors.text }]}>Giao diện</Text>
            <Text style={[styles.themeSubtitle, { color: colors.mutedText }]}>
              {isDark ? '🌙 Tối' : '☀️ Sáng'}
            </Text>
          </View>

          {/* Toggle Switch */}
          <Pressable onPress={handleToggle} accessibilityRole="switch" accessibilityState={{ checked: isDark }}>
            <Animated.View style={[styles.track, { backgroundColor: trackColor }]}>
              <Animated.View
                style={[
                  styles.thumb,
                  { transform: [{ translateX: thumbTranslate }] },
                ]}
              >
                <Text style={styles.thumbIcon}>{isDark ? '🌙' : '☀️'}</Text>
              </Animated.View>
            </Animated.View>
          </Pressable>
        </View>
      </Card>

      <Button label="Đăng xuất" onPress={handleLogout} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeInfo: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  themeSubtitle: {
    fontSize: 13,
  },
  track: {
    width: 54,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  thumbIcon: {
    fontSize: 14,
  },
});

