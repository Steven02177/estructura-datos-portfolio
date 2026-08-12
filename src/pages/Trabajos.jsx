import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout.jsx'
import TrabajoCard from '../components/TrabajoCard.jsx'
import { obtenerTrabajos } from '../firebase.js'

export default function Trabajos() {
  const [trabajos, setTrabajos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerTrabajos()
      .then(setTrabajos)
      .catch((err) => {
        console.error(err)
        setError('No se pudieron cargar los trabajos. Intenta recargar la página.')
      })
      .finally(() => setCargando(false))
  }, [])

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-blueLight">
            Registro del semestre · cabeza →
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-paper md:text-5xl">
            Todos mis trabajos
          </h1>
          <p className="mt-3 max-w-xl text-slate">
            {trabajos.length > 0
              ? `${trabajos.length} ejercicio${trabajos.length === 1 ? '' : 's'} documentado${trabajos.length === 1 ? '' : 's'} hasta ahora.`
              : 'Aún no hay ejercicios publicados.'}
          </p>
        </motion.div>

        {error && (
          <p className="mt-8 rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 font-mono text-xs text-rose">
            {error}
          </p>
        )}

        {cargando ? (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl border border-line/60 bg-panel/40" />
            ))}
          </div>
        ) : trabajos.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
            <p className="font-mono text-sm text-slate">
              Todavía no se ha publicado ningún trabajo. Vuelve pronto.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trabajos.map((trabajo, i) => (
              <TrabajoCard
                key={trabajo.id}
                trabajo={trabajo}
                index={i}
                siguienteTitulo={trabajos[i + 1]?.titulo ?? null}
              />
            ))}
          </div>
        )}
      </section>
    </Layout>
  )
}
