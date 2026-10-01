import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LoginScreen from './components/LoginScreen';
import PlatillosScreen from './components/PlatillosScreen';
import PedidosScreen from './components/PedidosScreen';

export default function App() {
  const [screen, setScreen] = useState('login');

  if (screen === 'login') return <LoginScreen onLoginSuccess={() => setScreen('dashboard')} />;
  
  if (screen === 'dashboard') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Panel Principal</Text>
        <TouchableOpacity style={styles.btn} onPress={() => setScreen('platillos')}><Text style={styles.txt}>1. CRUD Platillos</Text></TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => setScreen('pedidos')}><Text style={styles.txt}>2. CRUD Pedidos</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.btn, {backgroundColor: 'red'}]} onPress={() => setScreen('login')}><Text style={styles.txt}>Cerrar Sesión</Text></TouchableOpacity>
      </View>
    );
  }

  if (screen === 'platillos') return <PlatillosScreen onBack={() => setScreen('dashboard')} />;
  if (screen === 'pedidos') return <PedidosScreen onBack={() => setScreen('dashboard')} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  btn: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, marginBottom: 15 },
  txt: { color: 'white', textAlign: 'center', fontWeight: 'bold' }
});
