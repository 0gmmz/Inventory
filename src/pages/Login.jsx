import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [cargando, setCargando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setError(null)
    setCargando(true)
    try {
      await iniciarSesion(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 }}>
      <form onSubmit={enviar} className="card stack" style={{ width: '100%', maxWidth: 380 }}>
        <div>
          <h1>Inventario TI</h1>
          <p className="muted">Acceso exclusivo del equipo de TI</p>
        </div>
        <div className="field">
          <label htmlFor="email">Correo</label>
          <input id="email" type="email" autoComplete="username" required
                 value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" autoComplete="current-password" required
                 value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        {error && <p style={{ color: 'var(--st-baja)', fontSize: 13 }}>{error}</p>}
        <button className="btn" disabled={cargando}>
          {cargando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
