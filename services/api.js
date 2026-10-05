const BASE_URL = 'https://easymenu-api-1nce.onrender.com/api';

let authToken = null;

const request = async (
  path,
  options = {},
  requiresAuth = false
) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (requiresAuth && authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(
    `${BASE_URL}${path}`,
    {
      ...options,
      headers
    }
  );

  if (!response.ok) {
    let message = `Error ${response.status}`;

    try {
      const body = await response.text();

      if (body) {
        message = body;
      }
    } catch (_) {}

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const apiService = {

  // =========================
  // AUTENTICACIÓN DEL PERSONAL
  // =========================

  login: async (email, password) => {
    const data = await request(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({
          correo: email,
          clave: password
        })
      }
    );

    authToken = data.token;

    return data;
  },

  logout: () => {
    authToken = null;
  },


  // =========================
  // PRODUCTOS
  // =========================

  // Público: cliente puede consultar el menú
  getProductos: () =>
    request('/productos'),

  // Solo administrador
  createProducto: (data) =>
    request(
      '/productos',
      {
        method: 'POST',
        body: JSON.stringify(data)
      },
      true
    ),

  // Solo administrador
  updateProducto: (id, data) =>
    request(
      `/productos/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data)
      },
      true
    ),

  // Solo administrador
  deleteProducto: (id) =>
    request(
      `/productos/${id}`,
      {
        method: 'DELETE'
      },
      true
    ),


  // =========================
  // PEDIDOS DEL CLIENTE
  // =========================

  // Crear pedido SIN login
  createPedido: (data) =>
    request(
      '/pedidos',
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    ),

  // Consultar pedido por código corto SIN login
  getPedidoPorCodigo: (codigoCorto) =>
    request(
      `/pedidos/codigo/${encodeURIComponent(codigoCorto)}`
    ),

  // Cancelar pedido por código corto SIN login
  cancelarPedidoPorCodigo: (codigoCorto) =>
    request(
      `/pedidos/codigo/${encodeURIComponent(codigoCorto)}/cancelar`,
      {
        method: 'PATCH'
      }
    ),


  // =========================
  // PEDIDOS DEL PERSONAL
  // =========================

  getPedidos: () =>
    request(
      '/pedidos',
      {},
      true
    ),

  cambiarEstadoPedido: (id, estado) =>
    request(
      `/pedidos/${id}/estado?estado=${estado}`,
      {
        method: 'PATCH'
      },
      true
    ),

  cancelarPedido: (id) =>
    request(
      `/pedidos/${id}/cancelar`,
      {
        method: 'PATCH'
      },
      true
    )
};