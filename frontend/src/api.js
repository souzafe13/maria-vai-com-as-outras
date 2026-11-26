// Endereço do back-end. Troque pelo IP do seu computador (no Windows: ipconfig).
// Exemplo: 'http://192.168.0.15:8080'
export const BASE_URL = 'http://192.168.15.35:8080';

// Único lugar do app que usa fetch. Todas as chamadas passam por aqui.
export async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(BASE_URL + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new Error('Não foi possível conectar ao servidor.');
  }

  if (response.status === 204) return null;

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    // resposta sem corpo
  }

  if (!response.ok) {
    const error = new Error(data?.message || 'Erro inesperado. Tente novamente.');
    error.status = response.status;
    throw error;
  }

  return data;
}
