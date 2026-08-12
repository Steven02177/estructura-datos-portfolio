import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import AddTrabajoForm from '../components/AddTrabajoForm.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { obtenerTrabajos, eliminarTrabajo, cerrarSesion } from '../firebase.js'

export default function AdminDashboard() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [trabajos, setTrabajos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [formAbierto, setFormAbierto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [borrandoId, setBorrandoId] = useState(null)

  async function cargar() {
    setCargando(true)
    setError('')
    try {
      setTrabajos(await obtenerTrabajos())
    } catch (err) {
      console.error(err)
      setError('No se pudieron cargar los trabajos.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  async function confirmarEliminar(trabajo) {
    if (!window.confirm(`¿Eliminar "${trabajo.titulo}"? Esta acción no se puede deshacer.`)) {
      return
    }
    setBorrandoId(trabajo.id)
    try {
      await eliminarTrabajo(trabajo.id)
      setTrabajos((prev) => prev.filter((t) => t.id !== trabajo.id))
    } catch (err) {
      console.error(err)
      setError('No se pudo eliminar el trabajo.')
    } finally {
      setBorrandoId(null)
    }
  }

  const siguienteNumero = trabajos.length
    ? Math.max(...trabajos.map((t) => t.numeroClase)) + 1
    : 1

  return (
    <Layout>
      <section className="mx-auto max-w-5xl px-6 py-14 md:px-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-blueLight">
              Panel de administrador
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-paper">
              Gestionar trabajos
            </h1>
            <p className="mt-1 text-sm text-slate">
              Sesión iniciada como <span className="text-paper">{usuario?.email}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditando(null)
                setFormAbierto(true)
              }}
              className="rounded-full bg-blue px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-blueLight"
            >
              + Nuevo trabajo
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-6 rounded-lg border border-rose/40 bg-rose/10 px-4 py-3 font-mono text-xs text-rose">
            {error}
          </p>
        )}

        <div className="mt-8 overflow-hidden rounded-2xl border border-line/60">
          {cargando ? (
            <p className="p-6 font-mono text-sm text-slate">cargando…</p>
          ) : trabajos.length === 0 ? (
            <p className="p-6 font-mono text-sm text-slate">
              No hay trabajos todavía. Crea el primero.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-panel/60 text-xs uppercase tracking-wide text-slate">
                <tr>
                  <th className="px-4 py-3 font-mono">#</th>
                  <th className="px-4 py-3 font-mono">Título</th>
                  <th className="hidden px-4 py-3 font-mono sm:table-cell">Fecha</th>
                  <th className="px-4 py-3 font-mono text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {trabajos.map((trabajo) => (
                  <tr key={trabajo.id} className="border-t border-line/60">
                    <td className="px-4 py-3 font-mono text-slate">
                      {String(trabajo.numeroClase).padStart(2, '0')}
                    </td>
                    <td className="px-4 py-3 text-paper">{trabajo.titulo}</td>
                    <td className="hidden px-4 py-3 font-mono text-slate sm:table-cell">
                      {trabajo.fecha || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditando(trabajo)
                            setFormAbierto(true)
                          }}
                          className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate hover:border-blue hover:text-blueLight"
                        >
                          editar
                        </button>
                        <button
                          onClick={() => confirmarEliminar(trabajo)}
                          disabled={borrandoId === trabajo.id}
                          className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate hover:border-rose hover:text-rose disabled:opacity-50"
                        >
                          {borrandoId === trabajo.id ? 'eliminando…' : 'eliminar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {formAbierto && (
        <AddTrabajoForm
          siguienteNumero={siguienteNumero}
          trabajoExistente={editando}
          onClose={() => setFormAbierto(false)}
          onGuardado={async () => {
            setFormAbierto(false)
            setEditando(null)
            await cargar()
          }}
        />
      )}
    </Layout>
  )
}
