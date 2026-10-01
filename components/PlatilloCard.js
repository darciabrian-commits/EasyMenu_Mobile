import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PlatilloCard({ item, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={{fontWeight: 'bold'}}>{item.nombre || item.cliente}</Text>
        <Text>${item.precio || item.total}</Text>
      </View>
      <View style={{flexDirection: 'row', gap: 10}}>
        <TouchableOpacity onPress={() => onEdit(item)} style={{backgroundColor: '#ffc107', padding: 8, borderRadius: 5}}><Text>Editar</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={{backgroundColor: '#dc3545', padding: 8, borderRadius: 5}}><Text style={{color: '#fff'}}>Borrar</Text></TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({ card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, elevation: 1 } });

