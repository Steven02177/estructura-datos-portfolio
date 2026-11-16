/**
 * Kit de presentación compartido por las páginas del portafolio
 * (Parcial 3, Taller Hash y Taller Grafos) para evitar duplicar código.
 * Todos los estilos siguen la identidad visual del proyecto.
 */

/** Código en línea dentro de respuestas, tablas y textos. */
export function C({ children }) {
  return (
    <code className="rounded bg-navy/70 px-1 py-0.5 font-mono text-[11px] text-cyan">
      {children}
    </code>
  )
}

/** Celda de metadatos (nombre, fecha, lenguaje, etc.). */
export function Dato({ etiqueta, valor }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-slate">{etiqueta}</p>
      <p className="mt-1 text-sm leading-relaxed text-paper">{valor}</p>
    </div>
  )
}

/** Recuadro con el enunciado original del documento del profesor. */
export function Enunciado({ children }) {
  return (
    <div className="mt-4 rounded-xl border border-line/60 bg-panel/30 p-4">
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-blueLight">
        Enunciado
      </p>
      <div className="text-sm leading-relaxed text-slate">{children}</div>
    </div>
  )
}

/** Subtítulo interno de sección. */
export function Titulo({ children }) {
  return (
    <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-cyan">{children}</p>
  )
}

/** Tabla comparativa con encabezado y filas alternadas.
 *  Cada fila es un array de celdas (string o JSX); la primera columna va en mono. */
export function Tabla({ columnas, filas }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-line/60 shadow-lg shadow-navy/40">
      <table className="w-full min-w-[640px] text-left text-xs">
        <thead>
          <tr className="bg-navy text-[10px] uppercase tracking-wider text-slate">
            {columnas.map((c) => (
              <th key={c} className="px-3 py-3 font-mono font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f, i) => (
            <tr
              key={i}
              className={`border-t border-line/40 ${i % 2 === 0 ? 'bg-panel/30' : 'bg-panel/10'}`}
            >
              {f.map((celda, j) => (
                <td
                  key={j}
                  className={`px-3 py-2.5 align-top leading-relaxed ${
                    j === 0 ? 'font-mono text-paper' : 'text-slate'
                  }`}
                >
                  {celda}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Sección numerada con ancla para el índice. */
export function Seccion({ id, numero, titulo, children }) {
  return (
    <section id={id} className="mt-16 scroll-mt-24">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue/50 bg-blue/10 font-mono text-sm text-blueLight">
          {numero}
        </span>
        <h2 className="text-balance font-display text-2xl font-semibold text-paper md:text-3xl">
          {titulo}
        </h2>
      </div>
      {children}
    </section>
  )
}

/** Ruta pública de un trabajo: las páginas especiales abren su taller completo. */
export function rutaDeTrabajo(trabajo) {
  if (trabajo?.paginaEspecial === 'hash') return '/taller-hash'
  if (trabajo?.paginaEspecial === 'grafos') return '/taller-grafos'
  return `/trabajos/${trabajo?.id}`
}

/** Navegación de índice: píldoras con anclas a cada sección. */
export function IndiceNav({ items }) {
  return (
    <nav className="mt-8 flex flex-wrap gap-2">
      {items.map((e) => (
        <a
          key={e.id}
          href={`#${e.id}`}
          className="rounded-full border border-line/60 bg-panel/40 px-4 py-1.5 text-xs text-slate transition-colors hover:border-blue/40 hover:text-paper"
        >
          <span className="mr-1.5 font-mono text-blueLight">{e.n}</span>
          {e.titulo}
        </a>
      ))}
    </nav>
  )
}
