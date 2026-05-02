import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { envioMaritimoService } from '../services/enviosService'
import clienteService from '../services/clienteService'
import productoService from '../services/productoService'
import puertoService from '../services/puertoService'
import flotaService from '../services/flotaService'
import Modal from '../components/Modal'
import { useAuth } from '../context/AuthContext'

function EnvioMaritimoForm({ initial, onGuardar, onCancelar }) {
  const [form, setForm] = useState(initial)
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [puertos, setPuertos] = useState([])
  const [flotas, setFlotas] = useState([])

  useEffect(() => {
    clienteService.getAll().then(r => setClientes(r.data.data))
    productoService.getAll().then(r => setProductos(r.data.data))
    puertoService.getAll().then(r => setPuertos(r.data.data))
    flotaService.getAll().then(r => setFlotas(r.data.data))
  }, [])
  console.log(flotas);

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const precioFinal = form.precio_base && form.cantidad_producto
    ? Number(form.cantidad_producto) > 10
      ? (Number(form.precio_base) * 0.97).toFixed(2)
      : Number(form.precio_base).toFixed(2)
    : null

  function handleSubmit(e) {
    e.preventDefault()
    onGuardar({
      ...form,
      cantidad_producto: Number(form.cantidad_producto),
      precio_base: Number(form.precio_base),
      flota_id: Number(form.flota_id),
    })
  }

  const flotasFiltrados = flotas.filter(
  v => v.puerto_id === Number(form.puerto_id)
)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Cliente</label>
          <select required value={form.cliente_id} onChange={(e) => set('cliente_id', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="">Selecciona...</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Producto</label>
          <select required value={form.producto_id} onChange={(e) => set('producto_id', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="">Selecciona...</option>
            {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Puerto de entrega</label>
          <select required value={form.puerto_id} onChange={(e) => set('puerto_id', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="">Selecciona...</option>
            {puertos.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.codigo})</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Flota</label>
          <select required value={form.flota_id} onChange={(e) => set('flota_id', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="">Selecciona...</option>
            {flotasFiltrados.map(f => (
              <option key={f.id} value={f.id}>
                {f.numero_flota}{f.nombre ? ` — ${f.nombre}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Cantidad de productos</label>
          <input type="number" min="1" required value={form.cantidad_producto} onChange={(e) => set('cantidad_producto', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Precio base ($)</label>
          <input type="number" min="0.01" step="0.01" required value={form.precio_base} onChange={(e) => set('precio_base', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Fecha de entrega</label>
          <input type="date" required value={form.fecha_entrega} onChange={(e) => set('fecha_entrega', e.target.value)} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>

      {precioFinal && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <span className="text-blue-700 font-medium">Precio final estimado: </span>
          <span className="text-blue-900 font-bold">${Number(precioFinal).toLocaleString()}</span>
          {Number(form.cantidad_producto) > 10 && (
            <span className="text-green-600 ml-2">(3% de descuento)</span>
          )}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancelar} className="text-gray-600 px-4 py-2 text-sm hover:bg-gray-100 rounded-lg">Cancelar</button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">Guardar</button>
      </div>
    </form>
  )
}

const emptyForm = {
  cliente_id: '', producto_id: '', puerto_id: '', flota_id: '',
  cantidad_producto: '', precio_base: '',
  fecha_registro: new Date().toISOString().split('T')[0],
  fecha_entrega: '',
}

export default function EnviosMaritimosPage() {
  const [envios, setEnvios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [formError, setFormError] = useState('')
  const { usuario } = useAuth()
  const esAdmin = usuario?.rol?.toLowerCase() === 'admin'

  useEffect(() => {
    cargarEnvios()
  }, [])

  async function cargarEnvios() {
    try {
      setLoading(true)
      const res = await envioMaritimoService.getAll()
      setEnvios(res.data.data)
    } catch (err) {
      setError('No se pudieron cargar los envíos')
    } finally {
      setLoading(false)
    }
  }
  function abrirCrear() {
    setEditando(null)
    setFormError('')
    setShowModal(true)
  }

  function abrirEditar(envio) {
    setEditando(envio)
    setFormError('')
    setShowModal(true)
  }

  async function handleEliminar(id) {
    if (!confirm('¿Eliminar este envío?')) return
    try {
      await envioMaritimoService.delete(id)
      toast.success('Envío eliminado')
      cargarEnvios()
    } catch (err) {
      toast.error('Error al eliminar')
    }
  }

  async function handleGuardar(data) {
    setFormError('')
    try {
      if (editando) {
        await envioMaritimoService.update(editando.id, data)
        toast.success('Envío actualizado')
      } else {
        await envioMaritimoService.create(data)
        toast.success('Envío creado')
      }
      setShowModal(false)
      cargarEnvios()
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
        <h1 className="text-2xl font-bold text-gray-800">Envíos Marítimos</h1>
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
              <th className="px-3 py-3 text-left font-semibold text-gray-600">N. Guía</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600">Cliente</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600">T. Producto</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600">Cantidad</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600">Puerto</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600">Flota</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600">Precio envio</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600">F. registro</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600">F. entrega</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {envios.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-400">No hay envíos</td>
              </tr>
            ) : (
              envios.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3">{e.numero_guia}</td>
                  <td className="px-3 py-3">{e.cliente?.nombre}</td>
                  <td className="px-3 py-3">{e.producto?.nombre}</td>
                  <td className="px-3 py-3">{e.cantidad_producto}</td>
                  <td className="px-3 py-3">{e.puerto?.codigo}</td>
                  <td className="px-3 py-3">{e.flota?.numero_flota}</td>
                  <td className="px-3 py-3">${Number(e.precio_final).toLocaleString()}</td>
                  <td className="px-3 py-3">{e.fecha_registro}</td>
                  <td className="px-3 py-3">{e.fecha_entrega}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => abrirEditar(e)} className="text-blue-600 hover:underline text-xs">Editar</button>
                      {esAdmin && <button onClick={() => handleEliminar(e.id)} className="text-red-500 hover:underline text-xs">Eliminar</button>}
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
          title={editando ? 'Editar Envío Marítimo' : 'Nuevo Envío Marítimo'}
          onClose={() => setShowModal(false)}
        >
          {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
          <EnvioMaritimoForm
            initial={editando ? {
              cliente_id: editando.cliente_id,
              producto_id: editando.producto_id,
              puerto_id: editando.puerto_id,
              flota_id: editando.flota_id,
              cantidad_producto: editando.cantidad_producto,
              precio_base: editando.precio_base,
              fecha_registro: editando.fecha_registro,
              fecha_entrega: editando.fecha_entrega,
            } : emptyForm}
            onGuardar={handleGuardar}
            onCancelar={() => setShowModal(false)}
          />
        </Modal>
      )}
    </div>
  )
}
