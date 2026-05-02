import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/',                   label: 'Inicio'            },
  { to: '/clientes',           label: 'Clientes'          },
  { to: '/productos',          label: 'Productos'         },
  { to: '/bodegas',            label: 'Bodegas'           },
  { to: '/puertos',            label: 'Puertos'           },
  { to: '/envios/terrestres',  label: 'Envíos Terrestres' },
  { to: '/envios/maritimos',   label: 'Envíos Marítimos'  },
]

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const esAdmin = usuario?.rol?.toLowerCase() === 'admin'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-blue-700">🚚 LogisticApp</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.to
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {link.label}
            </Link>
          ))}

          

          {esAdmin && (
            <Link
              to="/flotas"
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/flotas'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              Flotas
            </Link>
          )}

          {esAdmin && (
            <Link
              to="/vehiculos"
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/vehiculos'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              Vehiculos
            </Link>
          )}

          {esAdmin && (
            <Link
              to="/usuarios"
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/usuarios'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              Usuarios
            </Link>
          )}
        </nav>

        <div className="p-4 border-t text-sm text-gray-500">
          <p className="font-medium text-gray-700">{usuario?.nombre}</p>
          <p className="text-xs mb-2">{usuario?.rol}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left text-red-500 hover:text-red-700 text-xs"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>

    </div>
  )
}
