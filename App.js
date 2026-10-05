import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';

import BienvenidaScreen from './components/BienvenidaScreen';
import LoginScreen from './components/LoginScreen';
import PlatillosScreen from './components/PlatillosScreen';
import PedidosScreen from './components/PedidosScreen';
import ClienteMenuScreen from './components/ClienteMenuScreen';
import CarritoScreen from './components/CarritoScreen';
import ConfirmarPedidoScreen from './components/ConfirmarPedidoScreen';

import { apiService } from './services/api';
import { pedidosStorage } from './services/pedidosStorage';

export default function App() {
  const [screen, setScreen] = useState('bienvenida');
  const [session, setSession] = useState(null);

  const [carrito, setCarrito] = useState([]);

  const [pedidosCliente, setPedidosCliente] = useState([]);

  const [pedidoSeleccionado, setPedidoSeleccionado] =
    useState(null);

  const [cargandoPedido, setCargandoPedido] =
    useState(false);

  const [pedidoRecienCreado, setPedidoRecienCreado] =
    useState(false);

  const [storageCargado, setStorageCargado] =
    useState(false);

  // =========================
  // CARGAR PEDIDOS GUARDADOS
  // =========================

  useEffect(() => {
    const cargarPedidosGuardados = async () => {
      try {
        const guardados =
          await pedidosStorage.obtenerPedidos();

        if (Array.isArray(guardados)) {
          setPedidosCliente(guardados);
        }
      } catch (error) {
        console.log(
          'Error cargando pedidos guardados:',
          error
        );
      } finally {
        setStorageCargado(true);
      }
    };

    cargarPedidosGuardados();
  }, []);

  // =========================
  // GUARDAR PEDIDOS
  // =========================

  useEffect(() => {
    if (!storageCargado) {
      return;
    }

    pedidosStorage.guardarPedidos(
      pedidosCliente
    );
  }, [pedidosCliente, storageCargado]);

  // =========================
  // LOGIN
  // =========================

  const handleLoginSuccess = (loginResponse) => {
    setSession(loginResponse);
    setScreen('dashboard');
  };

  const handleLogout = () => {
    apiService.logout();
    setSession(null);
    setScreen('bienvenida');
  };

  // =========================
  // ACTUALIZAR PEDIDO EN LISTA
  // =========================

  const actualizarPedidoEnLista = (
    pedidoActualizado
  ) => {
    setPedidosCliente(actual =>
      actual.map(pedido =>
        pedido.codigoCorto ===
        pedidoActualizado.codigoCorto
          ? pedidoActualizado
          : pedido
      )
    );
  };

  // =========================
  // CONSULTAR PEDIDO REAL
  // =========================

  const consultarPedido = async (pedido) => {
    try {
      setCargandoPedido(true);

      const actualizado =
        await apiService.getPedidoPorCodigo(
          pedido.codigoCorto
        );

      setPedidoSeleccionado(actualizado);

      actualizarPedidoEnLista(
        actualizado
      );

      return actualizado;

    } catch (error) {
      console.log(error);

      Alert.alert(
        'No se pudo actualizar',
        'No fue posible consultar el estado del pedido.'
      );

      return pedido;

    } finally {
      setCargandoPedido(false);
    }
  };

  // =========================
  // ABRIR PEDIDO CLIENTE
  // =========================

  const abrirPedido = async (pedido) => {
    setPedidoSeleccionado(pedido);

    setPedidoRecienCreado(false);

    setScreen('pedidoConfirmado');

    await consultarPedido(pedido);
  };

  // =========================
  // REFRESCAR PEDIDO
  // =========================

  const refrescarPedidoSeleccionado =
    async () => {

      if (!pedidoSeleccionado) {
        return;
      }

      await consultarPedido(
        pedidoSeleccionado
      );
    };

  // =========================
  // CANCELAR PEDIDO CLIENTE
  // =========================

  const cancelarPedidoSeleccionado = () => {
    if (!pedidoSeleccionado) {
      return;
    }

    if (
      pedidoSeleccionado.estado !==
      'PENDIENTE_PAGO'
    ) {
      Alert.alert(
        'No se puede cancelar',
        'Este pedido ya no está pendiente de pago.'
      );

      return;
    }

    Alert.alert(
      'Cancelar pedido',
      `¿Deseas cancelar el pedido ${pedidoSeleccionado.codigoCorto}?`,
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
              setCargandoPedido(true);

              await apiService.cancelarPedidoPorCodigo(
                pedidoSeleccionado.codigoCorto
              );

              const actualizado =
                await apiService.getPedidoPorCodigo(
                  pedidoSeleccionado.codigoCorto
                );

              setPedidoSeleccionado(
                actualizado
              );

              actualizarPedidoEnLista(
                actualizado
              );

              Alert.alert(
                'Pedido cancelado',
                'El pedido fue cancelado correctamente.'
              );

            } catch (error) {
              console.log(error);

              Alert.alert(
                'Error',
                'No se pudo cancelar el pedido.'
              );

            } finally {
              setCargandoPedido(false);
            }
          }
        }
      ]
    );
  };

  // =========================
  // BIENVENIDA
  // =========================

  if (screen === 'bienvenida') {
    return (
      <BienvenidaScreen
        onClient={() =>
          setScreen('clienteMenu')
        }
        onStaff={() =>
          setScreen('login')
        }
      />
    );
  }

  // =========================
  // LOGIN PERSONAL
  // =========================

  if (screen === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={
          handleLoginSuccess
        }
        onBack={() =>
          setScreen('bienvenida')
        }
      />
    );
  }

  // =========================
  // MENÚ CLIENTE
  // =========================

  if (screen === 'clienteMenu') {
    return (
      <ClienteMenuScreen
        carrito={carrito}
        setCarrito={setCarrito}
        pedidosCliente={pedidosCliente}

        onBack={() =>
          setScreen('bienvenida')
        }

        onOpenCart={() =>
          setScreen('carrito')
        }

        onViewOrders={() =>
          setScreen('misPedidos')
        }
      />
    );
  }

  // =========================
  // CARRITO
  // =========================

  if (screen === 'carrito') {
    return (
      <CarritoScreen
        carrito={carrito}
        setCarrito={setCarrito}

        onBack={() =>
          setScreen('clienteMenu')
        }

        onContinuar={() =>
          setScreen('confirmarPedido')
        }
      />
    );
  }

  // =========================
  // CONFIRMAR PEDIDO
  // =========================

  if (screen === 'confirmarPedido') {
    return (
      <ConfirmarPedidoScreen
        carrito={carrito}

        onBack={() =>
          setScreen('carrito')
        }

        onPedidoCreado={(pedido) => {

          setPedidosCliente(actual => [
            ...actual,
            pedido
          ]);

          setPedidoSeleccionado(
            pedido
          );

          setPedidoRecienCreado(
            true
          );

          setCarrito([]);

          setScreen(
            'pedidoConfirmado'
          );
        }}
      />
    );
  }

  // =========================
  // DETALLE PEDIDO CLIENTE
  // =========================

  if (screen === 'pedidoConfirmado') {
    return (
      <ScrollView
        contentContainerStyle={
          styles.detailContainer
        }
      >

        <Text style={styles.title}>
          {pedidoRecienCreado
            ? 'Pedido enviado ✅'
            : 'Detalle del pedido'}
        </Text>

        {cargandoPedido && (
          <View style={styles.loadingBox}>

            <ActivityIndicator
              size="small"
              color="#FF7A00"
            />

            <Text style={styles.loadingText}>
              Actualizando pedido...
            </Text>

          </View>
        )}

        <View style={styles.detailCard}>

          <Text style={styles.detailLabel}>
            Código
          </Text>

          <Text style={styles.code}>
            {pedidoSeleccionado
              ?.codigoCorto || '---'}
          </Text>

          <Text style={styles.detailLabel}>
            Estado
          </Text>

          <Text style={styles.status}>
            {pedidoSeleccionado
              ?.estado || '---'}
          </Text>

          <Text style={styles.detailLabel}>
            Total
          </Text>

          <Text style={styles.total}>
            $
            {Number(
              pedidoSeleccionado
                ?.total || 0
            ).toFixed(2)}
          </Text>

        </View>

        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={
            refrescarPedidoSeleccionado
          }
          disabled={cargandoPedido}
        >
          <Text style={styles.txt}>
            Actualizar estado
          </Text>
        </TouchableOpacity>

        {pedidoSeleccionado?.estado ===
          'PENDIENTE_PAGO' && (

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={
              cancelarPedidoSeleccionado
            }
            disabled={cargandoPedido}
          >
            <Text style={styles.txt}>
              Cancelar pedido
            </Text>
          </TouchableOpacity>

        )}

        <TouchableOpacity
          style={styles.btn}

          onPress={() => {

            setPedidoRecienCreado(
              false
            );

            setScreen(
              'clienteMenu'
            );
          }}
        >
          <Text style={styles.txt}>
            Volver al menú
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.darkBtn}

          onPress={() => {

            setPedidoRecienCreado(
              false
            );

            setScreen(
              'misPedidos'
            );
          }}
        >
          <Text style={styles.txt}>
            Ver mis pedidos
          </Text>
        </TouchableOpacity>

      </ScrollView>
    );
  }

  // =========================
  // MIS PEDIDOS CLIENTE
  // =========================

  if (screen === 'misPedidos') {
    return (
      <ScrollView
        contentContainerStyle={
          styles.ordersContainer
        }
      >

        <Text style={styles.title}>
          Mis pedidos
        </Text>

        {pedidosCliente.length === 0 ? (

          <Text style={styles.role}>
            Todavía no tienes pedidos.
          </Text>

        ) : (

          pedidosCliente.map(
            pedido => (

              <TouchableOpacity
                key={
                  pedido.codigoCorto
                }

                style={
                  styles.orderCard
                }

                onPress={() =>
                  abrirPedido(pedido)
                }
              >

                <Text
                  style={
                    styles.orderCode
                  }
                >
                  Código:{' '}
                  {pedido.codigoCorto}
                </Text>

                <Text
                  style={
                    styles.orderInfo
                  }
                >
                  Estado:{' '}
                  {pedido.estado}
                </Text>

                <Text
                  style={
                    styles.orderInfo
                  }
                >
                  Total: $
                  {Number(
                    pedido.total || 0
                  ).toFixed(2)}
                </Text>

                <Text
                  style={
                    styles.orderOpen
                  }
                >
                  Ver pedido →
                </Text>

              </TouchableOpacity>
            )
          )
        )}

        <TouchableOpacity
          style={styles.darkBtn}

          onPress={() =>
            setScreen(
              'clienteMenu'
            )
          }
        >
          <Text style={styles.txt}>
            Volver al menú
          </Text>
        </TouchableOpacity>

      </ScrollView>
    );
  }

  // =========================
  // PRODUCTOS PERSONAL
  // =========================

  if (screen === 'productos') {
    return (
      <PlatillosScreen
        onBack={() =>
          setScreen('dashboard')
        }
      />
    );
  }

  // =========================
  // PEDIDOS PERSONAL
  // =========================

  if (screen === 'pedidos') {
    return (
      <PedidosScreen
        rol={session?.rol}

        onBack={() =>
          setScreen('dashboard')
        }
      />
    );
  }

  // =========================
  // DASHBOARD PERSONAL
  // =========================

  const obtenerTituloRol = () => {

    if (
      session?.rol ===
      'ADMINISTRADOR'
    ) {
      return 'Panel de Administración';
    }

    if (
      session?.rol ===
      'CAJERO'
    ) {
      return 'Panel de Caja';
    }

    if (
      session?.rol ===
      'COCINA'
    ) {
      return 'Panel de Cocina';
    }

    return 'Panel Principal';
  };

  const obtenerDescripcionRol = () => {

    if (
      session?.rol ===
      'ADMINISTRADOR'
    ) {
      return 'Administra productos, pedidos y operaciones de EasyMenu.';
    }

    if (
      session?.rol ===
      'CAJERO'
    ) {
      return 'Gestiona cobros, entregas y pedidos de clientes.';
    }

    if (
      session?.rol ===
      'COCINA'
    ) {
      return 'Consulta y prepara los pedidos recibidos.';
    }

    return 'Bienvenido a EasyMenu';
  };

  return (
    <ScrollView
      contentContainerStyle={
        styles.dashboardContainer
      }
    >

      <View
        style={
          styles.dashboardHeader
        }
      >

        <Text style={styles.brand}>
          EasyMenu
        </Text>

        <Text
          style={
            styles.dashboardTitle
          }
        >
          {obtenerTituloRol()}
        </Text>

        <Text
          style={
            styles.dashboardDescription
          }
        >
          {obtenerDescripcionRol()}
        </Text>

        <View style={styles.roleBadge}>
          <Text
            style={
              styles.roleBadgeText
            }
          >
            {session?.rol || 'SIN ROL'}
          </Text>
        </View>

      </View>

      {/* ADMINISTRADOR */}

      {session?.rol ===
        'ADMINISTRADOR' && (

        <View
          style={
            styles.dashboardOptions
          }
        >

          <TouchableOpacity
            style={
              styles.dashboardCard
            }

            activeOpacity={0.85}

            onPress={() =>
              setScreen('productos')
            }
          >

            <View
              style={
                styles.dashboardIconBox
              }
            >
              <Text
                style={
                  styles.dashboardIcon
                }
              >
                🍔
              </Text>
            </View>

            <View
              style={
                styles.dashboardCardInfo
              }
            >

              <Text
                style={
                  styles.dashboardCardTitle
                }
              >
                Gestión de productos
              </Text>

              <Text
                style={
                  styles.dashboardCardText
                }
              >
                Registrar, editar y administrar productos del menú.
              </Text>

            </View>

            <Text
              style={
                styles.dashboardArrow
              }
            >
              ›
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={
              styles.dashboardCard
            }

            activeOpacity={0.85}

            onPress={() =>
              setScreen('pedidos')
            }
          >

            <View
              style={
                styles.dashboardIconBox
              }
            >
              <Text
                style={
                  styles.dashboardIcon
                }
              >
                📋
              </Text>
            </View>

            <View
              style={
                styles.dashboardCardInfo
              }
            >

              <Text
                style={
                  styles.dashboardCardTitle
                }
              >
                Gestión de pedidos
              </Text>

              <Text
                style={
                  styles.dashboardCardText
                }
              >
                Consultar pedidos y revisar sus estados.
              </Text>

            </View>

            <Text
              style={
                styles.dashboardArrow
              }
            >
              ›
            </Text>

          </TouchableOpacity>

          <View
            style={
              styles.dashboardCardDisabled
            }
          >

            <View
              style={
                styles.dashboardIconBox
              }
            >
              <Text
                style={
                  styles.dashboardIcon
                }
              >
                💰
              </Text>
            </View>

            <View
              style={
                styles.dashboardCardInfo
              }
            >

              <Text
                style={
                  styles.dashboardCardTitle
                }
              >
                Ventas del día
              </Text>

              <Text
                style={
                  styles.dashboardCardText
                }
              >
                Próximamente agregaremos el resumen diario de ventas.
              </Text>

            </View>

          </View>

        </View>
      )}

      {/* CAJERO */}

      {session?.rol ===
        'CAJERO' && (

        <View
          style={
            styles.dashboardOptions
          }
        >

          <TouchableOpacity
            style={
              styles.dashboardCard
            }

            activeOpacity={0.85}

            onPress={() =>
              setScreen('pedidos')
            }
          >

            <View
              style={
                styles.dashboardIconBox
              }
            >
              <Text
                style={
                  styles.dashboardIcon
                }
              >
                💳
              </Text>
            </View>

            <View
              style={
                styles.dashboardCardInfo
              }
            >

              <Text
                style={
                  styles.dashboardCardTitle
                }
              >
                Caja y pedidos
              </Text>

              <Text
                style={
                  styles.dashboardCardText
                }
              >
                Cobrar pedidos por código, entregar y gestionar operaciones.
              </Text>

            </View>

            <Text
              style={
                styles.dashboardArrow
              }
            >
              ›
            </Text>

          </TouchableOpacity>

        </View>
      )}

      {/* COCINA */}

      {session?.rol ===
        'COCINA' && (

        <View
          style={
            styles.dashboardOptions
          }
        >

          <TouchableOpacity
            style={
              styles.dashboardCard
            }

            activeOpacity={0.85}

            onPress={() =>
              setScreen('pedidos')
            }
          >

            <View
              style={
                styles.dashboardIconBox
              }
            >
              <Text
                style={
                  styles.dashboardIcon
                }
              >
                👨‍🍳
              </Text>
            </View>

            <View
              style={
                styles.dashboardCardInfo
              }
            >

              <Text
                style={
                  styles.dashboardCardTitle
                }
              >
                Pedidos de cocina
              </Text>

              <Text
                style={
                  styles.dashboardCardText
                }
              >
                Consulta pedidos recibidos y actualiza su preparación.
              </Text>

            </View>

            <Text
              style={
                styles.dashboardArrow
              }
            >
              ›
            </Text>

          </TouchableOpacity>

        </View>
      )}

      <TouchableOpacity
        style={
          styles.dashboardLogout
        }

        activeOpacity={0.85}

        onPress={handleLogout}
      >
        <Text
          style={
            styles.dashboardLogoutText
          }
        >
          Cerrar sesión
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFF7F0'
  },

  ordersContainer: {
    flexGrow: 1,
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#FFF7F0'
  },

  detailContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFF7F0'
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    color: '#222'
  },

  role: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 15,
    fontSize: 16
  },

  btn: {
    backgroundColor: '#FF7A00',
    padding: 15,
    borderRadius: 12,
    marginTop: 15
  },

  darkBtn: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 12,
    marginTop: 12
  },

  refreshBtn: {
    backgroundColor: '#FF7A00',
    padding: 15,
    borderRadius: 12,
    marginTop: 15
  },

  cancelBtn: {
    backgroundColor: '#C62828',
    padding: 15,
    borderRadius: 12,
    marginTop: 12
  },

  logoutBtn: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15
  },

  txt: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  detailCard: {
    backgroundColor: '#fff',
    padding: 22,
    borderRadius: 18,
    elevation: 3,
    marginBottom: 5
  },

  detailLabel: {
    color: '#888',
    fontSize: 13,
    marginTop: 12,
    marginBottom: 3
  },

  code: {
    color: '#222',
    fontSize: 25,
    fontWeight: 'bold'
  },

  status: {
    color: '#FF7A00',
    fontSize: 18,
    fontWeight: 'bold'
  },

  total: {
    color: '#222',
    fontSize: 22,
    fontWeight: 'bold'
  },

  loadingBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },

  loadingText: {
    color: '#777',
    marginLeft: 10
  },

  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    elevation: 2
  },

  orderCode: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6
  },

  orderInfo: {
    color: '#666',
    marginBottom: 3
  },

  orderOpen: {
    color: '#FF7A00',
    fontWeight: 'bold',
    marginTop: 8
  },

  // =========================
  // DASHBOARD
  // =========================

  dashboardContainer: {
    flexGrow: 1,
    backgroundColor: '#FFF7F0',
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 40
  },

  dashboardHeader: {
    alignItems: 'center',
    marginBottom: 35
  },

  brand: {
    color: '#FF7A00',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },

  dashboardTitle: {
    color: '#222',
    fontSize: 29,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  dashboardDescription: {
    color: '#777',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 20
  },

  roleBadge: {
    backgroundColor: '#FFE5CC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginTop: 16
  },

  roleBadgeText: {
    color: '#FF7A00',
    fontSize: 12,
    fontWeight: 'bold'
  },

  dashboardOptions: {
    width: '100%'
  },

  dashboardCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 17,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3
  },

  dashboardCardDisabled: {
    backgroundColor: '#F4F1EE',
    borderRadius: 18,
    padding: 17,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.7
  },

  dashboardIconBox: {
    width: 54,
    height: 54,
    borderRadius: 15,
    backgroundColor: '#FFF0E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },

  dashboardIcon: {
    fontSize: 26
  },

  dashboardCardInfo: {
    flex: 1
  },

  dashboardCardTitle: {
    color: '#222',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4
  },

  dashboardCardText: {
    color: '#777',
    fontSize: 13,
    lineHeight: 18
  },

  dashboardArrow: {
    color: '#FF7A00',
    fontSize: 31,
    fontWeight: 'bold',
    marginLeft: 8
  },

  dashboardLogout: {
    backgroundColor: '#222',
    borderRadius: 15,
    paddingVertical: 16,
    marginTop: 20
  },

  dashboardLogoutText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15
  }
});