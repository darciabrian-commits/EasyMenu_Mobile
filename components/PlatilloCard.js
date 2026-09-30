import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function PlatilloCard({ item, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.cardTitle}>{item.nombre}</Text>
        <Text style={styles.cardPrice}>${item.precio}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(item)} style={styles.editBtn}>
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
          <Text style={styles.btnText}>Borrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, elevation: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardPrice: { color: '#666' },
  actions: { flexDirection: 'row', gap: 10 },
  editBtn: { backgroundColor: '#ffc107', padding: 8, borderRadius: 5, justifyContent: 'center' },
  deleteBtn: { backgroundColor: '#dc3545', padding: 8, borderRadius: 5, justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});
