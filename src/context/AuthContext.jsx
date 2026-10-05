import { createContext, useContext, useEffect, useState } from 'react'
import { observarSesion } from '../firebase.js'

const AuthContext = createContext({ usuario: null, cargando: true })

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cancelar = observarSesion((user) => {
      setUsuario(user)
      setCargando(false)
    })
    return cancelar
  }, [])

  return (
    <AuthContext.Provider value={{ usuario, cargando }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
