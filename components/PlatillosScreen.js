import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { apiService } from '../services/api';

const CATEGORIAS = ['PLATILLO', 'BEBIDA', 'POSTRE'];

export default function PlatillosScreen({ onBack }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('PLATILLO');

  const [editingId, setEditingId] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarProductos = async () => {
    try {
      const data = await apiService.getProductos();

      setProductos(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {
      console.log(
        'Error al obtener productos:',
        error
      );

      Alert.alert(
        'Error',
        'No se pudieron cargar los productos'
      );
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setCategoria('PLATILLO');
    setEditingId(null);
  };

  const handleGuardar = async () => {
    const precioNumero = Number(precio);

    if (
      !nombre.trim() ||
      !descripcion.trim() ||
      !precio ||
      precioNumero <= 0
    ) {
      return Alert.alert(
        'Atención',
        'Completa nombre, descripción y un precio mayor que cero'
      );
    }

    const payload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: precioNumero,
      categoria,
    };

    setLoading(true);

    try {
      if (editingId) {
        await apiService.updateProducto(
          editingId,
          payload
        );

        Alert.alert(
          'Éxito',
          'Producto actualizado'
        );

      } else {
        await apiService.createProducto(
          payload
        );

        Alert.alert(
          'Éxito',
          'Producto registrado'
        );
      }

      limpiarFormulario();
      await cargarProductos();

    } catch (error) {
      Alert.alert(
        'Error',
        error.message ||
          'No se pudo guardar el producto'
      );

    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (item) => {
    setNombre(item.nombre || '');
    setDescripcion(item.descripcion || '');
    setPrecio(
      item.precio?.toString() || ''
    );
    setCategoria(
      item.categoria || 'PLATILLO'
    );
    setEditingId(item.id);
  };

  const handleBaja = (id) => {
    Alert.alert(
      'Confirmar',
      '¿Deseas dar de baja este producto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Dar de baja',
          style: 'destructive',

          onPress: async () => {
            try {
              await apiService.deleteProducto(id);

              if (editingId === id) {
                limpiarFormulario();
              }

              await cargarProductos();

              Alert.alert(
                'Éxito',
                'Producto dado de baja'
              );

            } catch (error) {
              Alert.alert(
                'Error',
                error.message ||
                  'No se pudo dar de baja el producto'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>
          Gestión de Productos
        </Text>

        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>
            Volver
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardForm}>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />

        <TextInput
          style={styles.input}
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Precio ($)"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>
          Categoría
        </Text>

        <View style={styles.categoryRow}>
          {CATEGORIAS.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.categoryBtn,
                categoria === item &&
                  styles.categoryBtnActive,
              ]}
              onPress={() =>
                setCategoria(item)
              }
            >
              <Text
                style={[
                  styles.categoryText,
                  categoria === item &&
                    styles.categoryTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.saveBtn,
            editingId &&
              styles.saveBtnEdit,
          ]}
          onPress={handleGuardar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              color="#fff"
            />
          ) : (
            <Text style={styles.saveText}>
              {editingId
                ? 'Actualizar producto'
                : 'Registrar producto'}
            </Text>
          )}
        </TouchableOpacity>

        {editingId && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={limpiarFormulario}
          >
            <Text
              style={styles.cancelText}
            >
              Cancelar edición
            </Text>
          </TouchableOpacity>
        )}

      </View>

      <FlatList
        data={productos}
        keyExtractor={(item) =>
          item.id.toString()
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay productos activos.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>

            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>
                {item.nombre}
              </Text>

              <Text
                style={styles.itemDescription}
              >
                {item.descripcion ||
                  'Sin descripción'}
              </Text>

              <Text style={styles.itemMeta}>
                {item.categoria}
                {' · $'}
                {Number(
                  item.precio
                ).toFixed(2)}
              </Text>
            </View>

            <View style={styles.actionsRow}>

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() =>
                  handleEditar(item)
                }
              >
                <Text
                  style={styles.actionText}
                >
                  Editar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() =>
                  handleBaja(item.id)
                }
              >
                <Text
                  style={styles.actionText}
                >
                  Baja
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#FFF7F0'
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#222'
  },

  backText: {
    color: '#FF7A00',
    fontWeight: 'bold',
    fontSize: 15
  },

  cardForm: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 18,
    marginBottom: 22,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 7
  },

  input: {
    borderWidth: 1,
    borderColor: '#E7E7E7',
    borderRadius: 12,
    padding: 13,
    marginBottom: 13,
    backgroundColor: '#FAFAFA',
    color: '#222',
    fontSize: 15
  },

  label: {
    fontWeight: '600',
    color: '#444',
    marginBottom: 9
  },

  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 17
  },

  categoryBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FF7A00',
    paddingVertical: 10,
    borderRadius: 10
  },

  categoryBtnActive: {
    backgroundColor: '#FF7A00'
  },

  categoryText: {
    textAlign: 'center',
    color: '#FF7A00',
    fontSize: 11,
    fontWeight: 'bold'
  },

  categoryTextActive: {
    color: '#fff'
  },

  saveBtn: {
    backgroundColor: '#FF7A00',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center'
  },

  saveBtnEdit: {
    backgroundColor: '#E89A19'
  },

  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },

  cancelBtn: {
    padding: 11,
    alignItems: 'center'
  },

  cancelText: {
    color: '#777',
    fontWeight: '600'
  },

  itemCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2
  },

  itemInfo: {
    marginBottom: 12
  },

  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222'
  },

  itemDescription: {
    color: '#777',
    marginTop: 4
  },

  itemMeta: {
    color: '#FF7A00',
    marginTop: 6,
    fontWeight: 'bold'
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 8
  },

  editBtn: {
    flex: 1,
    backgroundColor: '#E89A19',
    padding: 10,
    borderRadius: 9
  },

  deleteBtn: {
    flex: 1,
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 9
  },

  actionText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 25
  }
});