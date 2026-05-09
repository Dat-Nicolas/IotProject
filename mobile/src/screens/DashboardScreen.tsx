import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Header } from '../components/common/Header';
import { Loading } from '../components/common/Loading';
import { RoomCard } from '../components/dashboard/RoomCard';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DashboardStackParamList } from '../navigation/types';
import { useGetDashboardStatsQuery } from '../redux/api/dashboardApi';
import { useGetRoomsQuery } from '../redux/api/roomApi';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

type Props = NativeStackScreenProps<DashboardStackParamList, 'DashboardHome'>;

export default function DashboardScreen({ navigation }: Props) {
  const { isAuthenticated } = useAuth();
  const statsQuery = useGetDashboardStatsQuery(undefined, { skip: !isAuthenticated });
  const roomsQuery = useGetRoomsQuery(undefined, { skip: !isAuthenticated });
  const { colors } = useTheme();

  if (!isAuthenticated) {
    return <Loading />;
  }

  if (statsQuery.isLoading || roomsQuery.isLoading) {
    return <Loading />;
  }

  const stats = statsQuery.data;
  const rooms = roomsQuery.data ?? [];

  return (
    <FlatList
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      data={rooms}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View>
          <Header title="Dashboard" subtitle="Smart AC overview" />
          <View style={styles.statsRow}>
            <StatsCard label="Rooms" value={stats?.totalRooms ?? 0} />
            <StatsCard label="AC ON" value={stats?.acOnCount ?? 0} />
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <RoomCard room={item} onPress={() => navigation.navigate('RoomDetail', { roomId: item.id })} />
      )}
      refreshControl={
        <RefreshControl
          refreshing={roomsQuery.isFetching || statsQuery.isFetching}
          onRefresh={() => {
            roomsQuery.refetch();
            statsQuery.refetch();
          }}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
});
