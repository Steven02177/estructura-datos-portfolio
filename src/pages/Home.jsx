import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import GraphBackground from '../components/GraphBackground.jsx'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' },
  }),
}

export default function Home() {
  return (
    <Layout>
      <section className="relative overflow-hidden border-b border-line/60">
        <GraphBackground />
        <div className="relative mx-auto flex min-h-[88vh] max-w-4xl flex-col items-center justify-center px-6 py-24 text-center md:px-10">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="font-mono text-xs uppercase tracking-[0.3em] text-blueLight"
          >
            Portafolio académico
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.05] text-paper md:text-7xl"
          >
            Estructura de Datos
          </motion.h1>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 space-y-1"
          >
            <p className="font-display text-xl font-medium text-paper/90 md:text-2xl">
              Keyner García
            </p>
            <p className="font-mono text-sm text-slate">
              Ingeniería de Software · Universidad de Santander (UDES)
            </p>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-6 max-w-xl text-balance text-base leading-relaxed text-slate"
          >
            Un registro semestral de cada ejercicio de clase: el problema, el
            diagrama UML, el código y la salida — documentado a medida que
            avanza el curso.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-10"
          >
            <Link
              to="/trabajos"
              className="group inline-flex items-center gap-2 rounded-full bg-blue px-7 py-3.5 font-medium text-paper transition-all hover:bg-blueLight hover:shadow-[0_0_0_6px_rgba(37,99,235,0.15)]"
            >
              Explorar trabajos
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      <section id="sobre-el-proyecto" className="mx-auto max-w-4xl px-6 py-24 md:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-blueLight">
          Sobre el proyecto
        </p>
        <h2 className="mt-4 text-balance font-display text-3xl font-semibold text-paper md:text-4xl">
          Cada clase resuelve un problema distinto de estructuras de datos.
        </h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-slate">
          Este sitio nace como bitácora del curso: pilas, colas, listas
          enlazadas, árboles y grafos, cada uno modelado primero en UML y
          después implementado y ejecutado. La idea es que cualquiera —
          compañero, profesor o yo mismo en un semestre futuro — pueda
          revisar el razonamiento completo detrás de cada solución.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            ['UML', 'Modelado de clases y relaciones antes de programar.'],
            ['Código', 'Implementación completa, comentada y ejecutable.'],
            ['Salida', 'Evidencia real de la ejecución de cada ejercicio.'],
          ].map(([titulo, texto]) => (
            <div key={titulo} className="rounded-2xl border border-line/60 bg-panel/40 p-5">
              <p className="font-display text-sm font-semibold text-blueLight">{titulo}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate">{texto}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}
