import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { listarActivos } from '../services/activos'
import AssetTag from '../components/AssetTag'
import EstadoBadge from '../components/EstadoBadge'

export default function Hardware() {
  const [params] = useSearchParams()
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState(params.get('estado') ?? '')
  const [activos, setActivos] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => {
      listarActivos({ busqueda, estado })
        .then(setActivos)
        .catch(e => setError(e.message))
    }, 250)
    return () => clearTimeout(t)
  }, [busqueda, estado])

  return (
    <>
      <div className="page-head">
        <h1>Hardware</h1>
      </div>

      <div className="stack" style={{ marginBottom: 16 }}>
        <div className="field">
          <label htmlFor="buscar">Buscar</label>
          <input id="buscar" type="search" inputMode="search"
                 placeholder="Serie, ID interno, marca, modelo o colaborador"
                 value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="estado">Estado</label>
          <select id="estado" value={estado} onChange={e => setEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="disponible">Disponible</option>
            <option value="asignado">Asignado</option>
            <option value="en_reparacion">En reparación</option>
            <option value="baja">Baja</option>
          </select>
        </div>
      </div>

      {error && <p className="card" style={{ color: 'var(--st-baja)' }}>{error}</p>}

      {activos.length === 0 && !error && (
        <p className="card muted">Sin resultados. Registra un activo o ajusta la búsqueda.</p>
      )}

      <div className="stack">
        {activos.map(a => (
          <div key={a.id} className="card" style={{ display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
              <AssetTag>{a.id_interno}</AssetTag>
              <EstadoBadge estado={a.estado} />
            </div>
            <div>
              <strong>{a.marca} {a.modelo}</strong>
              <p className="muted">{a.categoria} · {a.subcategoria}</p>
            </div>
            <p className="muted" style={{ fontFamily: 'var(--f-mono)', fontSize: 12 }}>
              S/N {a.numero_serie}
            </p>
            {a.asignado_a && (
              <p className="muted">Asignado a {a.asignado_a} · {a.departamento}</p>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
