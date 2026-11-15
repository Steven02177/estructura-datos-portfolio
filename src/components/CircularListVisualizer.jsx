import { useState, useRef, useEffect } from 'react'

// ---------------------------------------------------------------------------
// Datos iniciales — mismos valores que los main de los ejercicios 3 y 4
// (codechef/6_ListaCircularSimple.java y codechef/7_ListaCircularDoble.java)
// ---------------------------------------------------------------------------
const INICIALES = {
  simple: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  doble: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
}

const NOMBRES = {
  simple: 'Circular sencillamente enlazada',
  doble: 'Circular doblemente enlazada',
}

const COLORES = {
  normal: { fill: '#141F38', stroke: '#233047' },
  recorrido: { fill: '#16305B', stroke: '#3B82F6' },
  objetivo: { fill: '#3B1D22', stroke: '#F87171' },
  ok: { fill: '#0F3A45', stroke: '#22D3EE' },
  aviso: { fill: '#3B1D22', stroke: '#F87171' },
}

const frame = (valores, resaltado, tipo, log) => ({ valores, resaltado, tipo, log })

function esPosValida(pos, n) {
  return Number.isInteger(pos) && pos >= 1 && pos <= n
}

/** Ecuaciones de punteros que ejecuta cada eliminación (espejo del código Java). */
function punterosEliminacion(estructura, n, posicion) {
  if (estructura === 'simple') {
    if (n === 1) return ['cabeza = null · ultimo = null → la lista queda vacía']
    if (posicion === 1) {
      return [
        'ultimo.siguiente = cabeza.siguiente → el último apunta a la NUEVA cabeza',
        'cabeza = cabeza.siguiente',
      ]
    }
    const ec = ['anterior.siguiente = eliminado.siguiente → un solo puntero modificado']
    if (posicion === n) ec.push('ultimo = anterior → la cola se movió')
    return ec
  }
  if (n === 1) return ['cabeza = null → la lista queda vacía']
  const ec = [
    'objetivo.anterior.siguiente = objetivo.siguiente → sentido «siguiente»',
    'objetivo.siguiente.anterior = objetivo.anterior → sentido «anterior»',
  ]
  if (posicion === 1) ec.push('cabeza = objetivo.siguiente → nueva cabeza')
  return ec
}

// ---------------------------------------------------------------------------
// Generadores de frames: un frame por cada paso visible de la operación
// ---------------------------------------------------------------------------

function* eliminar(estructura, valores, posicionCruda) {
  const n = valores.length
  const posicion = Number(posicionCruda)

  if (n === 0) {
    yield frame(valores, [], 'aviso', '[Aviso] La lista está vacía: no hay nada que eliminar.')
    return
  }
  if (!esPosValida(posicion, n)) {
    yield frame(
      valores,
      [],
      'aviso',
      `[Aviso] La posición ${Number.isFinite(posicion) ? posicion : '—'} no existe (rango válido: 1 a ${n}).`
    )
    return
  }

  const idx = posicion - 1

  // --- FASE 1: localizar (depende de la estructura de enlaces) ---
  if (posicion === 1) {
    if (n === 1) {
      yield frame(valores, [0], 'objetivo', 'Único nodo: eliminarlo deja la lista vacía.')
    } else if (estructura === 'simple') {
      yield frame(valores, [n - 1], 'recorrido', 'CABEZA: en la lista sencilla hay que recorrer hasta el ÚLTIMO nodo, porque él es quien apunta a la cabeza.')
      yield frame(valores, [0], 'objetivo', 'Nodo objetivo: la cabeza (posición 1).')
    } else {
      yield frame(valores, [0], 'objetivo', 'CABEZA: los vecinos se localizan en el propio nodo; solo se mueve la referencia «cabeza».')
    }
  } else {
    for (let i = 0; i < idx; i++) {
      yield frame(
        valores,
        [i],
        'recorrido',
        i === idx - 1
          ? `Posición ${i + 1} (valor ${valores[i]}) → este es el nodo ANTERIOR al objetivo.`
          : `Visitando posición ${i + 1} (valor ${valores[i]}) → seguimos con «siguiente» (sin puntero previo no se puede desvincular).`
      )
    }
    yield frame(valores, [idx], 'objetivo', `Nodo objetivo: posición ${posicion} (valor ${valores[idx]}).`)
  }

  // --- FASE 2: desvincular (punteros) ---
  for (const eq of punterosEliminacion(estructura, n, posicion)) {
    yield frame(valores, [idx], 'objetivo', `Punteros → ${eq}`)
  }

  const nuevos = valores.filter((_, i) => i !== idx)
  yield frame(
    nuevos,
    [],
    'ok',
    `✓ Eliminado ${valores[idx]} · tamaño = ${nuevos.length}${
      nuevos.length ? ` · nueva cabeza = ${nuevos[0]}` : ' · lista vacía'
    }`
  )
}

