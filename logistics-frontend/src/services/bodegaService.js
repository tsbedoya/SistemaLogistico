import api from './api'

const bodegaService = {
  getAll: () => api.get('/bodegas'),
  create: (data) => api.post('/bodegas', data),
  update: (id, data) => api.put(`/bodegas/${id}`, data),
  delete: (id) => api.delete(`/bodegas/${id}`),
}

export default bodegaService
