import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(undefined) // undefined = cargando

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSesion(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, s) => setSesion(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  async function iniciarSesion(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error('Correo o contraseña incorrectos')
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ sesion, usuario: sesion?.user ?? null, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
