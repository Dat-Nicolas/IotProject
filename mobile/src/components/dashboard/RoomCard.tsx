import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RoomResponse } from '../../redux/api/roomApi';
import { Card } from '../common/Card';
import { StatusBadge } from '../common/StatusBadge';
import { colors } from '../../theme/colors';

interface RoomCardProps {
  room: RoomResponse;
  onPress: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <Card>
        <View style={styles.row}>
          <View>
            <Text style={styles.title}>{room.name}</Text>
            <Text style={styles.subtitle}>{room.location}</Text>
          </View>
          <StatusBadge status={room.currentPeople > 0 ? 'ON' : 'OFF'} />
        </View>
        <Text style={styles.meta}>People: {room.currentPeople}</Text>
        <Text style={styles.meta}>Temp: {room.currentTemperature.toFixed(1)}°C</Text>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    color: colors.light.text,
    fontSize: 17,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.light.mutedText,
    fontSize: 13,
  },
  meta: {
    color: colors.light.text,
    fontSize: 14,
  },
});