function* insertar(estructura, valores, valorCrudo) {
  const valor = Number(valorCrudo)
  if (!Number.isFinite(valor)) {
    yield frame(valores, [], 'aviso', '[Aviso] Escribe un número válido para insertar.')
    return
  }

  const nuevos = [...valores, valor]
  if (nuevos.length === 1) {
    yield frame(nuevos, [0], 'ok', estructura === 'simple'
      ? 'Punteros → nuevo.siguiente = nuevo (un solo nodo se apunta a sí mismo)'
      : 'Punteros → nuevo.siguiente = nuevo · nuevo.anterior = nuevo (cierre en ambos sentidos)')
  } else {
    const ec = estructura === 'simple'
      ? ['nuevo.siguiente = cabeza', 'ultimo.siguiente = nuevo', 'ultimo = nuevo']
      : ['nuevo.siguiente = cabeza · nuevo.anterior = ultimo', 'ultimo.siguiente = nuevo · cabeza.anterior = nuevo']
    for (const e of ec) {
      yield frame(nuevos, [nuevos.length - 1], 'recorrido', `Punteros → ${e}`)
    }
  }
  yield frame(nuevos, [nuevos.length - 1], 'ok', `✓ Insertado ${valor} en la posición ${nuevos.length} · tamaño = ${nuevos.length}`)
}

function* actualizarPosicion(valores, posicionCruda, nuevoCrudo) {
  const n = valores.length
  const posicion = Number(posicionCruda)
  const nuevoDato = Number(nuevoCrudo)

  if (n === 0) {
    yield frame(valores, [], 'aviso', '[Aviso] La lista está vacía: no hay nada que actualizar.')
    return
  }
  if (!esPosValida(posicion, n)) {
    yield frame(
      valores,
      [],
      'aviso',
      `[Aviso] La posición ${Number.isFinite(posicion) ? posicion : '—'} no existe (rango válido: 1 a ${n}).`
    )
    return
  }
  if (!Number.isFinite(nuevoDato)) {
    yield frame(valores, [], 'aviso', '[Aviso] El nuevo dato no es un número válido.')
    return
  }

  const idx = posicion - 1

  // --- FASE 1: recorrido (lo único que depende de la estructura) ---
  if (posicion === 1) {
    yield frame(valores, [0], 'recorrido', 'Partimos de «cabeza»: ya estamos en la posición 1.')
  } else {
    for (let i = 0; i < idx; i++) {
      yield frame(
        valores,
        [i],
        'recorrido',
        i === idx - 1
          ? `Posición ${i + 1} (valor ${valores[i]}) → el siguiente paso llega al objetivo.`
          : `Visitando posición ${i + 1} (valor ${valores[i]}) → seguimos con «siguiente».`
      )
    }
  }
  yield frame(valores, [idx], 'objetivo', `Nodo objetivo: posición ${posicion} (valor ${valores[idx]}).`)

  // --- FASE 2: asignación (INDEPENDIENTE de los punteros) ---
  yield frame(valores, [idx], 'objetivo', `FASE 2 → nodo.dato = ${nuevoDato}   (no toca «siguiente» ni «anterior»)`)
  const viejo = valores[idx]
  const nuevos = [...valores]
  nuevos[idx] = nuevoDato
  yield frame(
    nuevos,
    [idx],
    'ok',
    `✓ Posición ${posicion}: ${viejo} → ${nuevoDato} · ningún enlace modificó, la circularidad se conserva`
  )
}

