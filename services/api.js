const BASE_URL = 'http://192.168.0.186:8080/api';

let authToken = null;

const request = async (path, options = {}, requiresAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (requiresAuth && authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const body = await response.text();
      if (body) message = body;
    } catch (_) {}
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
};

export const apiService = {
  login: async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ correo: email, clave: password }),
    });

    authToken = data.token;
    return data;
  },

  logout: () => {
    authToken = null;
  },

  getProductos: () => request('/productos'),

  createProducto: (data) =>
    request('/productos', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true),

  updateProducto: (id, data) =>
    request(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, true),

  deleteProducto: (id) =>
    request(`/productos/${id}`, {
      method: 'DELETE',
    }, true),
};
