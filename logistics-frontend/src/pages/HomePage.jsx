import { useAuth } from '../context/AuthContext';

const modulos = [
  { emoji: '👥', label: 'Clientes',           to: '/clientes'          },
  { emoji: '📦', label: 'Productos',           to: '/productos'         },
  { emoji: '🏭', label: 'Bodegas',             to: '/bodegas'           },
  { emoji: '⚓', label: 'Puertos',             to: '/puertos'           },
  { emoji: '🚛', label: 'Envíos Terrestres',   to: '/envios/terrestres' },
  { emoji: '🚢', label: 'Envíos Marítimos',    to: '/envios/maritimos'  },
  { emoji: '🚗', label: 'Vehículos',           to: '/vehiculos',        adminOnly: true },
  { emoji: '🛳️', label: 'Flotas',              to: '/flotas',           adminOnly: true },
  { emoji: '🔑', label: 'Usuarios',            to: '/usuarios',         adminOnly: true },
];

export default function HomePage() {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol?.toLowerCase() === 'admin';
  const modulosVisibles = modulos.filter((m) => !m.adminOnly || esAdmin);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        Bienvenido, {usuario?.nombre} 👋
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Selecciona un módulo para comenzar
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {modulosVisibles.map((m) => (
          <a
            key={m.to}
            href={m.to}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all flex flex-col items-center gap-3"
          >
            <span className="text-4xl">{m.emoji}</span>
            <span className="text-sm font-medium text-gray-700">{m.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
