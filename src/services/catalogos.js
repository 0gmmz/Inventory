import { supabase } from '../lib/supabase'

async function listar(tabla, filtroActivo = 'activa') {
  const { data, error } = await supabase
    .from(tabla)
    .select('*')
    .eq(filtroActivo, true)
    .order('nombre')
  if (error) throw error
  return data
}

export const getEmpresas = () => listar('empresas')
export const getCategorias = () => listar('categorias')
export const getDepartamentos = () => listar('departamentos', 'activo')

export async function getSubcategorias(categoriaId) {
  let q = supabase.from('subcategorias').select('*').eq('activa', true).order('nombre')
  if (categoriaId) q = q.eq('categoria_id', categoriaId)
  const { data, error } = await q
  if (error) throw error
  return data
}

export async function crearEnCatalogo(tabla, valores) {
  const { data, error } = await supabase.from(tabla).insert(valores).select().single()
  if (error) throw error
  return data
}
