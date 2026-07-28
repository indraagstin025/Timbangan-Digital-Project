const RAW_URL = import.meta.env.VITE_API_URL || 'https://timbangan-digital-production.up.railway.app';
const API_BASE_URL = RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api`;

/**
 * Ambil token JWT dari localStorage
 */
function getToken() {
  return localStorage.getItem('auth_token');
}

/**
 * Helper untuk membuat request ke backend API
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const json = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    const errorMessage = json.message || `Request gagal (${response.status})`;
    throw new Error(errorMessage);
  }

  return json;
}

/**
 * GET request
 */
export function get(endpoint) {
  return request(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export function post(endpoint, body) {
  return request(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * PUT request
 */
export function put(endpoint, body) {
  return request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * DELETE request
 */
export function del(endpoint) {
  return request(endpoint, { method: 'DELETE' });
}
