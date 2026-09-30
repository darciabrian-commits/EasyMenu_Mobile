import React, { useState } from 'react';
import BienvenidaScreen from './components/BienvenidaScreen';
import LoginScreen from './components/LoginScreen';
import PlatillosScreen from './components/PlatillosScreen';

export default function App() {
  // Estados posibles: 'bienvenida', 'login', 'platillos'
  const [screen, setScreen] = useState('bienvenida');

  // 1. Mostrar pantalla de Bienvenida (Fase 1)
  if (screen === 'bienvenida') {
    return (
      <BienvenidaScreen 
        onStart={() => setScreen('login')} 
      />
    );
  }

  // 2. Mostrar pantalla de Login (Fase 2)
  if (screen === 'login') {
    return (
      <LoginScreen 
        onLoginSuccess={() => setScreen('platillos')} 
      />
    );
  }

  // 3. Mostrar pantalla del CRUD de Platillos (Fase 2)
  return (
    <PlatillosScreen 
      onLogout={() => setScreen('login')} 
    />
  );
}