import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Hardware from './pages/Hardware'
import Licencias from './pages/Licencias'
import Asignaciones from './pages/Asignaciones'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hardware" element={<Hardware />} />
            <Route path="/licencias" element={<Licencias />} />
            <Route path="/asignaciones" element={<Asignaciones />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
