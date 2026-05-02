import api from './api'

export const envioTerrestreService = {
  getAll: () => api.get('/envios/terrestres'),
  create: (data) => api.post('/envios/terrestres', data),
  update: (id, data) => api.put(`/envios/terrestres/${id}`, data),
  delete: (id) => api.delete(`/envios/terrestres/${id}`),
}

export const envioMaritimoService = {
  getAll: () => api.get('/envios/maritimos'),
  create: (data) => api.post('/envios/maritimos', data),
  update: (id, data) => api.put(`/envios/maritimos/${id}`, data),
  delete: (id) => api.delete(`/envios/maritimos/${id}`),
}
