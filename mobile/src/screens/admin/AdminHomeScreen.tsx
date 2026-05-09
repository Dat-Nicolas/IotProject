import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { SCREEN_NAMES } from '../../navigation/ROUTES';

export default function AdminHomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  const menuItems = [
    {
      title: 'Người dùng',
      subtitle: 'Quản lý tài khoản, vai trò',
      icon: '👥',
      screen: SCREEN_NAMES.ADMIN_USERS,
      color: '#3B82F6',
    },
    {
      title: 'Điều hòa',
      subtitle: 'Danh sách và thông tin AC',
      icon: '❄️',
      screen: SCREEN_NAMES.ADMIN_ACS,
      color: '#10B981',
    },
    {
      title: 'Thương hiệu',
      subtitle: 'Cấu hình IR protocol',
      icon: '📡',
      screen: SCREEN_NAMES.ADMIN_BRANDS,
      color: '#F59E0B',
    },
    {
      title: 'Lịch hẹn giờ',
      subtitle: 'Quản lý tự động hóa',
      icon: '🗓️',
      screen: SCREEN_NAMES.ADMIN_SCHEDULES,
      color: '#8B5CF6',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>Quản trị hệ thống</Text>
      <Text style={[styles.subtitle, { color: colors.mutedText }]}>Chọn một module để quản lý</Text>

      <View style={styles.grid}>
        {menuItems.map((item) => (
          <Pressable
            key={item.screen}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
              <Text style={{ fontSize: 24 }}>{item.icon}</Text>
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.cardSubtitle, { color: colors.mutedText }]}>{item.subtitle}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 4, marginTop: 20 },
  subtitle: { fontSize: 15, marginBottom: 24 },
  grid: { gap: 16 },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 17, fontWeight: '700', marginBottom: 2 },
  cardSubtitle: { fontSize: 13 },
});
