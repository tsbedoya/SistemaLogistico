import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import productoService from '../services/productoService'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'

export default function ProductosPage() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '', tipo: '' })
  const [formError, setFormError] = useState('')
  const { usuario } = useAuth()
  const esAdmin = usuario?.rol?.toLowerCase() === 'admin'

  useEffect(() => {
    cargarProductos()
  }, [])

  async function cargarProductos() {
    try {
      setLoading(true)
      const res = await productoService.getAll()
      setProductos(res.data.data)
    } catch (err) {
      setError('No se pudieron cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  function abrirCrear() {
    setEditando(null)
    setForm({ nombre: '', descripcion: '', tipo: '' })
    setFormError('')
    setShowModal(true)
  }

  function abrirEditar(producto) {
    setEditando(producto)
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      tipo: producto.tipo,
    })
    setFormError('')
    setShowModal(true)
  }

  async function handleEliminar(id) {
    if (!confirm('¿Eliminar este producto?')) return
    try {
      await productoService.delete(id)
      toast.success('Producto eliminado')
      cargarProductos()
    } catch (err) {
      toast.error('Error al eliminar')
    }
  }

  async function handleGuardar(e) {
    e.preventDefault()
    setFormError('')
    try {
      if (editando) {
        await productoService.update(editando.id, form)
        toast.success('Producto actualizado')
      } else {
        await productoService.create(form)
        toast.success('Producto creado')
      }
      setShowModal(false)
      cargarProductos()
    } catch (err) {
      const data = err.response?.data
      setFormError(data?.errors?.length ? data.errors.map(e => e.message).join(' · ') : data?.message || 'Error al guardar')
    }
  }

  if (loading) return <p className="text-gray-500">Cargando...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
        <button
          onClick={abrirCrear}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          + Nuevo
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Tipo</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Descripción</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {productos.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No hay productos</td>
              </tr>
            ) : (
              productos.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{p.nombre}</td>
                  <td className="px-4 py-3">{p.tipo}</td>
                  <td className="px-4 py-3">{p.descripcion || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => abrirEditar(p)} className="text-blue-600 hover:underline text-xs">Editar</button>
                      {esAdmin && <button onClick={() => handleEliminar(p.id)} className="text-red-500 hover:underline text-xs">Eliminar</button>}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal
          title={editando ? 'Editar Producto' : 'Nuevo Producto'}
          onClose={() => setShowModal(false)}
        >
          {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
          <form onSubmit={handleGuardar} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nombre</label>
              <input
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Descripción</label>
              <input
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Tipo</label>
              <select
                required
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="">Selecciona...</option>
                <option value="GENERAL">General</option>
                <option value="FRAGIL">Frágil</option>
                <option value="PELIGROSO">Peligroso</option>
                <option value="REFRIGERADO">Refrigerado</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-600 px-4 py-2 text-sm hover:bg-gray-100 rounded-lg">Cancelar</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">Guardar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
