import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Card } from '../components/common/Card';
import { Header } from '../components/common/Header';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import {
  useGetConfigByRoomQuery,
  useUpdateConfigByRoomMutation,
} from '../redux/api/configApi';
import { useTheme } from '../hooks/useTheme';

interface Props {
  route: {
    params: {
      roomId: string;
    };
  };
}

export default function ConfigurationScreen({ route }: Props) {
  const roomId = route.params.roomId;
  const { data } = useGetConfigByRoomQuery(roomId);
  const [updateConfig, { isLoading }] = useUpdateConfigByRoomMutation();
  const [peoplePerAC, setPeoplePerAC] = useState<string>('10');
  const [minTemp, setMinTemp] = useState<string>('22');
  const [maxTemp, setMaxTemp] = useState<string>('28');
  const [defaultTemp, setDefaultTemp] = useState<string>('25');
  const { colors } = useTheme();

  useEffect(() => {
    if (!data) {
      return;
    }

    setPeoplePerAC(String(data.peoplePerAC));
    setMinTemp(String(data.minTemp));
    setMaxTemp(String(data.maxTemp));
    setDefaultTemp(String(data.defaultTemp));
  }, [data]);

  const handleSave = async () => {
    try {
      await updateConfig({
        roomId,
        data: {
          peoplePerAC: Number(peoplePerAC),
          minTemp: Number(minTemp),
          maxTemp: Number(maxTemp),
          defaultTemp: Number(defaultTemp),
        },
      }).unwrap();
      Alert.alert('Success', 'Configuration updated');
    } catch (error) {
      Alert.alert('Update failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Header title="Configuration" subtitle="Room auto control settings" />
      <Card>
        <Input
          placeholder="People per AC"
          keyboardType="numeric"
          value={peoplePerAC}
          onChangeText={setPeoplePerAC}
        />
        <Input placeholder="Min Temp" keyboardType="numeric" value={minTemp} onChangeText={setMinTemp} />
        <Input placeholder="Max Temp" keyboardType="numeric" value={maxTemp} onChangeText={setMaxTemp} />
        <Input
          placeholder="Default Temp"
          keyboardType="numeric"
          value={defaultTemp}
          onChangeText={setDefaultTemp}
        />
        <Button label={isLoading ? 'Saving...' : 'Save'} onPress={handleSave} disabled={isLoading} />
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
