import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// 1. Recibimos el evento onStart desde App.js
export default function BienvenidaScreen({ onStart }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍔 EasyMenu</Text>
      <Text style={styles.subtitle}>Gestión inteligente para tu restaurante</Text>
      
      <View style={styles.card}>
        <Text style={styles.welcomeText}>¡Bienvenido al sistema!</Text>
        <Text style={styles.infoText}>Versión Móvil - SDK 54</Text>
      </View>

      {/* 2. Le asignamos onPress={onStart} al botón */}
      <TouchableOpacity 
        style={styles.button} 
        activeOpacity={0.8} 
        onPress={onStart}
      >
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justify: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    elevation: 3,
    marginBottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#888',
  },
  button: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});