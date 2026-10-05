import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import { StatusBar } from 'expo-status-bar';

export default function BienvenidaScreen({
  onClient,
  onStaff
}) {
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
        Consulta el menú, realiza tu pedido o accede
        al sistema como personal.
      </Text>

      <View style={styles.features}>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🍔</Text>
          <Text style={styles.featureText}>
            Menú
          </Text>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🛒</Text>
          <Text style={styles.featureText}>
            Pedido
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
        style={styles.clientButton}
        activeOpacity={0.85}
        onPress={onClient}
      >
        <Text style={styles.buttonText}>
          Hacer un pedido
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.staffButton}
        activeOpacity={0.85}
        onPress={onStaff}
      >
        <Text style={styles.buttonText}>
          Acceso del personal
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
    marginBottom: 32
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

  clientButton: {
    backgroundColor: '#FF7A00',
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 3,
    marginBottom: 12
  },

  staffButton: {
    backgroundColor: '#222',
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 3
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold'
  },

  footer: {
    textAlign: 'center',
    marginTop: 24,
    color: '#999',
    fontSize: 13
  }
});