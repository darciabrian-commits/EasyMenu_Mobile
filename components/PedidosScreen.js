import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { apiService } from '../services/api';

export default function PedidosScreen({ onBack }) {
  const [cliente, setCliente] = useState('');
  const [total, setTotal] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Cargar la lista de pedidos desde Somee
  const cargarPedidos = async () => {
    try {
      const data = await apiService.getPedidos();
      setPedidos(data || []);
    } catch (error) {
      console.log('Error al cargar pedidos:', error);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  // 2. Crear una nueva orden
  const handleGuardar = async () => {
    if (!cliente || !total) {
      return Alert.alert('Atención', 'Ingresa el nombre del cliente y el total');
    }

    setLoading(true);
    try {
      await apiService.createPedido({ 
        cliente: cliente, 
        total: parseFloat(total) 
      });

      Alert.alert('¡Éxito!', 'Orden registrada correctamente');
      setCliente('');
      setTotal('');
      cargarPedidos(); // Refresca la lista al instante
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar la orden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón de retorno */}
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Volver al Menú</Text>
      </TouchableOpacity>

      <Text style={styles.title}>📋 Gestión de Pedidos</Text>

      {/* Tarjeta de Formulario */}
      <View style={styles.cardForm}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del Cliente"
          value={cliente}
          onChangeText={setCliente}
        />
        <TextInput
          style={styles.input}
          placeholder="Total de la Orden ($)"
          value={total}
          onChangeText={setTotal}
          keyboardType="numeric"
        />

        <TouchableOpacity 
          style={[styles.buttonSave, loading && styles.buttonDisabled]} 
          onPress={handleGuardar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>+ Crear Orden</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Lista de Pedidos Guardados */}
      <Text style={styles.subtitle}>Historial de Ordenes</Text>
      <FlatList
        data={pedidos}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View>
              <Text style={styles.itemName}>👤 {item.cliente || item.nombreCliente || 'Cliente General'}</Text>
              <Text style={styles.itemDate}>Orden #{item.id || 'N/A'}</Text>
            </View>
            <Text style={styles.itemPrice}>${parseFloat(item.total || 0).toFixed(2)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay pedidos registrados aún.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa', paddingTop: 50 },
  backButton: { marginBottom: 15 },
  backText: { color: '#007bff', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', color: '#444', marginVertical: 15 },
  
  cardForm: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonSave: {
    backgroundColor: '#0056b3',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#6c757d' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  itemCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  itemName: { fontSize: 16, fontWeight: '600', color: '#333' },
  itemDate: { fontSize: 12, color: '#888', marginTop: 2 },
  itemPrice: { fontSize: 18, fontWeight: 'bold', color: '#0056b3' },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
});