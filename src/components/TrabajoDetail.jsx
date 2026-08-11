import CodeBlock from './CodeBlock.jsx'

function Seccion({ etiqueta, children }) {
  return (
    <section className="mt-8 first:mt-0">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-amber">
        {etiqueta}
      </p>
      {children}
    </section>
  )
}

export default function TrabajoDetail({ trabajo }) {
  if (!trabajo) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center rounded-lg border border-dashed border-line px-6 text-center">
        <p className="max-w-sm font-mono text-sm text-slate">
          selecciona un nodo de la lista para ver su contenido, o agrega el
          primero.
        </p>
      </div>
    )
  }

  return (
    <article>
      <p className="font-mono text-xs text-slate">
        nodo [{trabajo.numeroClase}] {trabajo.fecha ? `· ${trabajo.fecha}` : ''}
      </p>
      <h2 className="mt-1 font-display text-2xl font-semibold text-paper md:text-3xl">
        {trabajo.titulo}
      </h2>
      {trabajo.descripcion && (
        <p className="mt-3 max-w-2xl font-body text-sm leading-relaxed text-slate">
          {trabajo.descripcion}
        </p>
      )}

      {trabajo.umlUrl && (
        <Seccion etiqueta="Diagrama UML">
          <div className="overflow-hidden rounded-lg border border-line bg-panel p-3">
            <img
              src={trabajo.umlUrl}
              alt={`Diagrama UML de ${trabajo.titulo}`}
              className="mx-auto max-h-[480px] w-auto rounded"
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
            <pre className="whitespace-pre-wrap rounded-lg border border-line bg-ink px-4 py-4 font-mono text-[13px] text-sage">
              {trabajo.salidaTexto}
            </pre>
          )}
          {trabajo.salidaImagenUrl && (
            <div className="mt-3 overflow-hidden rounded-lg border border-line bg-panel p-3">
              <img
                src={trabajo.salidaImagenUrl}
                alt={`Salida de ${trabajo.titulo}`}
                className="mx-auto max-h-[420px] w-auto rounded"
              />
            </div>
          )}
        </Seccion>
      )}
    </article>
  )
}
