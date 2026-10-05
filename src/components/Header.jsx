export default function Header() {
  return (
    <header className="border-b border-line/60 px-6 py-8 md:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs tracking-widest text-sage">
          UDES · INGENIERÍA DE SOFTWARE
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-paper md:text-5xl">
          Keyner<span className="text-amber">.</span>
        </h1>
        <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-slate">
          Bitácora de Estructura de Datos — un nodo por cada clase: diagrama
          UML, código fuente y salida de ejecución, enlazados en orden.
        </p>
      </div>
    </header>
  )
}
