import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { cerrarSesion } from '../firebase.js'

const enlaces = [
  { to: '/', label: 'Inicio', fin: true },
  { to: '/trabajos', label: 'Trabajos' },
  { to: '/#sobre-el-proyecto', label: 'Sobre el proyecto' },
]

function linkClasses({ isActive }) {
  return `text-sm transition-colors ${
    isActive ? 'text-paper' : 'text-slate hover:text-paper'
  }`
}

export default function NavBar() {
  const [abierto, setAbierto] = useState(false)
  const { usuario } = useAuth()
  const navigate = useNavigate()

  async function salir() {
    await cerrarSesion()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-navy/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="font-display text-base font-semibold tracking-tight text-paper">
          Keyner<span className="text-blueLight">.</span>ed
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {enlaces.map((e) => (
            <NavLink key={e.to} to={e.to} end={e.fin} className={linkClasses}>
              {e.label}
            </NavLink>
          ))}
          {usuario ? (
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="rounded-full border border-blue/50 bg-blue/10 px-4 py-1.5 text-sm text-blueLight transition-colors hover:bg-blue/20"
              >
                Panel admin
              </Link>
              <button
                onClick={salir}
                className="text-sm text-slate transition-colors hover:text-rose"
              >
                Salir
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="text-sm text-slate transition-colors hover:text-paper"
            >
              Administrador
            </Link>
          )}
        </nav>

        <button
          onClick={() => setAbierto((v) => !v)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={abierto}
        >
          <span className={`h-0.5 w-6 bg-paper transition-transform ${abierto ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-6 bg-paper transition-opacity ${abierto ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-paper transition-transform ${abierto ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {abierto && (
        <nav className="flex flex-col gap-1 border-t border-line/60 bg-navy px-6 py-4 md:hidden">
          {enlaces.map((e) => (
            <NavLink
              key={e.to}
              to={e.to}
              end={e.fin}
              onClick={() => setAbierto(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm ${isActive ? 'bg-panel text-paper' : 'text-slate'}`
              }
            >
              {e.label}
            </NavLink>
          ))}
          {usuario ? (
            <>
              <Link
                to="/admin"
                onClick={() => setAbierto(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-blueLight"
              >
                Panel admin
              </Link>
              <button
                onClick={salir}
                className="rounded-lg px-3 py-2.5 text-left text-sm text-rose"
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setAbierto(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-slate"
            >
              Administrador
            </Link>
          )}
        </nav>
      )}
    </header>
  )
}
