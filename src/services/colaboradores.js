import { supabase } from '../lib/supabase'

export async function buscarColaboradores(texto) {
  const { data, error } = await supabase
    .from('colaboradores')
    .select('*, departamentos(nombre)')
    .or(`numero_colaborador.ilike.%${texto}%,nombre_completo.ilike.%${texto}%`)
    .eq('activo', true)
    .order('nombre_completo')
    .limit(15)
  if (error) throw error
  return data
}

/**
 * Devuelve el colaborador si ya existe (por número de colaborador),
 * o lo crea si es nuevo. Útil en el flujo de asignación.
 */
export async function obtenerOCrearColaborador({ numero_colaborador, nombre_completo, departamento_id }) {
  const { data: existente, error: e1 } = await supabase
    .from('colaboradores')
    .select('*')
    .eq('numero_colaborador', numero_colaborador)
    .maybeSingle()
  if (e1) throw e1
  if (existente) return existente

  const { data, error } = await supabase
    .from('colaboradores')
    .insert({ numero_colaborador, nombre_completo, departamento_id })
    .select()
    .single()
  if (error) throw error
  return data
}
