import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../components/Layout.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import { obtenerTrabajo, obtenerTrabajos } from '../firebase.js'

function Seccion({ etiqueta, children }) {
  return (
    <section className="mt-10 first:mt-0">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-blueLight">
        {etiqueta}
      </p>
      {children}
    </section>
  )
}

export default function TrabajoPage() {
  const { id } = useParams()
  const [trabajo, setTrabajo] = useState(null)
  const [anterior, setAnterior] = useState(null)
  const [siguiente, setSiguiente] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setCargando(true)
    Promise.all([obtenerTrabajo(id), obtenerTrabajos()])
      .then(([t, todos]) => {
        if (!t) {
          setError('Este trabajo no existe o fue eliminado.')
          return
        }
        setTrabajo(t)
        const i = todos.findIndex((x) => x.id === t.id)
        setAnterior(i > 0 ? todos[i - 1] : null)
        setSiguiente(i >= 0 && i < todos.length - 1 ? todos[i + 1] : null)
      })
      .catch((err) => {
        console.error(err)
        setError('No se pudo cargar este trabajo.')
      })
      .finally(() => setCargando(false))
  }, [id])

  return (
    <Layout>
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <Link to="/trabajos" className="font-mono text-xs text-slate transition-colors hover:text-blueLight">
          ← volver a trabajos
        </Link>

        {cargando && (
          <p className="mt-10 font-mono text-sm text-slate">cargando…</p>
        )}

        {error && (
          <p className="mt-10 rounded-xl border border-rose/40 bg-rose/10 px-4 py-3 font-mono text-xs text-rose">
            {error}
          </p>
        )}

        {trabajo && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="mt-6 font-mono text-xs text-slate">
              Nº {String(trabajo.numeroClase).padStart(2, '0')}
              {trabajo.fecha ? ` · ${trabajo.fecha}` : ''}
            </p>
            <h1 className="mt-2 text-balance font-display text-3xl font-semibold text-paper md:text-4xl">
              {trabajo.titulo}
            </h1>
            {trabajo.descripcion && (
              <p className="mt-4 max-w-2xl leading-relaxed text-slate">
                {trabajo.descripcion}
              </p>
            )}

            {trabajo.umlUrl && (
              <Seccion etiqueta="Diagrama UML">
                <div className="overflow-hidden rounded-xl border border-line/60 bg-panel/40 p-3">
                  <img
                    src={trabajo.umlUrl}
                    alt={`Diagrama UML de ${trabajo.titulo}`}
                    className="mx-auto max-h-[480px] w-auto rounded-lg"
                  />
                </div>
              </Seccion>
            )}

            {trabajo.codigo && (
              <Seccion etiqueta="Código fuente">
                <CodeBlock codigo={trabajo.codigo} />
              </Seccion>
            )}

            {(trabajo.salidaTexto || trabajo.salidaImagenUrl) && (
              <Seccion etiqueta="Salida">
                {trabajo.salidaTexto && (
                  <pre className="whitespace-pre-wrap rounded-xl border border-line/60 bg-navy px-4 py-4 font-mono text-[13px] text-cyan">
                    {trabajo.salidaTexto}
                  </pre>
                )}
                {trabajo.salidaImagenUrl && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-line/60 bg-panel/40 p-3">
                    <img
                      src={trabajo.salidaImagenUrl}
                      alt={`Salida de ${trabajo.titulo}`}
                      className="mx-auto max-h-[420px] w-auto rounded-lg"
                    />
                  </div>
                )}
              </Seccion>
            )}

            {/* Navegación de la lista enlazada: nodo anterior / siguiente */}
            <nav className="mt-14 grid grid-cols-2 gap-4 border-t border-line/60 pt-6 font-mono text-xs">
              <div>
                <p className="text-slate/70">anterior ←</p>
                {anterior ? (
                  <Link to={`/trabajos/${anterior.id}`} className="mt-1 block truncate text-blueLight hover:underline">
                    "{anterior.titulo}"
                  </Link>
                ) : (
                  <p className="mt-1 text-slate/70">NULL</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-slate/70">siguiente →</p>
                {siguiente ? (
                  <Link to={`/trabajos/${siguiente.id}`} className="mt-1 block truncate text-blueLight hover:underline">
                    "{siguiente.titulo}"
                  </Link>
                ) : (
                  <p className="mt-1 text-slate/70">NULL</p>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </article>
    </Layout>
  )
}
