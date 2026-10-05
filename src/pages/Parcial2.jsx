import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import ParcialVisualizer from '../components/ParcialVisualizer.jsx'

export default function Parcial2() {
  return (
    <Layout>
      <article className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <Link to="/trabajos" className="font-mono text-xs text-slate transition-colors hover:text-blueLight">
          ← volver a trabajos
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-blueLight">
            Parcial 2 · Métodos de ordenamiento
          </p>
          <h1 className="mt-2 text-balance font-display text-3xl font-semibold text-paper md:text-4xl">
            Comparativa visual de algoritmos de ordenamiento
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate">
            Implementación interactiva de los 12 métodos de ordenamiento vistos en clase
            aplicados a los cinco escenarios del parcial: desordenados, casi ordenados,
            invertidos, con repeticiones y medianamente ordenados. Incluye visualización
            gráfica en tiempo real, tabla comparativa de métricas y análisis automático
            del método más y menos eficiente.
          </p>

          <section className="mt-12">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-blueLight">
              Representación visual y análisis
            </p>
            <ParcialVisualizer />
          </section>

          <section className="mt-14 rounded-2xl border border-line/60 bg-panel/20 p-6">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate">
              Criterios de análisis
            </p>
            <ul className="space-y-2 text-sm leading-relaxed text-slate">
              <li>
                <strong className="text-paper">Memoria:</strong> complejidad espacial aproximada
                (O(1) in-place, O(n) auxiliares como Merge/Counting/Bucket).
              </li>
              <li>
                <strong className="text-paper">Tiempo:</strong> tiempo real de ejecución sobre el
                arreglo completo del enunciado (ms).
              </li>
              <li>
                <strong className="text-paper">Comparaciones / Intercambios / Iteraciones:</strong>{' '}
                contadores exactos del algoritmo sobre todos los datos. Criterio principal de eficiencia.
              </li>
              <li>
                <strong className="text-paper">Recursiva:</strong> indica si el método usa
                recursión (Quick, Merge) o es iterativo.
              </li>
              <li>
                <strong className="text-paper">Datos:</strong> se usan los arreglos completos del
                parcial (200–500 elementos según el escenario). En la animación se omiten algunos
                frames intermedios para que sea usable; la tabla y el análisis sí miden el arreglo entero.
              </li>
            </ul>
          </section>
        </motion.div>
      </article>
    </Layout>
  )
}
