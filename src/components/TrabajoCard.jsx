import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function TrabajoCard({ trabajo, index, siguienteTitulo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06, ease: 'easeOut' }}
    >
      <Link
        to={`/trabajos/${trabajo.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line/60 bg-panel/40 transition-all duration-300 hover:-translate-y-1 hover:border-blue/50 hover:shadow-[0_16px_40px_-16px_rgba(37,99,235,0.35)]"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-panel2">
          {trabajo.umlUrl ? (
            <img
              src={trabajo.umlUrl}
              alt={`Diagrama UML de ${trabajo.titulo}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-mono text-xs text-slate">sin diagrama</span>
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full border border-line/70 bg-navy/70 px-2.5 py-1 font-mono text-[11px] text-blueLight backdrop-blur-sm">
            Nº {String(trabajo.numeroClase).padStart(2, '0')}
          </span>
          {trabajo.documentoUrl && (
            <span className="absolute right-3 top-3 rounded-full border border-line/70 bg-navy/70 px-2.5 py-1 font-mono text-[11px] text-cyan backdrop-blur-sm">
              📄 Word
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="font-mono text-xs text-slate">
            {trabajo.fecha || 'sin fecha registrada'}
          </p>
          <h3 className="mt-1.5 font-display text-lg font-semibold text-paper">
            {trabajo.titulo}
          </h3>
          {trabajo.descripcion && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate">
              {trabajo.descripcion}
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blueLight">
            Ver trabajo
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </div>

        {/* Puntero de lista enlazada: cada nodo referencia al siguiente */}
        <div className="border-t border-line/50 bg-navy/40 px-5 py-2.5">
          <p className="truncate font-mono text-[11px] text-slate">
            <span className="text-slate/70">siguiente →</span>{' '}
            {siguienteTitulo ? (
              <span className="text-cyan/90">"{siguienteTitulo}"</span>
            ) : (
              <span className="text-slate/70">NULL</span>
            )}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}
