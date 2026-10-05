import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';

import { apiService } from '../services/api';

export default function ConfirmarPedidoScreen({
  carrito,
  onBack,
  onPedidoCreado
}) {
  const [clienteOMesa, setClienteOMesa] = useState('');
  const [enviando, setEnviando] = useState(false);

  const total = useMemo(() => {
    return carrito.reduce(
      (suma, item) =>
        suma +
        Number(item.precio) * item.cantidad,
      0
    );
  }, [carrito]);

  const confirmarPedido = async () => {
    if (!clienteOMesa.trim()) {
      Alert.alert(
        'Dato requerido',
        'Ingresa tu nombre o número de mesa.'
      );
      return;
    }

    if (carrito.length === 0) {
      Alert.alert(
        'Carrito vacío',
        'Debes agregar al menos un producto.'
      );
      return;
    }

    const pedido = {
      clienteOMesa: clienteOMesa.trim(),

      items: carrito.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad,
        notas: item.notas || ''
      }))
    };

    try {
      setEnviando(true);

      const respuesta =
        await apiService.createPedido(pedido);

      onPedidoCreado(respuesta);
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        'No se pudo crear el pedido. Intenta nuevamente.'
      );
    } finally {
      setEnviando(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>
          {item.nombre}
        </Text>

        <Text style={styles.itemQuantity}>
          Cantidad: {item.cantidad}
        </Text>
      </View>

      <Text style={styles.itemSubtotal}>
        $
        {(
          Number(item.precio) *
          item.cantidad
        ).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          disabled={enviando}
        >
          <Text style={styles.backText}>
            ←
          </Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>
            Confirmar pedido
          </Text>

          <Text style={styles.subtitle}>
            Revisa antes de enviar
          </Text>
        </View>
      </View>

      <Text style={styles.label}>
        Nombre o número de mesa
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ej. Mesa 4 o Brian"
        placeholderTextColor="#999"
        value={clienteOMesa}
        onChangeText={setClienteOMesa}
        editable={!enviando}
      />

      <Text style={styles.sectionTitle}>
        Resumen del pedido
      </Text>

      <FlatList
        data={carrito}
        keyExtractor={item =>
          item.id.toString()
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.lista
        }
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            Total
          </Text>

          <Text style={styles.total}>
            ${total.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            enviando &&
              styles.confirmButtonDisabled
          ]}
          onPress={confirmarPedido}
          disabled={enviando}
        >
          {enviando ? (
            <ActivityIndicator
              color="#fff"
            />
          ) : (
            <Text style={styles.confirmText}>
              Confirmar pedido
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F0',
    paddingTop: 55,
    paddingHorizontal: 20
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    elevation: 2
  },

  backText: {
    fontSize: 25,
    color: '#222',
    fontWeight: 'bold'
  },

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#222'
  },

  subtitle: {
    color: '#777',
    marginTop: 2
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 24,
    elevation: 2
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12
  },

  lista: {
    paddingBottom: 180
  },

  item: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2
  },

  itemInfo: {
    flex: 1
  },

  itemName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5
  },

  itemQuantity: {
    color: '#777'
  },

  itemSubtotal: {
    color: '#FF7A00',
    fontSize: 18,
    fontWeight: 'bold'
  },

  footer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 25,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    elevation: 5
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222'
  },

  total: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF7A00'
  },

  confirmButton: {
    backgroundColor: '#FF7A00',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center'
  },

  confirmButtonDisabled: {
    opacity: 0.6
  },

  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});