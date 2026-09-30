import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import PlatilloCard from './PlatilloCard';

export default function PlatillosScreen({ onLogout }) {
  const [platillos, setPlatillos] = useState([
    { id: '1', nombre: 'Hamburguesa Doble', precio: '8.50' },
    { id: '2', nombre: 'Papas Supremas', precio: '4.00' },
  ]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [editId, setEditId] = useState(null);

  const handleSave = () => {
    if (!nombre || !precio) return Alert.alert('Error', 'Completa los datos');
    if (editId) {
      setPlatillos(platillos.map(item => item.id === editId ? { ...item, nombre, precio } : item));
      setEditId(null);
    } else {
      setPlatillos([...platillos, { id: Date.now().toString(), nombre, precio }]);
    }
    setNombre('');
    setPrecio('');
  };

  const handleEdit = (item) => { setNombre(item.nombre); setPrecio(item.precio); setEditId(item.id); };
  const handleDelete = (id) => setPlatillos(platillos.filter(item => item.id !== id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gestión de Menú</Text>
        <TouchableOpacity onPress={onLogout}><Text style={{ color: '#ff6b6b' }}>Salir</Text></TouchableOpacity>
      </View>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Nombre del platillo" value={nombre} onChangeText={setNombre} />
        <TextInput style={styles.input} placeholder="Precio ($)" value={precio} onChangeText={setPrecio} keyboardType="numeric" />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>{editId ? 'Actualizar' : 'Agregar'}</Text>
        </TouchableOpacity>
      </View>
      <FlatList 
        data={platillos} 
        keyExtractor={item => item.id} 
        renderItem={({ item }) => <PlatilloCard item={item} onEdit={handleEdit} onDelete={handleDelete} />} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  form: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20 },
  input: { borderBottomWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  saveButton: { backgroundColor: '#28a745', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
