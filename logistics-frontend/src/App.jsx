import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ClientesPage from './pages/ClientesPage'
import ProductosPage from './pages/ProductosPage'
import BodegasPage from './pages/BodegasPage'
import PuertosPage from './pages/PuertosPage'
import EnviosTerrestresPage from './pages/EnviosTerrestresPage'
import EnviosMaritimosPage from './pages/EnviosMaritimosPage'
import VehiculosPage from './pages/VehiculosPage'
import FlotasPage from './pages/FlotasPage'
import UsuariosPage from './pages/UsuariosPage'

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/clientes" element={<PrivateRoute><ClientesPage /></PrivateRoute>} />
          <Route path="/productos" element={<PrivateRoute><ProductosPage /></PrivateRoute>} />
          <Route path="/bodegas" element={<PrivateRoute><BodegasPage /></PrivateRoute>} />
          <Route path="/puertos" element={<PrivateRoute><PuertosPage /></PrivateRoute>} />
          <Route path="/vehiculos" element={<PrivateRoute><VehiculosPage /></PrivateRoute>} />
          <Route path="/flotas" element={<PrivateRoute><FlotasPage /></PrivateRoute>} />
          <Route path="/envios/terrestres" element={<PrivateRoute><EnviosTerrestresPage /></PrivateRoute>} />
          <Route path="/envios/maritimos" element={<PrivateRoute><EnviosMaritimosPage /></PrivateRoute>} />
          <Route path="/usuarios" element={<PrivateRoute><UsuariosPage /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
