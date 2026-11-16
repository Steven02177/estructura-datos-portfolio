import { useState, useEffect, useMemo } from 'react'

/**
 * Visualizador de grafos del Taller de Grafos.
 * Los cuatro grafos son EXACTAMENTE los que aparecen en los códigos Java:
 *  - campus:        GrafoRed (Grafos.java, Parte 2)         → BFS desde Rectoría
 *  - social:        GrafoDFS (10_GrafoDFS.java, ejercicio 3.1) → DFS desde Ana
 *  - transferencias: GrafoDirigido (11_GrafoDirigido.java, 3.2) → consulta de camino directo
 *  - tracert:       12_TracertGrafo.java (traza real de CMD)  → grafo dirigido
 * Muestra recorrido paso a paso, lista y matriz de adyacencia y grados.
 */

const GRAFOS = {
  campus: {
    id: 'campus',
    nombre: 'Red de campus',
    fuente: 'Grafos.java · Parte 2',
    dirigido: false,
    inicio: 'Rectoría',
    algoritmo: 'BFS',
    vertices: ['Rectoría', 'Ingeniería', 'Biblioteca', 'Laboratorios', 'Auditorio', 'Cafetería'],
    aristas: [
      ['Rectoría', 'Ingeniería'],
      ['Rectoría', 'Biblioteca'],
      ['Ingeniería', 'Laboratorios'],
      ['Biblioteca', 'Auditorio'],
      ['Laboratorios', 'Cafetería'],
      ['Auditorio', 'Cafetería'],
    ],
    pos: {
      'Rectoría': [320, 55],
      'Ingeniería': [165, 170],
      'Biblioteca': [475, 170],
      'Laboratorios': [125, 300],
      'Auditorio': [515, 300],
      'Cafetería': [320, 315],
    },
  },
  social: {
    id: 'social',
    nombre: 'Red social de amistades',
    fuente: '10_GrafoDFS.java · ejercicio 3.1',
    dirigido: false,
    inicio: 'Ana',
    algoritmo: 'DFS',
    vertices: ['Ana', 'Bruno', 'Carla', 'Diego', 'Elena', 'Fabián', 'Gabriela'],
    aristas: [
      ['Ana', 'Bruno'],
      ['Ana', 'Carla'],
      ['Bruno', 'Diego'],
      ['Carla', 'Diego'],
      ['Carla', 'Elena'],
      ['Diego', 'Fabián'],
      ['Elena', 'Fabián'],
      ['Fabián', 'Gabriela'],
      ['Bruno', 'Elena'],
    ],
    pos: {
      'Ana': [320, 50],
      'Bruno': [175, 140],
      'Carla': [465, 140],
      'Diego': [165, 270],
      'Elena': [475, 270],
      'Fabián': [320, 335],
      'Gabriela': [565, 350],
    },
  },
  transferencias: {
    id: 'transferencias',
    nombre: 'Transferencias entre cuentas',
    fuente: '11_GrafoDirigido.java · ejercicio 3.2',
    dirigido: true,
    inicio: 'Laura',
    algoritmo: 'BFS',
    vertices: ['Laura', 'Andrés', 'Camila', 'Daniel', 'Sofía', 'Miguel'],
    aristas: [
      ['Laura', 'Andrés'],
      ['Laura', 'Camila'],
      ['Andrés', 'Daniel'],
      ['Camila', 'Sofía'],
      ['Daniel', 'Miguel'],
      ['Sofía', 'Miguel'],
      ['Miguel', 'Laura'],
    ],
    pos: {
      'Laura': [320, 55],
      'Andrés': [170, 165],
      'Camila': [470, 165],
      'Daniel': [145, 290],
      'Sofía': [495, 290],
      'Miguel': [320, 340],
    },
  },
  tracert: {
    id: 'tracert',
    nombre: 'Traza tracert hasta Google',
    fuente: '12_TracertGrafo.java · CMD real',
    dirigido: true,
    inicio: 'Mi equipo',
    algoritmo: 'BFS',
    vertices: [
      'Mi equipo',
      '192.168.1.1',
      '190.96.224.1',
      '3: * (tiempo de espera)',
      '72.14.213.234',
      '142.251.154.119',
      'www.google.com',
    ],
    aristas: [
      ['Mi equipo', '192.168.1.1'],
      ['192.168.1.1', '190.96.224.1'],
      ['190.96.224.1', '3: * (tiempo de espera)'],
      ['3: * (tiempo de espera)', '72.14.213.234'],
      ['72.14.213.234', '142.251.154.119'],
      ['142.251.154.119', 'www.google.com'],
    ],
    pos: {
      'Mi equipo': [95, 45],
      '192.168.1.1': [95, 105],
      '190.96.224.1': [95, 165],
      '3: * (tiempo de espera)': [95, 225],
      '72.14.213.234': [95, 285],
      '142.251.154.119': [95, 345],
      'www.google.com': [95, 405],
    },
    alias: { '3: * (tiempo de espera)': '* (salto 3)' },
    vertical: true,
  },
}

