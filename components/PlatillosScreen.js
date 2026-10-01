import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import PlatilloCard from './PlatilloCard';
import { apiService } from '../services/api';

export default function PlatillosScreen({ onBack }) {
  const [platillos, setPlatillos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [editId, setEditId] = useState(null);

  const cargarDatos = async () => setPlatillos(await apiService.getPlatillos());
  useEffect(() => { cargarDatos(); }, []);

  const handleSave = async () => {
    if (!nombre || !precio) return;
    editId ? await apiService.updatePlatillo(editId, { nombre, precio: parseFloat(precio) }) : await apiService.createPlatillo({ nombre, precio: parseFloat(precio) });
    setNombre(''); setPrecio(''); setEditId(null); cargarDatos();
  };

  const handleEdit = (item) => { setNombre(item.nombre); setPrecio(item.precio.toString()); setEditId(item.id); };
  const handleDelete = async (id) => { await apiService.deletePlatillo(id); cargarDatos(); };

  return (
    <View style={{flex: 1, padding: 20, paddingTop: 40}}>
      <TouchableOpacity onPress={onBack}><Text style={{color: 'blue', marginBottom: 10}}>Volver al Menú</Text></TouchableOpacity>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Precio" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
      <TouchableOpacity style={styles.btn} onPress={handleSave}><Text style={{color: 'white', textAlign: 'center'}}>{editId ? 'Actualizar' : 'Guardar'}</Text></TouchableOpacity>
      <FlatList data={platillos} keyExtractor={item => item.id.toString()} renderItem={({ item }) => <PlatilloCard item={item} onEdit={handleEdit} onDelete={handleDelete} />} />
    </View>
  );
}
const styles = StyleSheet.create({ input: { borderWidth: 1, padding: 10, marginBottom: 10 }, btn: { backgroundColor: 'green', padding: 15, marginBottom: 20 } });