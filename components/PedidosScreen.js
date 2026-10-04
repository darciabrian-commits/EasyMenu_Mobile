import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';

import { apiService } from '../services/api';

export default function PedidosScreen({ onBack }) {
  const [clienteOMesa, setClienteOMesa] = useState('');
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState('1');
  const [notas, setNotas] = useState('');

  const [loading, setLoading] = useState(false);

  const cargarDatos = async () => {
    try {
      const [productosData, pedidosData] = await Promise.all([
        apiService.getProductos(),
        apiService.getPedidos()
      ]);

      setProductos(
        Array.isArray(productosData)
          ? productosData.filter(
              (producto) => producto.disponible === true
            )
          : []
      );

      setPedidos(
        Array.isArray(pedidosData)
          ? pedidosData
          : []
      );
    } catch (error) {
      console.log('Error al cargar datos:', error);

      Alert.alert(
        'Error',
        'No se pudieron cargar los datos'
      );
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const limpiarFormulario = () => {
    setClienteOMesa('');
    setProductoSeleccionado(null);
    setCantidad('1');
    setNotas('');
  };

  const crearPedido = async () => {
    const cantidadNumero = Number(cantidad);

    if (!clienteOMesa.trim()) {
      return Alert.alert(
        'Atención',
        'Ingresa el cliente o número de mesa'
      );
    }

    if (!productoSeleccionado) {
      return Alert.alert(
        'Atención',
        'Selecciona un producto'
      );
    }

    if (!cantidadNumero || cantidadNumero < 1) {
      return Alert.alert(
        'Atención',
        'La cantidad debe ser al menos 1'
      );
    }

    const pedido = {
      clienteOMesa: clienteOMesa.trim(),
      detalles: [
        {
          productoId: productoSeleccionado.id,
          cantidad: cantidadNumero,
          notas: notas.trim()
        }
      ]
    };

    setLoading(true);

    try {
      await apiService.createPedido(pedido);

      Alert.alert(
        'Éxito',
        'Pedido creado correctamente'
      );

      limpiarFormulario();
      await cargarDatos();
    } catch (error) {
      console.log('Error al crear pedido:', error);

      Alert.alert(
        'Error',
        error.message || 'No se pudo crear el pedido'
      );
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = (pedido) => {
    let siguienteEstado = null;

    if (pedido.estado === 'PENDIENTE') {
      siguienteEstado = 'RECIBIDO';
    } else if (pedido.estado === 'RECIBIDO') {
      siguienteEstado = 'EN_PREPARACION';
    } else if (pedido.estado === 'EN_PREPARACION') {
      siguienteEstado = 'LISTO';
    } else if (pedido.estado === 'LISTO') {
      siguienteEstado = 'ENTREGADO';
    }

    if (!siguienteEstado) {
      return Alert.alert(
        'Información',
        'Este pedido ya no puede avanzar de estado'
      );
    }

    Alert.alert(
      'Cambiar estado',
      `¿Cambiar de ${pedido.estado} a ${siguienteEstado}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Cambiar',
          onPress: async () => {
            try {
              await apiService.cambiarEstadoPedido(
                pedido.id,
                siguienteEstado
              );

              await cargarDatos();

              Alert.alert(
                'Éxito',
                `Estado cambiado a ${siguienteEstado}`
              );
            } catch (error) {
              Alert.alert(
                'Error',
                error.message || 'No se pudo cambiar el estado'
              );
            }
          }
        }
      ]
    );
  };

  const cancelarPedido = (pedido) => {
    Alert.alert(
      'Cancelar pedido',
      '¿Deseas cancelar este pedido?',
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.cancelarPedido(pedido.id);

              await cargarDatos();

              Alert.alert(
                'Éxito',
                'Pedido cancelado correctamente'
              );
            } catch (error) {
              Alert.alert(
                'Error',
                error.message || 'No se pudo cancelar el pedido'
              );
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
      >
        <Text style={styles.backText}>
          ← Volver
        </Text>
      </TouchableOpacity>

      <Text style={styles.title}>
        Gestión de Pedidos
      </Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Cliente o mesa"
          value={clienteOMesa}
          onChangeText={setClienteOMesa}
        />

        <Text style={styles.label}>
          Selecciona un producto
        </Text>

        <FlatList
          horizontal
          data={productos}
          keyExtractor={(item) =>
            item.id.toString()
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.producto,
                productoSeleccionado?.id === item.id &&
                  styles.productoActivo
              ]}
              onPress={() =>
                setProductoSeleccionado(item)
              }
            >
              <Text
                style={[
                  styles.productoTexto,
                  productoSeleccionado?.id === item.id &&
                    styles.productoTextoActivo
                ]}
              >
                {item.nombre}
              </Text>

              <Text
                style={[
                  styles.productoPrecio,
                  productoSeleccionado?.id === item.id &&
                    styles.productoTextoActivo
                ]}
              >
                ${Number(item.precio).toFixed(2)}
              </Text>
            </TouchableOpacity>
          )}
        />

        <TextInput
          style={styles.input}
          placeholder="Cantidad"
          value={cantidad}
          onChangeText={setCantidad}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Notas opcionales"
          value={notas}
          onChangeText={setNotas}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={crearPedido}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Crear Pedido
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Pedidos registrados
      </Text>

      <FlatList
        data={pedidos}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <View style={styles.pedidoCard}>
            <Text style={styles.pedidoTitle}>
              {item.clienteOMesa}
            </Text>

            <Text>
              Pedido #{item.id}
            </Text>

            <Text style={styles.estado}>
              Estado: {item.estado}
            </Text>

            <Text style={styles.total}>
              ${Number(item.total || 0).toFixed(2)}
            </Text>

            {item.estado !== 'CANCELADO' &&
              item.estado !== 'ENTREGADO' && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.estadoButton}
                    onPress={() =>
                      cambiarEstado(item)
                    }
                  >
                    <Text style={styles.buttonText}>
                      Cambiar estado
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() =>
                      cancelarPedido(item)
                    }
                  >
                    <Text style={styles.buttonText}>
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No hay pedidos registrados.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f8f9fa'
  },

  backButton: {
    marginBottom: 10
  },

  backText: {
    color: '#007bff',
    fontWeight: '600'
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15
  },

  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15
  },

  form: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8
  },

  label: {
    fontWeight: '600',
    marginTop: 5
  },

  producto: {
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
    marginVertical: 10
  },

  productoActivo: {
    backgroundColor: '#007bff'
  },

  productoTexto: {
    color: '#007bff',
    fontWeight: '600'
  },

  productoTextoActivo: {
    color: '#fff'
  },

  productoPrecio: {
    color: '#666',
    marginTop: 3
  },

  saveButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8
  },

  pedidoCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },

  pedidoTitle: {
    fontSize: 17,
    fontWeight: 'bold'
  },

  estado: {
    marginTop: 5,
    color: '#007bff'
  },

  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8
  },

  actions: {
    flexDirection: 'row',
    gap: 8
  },

  estadoButton: {
    flex: 1,
    backgroundColor: '#f0ad4e',
    padding: 10,
    borderRadius: 7
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 7
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20
  }
});