import api from './api'

const productoService = {
  getAll: () => api.get('/productos'),
  create: (data) => api.post('/productos', data),
  update: (id, data) => api.put(`/productos/${id}`, data),
  delete: (id) => api.delete(`/productos/${id}`),
}

export default productoService
