const BASE_URL = 'http://192.168.1.50:5000/api'; 

export const apiService = {
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {

      

      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        correo: email,  
        clave: password 
        
      }),

    });
    if (!response.ok) throw new Error('Credenciales incorrectas');
    return await response.json();
  },
  getPlatillos: async () => {
    const response = await fetch(`${BASE_URL}/platillos`);
    return await response.json();
  },
  createPlatillo: async (data) => {
    const response = await fetch(`${BASE_URL}/platillos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  updatePlatillo: async (id, data) => {
    const response = await fetch(`${BASE_URL}/platillos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await response.json();
  },
  deletePlatillo: async (id) => {
    const response = await fetch(`${BASE_URL}/platillos/${id}`, { method: 'DELETE' });
    return await response.json();
  },
};