function* actualizarDato(valores, viejoCrudo, nuevoCrudo) {
  const n = valores.length
  const viejo = Number(viejoCrudo)
  const nuevo = Number(nuevoCrudo)

  if (n === 0) {
    yield frame(valores, [], 'aviso', '[Aviso] La lista está vacía: no hay nada que actualizar.')
    return
  }
  if (!Number.isFinite(viejo) || !Number.isFinite(nuevo)) {
    yield frame(valores, [], 'aviso', '[Aviso] El dato antiguo y el nuevo deben ser números.')
    return
  }

  let idx = -1
  for (let i = 0; i < n; i++) {
    yield frame(valores, [i], 'recorrido', `Comparando posición ${i + 1} (valor ${valores[i]}) con ${viejo}.`)
    if (valores[i] === viejo) {
      idx = i
      break
    }
  }

  if (idx === -1) {
    yield frame(
      valores,
      [],
      'aviso',
      `[Aviso] El dato ${viejo} no existe: se dio UNA sola vuelta y se volvió a la cabeza (sin NullPointerException).`
    )
    return
  }

  yield frame(valores, [idx], 'objetivo', `Coincidencia en la posición ${idx + 1}.`)
  yield frame(valores, [idx], 'objetivo', `FASE 2 → nodo.dato = ${nuevo}   (misma asignación que por posición)`)
  const nuevos = [...valores]
  nuevos[idx] = nuevo
  yield frame(nuevos, [idx], 'ok', `✓ Dato ${viejo} → ${nuevo} en la posición ${idx + 1}`)
}

// ---------------------------------------------------------------------------
// Render SVG: los nodos sobre una circunferencia con sus flechas de enlace
// ---------------------------------------------------------------------------

