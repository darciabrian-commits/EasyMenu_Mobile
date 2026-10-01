const BASE_URL = 'http://192.168.1.17:5000/api';
export const apiService = {
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Credenciales incorrectas');
    return await response.json();
  },
  
  // CRUD 1: Platillos
  getPlatillos: async () => (await fetch(`${BASE_URL}/platillos`)).json(),
  createPlatillo: async (data) => (await fetch(`${BASE_URL}/platillos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })).json(),
  updatePlatillo: async (id, data) => (await fetch(`${BASE_URL}/platillos/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })).json(),
  deletePlatillo: async (id) => (await fetch(`${BASE_URL}/platillos/${id}`, { method: 'DELETE' })).json(),

  // CRUD 2: Pedidos
  getPedidos: async () => (await fetch(`${BASE_URL}/pedidos`)).json(),
  createPedido: async (data) => (await fetch(`${BASE_URL}/pedidos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })).json(),
  updatePedido: async (id, data) => (await fetch(`${BASE_URL}/pedidos/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })).json(),
  deletePedido: async (id) => (await fetch(`${BASE_URL}/pedidos/${id}`, { method: 'DELETE' })).json(),
};


