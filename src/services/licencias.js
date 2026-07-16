import { supabase } from '../lib/supabase'

/** Lista licencias con asientos usados/disponibles (vista v_licencias). */
export async function listarLicencias(busqueda) {
  let q = supabase.from('v_licencias').select('*')
  if (busqueda) {
    q = q.or(`nombre.ilike.%${busqueda}%,proveedor.ilike.%${busqueda}%`)
  }
  const { data, error } = await q.order('nombre')
  if (error) throw error
  return data
}

export async function crearLicencia(valores) {
  const { data, error } = await supabase
    .from('licencias_software')
    .insert(valores)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function actualizarLicencia(id, valores) {
  const { data, error } = await supabase
    .from('licencias_software')
    .update(valores)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Asigna un asiento. El trigger de la BD valida que haya asientos disponibles. */
export async function asignarAsiento({ licenciaId, colaboradorId, activoId }) {
  const { data, error } = await supabase
    .from('asignaciones_software')
    .insert({
      licencia_id: licenciaId,
      colaborador_id: colaboradorId,
      activo_id: activoId ?? null,
    })
    .select()
    .single()
  if (error) {
    if (error.message?.includes('asientos')) {
      throw new Error('La licencia no tiene asientos disponibles')
    }
    throw error
  }
  return data
}

export async function liberarAsiento(asignacionId) {
  const { data, error } = await supabase
    .from('asignaciones_software')
    .update({
      estado: 'devuelta',
      fecha_devolucion: new Date().toISOString().slice(0, 10),
    })
    .eq('id', asignacionId)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Licencias que vencen en los próximos N días (alerta en tablero). */
export async function licenciasPorVencer(dias = 30) {
  const limite = new Date(Date.now() + dias * 86400000).toISOString().slice(0, 10)
  const { data, error } = await supabase
    .from('licencias_software')
    .select('id, nombre, proveedor, fecha_vencimiento')
    .not('fecha_vencimiento', 'is', null)
    .lte('fecha_vencimiento', limite)
    .order('fecha_vencimiento')
  if (error) throw error
  return data
}
