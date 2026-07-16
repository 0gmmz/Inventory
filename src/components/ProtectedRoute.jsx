import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { sesion } = useAuth()
  if (sesion === undefined) return null // cargando sesión
  if (!sesion) return <Navigate to="/login" replace />
  return children
}
