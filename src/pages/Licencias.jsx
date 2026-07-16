import { useEffect, useState } from 'react'
import { listarLicencias } from '../services/licencias'

export default function Licencias() {
  const [licencias, setLicencias] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    listarLicencias().then(setLicencias).catch(e => setError(e.message))
  }, [])

  return (
    <>
      <div className="page-head">
        <h1>Licencias</h1>
      </div>
      {error && <p className="card" style={{ color: 'var(--st-baja)' }}>{error}</p>}
      {licencias.length === 0 && !error && (
        <p className="card muted">Aún no hay licencias registradas.</p>
      )}
      <div className="stack">
        {licencias.map(l => (
          <div key={l.id} className="card" style={{ display: 'grid', gap: 6 }}>
            <strong>{l.nombre}</strong>
            <p className="muted">{l.proveedor} {l.version && `· v${l.version}`} · {l.tipo}</p>
            <p className="muted">
              Asientos: {l.asientos_usados} de {l.asientos_total}
              {l.fecha_vencimiento && ` · vence ${l.fecha_vencimiento}`}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}
