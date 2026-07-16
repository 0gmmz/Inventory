import { createClient } from '@supabase/supabase-js'

// Valores del proyecto InventoryIT. El anon key es público por diseño
// (viaja en el bundle del cliente); la seguridad real la aplica RLS.
// Si existen variables de entorno (p. ej. para apuntar a otro proyecto
// en desarrollo), tienen prioridad.
const FALLBACK_URL = 'https://aimcktrxnnluevhqceqa.supabase.co'
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpbWNrdHJ4bm5sdWV2aHFjZXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMTA3MjMsImV4cCI6MjA5OTc4NjcyM30.6QSYqpP7pNSZEvflvVAMHqAdW4GQ3-GDfegWt9RJsLk'

const url = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY

export const supabase = createClient(url, key)
