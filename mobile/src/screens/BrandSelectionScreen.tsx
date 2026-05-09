import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { Card } from '../components/common/Card';
import { Header } from '../components/common/Header';

const BRANDS = ['Daikin', 'Panasonic', 'LG', 'Samsung', 'Mitsubishi', 'Toshiba', 'Sharp', 'Gree', 'Aqua'];

export default function BrandSelectionScreen() {
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={BRANDS}
      keyExtractor={(item) => item}
      ListHeaderComponent={<Header title="Brand Selection" subtitle="Select AC brand profile" />}
      renderItem={({ item }) => (
        <Card>
          <Text style={styles.item}>{item}</Text>
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
  item: {
    fontSize: 15,
    color: '#0A1A2A',
    fontWeight: '600',
  },
});
