import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { conteoPorEstado } from '../services/activos'
import { licenciasPorVencer } from '../services/licencias'
import { useAuth } from '../context/AuthContext'
import EstadoBadge from '../components/EstadoBadge'

export default function Dashboard() {
  const { usuario, cerrarSesion } = useAuth()
  const [conteo, setConteo] = useState(null)
  const [porVencer, setPorVencer] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([conteoPorEstado(), licenciasPorVencer(30)])
      .then(([c, v]) => { setConteo(c); setPorVencer(v) })
      .catch(e => setError(e.message))
  }, [])

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Tablero</h1>
          <p className="muted">{usuario?.email}</p>
        </div>
        <button className="btn btn--ghost" onClick={cerrarSesion}>Salir</button>
      </div>

      {error && <p className="card" style={{ color: 'var(--st-baja)' }}>{error}</p>}

      {conteo && (
        <div className="grid-cards">
          {Object.entries(conteo).map(([estado, n]) => (
            <Link key={estado} to={`/hardware?estado=${estado}`} className="card"
                  style={{ display: 'grid', gap: 8 }}>
              <span style={{ fontFamily: 'var(--f-display)', fontSize: 32, fontWeight: 600 }}>{n}</span>
              <EstadoBadge estado={estado} />
            </Link>
          ))}
        </div>
      )}

      {porVencer.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <h2>Licencias por vencer</h2>
          <div className="stack" style={{ marginTop: 12 }}>
            {porVencer.map(l => (
              <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span>{l.nombre} {l.proveedor && <span className="muted">· {l.proveedor}</span>}</span>
                <span className="muted">{l.fecha_vencimiento}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
