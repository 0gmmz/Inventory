import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCategorias, getSubcategorias, getEmpresas, crearEnCatalogo } from '../services/catalogos'
import { crearActivo } from '../services/activos'
import { subirFactura } from '../services/storage'

const FORM_INICIAL = {
  numero_serie: '', id_interno: '',
  categoria_id: '', subcategoria_id: '',
  marca: '', modelo: '', descripcion: '',
  adquisicion: 'compra', empresa_id: '',
  precio: '', moneda: 'MXN', activo_fijo: false,
  fecha_compra: '', notas: '',
}

export default function NuevoActivo() {
  const navigate = useNavigate()
  const [form, setForm] = useState(FORM_INICIAL)
  const [categorias, setCategorias] = useState([])
  const [subcategorias, setSubcategorias] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [facturaFile, setFacturaFile] = useState(null)
  const [nuevaEmpresa, setNuevaEmpresa] = useState('')
  const [mostrarNuevaEmpresa, setMostrarNuevaEmpresa] = useState(false)
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    Promise.all([getCategorias(), getEmpresas()])
      .then(([c, e]) => { setCategorias(c); setEmpresas(e) })
      .catch(e => setError(e.message))
  }, [])

  useEffect(() => {
    if (!form.categoria_id) { setSubcategorias([]); return }
    getSubcategorias(form.categoria_id)
      .then(setSubcategorias)
      .catch(e => setError(e.message))
  }, [form.categoria_id])

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor, ...(campo === 'categoria_id' ? { subcategoria_id: '' } : {}) }))
  }

  async function agregarEmpresa() {
    if (!nuevaEmpresa.trim()) return
    try {
      const emp = await crearEnCatalogo('empresas', { nombre: nuevaEmpresa.trim() })
      setEmpresas(es => [...es, emp].sort((a, b) => a.nombre.localeCompare(b.nombre)))
      set('empresa_id', emp.id)
      setNuevaEmpresa('')
      setMostrarNuevaEmpresa(false)
    } catch (e) {
      setError(e.message)
    }
  }

  async function guardar(e) {
    e.preventDefault()
    setError(null)
    setGuardando(true)
    try {
      let factura_path = null
      if (facturaFile) {
        factura_path = await subirFactura(facturaFile, form.id_interno || 'sin-id')
      }
      await crearActivo({
        numero_serie: form.numero_serie.trim(),
        id_interno: form.id_interno.trim(),
        categoria_id: form.categoria_id,
        subcategoria_id: form.subcategoria_id,
        marca: form.marca.trim() || null,
        modelo: form.modelo.trim() || null,
        descripcion: form.descripcion.trim() || null,
        adquisicion: form.adquisicion,
        empresa_id: form.empresa_id,
        factura_path,
        precio: form.precio === '' ? null : Number(form.precio),
        moneda: form.moneda,
        activo_fijo: form.activo_fijo,
        fecha_compra: form.fecha_compra || null,
        notas: form.notas.trim() || null,
      })
      navigate('/hardware')
    } catch (err) {
      setError(err.message)
      setGuardando(false)
    }
  }

  return (
    <>
      <div className="page-head">
        <h1>Registrar equipo</h1>
        <Link to="/hardware" className="btn btn--ghost">Cancelar</Link>
      </div>

      <form onSubmit={guardar} className="stack">

        <div className="card stack">
          <h2>Identificación</h2>
          <div className="field">
            <label htmlFor="numero_serie">Número de serie *</label>
            <input id="numero_serie" required value={form.numero_serie}
                   onChange={e => set('numero_serie', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="id_interno">ID interno (código de barras) *</label>
            <input id="id_interno" required inputMode="numeric" value={form.id_interno}
                   onChange={e => set('id_interno', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="categoria">Categoría *</label>
            <select id="categoria" required value={form.categoria_id}
                    onChange={e => set('categoria_id', e.target.value)}>
              <option value="">Selecciona…</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="subcategoria">¿Qué es? *</label>
            <select id="subcategoria" required value={form.subcategoria_id}
                    disabled={!form.categoria_id}
                    onChange={e => set('subcategoria_id', e.target.value)}>
              <option value="">{form.categoria_id ? 'Selecciona…' : 'Elige primero una categoría'}</option>
              {subcategorias.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="marca">Marca</label>
            <input id="marca" value={form.marca} onChange={e => set('marca', e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="modelo">Modelo</label>
            <input id="modelo" value={form.modelo} onChange={e => set('modelo', e.target.value)} />
          </div>
        </div>

        <div className="card stack">
          <h2>Finanzas y compras</h2>
          <div className="field">
            <label htmlFor="adquisicion">Adquisición *</label>
            <select id="adquisicion" required value={form.adquisicion}
                    onChange={e => set('adquisicion', e.target.value)}>
              <option value="compra">Compra</option>
              <option value="renta">Renta</option>
              <option value="prestamo">Préstamo</option>
              <option value="comodato">Comodato</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="empresa">Empresa *</label>
            <select id="empresa" required value={form.empresa_id}
                    onChange={e => set('empresa_id', e.target.value)}>
              <option value="">Selecciona…</option>
              {empresas.map(em => <option key={em.id} value={em.id}>{em.nombre}</option>)}
            </select>
            {!mostrarNuevaEmpresa && (
              <button type="button" className="btn btn--ghost"
                      onClick={() => setMostrarNuevaEmpresa(true)}>
                + Agregar empresa nueva
              </button>
            )}
            {mostrarNuevaEmpresa && (
              <div style={{ display: 'flex', gap: 8 }}>
                <input placeholder="Nombre de la empresa" value={nuevaEmpresa}
                       style={{ flex: 1, minHeight: 'var(--tap)', padding: '10px 12px',
                                border: '1px solid var(--line-strong)', borderRadius: 'var(--r-md)' }}
                       onChange={e => setNuevaEmpresa(e.target.value)} />
                <button type="button" className="btn" onClick={agregarEmpresa}>Agregar</button>
              </div>
            )}
          </div>
          <div className="field">
            <label htmlFor="factura">Factura o contrato (PDF)</label>
            <input id="factura" type="file" accept="application/pdf"
                   onChange={e => setFacturaFile(e.target.files?.[0] ?? null)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div className="field">
              <label htmlFor="precio">Precio</label>
              <input id="precio" type="number" step="0.01" min="0" inputMode="decimal"
                     value={form.precio} onChange={e => set('precio', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="moneda">Moneda</label>
              <select id="moneda" value={form.moneda} onChange={e => set('moneda', e.target.value)}>
                <option>MXN</option><option>USD</option><option>EUR</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="fecha_compra">Fecha de compra</label>
            <input id="fecha_compra" type="date" value={form.fecha_compra}
                   onChange={e => set('fecha_compra', e.target.value)} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 'var(--tap)', fontWeight: 600, fontSize: 13, color: 'var(--ink-2)' }}>
            <input type="checkbox" checked={form.activo_fijo}
                   style={{ width: 20, height: 20 }}
                   onChange={e => set('activo_fijo', e.target.checked)} />
            Es activo fijo
          </label>
        </div>

        <div className="card stack">
          <h2>Notas</h2>
          <div className="field">
            <label htmlFor="notas">Observaciones</label>
            <textarea id="notas" rows="3" value={form.notas}
                      onChange={e => set('notas', e.target.value)} />
          </div>
        </div>

        {error && <p className="card" style={{ color: 'var(--st-baja)' }}>{error}</p>}

        <button className="btn" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Registrar equipo'}
        </button>
      </form>
    </>
  )
}
