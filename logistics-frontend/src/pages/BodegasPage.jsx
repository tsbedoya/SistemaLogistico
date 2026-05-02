import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import bodegaService from '../services/bodegaService'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'

export default function BodegasPage() {
  const [bodegas, setBodegas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', direccion: '', ciudad: '', pais: '' })
  const [formError, setFormError] = useState('')
  const { usuario } = useAuth()
  const esAdmin = usuario?.rol?.toLowerCase() === 'admin'

  useEffect(() => {
    cargarBodegas()
  }, [])

  async function cargarBodegas() {
    try {
      setLoading(true)
      const res = await bodegaService.getAll()
      setBodegas(res.data.data)
    } catch (err) {
      setError('No se pudieron cargar las bodegas')
    } finally {
      setLoading(false)
    }
  }

  function abrirCrear() {
    setEditando(null)
    setForm({ nombre: '', direccion: '', ciudad: '', pais: '' })
    setFormError('')
    setShowModal(true)
  }

  function abrirEditar(bodega) {
    setEditando(bodega)
    setForm({
      nombre: bodega.nombre,
      direccion: bodega.direccion,
      ciudad: bodega.ciudad,
      pais: bodega.pais,
    })
    setFormError('')
    setShowModal(true)
  }

  async function handleEliminar(id) {
    if (!confirm('¿Eliminar esta bodega?')) return
    try {
      await bodegaService.delete(id)
      toast.success('Bodega eliminada')
      cargarBodegas()
    } catch (err) {
      toast.error('Error al eliminar')
    }
  }

  async function handleGuardar(e) {
    e.preventDefault()
    setFormError('')
    try {
      if (editando) {
        await bodegaService.update(editando.id, form)
        toast.success('Bodega actualizada')
      } else {
        await bodegaService.create(form)
        toast.success('Bodega creada')
      }
      setShowModal(false)
      cargarBodegas()
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
        <h1 className="text-2xl font-bold text-gray-800">Bodegas</h1>
        <button
          onClick={abrirCrear}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          + Nueva
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Ciudad</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">País</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Dirección</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bodegas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No hay bodegas</td>
              </tr>
            ) : (
              bodegas.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{b.nombre}</td>
                  <td className="px-4 py-3">{b.ciudad}</td>
                  <td className="px-4 py-3">{b.pais}</td>
                  <td className="px-4 py-3">{b.direccion}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => abrirEditar(b)} className="text-blue-600 hover:underline text-xs">Editar</button>
                      {esAdmin && <button onClick={() => handleEliminar(b.id)} className="text-red-500 hover:underline text-xs">Eliminar</button>}
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
          title={editando ? 'Editar Bodega' : 'Nueva Bodega'}
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
              <label className="text-sm font-medium text-gray-700">Dirección</label>
              <input
                required
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Ciudad</label>
              <input
                required
                value={form.ciudad}
                onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">País</label>
              <input
                required
                value={form.pais}
                onChange={(e) => setForm({ ...form, pais: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
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
