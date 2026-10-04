import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import { StatusBar } from 'expo-status-bar';

export default function BienvenidaScreen({ onStart }) {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>
        Bienvenido a EasyMenu
      </Text>

      <Text style={styles.subtitle}>
        Gestiona productos y pedidos de forma rápida,
        sencilla y desde un solo lugar.
      </Text>

      <View style={styles.features}>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🍔</Text>
          <Text style={styles.featureText}>
            Productos
          </Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📋</Text>
          <Text style={styles.featureText}>
            Pedidos
          </Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureIcon}>⚡</Text>
          <Text style={styles.featureText}>
            Fácil y rápido
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={onStart}
      >
        <Text style={styles.buttonText}>
          Comenzar
        </Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        EasyMenu · Sistema de gestión
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7F0',
    paddingHorizontal: 24,
    justifyContent: 'center'
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 20
  },

  logo: {
    width: 180,
    height: 180,
    borderRadius: 35
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 12
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 12,
    marginBottom: 32
  },

  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 38
  },

  feature: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 2
  },

  featureIcon: {
    fontSize: 27,
    marginBottom: 7
  },

  featureText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
    textAlign: 'center'
  },

  button: {
    backgroundColor: '#FF7A00',
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 3
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },

  footer: {
    textAlign: 'center',
    marginTop: 24,
    color: '#999',
    fontSize: 13
  }
});