function ListaCircularSVG({ valores, resaltado, tipo, estructura }) {
  const n = valores.length
  const W = 720
  const H = 430
  const cx = W / 2
  const cy = H / 2 + 8

  if (n === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-line/60 bg-navy/40">
        <p className="font-mono text-sm text-slate">
          Lista vacía — inserta un nodo para volver a formar el círculo
        </p>
      </div>
    )
  }

  const R = n <= 4 ? 105 : n <= 7 ? 125 : 145
  const nodeR = 27
  const rad = (deg) => (deg * Math.PI) / 180
  const degDe = (i) => -90 + (360 / n) * i
  const punto = (i, r = R) => ({
    x: cx + r * Math.cos(rad(degDe(i))),
    y: cy + r * Math.sin(rad(degDe(i))),
  })
  const mover = (p, ctrl, d) => {
    const dx = ctrl.x - p.x
    const dy = ctrl.y - p.y
    const len = Math.hypot(dx, dy) || 1
    return { x: p.x + (dx / len) * d, y: p.y + (dy / len) * d }
  }

  /** Arco desde el nodo i hacia su vecino en la dirección d (+1 siguiente, -1 anterior). */
  const arco = (i, d, lane) => {
    const j = (i + d + n) % n
    const p1 = punto(i)
    const p2 = punto(j)
    const degCtrl = degDe(i) + d * (180 / n)
    const ctrl = {
      x: cx + R * lane * Math.cos(rad(degCtrl)),
      y: cy + R * lane * Math.sin(rad(degCtrl)),
    }
    const a = mover(p1, ctrl, nodeR + 6)
    const b = mover(p2, ctrl, nodeR + 11)
    return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${ctrl.x.toFixed(1)} ${ctrl.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
  }

  const arcos = []
  if (n === 1) {
    const p = punto(0)
    arcos.push({
      d: `M ${(p.x - 14).toFixed(1)} ${(p.y - 15).toFixed(1)} C ${(p.x - 34).toFixed(1)} ${(p.y - 54).toFixed(1)}, ${(p.x + 34).toFixed(1)} ${(p.y - 54).toFixed(1)}, ${(p.x + 12).toFixed(1)} ${(p.y - 21).toFixed(1)}`,
      color: '#3B82F6',
    })
    if (estructura === 'doble') {
      arcos.push({
        d: `M ${(p.x + 9).toFixed(1)} ${(p.y - 25).toFixed(1)} C ${(p.x + 24).toFixed(1)} ${(p.y - 66).toFixed(1)}, ${(p.x - 24).toFixed(1)} ${(p.y - 66).toFixed(1)}, ${(p.x - 11).toFixed(1)} ${(p.y - 28).toFixed(1)}`,
        color: '#22D3EE',
      })
    }
  } else {
    for (let i = 0; i < n; i++) {
      arcos.push({ d: arco(i, 1, 1.24), color: '#3B82F6' })
      if (estructura === 'doble') arcos.push({ d: arco(i, -1, 0.76), color: '#22D3EE' })
    }
  }

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Lista circular">
        <defs>
          <marker id="fl-sig" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#3B82F6" />
          </marker>
          <marker id="fl-ant" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#22D3EE" />
          </marker>
        </defs>

        {/* enlaces */}
        {arcos.map((a, i) => (
          <path
            key={i}
            d={a.d}
            fill="none"
            stroke={a.color}
            strokeWidth="1.8"
            strokeOpacity="0.8"
            markerEnd={a.color === '#3B82F6' ? 'url(#fl-sig)' : 'url(#fl-ant)'}
          />
        ))}

        {/* posiciones (base 1) */}
        {valores.map((_, i) => {
          const p = punto(i, R + nodeR + 32)
          return (
            <text
              key={`p${i}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="'IBM Plex Mono', monospace"
              fontSize="10"
              fill="#94A3B8"
              fillOpacity="0.75"
            >
              {i + 1}
            </text>
          )
        })}

        {/* nodos */}
        {valores.map((v, i) => {
          const p = punto(i)
          const estado = resaltado.includes(i) ? tipo : 'normal'
          const c = COLORES[estado] || COLORES.normal
          const resalta = estado !== 'normal'
          return (
            <g key={i}>
              {resalta && (
                <circle cx={p.x} cy={p.y} r={nodeR + 7} fill="none" stroke={c.stroke} strokeOpacity="0.35" />
              )}
              <circle cx={p.x} cy={p.y} r={nodeR} fill={c.fill} stroke={c.stroke} strokeWidth="2" />
              <text
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="'IBM Plex Mono', monospace"
                fontSize={String(v).length > 3 ? 12 : 14}
                fill="#F8FAFC"
              >
                {v}
              </text>
              {i === 0 && (
                <text
                  x={p.x}
                  y={p.y + nodeR + 16}
                  textAnchor="middle"
                  fontFamily="'IBM Plex Mono', monospace"
                  fontSize="10"
                  fill="#22D3EE"
                >
                  cabeza
                </text>
              )}
              {i === n - 1 && n > 1 && (
                <text
                  x={p.x}
                  y={p.y + nodeR + 16}
                  textAnchor="middle"
                  fontFamily="'IBM Plex Mono', monospace"
                  fontSize="10"
                  fill="#22D3EE"
                >
                  ultimo
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Leyenda */}
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[10px] text-slate">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4" style={{ background: '#3B82F6' }} /> siguiente
        </span>
        {estructura === 'doble' && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4" style={{ background: '#22D3EE' }} /> anterior
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: '#16305B', border: '1px solid #3B82F6' }} /> recorriendo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: '#3B1D22', border: '1px solid #F87171' }} /> objetivo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: '#0F3A45', border: '1px solid #22D3EE' }} /> operación aplicada
        </span>
        <span>· posiciones numeradas desde 1 (base 1)</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Auxiliares de UI (definidos FUERA del componente para no perder el foco
// de los inputs en cada render)
// ---------------------------------------------------------------------------

function Campo({ etiqueta, valor, onChange, ancho = 'w-20', min, disabled }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate">{etiqueta}</span>
      <input
        type="number"
        value={valor}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${ancho} rounded-lg border border-line/60 bg-navy px-2.5 py-2 font-mono text-sm text-paper outline-none transition-colors focus:border-blue disabled:opacity-50`}
      />
    </label>
  )
}

function Boton({ children, onClick, variante = 'primario', disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`self-end rounded-lg px-3.5 py-2 text-xs font-medium transition-colors disabled:opacity-40 ${
        variante === 'primario'
          ? 'bg-blue text-paper hover:bg-blueLight'
          : 'border border-line/60 text-slate hover:text-paper'
      }`}
    >
      {children}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function CircularListVisualizer() {
  const [estructura, setEstructura] = useState('simple')
  const [valores, setValores] = useState(INICIALES.simple)
  const [resaltado, setResaltado] = useState([])
  const [tipo, setTipo] = useState('')
  const [logs, setLogs] = useState(['> Elige una operación: se verá el recorrido y las ecuaciones de punteros paso a paso.'])
  const [resumen, setResumen] = useState('')
  const [running, setRunning] = useState(false)

  const [valorInsert, setValorInsert] = useState('55')
  const [posEliminar, setPosEliminar] = useState('5')
  const [posActualizar, setPosActualizar] = useState('3')
  const [datoNuevoPos, setDatoNuevoPos] = useState('999')
  const [datoViejo, setDatoViejo] = useState('7')
  const [datoNuevo, setDatoNuevo] = useState('77')

  const stopRef = useRef(false)
  const corriendoRef = useRef(false)
  const logEndRef = useRef(null)

  useEffect(() => {
    if (logEndRef.current) logEndRef.current.scrollTop = logEndRef.current.scrollHeight
  }, [logs])

  async function reproducir(gen) {
    if (corriendoRef.current) return
    corriendoRef.current = true
    setRunning(true)
    stopRef.current = false

    let ultimo = null
    for (const f of gen) {
      if (stopRef.current) break
      ultimo = f
      setValores([...f.valores])
      setResaltado(f.resaltado)
      setTipo(f.tipo)
      if (f.log) setLogs((prev) => [...prev.slice(-80), f.log])
      await new Promise((r) => setTimeout(r, 330))
    }

    setResaltado([])
    setTipo('')
    if (ultimo) setResumen(ultimo.log)
    corriendoRef.current = false
    setRunning(false)
  }

  function cambiarEstructura(e) {
    if (running) return
    stopRef.current = true
    setEstructura(e)
    setValores([...INICIALES[e]])
    setResaltado([])
    setTipo('')
    setResumen('')
    setLogs([`> Estructura «${NOMBRES[e]}» con ${INICIALES[e].length} nodos (mismos datos del main Java).`])
  }

  function reiniciar() {
    if (running) return
    stopRef.current = true
    setValores([...INICIALES[estructura]])
    setResaltado([])
    setTipo('')
    setResumen('')
    setLogs([`> Lista restaurada a los ${INICIALES[estructura].length} nodos iniciales.`])
  }

  const detener = () => {
    stopRef.current = true
    setRunning(false)
  }

  const enEjecucion = running
  const n = valores.length
  const sinDatos = logs.length === 0

  return (
    <div className="space-y-6">
      {/* Selector de estructura + estadísticas */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-slate">Estructura</p>
          <div className="flex flex-wrap gap-2">
            {['simple', 'doble'].map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => cambiarEstructura(e)}
                disabled={enEjecucion}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                  estructura === e
                    ? 'bg-blue text-paper'
                    : 'border border-line/60 bg-panel/40 text-slate hover:border-blue/40 hover:text-paper'
                }`}
              >
                {NOMBRES[e]}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate/70">
            {estructura === 'simple'
              ? 'Un puntero por nodo: sin «anterior» hay que recorrer siempre hasta el nodo previo.'
              : 'Dos punteros por nodo: «anterior» permite desvincular sin recorrido previo.'}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-x-6 gap-y-2 font-mono text-xs text-slate">
          <span>Tamaño: <strong className="text-paper">{n}</strong></span>
          <span>Cabeza: <strong className="text-cyan">{n > 0 ? valores[0] : '—'}</strong></span>
          <span>
            Último:{' '}
            <strong className="text-cyan">
              {n > 0 ? valores[n - 1] : '—'}
              {estructura === 'doble' && n > 0 ? ' (cabeza.anterior)' : ''}
            </strong>
          </span>
          <button
            type="button"
            onClick={reiniciar}
            disabled={enEjecucion}
            className="ml-auto rounded-full border border-line/60 px-4 py-1.5 text-xs text-slate transition-colors hover:text-paper disabled:opacity-40"
          >
            Reiniciar
          </button>
        </div>
      </div>

      {/* Operaciones */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2 rounded-xl border border-line/60 bg-panel/30 p-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-blueLight">Insertar al final</p>
          <div className="flex items-end gap-2">
            <Campo etiqueta="dato" valor={valorInsert} onChange={setValorInsert} disabled={enEjecucion} />
            <Boton onClick={() => reproducir(insertar(estructura, valores, valorInsert))} disabled={enEjecucion}>
              Insertar
            </Boton>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-line/60 bg-panel/30 p-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-blueLight">Eliminar en posición</p>
          <div className="flex items-end gap-2">
            <Campo etiqueta="posición" valor={posEliminar} onChange={setPosEliminar} min={1} disabled={enEjecucion} />
            <Boton onClick={() => reproducir(eliminar(estructura, valores, posEliminar))} disabled={enEjecucion}>
              Eliminar
            </Boton>
          </div>
          <p className="font-mono text-[10px] text-slate/60">Ejercicio 3 (simple) · 4 (doble)</p>
        </div>

        <div className="space-y-2 rounded-xl border border-line/60 bg-panel/30 p-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-blueLight">Actualizar por posición</p>
          <div className="flex items-end gap-2">
            <Campo etiqueta="posición" valor={posActualizar} onChange={setPosActualizar} min={1} disabled={enEjecucion} />
            <Campo etiqueta="nuevo dato" valor={datoNuevoPos} onChange={setDatoNuevoPos} ancho="w-24" disabled={enEjecucion} />
            <Boton
              onClick={() => reproducir(actualizarPosicion(valores, posActualizar, datoNuevoPos))}
              disabled={enEjecucion}
            >
              Actualizar
            </Boton>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-line/60 bg-panel/30 p-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-blueLight">Actualizar por dato</p>
          <div className="flex items-end gap-2">
            <Campo etiqueta="dato antiguo" valor={datoViejo} onChange={setDatoViejo} ancho="w-24" disabled={enEjecucion} />
            <Campo etiqueta="nuevo" valor={datoNuevo} onChange={setDatoNuevo} ancho="w-20" disabled={enEjecucion} />
            <Boton onClick={() => reproducir(actualizarDato(valores, datoViejo, datoNuevo))} disabled={enEjecucion}>
              Actualizar
            </Boton>
          </div>
        </div>
      </div>

      {/* Resumen de la última operación */}
      {resumen && (
        <div
          className={`rounded-xl border px-4 py-3 font-mono text-xs ${
            resumen.includes('[Aviso]')
              ? 'border-rose/40 bg-rose/10 text-rose'
              : 'border-cyan/30 bg-cyan/5 text-cyan'
          }`}
        >
          {resumen}
        </div>
      )}

      {/* Visualización */}
      <div className="rounded-2xl border border-line/60 bg-panel/20 p-4 md:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate">
            Recorrido circular · {NOMBRES[estructura]}
          </p>
          <button
            type="button"
            onClick={detener}
            disabled={!enEjecucion}
            className="rounded-full border border-rose/40 px-4 py-1.5 text-xs text-rose transition-colors hover:bg-rose/10 disabled:opacity-40"
          >
            Detener
          </button>
        </div>

        <ListaCircularSVG valores={valores} resaltado={resaltado} tipo={tipo} estructura={estructura} />
      </div>

      {/* Log */}
      <div className="overflow-hidden rounded-2xl border border-line/60">
        <div className="px-4 py-2 md:px-5">
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate">
            Log de ejecución
            <span className="ml-2 normal-case tracking-normal text-slate/50">
              (recorrido + ecuaciones de punteros, en el mismo orden que el código Java)
            </span>
          </p>
        </div>
        <div
          ref={logEndRef}
          className="h-44 overflow-y-auto bg-navy/80 px-4 py-3 font-mono text-[11px] leading-relaxed text-cyan md:px-5"
        >
          {sinDatos ? (
            <p className="text-slate/50">&gt; Sin operaciones todavía.</p>
          ) : (
            logs.map((linea, i) => (
              <p
                key={i}
                className={
                  linea.includes('[Aviso]')
                    ? 'text-rose/90'
                    : linea.includes('✓')
                      ? 'text-cyan'
                      : linea.includes('Punteros')
                        ? 'text-blueLight'
                        : 'text-cyan/85'
                }
              >
                &gt; {linea}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
