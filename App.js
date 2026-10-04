import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';

import BienvenidaScreen from './components/BienvenidaScreen';
import LoginScreen from './components/LoginScreen';
import PlatillosScreen from './components/PlatillosScreen';
import PedidosScreen from './components/PedidosScreen';

import { apiService } from './services/api';

export default function App() {
  const [screen, setScreen] = useState('bienvenida');
  const [session, setSession] = useState(null);

  const handleLoginSuccess = (loginResponse) => {
    setSession(loginResponse);
    setScreen('dashboard');
  };

  const handleLogout = () => {
    apiService.logout();
    setSession(null);
    setScreen('login');
  };

  if (screen === 'bienvenida') {
    return (
      <BienvenidaScreen
        onStart={() => setScreen('login')}
      />
    );
  }

  if (screen === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (screen === 'productos') {
    return (
      <PlatillosScreen
        onBack={() => setScreen('dashboard')}
      />
    );
  }

  if (screen === 'pedidos') {
    return (
      <PedidosScreen
        onBack={() => setScreen('dashboard')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Panel Principal
      </Text>

      <Text style={styles.role}>
        Rol: {session?.rol || 'SIN ROL'}
      </Text>

      {session?.rol === 'ADMINISTRADOR' && (
        <>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setScreen('productos')}
          >
            <Text style={styles.txt}>
              CRUD de Productos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => setScreen('pedidos')}
          >
            <Text style={styles.txt}>
              CRUD de Pedidos
            </Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
      >
        <Text style={styles.txt}>
          Cerrar Sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff7f0'
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#222'
  },

  role: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30
  },

  btn: {
    backgroundColor: '#ff7a00',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15
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
  }
});