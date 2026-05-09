import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Card } from '../components/common/Card';
import { Header } from '../components/common/Header';
import { ACController } from '../components/ac/ACController';
import { TemperatureDial } from '../components/ac/TemperatureDial';
import { ModeSelector } from '../components/ac/ModeSelector';
import { Button } from '../components/common/Button';
import { useControlAcMutation, useGetAcsByRoomQuery } from '../redux/api/acApi';
import { useTheme } from '../hooks/useTheme';

interface Props {
  route: {
    params: {
      roomId: string;
    };
  };
}

export default function ManualControlScreen({ route }: Props) {
  const roomId = route.params.roomId;
  const { data } = useGetAcsByRoomQuery(roomId);
  const [controlAc] = useControlAcMutation();
  const selectedAc = useMemo(() => (data ?? [])[0], [data]);
  const [temp, setTemp] = useState(25);
  const [mode, setMode] = useState<'COOL' | 'DRY' | 'FAN' | 'AUTO'>('COOL');
  const { colors } = useTheme();

  const handleToggle = async () => {
    if (!selectedAc) {
      return;
    }

    const nextStatus = selectedAc.status === 'ON' ? 'OFF' : 'ON';
    try {
      await controlAc({ id: selectedAc.id, data: { status: nextStatus } }).unwrap();
    } catch (error) {
      Alert.alert('Control failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleApply = async () => {
    if (!selectedAc) {
      return;
    }

    try {
      await controlAc({ id: selectedAc.id, data: { currentTemp: temp, mode } }).unwrap();
      Alert.alert('Success', 'AC settings applied');
    } catch (error) {
      Alert.alert('Control failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Header title="Manual Control" subtitle={selectedAc?.name ?? 'No AC found'} />
      <Card>
        <ACController status={selectedAc?.status ?? 'OFF'} onToggle={handleToggle} />
      </Card>
      <Card>
        <TemperatureDial value={temp} onChange={setTemp} />
      </Card>
      <Card>
        <ModeSelector value={mode} onChange={setMode} />
      </Card>
      <Card>
        <Button label="Apply Settings" onPress={handleApply} />
      </Card>
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
});
