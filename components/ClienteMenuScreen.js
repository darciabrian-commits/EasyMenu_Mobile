import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';

import { apiService } from '../services/api';

const normalizarCategoria = (categoria) => {
  if (!categoria) return 'Otros';

  const valor = categoria
    .trim()
    .toUpperCase();

  if (valor === 'BEBIDA' || valor === 'BEBIDAS') {
    return 'Bebidas';
  }

  if (
    valor === 'PLATILLO' ||
    valor === 'PLATO PRINCIPAL'
  ) {
    return 'Plato Principal';
  }

  if (valor === 'POSTRE' || valor === 'POSTRES') {
    return 'Postres';
  }

  return categoria.trim();
};

export default function ClienteMenuScreen({
  carrito,
  setCarrito,
  pedidosCliente,
  onBack,
  onOpenCart,
  onViewOrders
}) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todos');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      setError('');

      const data = await apiService.getProductos();

      const disponibles = data.filter(
        producto =>
          producto.disponible === true &&
          producto.activo === true
      );

      setProductos(disponibles);
    } catch (err) {
      console.log(err);
      setError('No se pudo cargar el menú.');
    } finally {
      setCargando(false);
    }
  };

  const agregarAlCarrito = (producto) => {
    setCarrito(actual => {
      const existente = actual.find(
        item => item.id === producto.id
      );

      if (existente) {
        return actual.map(item =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1
              }
            : item
        );
      }

      return [
        ...actual,
        {
          ...producto,
          cantidad: 1
        }
      ];
    });
  };

  const cantidadCarrito = useMemo(() => {
    return carrito.reduce(
      (total, item) => total + item.cantidad,
      0
    );
  }, [carrito]);

  const categorias = useMemo(() => {
    const lista = productos
      .map(producto =>
        normalizarCategoria(producto.categoria)
      )
      .filter(Boolean);

    return ['Todos', ...new Set(lista)];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    return productos.filter(producto => {
      const coincideNombre = producto.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      const coincideCategoria =
        categoria === 'Todos' ||
        normalizarCategoria(producto.categoria) === categoria;

      return coincideNombre && coincideCategoria;
    });
  }, [productos, busqueda, categoria]);

  const renderProducto = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardInfo}>
          <Text style={styles.productName}>
            {item.nombre}
          </Text>

          <Text style={styles.description}>
            {item.descripcion || 'Sin descripción'}
          </Text>

          <Text style={styles.category}>
            {normalizarCategoria(item.categoria)}
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.85}
            onPress={() => agregarAlCarrito(item)}
          >
            <Text style={styles.addButtonText}>
              + Agregar
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>
          ${Number(item.precio).toFixed(2)}
        </Text>
      </View>
    );
  };

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

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>
            Nuestro menú
          </Text>

          <Text style={styles.subtitle}>
            Elige tus productos favoritos
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={onOpenCart}
        >
          <Text style={styles.cartIcon}>
            🛒
          </Text>

          {cantidadCarrito > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cantidadCarrito}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {pedidosCliente.length > 0 && (
        <TouchableOpacity
          style={styles.orderButton}
          activeOpacity={0.85}
          onPress={onViewOrders}
        >
          <View>
            <Text style={styles.orderButtonTitle}>
              📋 Mis pedidos
            </Text>

            <Text style={styles.orderButtonCode}>
              {pedidosCliente.length === 1
                ? '1 pedido guardado'
                : `${pedidosCliente.length} pedidos guardados`}
            </Text>
          </View>

          <Text style={styles.orderArrow}>
            ›
          </Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.search}
        placeholder="Buscar producto..."
        placeholderTextColor="#999"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <FlatList
        horizontal
        data={categorias}
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
        contentContainerStyle={styles.categoriesContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              categoria === item &&
                styles.categoryButtonActive
            ]}
            onPress={() => setCategoria(item)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                categoria === item &&
                  styles.categoryButtonTextActive
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {cargando ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#FF7A00"
          />

          <Text style={styles.loadingText}>
            Cargando menú...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={cargarProductos}
          >
            <Text style={styles.retryText}>
              Reintentar
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={productosFiltrados}
          keyExtractor={item =>
            item.id.toString()
          }
          renderItem={renderProducto}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No se encontraron productos.
            </Text>
          }
        />
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
    marginBottom: 20
  },

  headerTextContainer: {
    flex: 1
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

  cartButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    marginLeft: 8
  },

  cartIcon: {
    fontSize: 24
  },

  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FF7A00',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5
  },

  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },

  orderButton: {
    backgroundColor: '#222',
    borderRadius: 15,
    paddingHorizontal: 17,
    paddingVertical: 14,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2
  },

  orderButtonTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3
  },

  orderButtonCode: {
    color: '#ddd',
    fontSize: 12
  },

  orderArrow: {
    color: '#FF7A00',
    fontSize: 32,
    fontWeight: 'bold'
  },

  search: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 18,
    elevation: 2
  },

  categories: {
    height: 70,
    maxHeight: 70,
    marginBottom: 18
  },

  categoriesContent: {
    paddingHorizontal: 4,
    paddingVertical: 6,
    paddingRight: 30,
    alignItems: 'center'
  },

  categoryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 10,
    minWidth: 100,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },

  categoryButtonActive: {
    backgroundColor: '#FF7A00'
  },

  categoryButtonText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center'
  },

  categoryButtonTextActive: {
    color: '#fff'
  },

  productList: {
    paddingBottom: 30
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 17,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2
  },

  cardInfo: {
    flex: 1,
    paddingRight: 15
  },

  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5
  },

  description: {
    color: '#777',
    fontSize: 14,
    marginBottom: 8
  },

  category: {
    color: '#FF7A00',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12
  },

  addButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF7A00',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12
  },

  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13
  },

  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF7A00'
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  loadingText: {
    marginTop: 12,
    color: '#777'
  },

  error: {
    color: '#c62828',
    marginBottom: 15
  },

  retryButton: {
    backgroundColor: '#FF7A00',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12
  },

  retryText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 40
  }
});