import AsyncStorage from '@react-native-async-storage/async-storage';

const PEDIDOS_KEY = '@easymenu_pedidos_cliente';

const LIMITE_PEDIDOS = 20;

export const pedidosStorage = {

  guardarPedidos: async (pedidos) => {
    try {
      const pedidosLimitados = pedidos
        .slice(-LIMITE_PEDIDOS);

      await AsyncStorage.setItem(
        PEDIDOS_KEY,
        JSON.stringify(pedidosLimitados)
      );
    } catch (error) {
      console.log(
        'Error guardando pedidos:',
        error
      );
    }
  },

  obtenerPedidos: async () => {
    try {
      const data = await AsyncStorage.getItem(
        PEDIDOS_KEY
      );

      if (!data) {
        return [];
      }

      return JSON.parse(data);
    } catch (error) {
      console.log(
        'Error leyendo pedidos:',
        error
      );

      return [];
    }
  },

  limpiarPedidos: async () => {
    try {
      await AsyncStorage.removeItem(
        PEDIDOS_KEY
      );
    } catch (error) {
      console.log(
        'Error limpiando pedidos:',
        error
      );
    }
  }
};