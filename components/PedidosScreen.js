import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import PlatilloCard from './PlatilloCard';
import { apiService } from '../services/api';

export default function PedidosScreen({ onBack }) {
  const [pedidos, setPedidos] = useState([]);
  const [cliente, setCliente] = useState('');
  const [total, setTotal] = useState('');
  const [editId, setEditId] = useState(null);

  const cargarDatos = async () => setPedidos(await apiService.getPedidos());
  useEffect(() => { cargarDatos(); }, []);

  const handleSave = async () => {
    if (!cliente || !total) return;
    editId ? await apiService.updatePedido(editId, { cliente, total: parseFloat(total) }) : await apiService.createPedido({ cliente, total: parseFloat(total) });
    setCliente(''); setTotal(''); setEditId(null); cargarDatos();
  };

  const handleEdit = (item) => { setCliente(item.cliente); setTotal(item.total.toString()); setEditId(item.id); };
  const handleDelete = async (id) => { await apiService.deletePedido(id); cargarDatos(); };

  return (
    <View style={{flex: 1, padding: 20, paddingTop: 40}}>
      <TouchableOpacity onPress={onBack}><Text style={{color: 'blue', marginBottom: 10}}>Volver al Menú</Text></TouchableOpacity>
      <TextInput style={styles.input} placeholder="Nombre Cliente" value={cliente} onChangeText={setCliente} />
      <TextInput style={styles.input} placeholder="Total" value={total} onChangeText={setTotal} keyboardType="numeric" />
      <TouchableOpacity style={styles.btn} onPress={handleSave}><Text style={{color: 'white', textAlign: 'center'}}>{editId ? 'Actualizar Orden' : 'Crear Orden'}</Text></TouchableOpacity>
      <FlatList data={pedidos} keyExtractor={item => item.id.toString()} renderItem={({ item }) => <PlatilloCard item={item} onEdit={handleEdit} onDelete={handleDelete} />} />
    </View>
  );
}
const styles = StyleSheet.create({ input: { borderWidth: 1, padding: 10, marginBottom: 10 }, btn: { backgroundColor: 'blue', padding: 15, marginBottom: 20 } });
