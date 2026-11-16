import { useState } from 'react'

/**
 * Simulador interactivo de una tabla hash estilo Java:
 *  - hashCode() real de String (h = 31*h + c en 32 bits)
 *  - índice real de Java 8: (h ^ (h >>> 16)) & (capacidad - 1)
 *  - capacidad inicial 16, factor de carga 0.75 (umbral 12)
 *  - modo HashMap (llave → valor) y modo HashSet (elementos únicos)
 *  - colisiones encadenadas (separate chaining) visibles por bucket
 */

const CAPACIDAD = 16
const UMBRAL = 12 // Math.floor(16 * 0.75)

/** hashCode() de String en Java: h = 31*h + c con desbordamiento de 32 bits. */
function javaHashCode(texto) {
  let h = 0
  for (let i = 0; i < texto.length; i++) {
    h = (Math.imul(31, h) + texto.charCodeAt(i)) | 0
  }
  return h
}

/** Índice de bucket calculado exactamente como lo hace Java 8. */
function indiceJava(clave) {
  const h = javaHashCode(clave)
  const spread = (h ^ (h >>> 16)) | 0
  return { h, spread, indice: spread & (CAPACIDAD - 1) }
}

const vacias = () => Array.from({ length: CAPACIDAD }, () => [])

const EJEMPLO_MAP = [
  ['UDES001', 'Laura Gómez'],
  ['UDES002', 'Andrés Pérez'],
  ['UDES003', 'Camila Rojas'],
  ['UDES004', 'Daniel Torres'],
  ['UDES005', 'Sofía Martínez'],
]

const EJEMPLO_SET = [
  'laura@gmail.com',
  'andres@gmail.com',
  'camila@gmail.com',
  'daniel@gmail.com',
  'sofia@gmail.com',
]

