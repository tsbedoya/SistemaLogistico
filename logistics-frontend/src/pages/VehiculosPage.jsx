import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import vehiculoService from '../services/vehiculoService'
import bodegaService from '../services/bodegaService'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'


function VehiculoForm({ initial, onGuardar, onCancelar }) {
  const [form, setForm] = useState(initial)
  const [bodegas, setBodegas] = useState([])

  useEffect(() => {
    bodegaService.getAll().then(r => setBodegas(r.data.data))
  }, [])

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onGuardar({ ...form, placa: form.placa.toUpperCase() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Bodega asignada</label>
        <select required value={form.bodega_id} onChange={(e) => set('bodega_id', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">Selecciona...</option>
          {bodegas.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Placa</label>
        <input
          required
          placeholder="AAA123"
          maxLength={6}
          value={form.placa}
          onChange={(e) => set('placa', e.target.value.toUpperCase())}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">Formato: 3 letras y 3 números (ej. ABC123)</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Marca</label>
        <input
          placeholder="Opcional"
          value={form.marca}
          onChange={(e) => set('marca', e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancelar} className="text-gray-600 px-4 py-2 text-sm hover:bg-gray-100 rounded-lg">Cancelar</button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">Guardar</button>
      </div>
    </form>
  )
}

const emptyForm = { bodega_id: '', placa: '', marca: '' }

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [formError, setFormError] = useState('')
  const { usuario } = useAuth()

  useEffect(() => { cargar() }, [])

  async function cargar() {
    try {
      setLoading(true)
      const res = await vehiculoService.getAll()
      setVehiculos(res.data.data)
    } catch {
      setError('No se pudieron cargar los vehículos')
    } finally {
      setLoading(false)
    }
  }

  function abrirCrear() {
    setEditando(null)
    setFormError('')
    setShowModal(true)
  }

  function abrirEditar(v) {
    setEditando(v)
    setFormError('')
    setShowModal(true)
  }

  async function handleEliminar(id) {
    if (!confirm('¿Eliminar este vehículo?')) return
    try {
      await vehiculoService.delete(id)
      toast.success('Vehículo eliminado')
      cargar()
    } catch {
      toast.error('Error al eliminar')
    }
  }

  async function handleGuardar(data) {
    setFormError('')
    try {
      if (editando) {
        await vehiculoService.update(editando.id, data)
        toast.success('Vehículo actualizado')
      } else {
        await vehiculoService.create(data)
        toast.success('Vehículo creado')
      }
      setShowModal(false)
      cargar()
    } catch (err) {
      const d = err.response?.data
      setFormError(d?.errors?.length ? d.errors.map(e => e.message).join(' · ') : d?.message || 'Error al guardar')
    }
  }

  if (loading) return <p className="text-gray-500">Cargando...</p>
  if (error) return <p className="text-red-500">{error}</p>
  if (usuario?.rol?.toLowerCase() !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-4xl mb-4">🔒</p>
        <p className="text-lg font-medium">Acceso restringido</p>
        <p className="text-sm">Solo los administradores pueden ver esta sección</p>
      </div>
    )
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vehículos</h1>
        <button onClick={abrirCrear} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          + Nuevo
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Placa</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Marca</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Bodega</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {vehiculos.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No hay vehículos</td>
              </tr>
            ) : (
              vehiculos.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">{v.placa}</td>
                  <td className="px-4 py-3">{v.marca || '—'}</td>
                  <td className="px-4 py-3">{v.bodega?.nombre}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => abrirEditar(v)} className="text-blue-600 hover:underline text-xs">Editar</button>
                      <button onClick={() => handleEliminar(v.id)} className="text-red-500 hover:underline text-xs">Eliminar</button>
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
          title={editando ? 'Editar Vehículo' : 'Nuevo Vehículo'}
          onClose={() => setShowModal(false)}
        >
          {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
          <VehiculoForm
            initial={editando ? {
              bodega_id: editando.bodega_id,
              placa: editando.placa,
              marca: editando.marca || '',
            } : emptyForm}
            onGuardar={handleGuardar}
            onCancelar={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  )
}
