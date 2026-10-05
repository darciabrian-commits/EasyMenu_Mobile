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
  RefreshControl
} from 'react-native';

import { apiService } from '../services/api';

export default function PedidosScreen({
  onBack,
  rol
}) {

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refrescando, setRefrescando] = useState(false);

  // CAJERO
  const [codigo, setCodigo] = useState('');
  const [pedidoBuscado, setPedidoBuscado] = useState(null);
  const [buscando, setBuscando] = useState(false);

  // =============================
  // CARGAR PEDIDOS
  // =============================

  const cargarPedidos = async (
    mostrarCarga = true
  ) => {

    try {

      if (mostrarCarga) {
        setLoading(true);
      }

      const data =
        await apiService.getPedidos();

      const lista =
        Array.isArray(data)
          ? data
          : [];

      // Ordenar de más antiguo a más nuevo.
      lista.sort((a, b) => {

        if (a.fecha && b.fecha) {
          return (
            new Date(a.fecha) -
            new Date(b.fecha)
          );
        }

        return (
          Number(a.id || 0) -
          Number(b.id || 0)
        );
      });

      setPedidos(lista);

    } catch (error) {

      console.log(
        'Error cargando pedidos:',
        error
      );

      Alert.alert(
        'Error',
        'No se pudieron cargar los pedidos.'
      );

    } finally {

      setLoading(false);
      setRefrescando(false);

    }
  };

  useEffect(() => {

    cargarPedidos();

  }, []);

  // =============================
  // ACTUALIZAR
  // =============================

  const refrescar = () => {

    setRefrescando(true);

    cargarPedidos(false);

  };

  // =============================
  // CAMBIAR ESTADO
  // =============================

  const actualizarEstado = (
    pedido,
    nuevoEstado
  ) => {

    Alert.alert(
      'Confirmar',
      `¿Cambiar el pedido #${pedido.id} a ${formatearEstado(nuevoEstado)}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Confirmar',

          onPress: async () => {

            try {

              setLoading(true);

              await apiService
                .cambiarEstadoPedido(
                  pedido.id,
                  nuevoEstado
                );

              await cargarPedidos(false);

              // Si cajero tiene ese pedido abierto,
              // volver a consultarlo.
              if (
                pedidoBuscado?.id ===
                pedido.id
              ) {

                try {

                  const actualizado =
                    await apiService
                      .getPedidoPorCodigo(
                        pedidoBuscado.codigoCorto
                      );

                  setPedidoBuscado(
                    actualizado
                  );

                } catch (e) {

                  console.log(e);

                }
              }

              Alert.alert(
                'Éxito',
                `Pedido actualizado a ${formatearEstado(nuevoEstado)}.`
              );

            } catch (error) {

              console.log(
                'Error cambiando estado:',
                error
              );

              Alert.alert(
                'Error',
                error.message ||
                'No se pudo cambiar el estado.'
              );

            } finally {

              setLoading(false);

            }
          }
        }
      ]
    );
  };

  // =============================
  // BUSCAR POR CÓDIGO - CAJERO
  // =============================

  const buscarPorCodigo = async () => {

    const codigoLimpio =
      codigo.trim().toUpperCase();

    if (!codigoLimpio) {

      return Alert.alert(
        'Atención',
        'Ingresa el código del pedido.'
      );

    }

    try {

      setBuscando(true);
      setPedidoBuscado(null);

      const pedido =
        await apiService
          .getPedidoPorCodigo(
            codigoLimpio
          );

      setPedidoBuscado(pedido);

    } catch (error) {

      console.log(
        'Error buscando pedido:',
        error
      );

      Alert.alert(
        'Pedido no encontrado',
        'Verifica el código e intenta nuevamente.'
      );

    } finally {

      setBuscando(false);

    }
  };

  // =============================
  // UTILIDADES
  // =============================

  const formatearEstado = (estado) => {

    const estados = {

      PENDIENTE_PAGO:
        'Pendiente de pago',

      RECIBIDO:
        'Recibido',

      EN_PREPARACION:
        'En preparación',

      LISTO:
        'Listo',

      ENTREGADO:
        'Entregado',

      CANCELADO:
        'Cancelado',

      EXPIRADO:
        'Expirado',

      PENDIENTE_REEMBOLSO:
        'Pendiente de reembolso',

      REEMBOLSADO:
        'Reembolsado'

    };

    return estados[estado] || estado;

  };

  const colorEstado = (estado) => {

    if (estado === 'RECIBIDO') {
      return '#1565C0';
    }

    if (estado === 'EN_PREPARACION') {
      return '#EF6C00';
    }

    if (estado === 'LISTO') {
      return '#2E7D32';
    }

    if (estado === 'ENTREGADO') {
      return '#424242';
    }

    if (estado === 'CANCELADO') {
      return '#C62828';
    }

    if (
      estado === 'PENDIENTE_PAGO'
    ) {
      return '#F57C00';
    }

    return '#666';
  };

  // =============================
  // PEDIDOS PARA COCINA
  // =============================

  const pedidosCocina =
    pedidos.filter(
      pedido =>
        pedido.estado === 'RECIBIDO' ||
        pedido.estado ===
          'EN_PREPARACION'
    );

  // =============================
  // PEDIDOS LISTOS CAJERO
  // =============================

  const pedidosListos =
    pedidos.filter(
      pedido =>
        pedido.estado === 'LISTO'
    );

  // =============================
  // CARD GENERAL
  // =============================

  const PedidoCard = ({
    pedido,
    tipo
  }) => {

    return (

      <View style={styles.pedidoCard}>

        <View
          style={
            styles.cardHeader
          }
        >

          <View>

            <Text
              style={
                styles.pedidoTitle
              }
            >
              {pedido.clienteOMesa ||
                'Cliente'}
            </Text>

            <Text
              style={
                styles.pedidoNumero
              }
            >
              Pedido #{pedido.id}
            </Text>

          </View>

          <View
            style={[
              styles.estadoBadge,
              {
                backgroundColor:
                  `${colorEstado(
                    pedido.estado
                  )}18`
              }
            ]}
          >

            <Text
              style={[
                styles.estadoBadgeText,
                {
                  color:
                    colorEstado(
                      pedido.estado
                    )
                }
              ]}
            >
              {formatearEstado(
                pedido.estado
              )}
            </Text>

          </View>

        </View>

        {pedido.codigoCorto && (

          <View style={styles.codigoBox}>

            <Text
              style={
                styles.codigoLabel
              }
            >
              Código
            </Text>

            <Text
              style={
                styles.codigoTexto
              }
            >
              {pedido.codigoCorto}
            </Text>

          </View>

        )}

        <Text style={styles.total}>
          Total: $
          {Number(
            pedido.total || 0
          ).toFixed(2)}
        </Text>

        {/* ======================
            COCINA
        ====================== */}

        {tipo === 'COCINA' &&
          pedido.estado ===
            'RECIBIDO' && (

          <TouchableOpacity
            style={
              styles.primaryButton
            }

            onPress={() =>
              actualizarEstado(
                pedido,
                'EN_PREPARACION'
              )
            }
          >

            <Text
              style={
                styles.buttonText
              }
            >
              👨‍🍳 Iniciar preparación
            </Text>

          </TouchableOpacity>

        )}

        {tipo === 'COCINA' &&
          pedido.estado ===
            'EN_PREPARACION' && (

          <TouchableOpacity
            style={
              styles.greenButton
            }

            onPress={() =>
              actualizarEstado(
                pedido,
                'LISTO'
              )
            }
          >

            <Text
              style={
                styles.buttonText
              }
            >
              ✓ Marcar como listo
            </Text>

          </TouchableOpacity>

        )}

        {/* ======================
            CAJERO
        ====================== */}

        {tipo === 'CAJERO' &&
          pedido.estado ===
            'LISTO' && (

          <TouchableOpacity
            style={
              styles.greenButton
            }

            onPress={() =>
              actualizarEstado(
                pedido,
                'ENTREGADO'
              )
            }
          >

            <Text
              style={
                styles.buttonText
              }
            >
              ✓ Marcar como entregado
            </Text>

          </TouchableOpacity>

        )}

      </View>

    );
  };

  // =============================
  // CARGA INICIAL
  // =============================

  if (
    loading &&
    pedidos.length === 0
  ) {

    return (

      <View
        style={
          styles.loadingContainer
        }
      >

        <ActivityIndicator
          size="large"
          color="#FF7A00"
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Cargando pedidos...
        </Text>

      </View>

    );
  }

  // =============================
  // COCINA
  // =============================

  if (rol === 'COCINA') {

    return (

      <View style={styles.container}>

        <TouchableOpacity
          onPress={onBack}
          style={
            styles.backButton
          }
        >

          <Text
            style={
              styles.backText
            }
          >
            ← Volver
          </Text>

        </TouchableOpacity>

        <Text style={styles.brand}>
          EasyMenu
        </Text>

        <Text style={styles.title}>
          Pedidos de Cocina
        </Text>

        <Text style={styles.subtitle}>
          Pedidos recibidos y en preparación
        </Text>

        <FlatList
          data={pedidosCocina}

          keyExtractor={item =>
            item.id.toString()
          }

          renderItem={({ item }) => (

            <PedidoCard
              pedido={item}
              tipo="COCINA"
            />

          )}

          refreshControl={

            <RefreshControl
              refreshing={
                refrescando
              }

              onRefresh={
                refrescar
              }

              tintColor="#FF7A00"
            />

          }

          ListEmptyComponent={

            <View
              style={
                styles.emptyBox
              }
            >

              <Text
                style={
                  styles.emptyIcon
                }
              >
                👨‍🍳
              </Text>

              <Text
                style={
                  styles.emptyTitle
                }
              >
                Cocina al día
              </Text>

              <Text
                style={
                  styles.empty
                }
              >
                No hay pedidos pendientes de preparación.
              </Text>

            </View>

          }
        />

      </View>

    );
  }

  // =============================
  // CAJERO
  // =============================

  if (rol === 'CAJERO') {

    return (

      <View style={styles.container}>

        <TouchableOpacity
          onPress={onBack}
          style={
            styles.backButton
          }
        >

          <Text
            style={
              styles.backText
            }
          >
            ← Volver
          </Text>

        </TouchableOpacity>

        <Text style={styles.brand}>
          EasyMenu
        </Text>

        <Text style={styles.title}>
          Caja y Pedidos
        </Text>

        <Text style={styles.subtitle}>
          Cobra pedidos y registra entregas
        </Text>

        {/* BUSCAR CÓDIGO */}

        <View
          style={
            styles.buscarCard
          }
        >

          <Text
            style={
              styles.sectionTitle
            }
          >
            Cobrar pedido
          </Text>

          <Text
            style={
              styles.sectionDescription
            }
          >
            Ingresa el código corto que proporciona el cliente.
          </Text>

          <View
            style={
              styles.searchRow
            }
          >

            <TextInput
              style={
                styles.searchInput
              }

              placeholder="Ej. A8301F"

              value={codigo}

              onChangeText={
                setCodigo
              }

              autoCapitalize="characters"

              maxLength={10}
            />

            <TouchableOpacity
              style={
                styles.searchButton
              }

              onPress={
                buscarPorCodigo
              }

              disabled={buscando}
            >

              {buscando ? (

                <ActivityIndicator
                  color="#fff"
                />

              ) : (

                <Text
                  style={
                    styles.buttonText
                  }
                >
                  Buscar
                </Text>

              )}

            </TouchableOpacity>

          </View>

        </View>

        {/* PEDIDO ENCONTRADO */}

        {pedidoBuscado && (

          <View
            style={
              styles.resultadoBox
            }
          >

            <Text
              style={
                styles.resultadoTitle
              }
            >
              Pedido encontrado
            </Text>

            <Text
              style={
                styles.resultadoCodigo
              }
            >
              {pedidoBuscado.codigoCorto}
            </Text>

            <Text
              style={
                styles.resultadoInfo
              }
            >
              {pedidoBuscado.clienteOMesa}
            </Text>

            <Text
              style={
                styles.resultadoInfo
              }
            >
              Estado:{' '}
              {formatearEstado(
                pedidoBuscado.estado
              )}
            </Text>

            <Text
              style={
                styles.resultadoTotal
              }
            >
              $
              {Number(
                pedidoBuscado.total ||
                0
              ).toFixed(2)}
            </Text>

            {pedidoBuscado.estado ===
              'PENDIENTE_PAGO' && (

              <TouchableOpacity
                style={
                  styles.greenButton
                }

                onPress={() =>
                  actualizarEstado(
                    pedidoBuscado,
                    'RECIBIDO'
                  )
                }
              >

                <Text
                  style={
                    styles.buttonText
                  }
                >
                  💳 Confirmar pago
                </Text>

              </TouchableOpacity>

            )}

            {pedidoBuscado.estado !==
              'PENDIENTE_PAGO' && (

              <Text
                style={
                  styles.infoMessage
                }
              >
                Este pedido ya no está pendiente de pago.
              </Text>

            )}

          </View>

        )}

        <Text
          style={
            styles.listTitle
          }
        >
          Pedidos listos para entregar
        </Text>

        <FlatList
          data={pedidosListos}

          keyExtractor={item =>
            item.id.toString()
          }

          renderItem={({ item }) => (

            <PedidoCard
              pedido={item}
              tipo="CAJERO"
            />

          )}

          refreshControl={

            <RefreshControl
              refreshing={
                refrescando
              }

              onRefresh={
                refrescar
              }

              tintColor="#FF7A00"
            />

          }

          ListEmptyComponent={

            <Text style={styles.empty}>
              No hay pedidos listos para entregar.
            </Text>

          }
        />

      </View>

    );
  }

  // =============================
  // ADMINISTRADOR
  // =============================

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

      <Text style={styles.brand}>
        EasyMenu
      </Text>

      <Text style={styles.title}>
        Gestión de Pedidos
      </Text>

      <Text style={styles.subtitle}>
        Consulta general de pedidos
      </Text>

      <View
        style={
          styles.adminResumen
        }
      >

        <View
          style={
            styles.resumenItem
          }
        >
          <Text
            style={
              styles.resumenNumero
            }
          >
            {pedidos.length}
          </Text>

          <Text
            style={
              styles.resumenLabel
            }
          >
            Pedidos
          </Text>
        </View>

        <View
          style={
            styles.resumenItem
          }
        >
          <Text
            style={
              styles.resumenNumero
            }
          >
            {
              pedidos.filter(
                p =>
                  p.estado ===
                  'RECIBIDO' ||
                  p.estado ===
                  'EN_PREPARACION' ||
                  p.estado ===
                  'LISTO'
              ).length
            }
          </Text>

          <Text
            style={
              styles.resumenLabel
            }
          >
            Activos
          </Text>
        </View>

        <View
          style={
            styles.resumenItem
          }
        >
          <Text
            style={
              styles.resumenNumero
            }
          >
            {
              pedidos.filter(
                p =>
                  p.estado ===
                  'ENTREGADO'
              ).length
            }
          </Text>

          <Text
            style={
              styles.resumenLabel
            }
          >
            Entregados
          </Text>
        </View>

      </View>

      <FlatList
        data={pedidos}

        keyExtractor={item =>
          item.id.toString()
        }

        renderItem={({ item }) => (

          <PedidoCard
            pedido={item}
            tipo="ADMINISTRADOR"
          />

        )}

        refreshControl={

          <RefreshControl
            refreshing={
              refrescando
            }

            onRefresh={
              refrescar
            }

            tintColor="#FF7A00"
          />

        }

        ListEmptyComponent={

          <Text style={styles.empty}>
            No hay pedidos registrados.
          </Text>

        }
      />

    </View>

  );
}

// =============================
// ESTILOS
// =============================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFF7F0',
    paddingHorizontal: 20,
    paddingTop: 50
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFF7F0',
    justifyContent: 'center',
    alignItems: 'center'
  },

  loadingText: {
    color: '#777',
    marginTop: 12
  },

  backButton: {
    marginBottom: 12,
    alignSelf: 'flex-start'
  },

  backText: {
    color: '#FF7A00',
    fontWeight: 'bold',
    fontSize: 15
  },

  brand: {
    color: '#FF7A00',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222'
  },

  subtitle: {
    color: '#777',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 20
  },

  pedidoCard: {
    backgroundColor: '#fff',
    padding: 17,
    borderRadius: 17,
    marginBottom: 13,
    elevation: 2
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },

  pedidoTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222'
  },

  pedidoNumero: {
    color: '#888',
    fontSize: 12,
    marginTop: 3
  },

  estadoBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6
  },

  estadoBadgeText: {
    fontSize: 11,
    fontWeight: 'bold'
  },

  codigoBox: {
    marginTop: 15
  },

  codigoLabel: {
    color: '#999',
    fontSize: 11
  },

  codigoTexto: {
    color: '#222',
    fontSize: 18,
    fontWeight: 'bold'
  },

  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 12,
    marginBottom: 8
  },

  primaryButton: {
    backgroundColor: '#FF7A00',
    padding: 13,
    borderRadius: 11,
    marginTop: 10
  },

  greenButton: {
    backgroundColor: '#2E7D32',
    padding: 13,
    borderRadius: 11,
    marginTop: 10
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  buscarCard: {
    backgroundColor: '#fff',
    padding: 17,
    borderRadius: 17,
    marginBottom: 18,
    elevation: 2
  },

  sectionTitle: {
    color: '#222',
    fontSize: 18,
    fontWeight: 'bold'
  },

  sectionDescription: {
    color: '#777',
    marginTop: 5,
    marginBottom: 13,
    fontSize: 13
  },

  searchRow: {
    flexDirection: 'row'
  },

  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 11,
    paddingHorizontal: 13,
    backgroundColor: '#FAFAFA',
    marginRight: 8
  },

  searchButton: {
    backgroundColor: '#FF7A00',
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 11
  },

  resultadoBox: {
    backgroundColor: '#222',
    borderRadius: 17,
    padding: 18,
    marginBottom: 20
  },

  resultadoTitle: {
    color: '#AAA',
    fontSize: 12
  },

  resultadoCodigo: {
    color: '#FF7A00',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 3
  },

  resultadoInfo: {
    color: '#EEE',
    marginTop: 6
  },

  resultadoTotal: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10
  },

  infoMessage: {
    color: '#CCC',
    marginTop: 12,
    fontSize: 12
  },

  listTitle: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
    marginBottom: 12
  },

  emptyBox: {
    marginTop: 70,
    alignItems: 'center'
  },

  emptyIcon: {
    fontSize: 40
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 10
  },

  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 8,
    marginBottom: 30
  },

  adminResumen: {
    flexDirection: 'row',
    marginBottom: 20
  },

  resumenItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 12,
    marginHorizontal: 3,
    alignItems: 'center',
    elevation: 1
  },

  resumenNumero: {
    color: '#FF7A00',
    fontSize: 22,
    fontWeight: 'bold'
  },

  resumenLabel: {
    color: '#777',
    fontSize: 11,
    marginTop: 3
  }

}); 