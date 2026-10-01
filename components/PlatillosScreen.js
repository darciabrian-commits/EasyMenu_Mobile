import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { apiService } from '../services/api';

export default function PlatillosScreen({ onBack }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [editingId, setEditingId] = useState(null); // ID para saber si estamos editando
  const [platillos, setPlatillos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Cargar datos reales desde Somee
  const cargarPlatillos = async () => {
    try {
      const data = await apiService.getPlatillos();
      setPlatillos(data || []);
    } catch (error) {
      console.log('Error al obtener platillos:', error);
    }
  };

  useEffect(() => {
    cargarPlatillos();
  }, []);

  // 2. Guardar (Crear o Actualizar)
  const handleGuardar = async () => {
    if (!nombre || !precio) {
      return Alert.alert('Atención', 'Ingresa nombre y precio');
    }

    setLoading(true);
    try {
      if (editingId) {
        // Actualizar existente
        await apiService.updatePlatillo(editingId, { nombre, precio: parseFloat(precio) });
        Alert.alert('¡Éxito!', 'Platillo actualizado');
      } else {
        // Crear nuevo
        await apiService.createPlatillo({ nombre, precio: parseFloat(precio) });
        Alert.alert('¡Éxito!', 'Platillo registrado');
      }

      setNombre('');
      setPrecio('');
      setEditingId(null);
      cargarPlatillos();
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  // 3. Cargar datos en los inputs para Editar
  const handleEditar = (item) => {
    setNombre(item.nombre);
    setPrecio(item.precio ? item.precio.toString() : '');
    setEditingId(item.id);
  };

  // 4. Eliminar platillo de la base de datos
  const handleBorrar = (id) => {
    Alert.alert(
      'Confirmar',
      '¿Deseas eliminar este platillo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deletePlatillo(id);
              cargarPlatillos();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Encabezado idéntico a Fase 2 */}
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Menú</Text>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Formulario estilo Fase 2 */}
      <View style={styles.cardForm}>
        <TextInput
          style={styles.inputLine}
          placeholder="Nombre del platillo"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.inputLine}
          placeholder="Precio ($)"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="numeric"
        />

        <TouchableOpacity 
          style={[styles.buttonAdd, editingId && styles.buttonEditMode]} 
          onPress={handleGuardar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonAddText}>
              {editingId ? 'Actualizar Platillo' : 'Agregar'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Lista con botones Editar (Amarillo) y Borrar (Rojo) */}
      <FlatList
        data={platillos}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.nombre}</Text>
              <Text style={styles.itemPrice}>${parseFloat(item.precio || 0).toFixed(2)}</Text>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.btnEditar} onPress={() => handleEditar(item)}>
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnBorrar} onPress={() => handleBorrar(item.id)}>
                <Text style={styles.btnText}>Borrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fafafa', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontFamily: 'sans-serif-medium', color: '#111' },
  logoutText: { color: '#ff6b6b', fontSize: 16 },

  cardForm: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  inputLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonAdd: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonEditMode: { backgroundColor: '#f39c12' },
  buttonAddText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  itemCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 1,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  itemPrice: { fontSize: 14, color: '#666', marginTop: 4 },

  actionsRow: { flexDirection: 'row', gap: 8 },
  btnEditar: { backgroundColor: '#f1c40f', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6 },
  btnBorrar: { backgroundColor: '#e74c3c', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});