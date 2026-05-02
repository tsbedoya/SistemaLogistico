import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import usuarioService from '../services/usuarioService'
import Modal from '../components/Modal'

export default function UsuariosPage() {
  const { usuario } = useAuth()

  if (usuario?.rol?.toLowerCase() !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-4xl mb-4">🔒</p>
        <p className="text-lg font-medium">Acceso restringido</p>
        <p className="text-sm">Solo los administradores pueden ver esta sección</p>
      </div>
    )
  }

  return <UsuariosAdmin />
}

function UsuariosAdmin() {
  const { usuario: usuarioActual } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', email: '', password_hash: '', rol: 'OPERADOR' })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    cargarUsuarios()
  }, [])

  async function cargarUsuarios() {
    try {
      setLoading(true)
      const res = await usuarioService.getAll()
      setUsuarios(res.data.data)
    } catch (err) {
      setError('No se pudieron cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }

  function abrirCrear() {
    setEditando(null)
    setForm({ nombre: '', email: '', password_hash: '', rol: 'OPERADOR' })
    setFormError('')
    setShowModal(true)
  }

  function abrirEditar(u) {
    setEditando(u)
    setForm({ nombre: u.nombre, email: u.email, password_hash: '', rol: u.rol })
    setFormError('')
    setShowModal(true)
  }

  async function handleEliminar(id) {
    if (id === usuarioActual?.id) {
      toast.error('No puedes eliminar tu propio usuario')
      return
    }
    if (!confirm('¿Eliminar este usuario?')) return
    try {
      await usuarioService.delete(id)
      toast.success('Usuario eliminado')
      cargarUsuarios()
    } catch (err) {
      toast.error('Error al eliminar')
    }
  }

  async function handleGuardar(e) {
    e.preventDefault()
    setFormError('')
    try {
      if (editando) {
        const data = { nombre: form.nombre, email: form.email, rol: form.rol }
        await usuarioService.update(editando.id, data)
        toast.success('Usuario actualizado')
      } else {
        await usuarioService.create(form)
        toast.success('Usuario creado')
      }
      setShowModal(false)
      cargarUsuarios()
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
        <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
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
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Rol</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">No hay usuarios</td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {u.nombre}
                    {u.id === usuarioActual?.id && (
                      <span className="ml-2 text-xs text-blue-500">(tú)</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      u.rol?.toLowerCase() === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => abrirEditar(u)} className="text-blue-600 hover:underline text-xs">Editar</button>
                      <button
                        onClick={() => handleEliminar(u.id)}
                        className={`text-xs ${u.id === usuarioActual?.id ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:underline'}`}
                        disabled={u.id === usuarioActual?.id}
                      >
                        Eliminar
                      </button>
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
          title={editando ? 'Editar Usuario' : 'Nuevo Usuario'}
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
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            {!editando && (
              <div>
                <label className="text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  required
                  value={form.password_hash}
                  onChange={(e) => setForm({ ...form, password_hash: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700">Rol</label>
              <select
                required
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="OPERADOR">Operador</option>
                <option value="ADMIN">Admin</option>
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
