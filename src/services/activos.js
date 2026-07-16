import { supabase } from '../lib/supabase'

/**
 * Lista el inventario desde la vista v_inventario_hardware.
 * filtros: { busqueda, estado, categoria, empresa }
 * busqueda aplica sobre número de serie, ID interno, marca y modelo —
 * también sirve para el resultado de escanear un código de barras.
 */
export async function listarActivos(filtros = {}) {
  let q = supabase.from('v_inventario_hardware').select('*')

  if (filtros.busqueda) {
    const b = filtros.busqueda.trim()
    q = q.or(
      `numero_serie.ilike.%${b}%,id_interno.ilike.%${b}%,marca.ilike.%${b}%,modelo.ilike.%${b}%,asignado_a.ilike.%${b}%`
    )
  }
  if (filtros.estado) q = q.eq('estado', filtros.estado)
  if (filtros.categoria) q = q.eq('categoria', filtros.categoria)
  if (filtros.empresa) q = q.eq('empresa', filtros.empresa)

  const { data, error } = await q.order('id_interno')
  if (error) throw error
  return data
}

/** Búsqueda exacta por ID interno (escaneo de código de barras). */
export async function buscarPorIdInterno(idInterno) {
  const { data, error } = await supabase
    .from('v_inventario_hardware')
    .select('*')
    .eq('id_interno', idInterno)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function getActivo(id) {
  const { data, error } = await supabase
    .from('activos_hardware')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function crearActivo(valores) {
  const { data, error } = await supabase
    .from('activos_hardware')
    .insert(valores)
    .select()
    .single()
  if (error) {
    if (error.code === '23505') {
      throw new Error('Ya existe un activo con ese número de serie o ID interno')
    }
    throw error
  }
  return data
}

export async function actualizarActivo(id, valores) {
  const { data, error } = await supabase
    .from('activos_hardware')
    .update(valores)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export const enviarAReparacion = (id) => actualizarActivo(id, { estado: 'en_reparacion' })
export const regresarDeReparacion = (id) => actualizarActivo(id, { estado: 'disponible' })
export const darDeBaja = (id) => actualizarActivo(id, { estado: 'baja' })

/** Conteos por estado para el tablero. */
export async function conteoPorEstado() {
  const { data, error } = await supabase
    .from('activos_hardware')
    .select('estado')
  if (error) throw error
  const conteo = { disponible: 0, asignado: 0, en_reparacion: 0, baja: 0 }
  for (const r of data) conteo[r.estado] = (conteo[r.estado] ?? 0) + 1
  return conteo
}
