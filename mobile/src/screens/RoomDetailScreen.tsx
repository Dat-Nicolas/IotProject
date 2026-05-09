import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card } from '../components/common/Card';
import { Header } from '../components/common/Header';
import { Loading } from '../components/common/Loading';
import { PeopleChart } from '../components/dashboard/PeopleChart';
import { DashboardStackParamList } from '../navigation/types';
import { useGetAcsByRoomQuery } from '../redux/api/acApi';
import { useGetRoomByIdQuery } from '../redux/api/roomApi';
import { useGetRoomChartQuery } from '../redux/api/dashboardApi';
import { useTheme } from '../hooks/useTheme';

type Props = NativeStackScreenProps<DashboardStackParamList, 'RoomDetail'>;

export default function RoomDetailScreen({ route }: Props) {
  const { roomId } = route.params;
  const roomQuery = useGetRoomByIdQuery(roomId);
  const acQuery = useGetAcsByRoomQuery(roomId);
  const chartQuery = useGetRoomChartQuery(roomId);
  const { colors } = useTheme();

  if (roomQuery.isLoading || acQuery.isLoading || chartQuery.isLoading) {
    return <Loading />;
  }

  const room = roomQuery.data;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Header title={room?.name ?? 'Room'} subtitle={room?.location} />
      <Card>
        <Text style={[styles.metric, { color: colors.text }]}>People: {room?.currentPeople ?? 0}</Text>
        <Text style={[styles.metric, { color: colors.text }]}>Temperature: {room?.currentTemperature ?? 0}°C</Text>
      </Card>

      <Card>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Air Conditioners</Text>
        {(acQuery.data ?? []).map((ac) => (
          <Text key={ac.id} style={[styles.item, { color: colors.mutedText }]}>
            {ac.name}: {ac.status} | {ac.mode} | {ac.currentTemp}°C
          </Text>
        ))}
      </Card>

      <PeopleChart points={(chartQuery.data ?? []).map((x) => ({ timestamp: x.timestamp, peopleCount: x.peopleCount }))} />
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
  metric: {
    fontSize: 15,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  item: {
    fontSize: 14,
    marginBottom: 4,
  },
});