export default function HashVisualizer() {
  const [modo, setModo] = useState('map')
  const [buckets, setBuckets] = useState(vacias)
  const [clave, setClave] = useState('')
  const [valor, setValor] = useState('')
  const [ultimo, setUltimo] = useState(null)
  const [log, setLog] = useState([
    'Tabla hash de Java: capacidad inicial 16 · factor de carga 0.75 · umbral 12 (redimensiona al superarlo).',
    'Escribe una llave y pulsa «Insertar» para ver hashCode(), el bucket y la cadena resultante.',
  ])

  const anotar = (lineas) =>
    setLog((prev) => [...prev, ...lineas].slice(-40))

  const tamaño = buckets.reduce((n, b) => n + b.length, 0)
  const colisiones = buckets.filter((b) => b.length > 1).length
  const maxCadena = Math.max(0, ...buckets.map((b) => b.length))

  /** Inserta (o rechaza) una llave replicando put()/add() de Java. */
  function insertar(c, v) {
    const texto = c.trim()
    if (!texto) {
      anotar(['⚠ Escribe una llave antes de insertar.'])
      return
    }
    const { h, spread, indice } = indiceJava(texto)
    const nuevos = buckets.map((b) => [...b])
    const bucket = nuevos[indice]
    const existente = bucket.findIndex((e) => e.clave === texto)

    let resultado
    let lineas

    if (modo === 'map') {
      if (existente >= 0) {
        bucket[existente] = { clave: texto, valor: v || bucket[existente].valor }
        resultado = 'put() reemplazó el valor (size() no cambia)'
        lineas = [
          `put("${texto}", "${v}") → hashCode ${h} · índice [${indice}] → valor reemplazado (size() = ${tamaño})`,
        ]
      } else {
        const choque = bucket.length > 0 ? bucket.map((e) => e.clave).join(', ') : null
        bucket.push({ clave: texto, valor: v || 'valor' })
        resultado = choque
          ? `Colisión: encadenada con ${choque}`
          : 'Insertado en un bucket vacío'
        lineas = [
          `put("${texto}", "${v}") → hashCode ${h} · índice [${indice}] → ${
            choque ? `colisión, se encadena tras ${choque}` : 'insertado'
          }`,
        ]
      }
    } else {
      if (existente >= 0) {
        resultado = 'add() devolvió false (elemento duplicado)'
        lineas = [
          `add("${texto}") → false · hashCode ${h} · índice [${indice}] → ya existe (size() = ${tamaño})`,
        ]
      } else {
        const choque = bucket.length > 0 ? bucket.map((e) => e.clave).join(', ') : null
        bucket.push({ clave: texto })
        resultado = choque
          ? `Colisión: encadenada con ${choque}`
          : 'add() devolvió true (elemento único)'
        lineas = [
          `add("${texto}") → true · hashCode ${h} · índice [${indice}] → ${
            choque ? `colisión, se encadena tras ${choque}` : 'insertado'
          }`,
        ]
      }
    }

    setBuckets(nuevos)
    setUltimo({ clave: texto, h, spread, indice, resultado, bucket: [...nuevos[indice]] })
    anotar(lineas)
    setClave('')
    setValor('')
  }

  function cambiarModo(nuevo) {
    if (nuevo === modo) return
    setModo(nuevo)
    setBuckets(vacias())
    setUltimo(null)
    setClave('')
    setValor('')
    setLog([
      nuevo === 'map'
        ? 'Modo HashMap: pares llave-valor, get() recupera por llave.'
        : 'Modo HashSet: elementos únicos, add() rechaza duplicados.',
    ])
  }

  function reiniciar() {
    setBuckets(vacias())
    setUltimo(null)
    setClave('')
    setValor('')
    setUltimo(null)
    setLog(['Tabla vaciada: size() = 0.'])
  }

  function cargarEjemplo() {
    const datos = modo === 'map' ? EJEMPLO_MAP : EJEMPLO_SET
    const nuevos = vacias()
    const lineas = [
      modo === 'map'
        ? 'Cargando 5 estudiantes (matrícula → estudiante):'
        : 'Cargando 5 correos únicos:',
    ]
    for (const [c, v] of datos) {
      const { h, indice } = indiceJava(c)
      nuevos[indice].push({ clave: c, valor: v || c })
      lineas.push(
        modo === 'map'
          ? `  put("${c}") → índice [${indice}]${nuevos[indice].length > 1 ? ' (colisión encadenada)' : ''}`
          : `  add("${c}") → índice [${indice}]${nuevos[indice].length > 1 ? ' (colisión encadenada)' : ''}`
      )
    }
    lineas.push(`size() = ${datos.length} · colisiones encadenadas: ${nuevos.filter((b) => b.length > 1).length}`)
    setBuckets(nuevos)
    setUltimo(null)
    setClave('')
    setValor('')
    anotar(lineas)
  }

  const factor = (tamaño / CAPACIDAD).toFixed(2)

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-line/60 bg-panel/40">
      {/* Encabezado + modos */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 bg-panel/60 px-5 py-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-cyan">
            Simulador de tabla hash
          </p>
          <p className="mt-1 text-xs text-slate">
            HashMap vs HashSet · cálculo de bucket idéntico a Java 8
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => cambiarModo('map')}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              modo === 'map'
                ? 'bg-blue text-paper'
                : 'border border-line/60 text-slate hover:text-paper'
            }`}
          >
            HashMap
          </button>
          <button
            type="button"
            onClick={() => cambiarModo('set')}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              modo === 'set'
                ? 'bg-cyan text-navy'
                : 'border border-line/60 text-slate hover:text-paper'
            }`}
          >
            HashSet
          </button>
        </div>
      </div>

      <div className="grid gap-6 p-5 md:grid-cols-2 md:p-6">
        {/* Controles */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && insertar(clave, valor)}
              placeholder={modo === 'map' ? 'Llave (ej. UDES006)' : 'Elemento (ej. juan@gmail.com)'}
              className="min-w-0 flex-1 rounded-lg border border-line/60 bg-navy px-3 py-2 font-mono text-sm text-paper placeholder:text-slate/50 focus:border-cyan focus:outline-none"
            />
            {modo === 'map' && (
              <input
                type="text"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && insertar(clave, valor)}
                placeholder="Valor (ej. Juan Pérez)"
                className="min-w-0 flex-1 rounded-lg border border-line/60 bg-navy px-3 py-2 font-mono text-sm text-paper placeholder:text-slate/50 focus:border-cyan focus:outline-none"
              />
            )}
            <button
              type="button"
              onClick={() => insertar(clave, valor)}
              className="rounded-lg bg-blue px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-blueLight"
            >
              {modo === 'map' ? 'put()' : 'add()'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={cargarEjemplo}
              className="rounded-full border border-cyan/40 bg-cyan/10 px-4 py-1.5 text-xs text-cyan transition-colors hover:bg-cyan/20"
            >
              Cargar ejemplo (5 registros)
            </button>
            <button
              type="button"
              onClick={reiniciar}
              className="rounded-full border border-line/60 px-4 py-1.5 text-xs text-slate transition-colors hover:text-paper"
            >
              Vaciar tabla
            </button>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['size()', String(tamaño)],
              ['capacidad', String(CAPACIDAD)],
              ['carga', `${factor} / 0.75`],
              ['colisiones', String(colisiones)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-line/40 bg-navy/60 px-3 py-2">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate">{k}</p>
                <p className="mt-0.5 font-mono text-sm text-cyan">{v}</p>
              </div>
            ))}
          </div>

          {/* Detalle de la última operación */}
          {ultimo && (
            <div className="rounded-xl border border-cyan/30 bg-cyan/5 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                Última operación
              </p>
              <div className="mt-2 space-y-1 font-mono text-xs text-paper">
                <p>
                  llave: <span className="text-cyan">"{ultimo.clave}"</span>
                </p>
                <p>
                  hashCode(): <span className="text-cyan">{ultimo.h}</span> · spread:{' '}
                  <span className="text-cyan">{ultimo.spread}</span> · índice:{' '}
                  <span className="text-cyan">[{ultimo.indice}]</span>
                </p>
                <p>
                  cadena del bucket:{' '}
                  <span className="text-cyan">
                    {ultimo.bucket.map((e) => e.clave).join(' → ')} → null
                  </span>
                </p>
                <p className="text-rose">{ultimo.resultado}</p>
              </div>
              {tamaño >= UMBRAL && (
                <p className="mt-2 font-mono text-[11px] text-rose">
                  size() ≥ {UMBRAL}: Java redimensionaría la tabla al siguiente múltiplo de 2.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Tabla hash (buckets) */}
        <div className="space-y-1.5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate">
            Buckets (capacidad 16) · separate chaining
          </p>
          <div className="max-h-[420px] space-y-1.5 overflow-y-auto pr-1">
            {buckets.map((bucket, i) => {
              const activo = ultimo?.indice === i
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-1.5 transition-colors ${
                    activo
                      ? 'border-cyan/60 bg-cyan/5'
                      : 'border-line/40 bg-navy/40'
                  }`}
                >
                  <span
                    className={`w-5 shrink-0 font-mono text-[11px] ${
                      activo ? 'text-cyan' : 'text-slate'
                    }`}
                  >
                    {i}
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {bucket.length === 0 ? (
                      <span className="font-mono text-[11px] text-slate/40">null</span>
                    ) : (
                      <>
                        {bucket.map((e) => (
                          <span
                            key={e.clave}
                            className={`rounded px-2 py-0.5 font-mono text-[11px] ${
                              bucket.length > 1
                                ? 'border border-rose/50 bg-rose/10 text-rose'
                                : 'border border-cyan/40 bg-cyan/10 text-cyan'
                            }`}
                          >
                            {e.clave}
                            {modo === 'map' && (
                              <span className="text-slate"> → {e.valor}</span>
                            )}
                          </span>
                        ))}
                        <span className="font-mono text-[10px] text-slate/60">→ null</span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <p className="font-mono text-[10px] text-slate/60">
            cadena máxima: {maxCadena} · umbral de redimensionamiento: {UMBRAL} elementos
          </p>
        </div>
      </div>

      {/* Registro de operaciones */}
      <div className="border-t border-line/60 bg-navy px-5 py-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate">
          Registro de operaciones
        </p>
        <div className="max-h-40 space-y-1 overflow-y-auto font-mono text-[12px] leading-relaxed text-cyan">
          {log.map((linea, i) => (
            <p key={i} className={linea.startsWith('⚠') ? 'text-rose' : ''}>
              {linea}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