/** Vecinos en el MISMO orden en que los construye el código Java. */
function construirAdyacencia(g) {
  const m = new Map(g.vertices.map((v) => [v, []]))
  for (const [a, b] of g.aristas) {
    m.get(a).push(b)
    if (!g.dirigido) m.get(b).push(a)
  }
  return m
}

/** BFS idéntico a Grafos.java: se marca visitado al encolar. */
function simularBFS(g, ady, inicio) {
  const visitados = new Set([inicio])
  const cola = [inicio]
  const recorrido = []
  const pasos = []
  while (cola.length) {
    const actual = cola.shift()
    recorrido.push(actual)
    const encolados = []
    for (const v of ady.get(actual) || []) {
      if (!visitados.has(v)) {
        visitados.add(v)
        cola.push(v)
        encolados.push(v)
      }
    }
    pasos.push({ actual, cola: [...cola], pila: null, visitados: [...visitados], recorrido: [...recorrido], encolados })
  }
  return pasos
}

/** DFS idéntico a 10_GrafoDFS.java: Pila (Stack) + Set de visitados. */
function simularDFS(g, ady, inicio) {
  const pila = [inicio]
  const visitados = new Set()
  const recorrido = []
  const pasos = []
  while (pila.length) {
    const actual = pila.pop()
    if (visitados.has(actual)) continue
    visitados.add(actual)
    recorrido.push(actual)
    const vecinos = ady.get(actual) || []
    const empujados = []
    for (let i = vecinos.length - 1; i >= 0; i--) {
      if (!visitados.has(vecinos[i])) {
        pila.push(vecinos[i])
        empujados.unshift(vecinos[i])
      }
    }
    pasos.push({ actual, cola: null, pila: [...pila], visitados: [...visitados], recorrido: [...recorrido], encolados: empujados })
  }
  return pasos
}

