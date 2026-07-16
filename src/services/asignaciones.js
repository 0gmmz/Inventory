import { supabase } from '../lib/supabase'
import { subirResguardo } from './storage'

/**
 * Flujo de asignación de hardware (según requerimientos):
 * número de colaborador, nombre, departamento, fecha y PDF de resguardo firmado.
 * El trigger de la BD pone el activo en estado 'asignado' automáticamente.
 */
export async function asignarHardware({ activoId, colaboradorId, fechaAsignacion, resguardoFile, notas }) {
  let resguardo_path = null
  if (resguardoFile) {
    resguardo_path = await subirResguardo(resguardoFile, activoId.slice(0, 8))
  }
  const { data, error } = await supabase
    .from('asignaciones_hardware')
    .insert({
      activo_id: activoId,
      colaborador_id: colaboradorId,
      fecha_asignacion: fechaAsignacion ?? new Date().toISOString().slice(0, 10),
      resguardo_path,
      notas: notas ?? null,
    })
    .select()
    .single()
  if (error) {
    if (error.code === '23505') {
      throw new Error('Este activo ya tiene una asignación activa')
    }
    throw error
  }
  return data
}

/** Agrega o reemplaza el resguardo firmado de una asignación existente. */
export async function adjuntarResguardo(asignacionId, file) {
  const resguardo_path = await subirResguardo(file, asignacionId.slice(0, 8))
  const { data, error } = await supabase
    .from('asignaciones_hardware')
    .update({ resguardo_path })
    .eq('id', asignacionId)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Registra la devolución. El trigger regresa el activo a 'disponible'. */
export async function registrarDevolucion(asignacionId, fechaDevolucion) {
  const { data, error } = await supabase
    .from('asignaciones_hardware')
    .update({
      estado: 'devuelta',
      fecha_devolucion: fechaDevolucion ?? new Date().toISOString().slice(0, 10),
    })
    .eq('id', asignacionId)
    .select()
    .single()
  if (error) throw error
  return data
}

/** Historial de asignaciones de un activo (más reciente primero). */
export async function historialDeActivo(activoId) {
  const { data, error } = await supabase
    .from('asignaciones_hardware')
    .select('*, colaboradores(numero_colaborador, nombre_completo, departamentos(nombre))')
    .eq('activo_id', activoId)
    .order('fecha_asignacion', { ascending: false })
  if (error) throw error
  return data
}

/** Equipo actualmente en manos de un colaborador. */
export async function activosDeColaborador(colaboradorId) {
  const { data, error } = await supabase
    .from('asignaciones_hardware')
    .select('*, activos_hardware(numero_serie, id_interno, marca, modelo)')
    .eq('colaborador_id', colaboradorId)
    .eq('estado', 'activa')
  if (error) throw error
  return data
}
