import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { iniciarSesion, enviarRecuperacionContrasena } from '../firebase.js'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [recuperando, setRecuperando] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  async function manejarEnvio(e) {
    e.preventDefault()
    setError('')
    setMensaje('')
    setEnviando(true)
    try {
      await iniciarSesion(email, password)
      const destino = location.state?.from?.pathname || '/admin'
      navigate(destino, { replace: true })
    } catch (err) {
      console.error('Error de inicio de sesión:', err.code, err.message)
      if (err.code === 'auth/invalid-email') {
        setError('El formato del correo electrónico no es válido.')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Espera un momento e inténtalo de nuevo.')
      } else if (err.code === 'auth/network-request-failed') {
        setError('No hay conexión. Revisa tu internet e inténtalo de nuevo.')
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('El acceso con correo y contraseña no está habilitado en Firebase.')
      } else {
        setError('Correo o contraseña incorrectos. Verifica tus datos o restablece la contraseña.')
      }
    } finally {
      setEnviando(false)
    }
  }

  async function manejarRecuperacion() {
    setError('')
    setMensaje('')
    const correo = email.trim()
    if (!correo) {
      setError('Escribe tu correo electrónico en el campo correo y luego pulsa «Olvidé mi contraseña».')
      return
    }
    setRecuperando(true)
    try {
      await enviarRecuperacionContrasena(correo)
      setMensaje('Si el correo está registrado, Firebase enviará un enlace para restablecer la contraseña. Revisa también spam.')
    } catch (err) {
      console.error('Error al recuperar contraseña:', err.code, err.message)
      if (err.code === 'auth/invalid-email') {
        setError('El formato del correo electrónico no es válido.')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Se solicitaron demasiados enlaces. Espera un momento e inténtalo de nuevo.')
      } else {
        setError('No se pudo solicitar la recuperación. Revisa la conexión y la configuración de Authentication.')
      }
    } finally {
      setRecuperando(false)
    }
  }

  return (
    <Layout>
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-blueLight">
          Acceso restringido
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-paper">
          Panel de administrador
        </h1>
        <p className="mt-2 text-sm text-slate">
          Solo Keyner puede editar el contenido. Si eres visitante o
          profesor, no necesitas iniciar sesión — vuelve a{' '}
          <a href="/trabajos" className="text-blueLight hover:underline">
            trabajos
          </a>
          .
        </p>

        <form onSubmit={manejarEnvio} className="mt-8 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1 block font-mono text-xs text-slate">correo</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line bg-panel px-3 py-2.5 text-sm text-paper outline-none focus:border-blue"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1 block font-mono text-xs text-slate">contraseña</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-line bg-panel px-3 py-2.5 text-sm text-paper outline-none focus:border-blue"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-rose/40 bg-rose/10 px-3 py-2 font-mono text-xs text-rose">
              {error}
            </p>
          )}
          {mensaje && (
            <p role="status" className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 font-mono text-xs text-emerald-300">
              {mensaje}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando || recuperando}
            className="w-full rounded-lg bg-blue py-2.5 text-sm font-medium text-paper transition-colors hover:bg-blueLight disabled:opacity-50"
          >
            {enviando ? 'entrando…' : 'Entrar'}
          </button>
          <button
            type="button"
            onClick={manejarRecuperacion}
            disabled={enviando || recuperando}
            className="w-full py-2 text-sm text-blueLight transition-colors hover:underline disabled:opacity-50"
          >
            {recuperando ? 'enviando enlace…' : 'Olvidé mi contraseña'}
          </button>
        </form>
      </div>
    </Layout>
  )
}
