import NodeCard from './NodeCard.jsx'

function Arrow() {
  return (
    <div className="flex justify-center py-1 font-mono text-line" aria-hidden="true">
      <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
        <path d="M8 0V18M8 18L2 12M8 18L14 12" stroke="#3D4759" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

export default function LinkedListMenu({ trabajos, trabajoActivoId, onSelect, onAgregar }) {
  return (
    <nav aria-label="Lista de trabajos" className="flex flex-col">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate">
        cabeza →
      </p>

      {trabajos.length === 0 && (
        <p className="mb-4 rounded-lg border border-dashed border-line px-4 py-6 text-center font-mono text-xs text-slate">
          la lista está vacía. agrega tu primer nodo.
        </p>
      )}

      {trabajos.map((trabajo, i) => (
        <div key={trabajo.id}>
          <NodeCard
            trabajo={trabajo}
            index={i}
            activo={trabajo.id === trabajoActivoId}
            onClick={() => onSelect(trabajo.id)}
          />
          <Arrow />
        </div>
      ))}

      <button
        onClick={onAgregar}
        className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-line px-5 py-4 font-mono text-sm text-slate transition-colors hover:border-amber hover:text-amber"
      >
        <span className="text-lg leading-none">+</span>
        <span>siguiente = NULL — agregar nodo</span>
      </button>
    </nav>
  )
}
