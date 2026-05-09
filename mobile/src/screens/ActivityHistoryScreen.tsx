import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { Card } from '../components/common/Card';
import { Header } from '../components/common/Header';
import { useGetActivityLogsQuery } from '../redux/api/logApi';

interface Props {
  route: {
    params: {
      roomId: string;
    };
  };
}

export default function ActivityHistoryScreen({ route }: Props) {
  const roomId = route.params.roomId;
  const { data } = useGetActivityLogsQuery(roomId);
  const items = data?.items ?? [];

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={items}
      keyExtractor={(item, index) => String(item.id ?? index)}
      ListHeaderComponent={<Header title="Activity History" subtitle="Recent room actions" />}
      renderItem={({ item }) => (
        <Card>
          <Text style={styles.action}>{String(item.action ?? 'N/A')}</Text>
          <Text style={styles.time}>{String(item.timestamp ?? '')}</Text>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  content: {
    padding: 16,
  },
  action: {
    color: '#0A1A2A',
    fontWeight: '700',
    fontSize: 14,
  },
  time: {
    color: '#5B6B7A',
    marginTop: 4,
    fontSize: 12,
  },
});
