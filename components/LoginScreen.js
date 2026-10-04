import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';

import { apiService } from '../services/api';

export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      return Alert.alert(
        'Atención',
        'Completa correo y contraseña'
      );
    }

    setLoading(true);

    try {
      const session = await apiService.login(
        email.trim(),
        password
      );

      onLoginSuccess(session);

    } catch (error) {
      Alert.alert(
        'Error',
        'Credenciales incorrectas o API no disponible'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Image
        source={require('../assets/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        EasyMenu
      </Text>

      <Text style={styles.subtitle}>
        Inicio de sesión del personal
      </Text>

      <View style={styles.card}>

        <Text style={styles.label}>
          Correo electrónico
        </Text>

        <TextInput
          style={styles.input}
          placeholder="admin@easymenu.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>
          Contraseña
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ingresa tu contraseña"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Ingresar
            </Text>
          )}
        </TouchableOpacity>

      </View>

      <Text style={styles.footer}>
        EasyMenu · Gestión rápida y sencilla
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 22,
    backgroundColor: '#FFF7F0'
  },

  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 8
  },

  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#222',
    marginBottom: 4
  },

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginBottom: 28
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6
  },

  input: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    backgroundColor: '#FAFAFA',
    padding: 15,
    borderRadius: 12,
    marginBottom: 18,
    color: '#222',
    fontSize: 16
  },

  button: {
    backgroundColor: '#FF7A00',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4
  },

  buttonDisabled: {
    opacity: 0.7
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },

  footer: {
    textAlign: 'center',
    color: '#999',
    marginTop: 22,
    fontSize: 13
  }
});