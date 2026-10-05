import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';

export default function CarritoScreen({
  carrito,
  setCarrito,
  onBack,
  onContinuar
}) {
  const cambiarCantidad = (id, cambio) => {
    setCarrito(actual =>
      actual
        .map(item => {
          if (item.id !== id) {
            return item;
          }

          return {
            ...item,
            cantidad: item.cantidad + cambio
          };
        })
        .filter(item => item.cantidad > 0)
    );
  };

  const eliminarProducto = (id) => {
    setCarrito(actual =>
      actual.filter(item => item.id !== id)
    );
  };

  const total = useMemo(() => {
    return carrito.reduce(
      (suma, item) =>
        suma +
        Number(item.precio) * item.cantidad,
      0
    );
  }, [carrito]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.nombre}>
          {item.nombre}
        </Text>

        <Text style={styles.precio}>
          ${Number(item.precio).toFixed(2)} c/u
        </Text>

        <TouchableOpacity
          onPress={() => eliminarProducto(item.id)}
        >
          <Text style={styles.eliminar}>
            Eliminar
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cantidadContainer}>
        <TouchableOpacity
          style={styles.cantidadBtn}
          onPress={() =>
            cambiarCantidad(item.id, -1)
          }
        >
          <Text style={styles.cantidadBtnText}>
            −
          </Text>
        </TouchableOpacity>

        <Text style={styles.cantidad}>
          {item.cantidad}
        </Text>

        <TouchableOpacity
          style={styles.cantidadBtn}
          onPress={() =>
            cambiarCantidad(item.id, 1)
          }
        >
          <Text style={styles.cantidadBtnText}>
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backText}>
            ←
          </Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>
            Tu carrito
          </Text>

          <Text style={styles.subtitle}>
            Revisa tu pedido
          </Text>
        </View>
      </View>

      {carrito.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>
            🛒
          </Text>

          <Text style={styles.emptyTitle}>
            Tu carrito está vacío
          </Text>

          <Text style={styles.emptyText}>
            Agrega productos desde el menú.
          </Text>
        </View>
      ) : (
        <>
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

          <View style={styles.resumen}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Total
              </Text>

              <Text style={styles.total}>
                ${total.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.continuarButton}
              onPress={onContinuar}
            >
              <Text style={styles.continuarText}>
                Continuar pedido
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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

  lista: {
    paddingBottom: 180
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 17,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2
  },

  info: {
    flex: 1
  },

  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5
  },

  precio: {
    color: '#FF7A00',
    fontWeight: 'bold',
    marginBottom: 7
  },

  eliminar: {
    color: '#c62828',
    fontSize: 13
  },

  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  cantidadBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FF7A00',
    justifyContent: 'center',
    alignItems: 'center'
  },

  cantidadBtnText: {
    color: '#fff',
    fontSize: 23,
    fontWeight: 'bold'
  },

  cantidad: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 14,
    color: '#222'
  },

  resumen: {
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

  continuarButton: {
    backgroundColor: '#FF7A00',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center'
  },

  continuarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80
  },

  emptyIcon: {
    fontSize: 65,
    marginBottom: 15
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6
  },

  emptyText: {
    color: '#777'
  }
});