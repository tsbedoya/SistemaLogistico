import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import flotaService from '../services/flotaService'
import puertoService from '../services/puertoService'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'



function FlotaForm({ initial, onGuardar, onCancelar }) {
  const [form, setForm] = useState(initial)
  const [puertos, setPuertos] = useState([])

  useEffect(() => {
    puertoService.getAll().then(r => setPuertos(r.data.data))
  }, [])

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onGuardar({ ...form, numero_flota: form.numero_flota.toUpperCase() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Puerto asignado</label>
        <select required value={form.puerto_id} onChange={(e) => set('puerto_id', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
          <option value="">Selecciona...</option>
          {puertos.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.codigo})</option>)}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Número de flota</label>
        <input
          required
          placeholder="AAA1234A"
          maxLength={8}
          value={form.numero_flota}
          onChange={(e) => set('numero_flota', e.target.value.toUpperCase())}
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">Formato: 3 letras, 4 números, 1 letra (ej. CAR1234B)</p>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Nombre</label>
        <input
          placeholder="Opcional"
          value={form.nombre}
          onChange={(e) => set('nombre', e.target.value)}
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

const emptyForm = { puerto_id: '', numero_flota: '', nombre: '' }

export default function FlotasPage() {
  const [flotas, setFlotas] = useState([])
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
      const res = await flotaService.getAll()
      setFlotas(res.data.data)
    } catch {
      setError('No se pudieron cargar las flotas')
    } finally {
      setLoading(false)
    }
  }

  function abrirCrear() {
    setEditando(null)
    setFormError('')
    setShowModal(true)
  }

  function abrirEditar(f) {
    setEditando(f)
    setFormError('')
    setShowModal(true)
  }

  async function handleEliminar(id) {
    if (!confirm('¿Eliminar esta flota?')) return
    try {
      await flotaService.delete(id)
      toast.success('Flota eliminada')
      cargar()
    } catch {
      toast.error('Error al eliminar')
    }
  }

  async function handleGuardar(data) {
    setFormError('')
    try {
      if (editando) {
        await flotaService.update(editando.id, data)
        toast.success('Flota actualizada')
      } else {
        await flotaService.create(data)
        toast.success('Flota creada')
      }
      setShowModal(false)
      cargar()
    } catch (err) {
      const data = err.response?.data
      setFormError(data?.errors?.length ? data.errors.map(e => e.message).join(' · ') : data?.message || 'Error al guardar')
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
        <h1 className="text-2xl font-bold text-gray-800">Flotas</h1>
        <button onClick={abrirCrear} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          + Nueva
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Número de flota</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Puerto</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Ciudad</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {flotas.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No hay flotas</td>
              </tr>
            ) : (
              flotas.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono">{f.numero_flota}</td>
                  <td className="px-4 py-3">{f.nombre || '—'}</td>
                  <td className="px-4 py-3">{f.puerto?.codigo}</td>
                  <td className="px-4 py-3">{f.puerto?.ciudad}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => abrirEditar(f)} className="text-blue-600 hover:underline text-xs">Editar</button>
                      <button onClick={() => handleEliminar(f.id)} className="text-red-500 hover:underline text-xs">Eliminar</button>
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
          title={editando ? 'Editar Flota' : 'Nueva Flota'}
          onClose={() => setShowModal(false)}
        >
          {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
          <FlotaForm
            initial={editando ? {
              puerto_id: editando.puerto_id,
              numero_flota: editando.numero_flota,
              nombre: editando.nombre || '',
            } : emptyForm}
            onGuardar={handleGuardar}
            onCancelar={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  )
}