export default function GrafoVisualizer() {
  const [grafoId, setGrafoId] = useState('campus')
  const [algoritmo, setAlgoritmo] = useState('BFS')
  const [paso, setPaso] = useState(0)
  const [vista, setVista] = useState('lista') // 'lista' | 'matriz'
  const [consulta, setConsulta] = useState(null)
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')

  const g = GRAFOS[grafoId]
  const ady = useMemo(() => construirAdyacencia(g), [g])
  const pasos = useMemo(
    () => (algoritmo === 'BFS' ? simularBFS(g, ady, g.inicio) : simularDFS(g, ady, g.inicio)),
    [g, ady, algoritmo]
  )

  // Al cambiar de grafo o de algoritmo se reinicia el recorrido y la consulta.
  useEffect(() => {
    setPaso(0)
    setConsulta(null)
    setOrigen(g.vertices[0])
    setDestino(g.vertices[1])
  }, [g])

  const estado = paso > 0 ? pasos[paso - 1] : null
  const pendientes = estado
    ? algoritmo === 'BFS'
      ? estado.cola
      : estado.pila
    : [g.inicio]
  const visitados = estado ? estado.visitados : []
  const recorrido = estado ? estado.recorrido : []
  const terminado = paso >= pasos.length

  const trazas = pasos.slice(0, paso).map((p, i) =>
    algoritmo === 'BFS'
      ? `${i + 1}. visitando ${p.actual} · encolados: ${p.encolados.join(', ') || '—'} · cola: [${p.cola.join(', ')}]`
      : `${i + 1}. visitando ${p.actual} · empujados: ${p.encolados.join(', ') || '—'} · pila: [${p.pila.join(', ')}]`
  )

  const esActual = (v) => estado?.actual === v
  const estaVisitado = (v) => visitados.includes(v)
  const estaPendiente = (v) => pendientes.includes(v)

  function consultar() {
    const existe = (ady.get(origen) || []).includes(destino)
    setConsulta({ origen, destino, existe })
  }

  const aristasResaltadas = new Set(
    consulta && consulta.existe ? [`${consulta.origen}->${consulta.destino}`] : []
  )

  const grados = new Map(
    g.vertices.map((v) => [
      v,
      g.dirigido
        ? { texto: `salida ${ady.get(v).length}`, entrada: g.aristas.filter(([, b]) => b === v).length }
        : { texto: `grado ${ady.get(v).length}`, entrada: null },
    ])
  )

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-line/60 bg-panel/40">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 bg-panel/60 px-5 py-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-cyan">
            Visualizador de grafos
          </p>
          <p className="mt-1 text-xs text-slate">
            {g.nombre} · {g.vertices.length} vértices · {g.aristas.length} aristas ·{' '}
            {g.dirigido ? 'dirigido' : 'no dirigido'} · {g.fuente}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.values(GRAFOS).map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => {
                setGrafoId(x.id)
                setAlgoritmo(x.algoritmo)
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs transition-colors ${
                x.id === grafoId
                  ? 'bg-blue text-paper'
                  : 'border border-line/60 text-slate hover:text-paper'
              }`}
            >
              {x.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[1.4fr_1fr] md:p-6">
        {/* Lienzo del grafo */}
        <div>
          <svg
            viewBox={g.vertical ? '0 0 640 445' : '0 0 640 390'}
            className="w-full"
            role="img"
            aria-label={`Diagrama del grafo ${g.nombre}`}
          >
            <defs>
              <marker
                id="flecha"
                markerWidth="9"
                markerHeight="9"
                refX="8"
                refY="4.5"
                orient="auto"
              >
                <path d="M0,0 L9,4.5 L0,9 z" fill="#3B82F6" />
              </marker>
            </defs>

            {/* Aristas */}
            {g.aristas.map(([a, b]) => {
              const [x1, y1] = g.pos[a]
              const [x2, y2] = g.pos[b]
              const resaltada = aristasResaltadas.has(`${a}->${b}`)
              return (
                <line
                  key={`${a}-${b}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={resaltada ? '#22D3EE' : '#3B82F6'}
                  strokeOpacity={resaltada ? 1 : 0.4}
                  strokeWidth={resaltada ? 3 : 1.6}
                  markerEnd={g.dirigido ? 'url(#flecha)' : undefined}
                />
              )
            })}

            {/* Vértices */}
            {g.vertices.map((v) => {
              const [x, y] = g.pos[v]
              const actual = esActual(v)
              const visitado = estaVisitado(v)
              const pendiente = estaPendiente(v)
              const etiqueta = g.alias?.[v] ?? v
              const esOrigen = consulta && (consulta.origen === v || consulta.destino === v)
              return (
                <g key={v}>
                  {actual && (
                    <circle cx={x} cy={y} r={30} fill="#22D3EE" opacity={0.18} />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={24}
                    fill={actual ? '#2563EB' : visitado ? 'rgba(37,99,235,0.28)' : '#141F38'}
                    stroke={
                      actual
                        ? '#22D3EE'
                        : esOrigen
                          ? '#F87171'
                          : pendiente
                            ? '#22D3EE'
                            : visitado
                              ? '#3B82F6'
                              : '#233047'
                    }
                    strokeWidth={actual || esOrigen ? 3 : 1.6}
                    strokeDasharray={pendiente && !actual && !esOrigen ? '4 3' : undefined}
                  />
                  {g.vertical ? (
                    <text
                      x={x + 36}
                      y={y}
                      dominantBaseline="middle"
                      className="font-mono"
                      fontSize="11"
                      fill="#F8FAFC"
                    >
                      {etiqueta}
                    </text>
                  ) : (
                    <text
                      x={x}
                      y={y + 40}
                      textAnchor="middle"
                      className="font-mono"
                      fontSize="11"
                      fill="#F8FAFC"
                    >
                      {etiqueta}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Leyenda */}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-slate">
            <span>● actual</span>
            <span>● visitado</span>
            <span>◌ pendiente (cola/pila)</span>
            {g.dirigido && <span>→ arista dirigida</span>}
            {consulta && (
              <span className={consulta.existe ? 'text-cyan' : 'text-rose'}>
                {consulta.existe
                  ? `✓ ${consulta.origen} → ${consulta.destino} existe`
                  : `✗ no existe ${consulta.origen} → ${consulta.destino}`}
              </span>
            )}
          </div>

          {/* Consulta de conexión directa (solo grafos dirigidos) */}
          {g.dirigido && (
            <div className="mt-4 rounded-xl border border-line/40 bg-navy/60 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                existeCaminoDirecto(origen, destino)
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <select
                  value={origen}
                  onChange={(e) => setOrigen(e.target.value)}
                  className="rounded-lg border border-line/60 bg-panel px-2 py-1.5 font-mono text-xs text-paper focus:border-cyan focus:outline-none"
                >
                  {g.vertices.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <span className="font-mono text-xs text-slate">→</span>
                <select
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  className="rounded-lg border border-line/60 bg-panel px-2 py-1.5 font-mono text-xs text-paper focus:border-cyan focus:outline-none"
                >
                  {g.vertices.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={consultar}
                  className="rounded-lg bg-blue px-4 py-1.5 text-xs font-medium text-paper transition-colors hover:bg-blueLight"
                >
                  Consultar
                </button>
                {consulta && (
                  <span
                    className={`rounded-full px-3 py-1 font-mono text-xs ${
                      consulta.existe ? 'bg-cyan/15 text-cyan' : 'bg-rose/15 text-rose'
                    }`}
                  >
                    {String(consulta.existe)}
                  </span>
                )}
              </div>
              <p className="mt-2 font-mono text-[10px] text-slate/70">
                {grafoId === 'transferencias'
                  ? 'Prueba Laura → Andrés (true) y Sofía → Laura (false): la inversa no está registrada.'
                  : 'La traza solo registra el sentido del salto: no existe el camino inverso.'}
              </p>
            </div>
          )}
        </div>

        {/* Panel de estado */}
        <div className="space-y-4">
          {/* Controles del recorrido */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAlgoritmo('BFS')}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                algoritmo === 'BFS'
                  ? 'bg-cyan text-navy'
                  : 'border border-line/60 text-slate hover:text-paper'
              }`}
            >
              BFS (cola)
            </button>
            <button
              type="button"
              onClick={() => setAlgoritmo('DFS')}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                algoritmo === 'DFS'
                  ? 'bg-cyan text-navy'
                  : 'border border-line/60 text-slate hover:text-paper'
              }`}
            >
              DFS (pila)
            </button>
            <button
              type="button"
              onClick={() => setPaso((p) => Math.min(p + 1, pasos.length))}
              disabled={terminado}
              className="rounded-full bg-blue px-4 py-1.5 text-xs font-medium text-paper transition-colors hover:bg-blueLight disabled:cursor-not-allowed disabled:opacity-40"
            >
              ▶ Siguiente paso
            </button>
            <button
              type="button"
              onClick={() => setPaso(pasos.length)}
              disabled={terminado}
              className="rounded-full border border-line/60 px-4 py-1.5 text-xs text-slate transition-colors hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
            >
              Hasta el final
            </button>
            <button
              type="button"
              onClick={() => setPaso(0)}
              className="rounded-full border border-line/60 px-4 py-1.5 text-xs text-slate transition-colors hover:text-paper"
            >
              Reiniciar
            </button>
          </div>

          {/* Estado */}
          <div className="rounded-xl border border-line/40 bg-navy/60 p-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate">
                {algoritmo === 'BFS' ? 'Cola (Queue)' : 'Pila (Stack)'}
              </p>
              <p className="font-mono text-[10px] text-slate">
                paso {paso}/{pasos.length} · desde {g.inicio}
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {pendientes.length === 0 ? (
                <span className="font-mono text-xs text-slate/50">vacía</span>
              ) : (
                pendientes.map((v, i) => (
                  <span
                    key={`${v}-${i}`}
                    className="rounded border border-cyan/40 bg-cyan/10 px-2 py-0.5 font-mono text-[11px] text-cyan"
                  >
                    {g.alias?.[v] ?? v}
                  </span>
                ))
              )}
            </div>

            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-slate">
              Recorrido ({recorrido.length}/{g.vertices.length})
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {recorrido.length === 0 ? (
                <span className="font-mono text-xs text-slate/50">sin visitar</span>
              ) : (
                recorrido.map((v, i) => (
                  <span
                    key={`${v}-${i}`}
                    className="rounded bg-blue/20 px-2 py-0.5 font-mono text-[11px] text-paper"
                  >
                    {i + 1}. {g.alias?.[v] ?? v}
                  </span>
                ))
              )}
            </div>

            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-slate">
              Visitados (HashSet)
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {visitados.length === 0 ? (
                <span className="font-mono text-xs text-slate/50">∅ (vacío)</span>
              ) : (
                visitados.map((v) => (
                  <span
                    key={v}
                    className="rounded border border-line/60 px-2 py-0.5 font-mono text-[11px] text-slate"
                  >
                    {g.alias?.[v] ?? v}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Traza paso a paso */}
          <div className="rounded-xl border border-line/40 bg-navy p-4">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate">
              Traza del algoritmo
            </p>
            <div className="max-h-36 space-y-1 overflow-y-auto font-mono text-[11px] leading-relaxed text-cyan">
              {trazas.length === 0 ? (
                <p className="text-slate/60">
                  Pulsa «Siguiente paso» para iniciar {algoritmo} desde {g.inicio}.
                </p>
              ) : (
                trazas.map((t, i) => <p key={i}>{t}</p>)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lista / Matriz de adyacencia */}
      <div className="border-t border-line/60 px-5 py-5 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[11px] uppercase tracking-widest text-cyan">
            Representación en memoria
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setVista('lista')}
              className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
                vista === 'lista' ? 'bg-blue text-paper' : 'border border-line/60 text-slate hover:text-paper'
              }`}
            >
              Lista de adyacencia
            </button>
            <button
              type="button"
              onClick={() => setVista('matriz')}
              className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
                vista === 'matriz' ? 'bg-blue text-paper' : 'border border-line/60 text-slate hover:text-paper'
              }`}
            >
              Matriz de adyacencia
            </button>
          </div>
        </div>

        {vista === 'lista' ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {g.vertices.map((v) => {
              const vecinos = ady.get(v) || []
              const grado = grados.get(v)
              const actual = esActual(v)
              return (
                <div
                  key={v}
                  className={`rounded-lg border px-3 py-2 font-mono text-[11px] ${
                    actual ? 'border-cyan/60 bg-cyan/5' : 'border-line/40 bg-navy/50'
                  }`}
                >
                  <span className={actual ? 'text-cyan' : 'text-paper'}>
                    {v}
                    <span className="ml-2 text-slate/70">({grado.texto})</span>
                  </span>
                  <span className="text-slate"> → [</span>
                  <span className="text-cyan">{vecinos.join(', ')}</span>
                  <span className="text-slate">]</span>
                  {g.dirigido && grado.entrada > 0 && (
                    <span className="ml-2 text-slate/60">· llegan {grado.entrada}</span>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[560px] border-collapse font-mono text-[11px]">
              <thead>
                <tr>
                  <th className="border border-line/40 bg-panel px-2 py-1.5 text-slate" />
                  {g.vertices.map((c) => (
                    <th key={c} className="border border-line/40 bg-panel px-2 py-1.5 text-slate">
                      {g.alias?.[c] ?? c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {g.vertices.map((f) => (
                  <tr key={f}>
                    <th className="border border-line/40 bg-panel px-2 py-1.5 text-left text-paper">
                      {g.alias?.[f] ?? f}
                    </th>
                    {g.vertices.map((c) => {
                      const hay = (ady.get(f) || []).includes(c)
                      const filaActiva = esActual(f)
                      return (
                        <td
                          key={c}
                          className={`border border-line/40 px-2 py-1.5 text-center ${
                            hay
                              ? 'bg-blue/25 text-cyan'
                              : filaActiva
                                ? 'bg-cyan/10 text-slate/40'
                                : 'text-slate/40'
                          }`}
                        >
                          {hay ? 1 : 0}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 font-mono text-[10px] text-slate/60">
              {g.dirigido
                ? 'Matriz dirigida: fila = origen, columna = destino (A[i][j] = 1 si existe arista i → j).'
                : 'Matriz no dirigida: la matriz es simétrica (A[i][j] = A[j][i]).'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
