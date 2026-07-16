import { supabase } from '../lib/supabase'

// Buckets privados: acceso solo con URLs firmadas
const BUCKET_FACTURAS = 'facturas'
const BUCKET_RESGUARDOS = 'resguardos'

function nombreSeguro(prefijo) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `${prefijo}_${stamp}.pdf`
}

async function subirPdf(bucket, path, file) {
  if (file.type !== 'application/pdf') {
    throw new Error('El archivo debe ser un PDF')
  }
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: 'application/pdf', upsert: false })
  if (error) throw error
  return data.path
}

/** Sube la factura de un activo o licencia. Devuelve la ruta para guardar en factura_path. */
export function subirFactura(file, referencia) {
  return subirPdf(BUCKET_FACTURAS, nombreSeguro(`factura_${referencia}`), file)
}

/** Sube el resguardo firmado de una asignación. Devuelve la ruta para resguardo_path. */
export function subirResguardo(file, referencia) {
  return subirPdf(BUCKET_RESGUARDOS, nombreSeguro(`resguardo_${referencia}`), file)
}

/** URL firmada temporal (1 hora) para ver/descargar un PDF privado. */
export async function urlFirmada(bucket, path) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600)
  if (error) throw error
  return data.signedUrl
}

export const urlFactura = (path) => urlFirmada(BUCKET_FACTURAS, path)
export const urlResguardo = (path) => urlFirmada(BUCKET_RESGUARDOS, path)
