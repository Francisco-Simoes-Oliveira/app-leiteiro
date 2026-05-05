const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Erro na requisição');
  }
  return res.json();
}

export const api = {
  // Vacas
  getVacas: () => request('/vacas'),
  getVaca: (id) => request(`/vacas/${id}`),
  createVaca: (data) => request('/vacas', { method: 'POST', body: JSON.stringify(data) }),
  updateVaca: (id, data) => request(`/vacas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVaca: (id) => request(`/vacas/${id}`, { method: 'DELETE' }),

  // Produção
  getProducao: (vacaId) => request(`/producao${vacaId ? `?vacaId=${vacaId}` : ''}`),
  createProducao: (data) => request('/producao', { method: 'POST', body: JSON.stringify(data) }),
  updateProducao: (id, data) => request(`/producao/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProducao: (id) => request(`/producao/${id}`, { method: 'DELETE' }),

  // Medicamentos
  getMedicamentos: (vacaId) => request(`/medicamentos${vacaId ? `?vacaId=${vacaId}` : ''}`),
  createMedicamento: (data) => request('/medicamentos', { method: 'POST', body: JSON.stringify(data) }),
  updateMedicamento: (id, data) => request(`/medicamentos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMedicamento: (id) => request(`/medicamentos/${id}`, { method: 'DELETE' }),

  // Sanitário
  getSanitario: (vacaId) => request(`/sanitario${vacaId ? `?vacaId=${vacaId}` : ''}`),
  createSanitario: (data) => request('/sanitario', { method: 'POST', body: JSON.stringify(data) }),
  updateSanitario: (id, data) => request(`/sanitario/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSanitario: (id) => request(`/sanitario/${id}`, { method: 'DELETE' }),

  // Despesas
  getDespesas: () => request('/despesas'),
  createDespesa: (data) => request('/despesas', { method: 'POST', body: JSON.stringify(data) }),
  updateDespesa: (id, data) => request(`/despesas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDespesa: (id) => request(`/despesas/${id}`, { method: 'DELETE' }),
};
