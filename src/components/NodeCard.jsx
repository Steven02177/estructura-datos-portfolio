export default function NodeCard({ trabajo, index, activo, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left rounded-lg border px-5 py-4 font-body transition-colors
        ${activo
          ? 'border-sage bg-sage/10'
          : 'border-line bg-panel hover:border-slate'}`}
    >
      <div className="flex items-start gap-4">
        <span className="mt-0.5 shrink-0 rounded border border-line bg-ink px-2 py-1 font-mono text-[11px] text-amber">
          [{String(index).padStart(2, '0')}]
        </span>
        <div className="min-w-0">
          <p className={`truncate font-display text-base font-medium ${activo ? 'text-paper' : 'text-paper/90'}`}>
            {trabajo.titulo}
          </p>
          <p className="mt-1 font-mono text-xs text-slate">
            clase #{trabajo.numeroClase}{trabajo.fecha ? ` · ${trabajo.fecha}` : ''}
          </p>
        </div>
      </div>
    </button>
  )
}
