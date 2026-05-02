import api from './api'

const flotaService = {
  getAll: () => api.get('/flotas'),
  getById: (id) => api.get(`/flotas/${id}`),
  create: (data) => api.post('/flotas', data),
  update: (id, data) => api.put(`/flotas/${id}`, data),
  delete: (id) => api.delete(`/flotas/${id}`),
}

export default flotaService
