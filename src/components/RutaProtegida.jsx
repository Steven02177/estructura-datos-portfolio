import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth()

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy">
        <p className="font-mono text-sm text-slate">verificando sesión…</p>
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
