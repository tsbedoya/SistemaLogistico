import api from './api'

const puertoService = {
  getAll: () => api.get('/puertos'),
  create: (data) => api.post('/puertos', data),
  update: (id, data) => api.put(`/puertos/${id}`, data),
  delete: (id) => api.delete(`/puertos/${id}`),
}

export default puertoService
