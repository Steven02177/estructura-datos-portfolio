import { useState } from 'react'
import CodeBlock from './CodeBlock.jsx'

/**
 * Bloque de "código + salida real" con botón de copiar al portapapeles.
 * Extraído de Parcial3.jsx para reutilizarlo en los talleres nuevos.
 *
 * Props:
 *   archivo       — nombre del archivo .java (también se usa en la nota al pie)
 *   codigo        — código fuente completo (string)
 *   salida        — salida de la ejecución (string)
 *   etiquetaBoton — texto del botón de copiar (por defecto «CodeChef»)
 */
export default function CodigoConSalida({
  archivo,
  codigo,
  salida,
  etiquetaSalida = 'Salida de la ejecución',
  etiquetaBoton = 'Copiar código (CodeChef)',
}) {
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <div className="mt-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs text-cyan">{archivo}</p>
        <button
          type="button"
          onClick={copiar}
          className="rounded-full border border-cyan/40 bg-cyan/10 px-4 py-1.5 text-xs font-medium text-cyan transition-colors hover:bg-cyan/20"
        >
          {copiado ? '✓ Copiado — pega en tu IDE' : etiquetaBoton}
        </button>
      </div>

      <CodeBlock codigo={codigo} />

      {salida && (
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-slate">
            {etiquetaSalida}
          </p>
          <div className="rounded-xl border border-cyan/30 bg-navy p-4 shadow-lg shadow-navy/40">
            <pre className="overflow-x-auto font-mono text-[12px] leading-relaxed text-cyan">
              {salida}
            </pre>
          </div>
          <p className="mt-2 font-mono text-[10px] text-slate/60">
            Salida real: código compilado y ejecutado con JDK 17 ·{' '}
            <span className="text-slate/80">{archivo}</span>
          </p>
        </div>
      )}
    </div>
  )
}
