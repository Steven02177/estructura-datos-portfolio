import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import { iniciarSesion } from '../firebase.js'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  async function manejarEnvio(e) {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await iniciarSesion(email, password)
      const destino = location.state?.from?.pathname || '/admin'
      navigate(destino, { replace: true })
    } catch (err) {
      console.error(err)
      setError('Correo o contraseña incorrectos.')
    } finally {
      setEnviando(false)
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
            <label className="mb-1 block font-mono text-xs text-slate">correo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-line bg-panel px-3 py-2.5 text-sm text-paper outline-none focus:border-blue"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs text-slate">contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-line bg-panel px-3 py-2.5 text-sm text-paper outline-none focus:border-blue"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-rose/40 bg-rose/10 px-3 py-2 font-mono text-xs text-rose">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-lg bg-blue py-2.5 text-sm font-medium text-paper transition-colors hover:bg-blueLight disabled:opacity-50"
          >
            {enviando ? 'entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </Layout>
  )
}
