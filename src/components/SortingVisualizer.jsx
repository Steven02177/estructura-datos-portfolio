import { useState, useRef, useEffect, useCallback } from 'react'

const METODOS = [
  { id: 'burbuja', nombre: 'Burbuja simple' },
  { id: 'burbujaMejorado', nombre: 'Burbuja mejorado' },
  { id: 'seleccion', nombre: 'Selección directa' },
  { id: 'insercion', nombre: 'Inserción simple' },
  { id: 'shaker', nombre: 'ShakerSort (Cocktail)' },
  { id: 'shell', nombre: 'ShellSort' },
  { id: 'quick', nombre: 'QuickSort' },
  { id: 'radix', nombre: 'RadixSort' },
]

// ---------------------------------------------------------------------------
// Generadores de pasos
// ---------------------------------------------------------------------------

function* bubbleSort(arr) {
  const a = [...arr]
  const n = a.length
  let comparaciones = 0
  let intercambios = 0

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      comparaciones++

      yield {
        array: [...a],
        comparing: [j, j + 1],
        sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
        log: `Iteración ${i + 1} · Comparando Val ${j + 1} (${a[j]}) y Val ${j + 2} (${a[j + 1]})`,
        comparaciones,
        intercambios,
      }

      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        intercambios++

        yield {
          array: [...a],
          comparing: [j, j + 1],
          swapped: true,
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
          log: `Iteración ${i + 1} · Intercambio Val ${j + 1} ↔ Val ${j + 2}`,
          comparaciones,
          intercambios,
        }
      }
    }
  }

  yield {
    array: [...a],
    comparing: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    log: '✓ Ordenamiento completado (Burbuja simple)',
    comparaciones,
    intercambios,
    done: true,
  }
}

function* bubbleSortMejorado(arr) {
  const a = [...arr]
  const n = a.length
  let comparaciones = 0
  let intercambios = 0
  let i = 0
  let huboIntercambio = true

  while (huboIntercambio) {
    huboIntercambio = false

    for (let j = 0; j < n - i - 1; j++) {
      comparaciones++

      yield {
        array: [...a],
        comparing: [j, j + 1],
        sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
        log: `Iteración ${i + 1} · Comparando Val ${j + 1} (${a[j]}) y Val ${j + 2} (${a[j + 1]})`,
        comparaciones,
        intercambios,
      }

      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        intercambios++
        huboIntercambio = true

        yield {
          array: [...a],
          comparing: [j, j + 1],
          swapped: true,
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
          log: `Iteración ${i + 1} · Movimiento detectado · Intercambio Val ${j + 1} ↔ Val ${j + 2}`,
          comparaciones,
          intercambios,
        }
      }
    }

    i++
  }

  yield {
    array: [...a],
    comparing: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    log: '✓ Ordenamiento completado (Burbuja mejorado)',
    comparaciones,
    intercambios,
    done: true,
  }
}

function* selectionSort(arr) {
  const a = [...arr]
  const n = a.length
  let comparaciones = 0
  let intercambios = 0

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i

    for (let j = i + 1; j < n; j++) {
      comparaciones++

      yield {
        array: [...a],
        comparing: [minIdx, j],
        sorted: Array.from({ length: i }, (_, k) => k),
        log: `Pasada ${i + 1} · Buscando mínimo · Comparando índice ${minIdx} (${a[minIdx]}) e índice ${j} (${a[j]})`,
        comparaciones,
        intercambios,
      }

      if (a[j] < a[minIdx]) {
        minIdx = j
      }
    }

    if (minIdx !== i) {
      ;[a[i], a[minIdx]] = [a[minIdx], a[i]]
      intercambios++

      yield {
        array: [...a],
        comparing: [i, minIdx],
        swapped: true,
        sorted: Array.from({ length: i }, (_, k) => k),
        log: `Pasada ${i + 1} · Intercambio posición ${i} ↔ ${minIdx}`,
        comparaciones,
        intercambios,
      }
    }
  }

  yield {
    array: [...a],
    comparing: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    log: '✓ Ordenamiento completado (Selección directa)',
    comparaciones,
    intercambios,
    done: true,
  }
}

function* insertionSort(arr) {
  const a = [...arr]
  const n = a.length
  let comparaciones = 0
  let intercambios = 0

  for (let i = 1; i < n; i++) {
    const key = a[i]
    let j = i - 1

    yield {
      array: [...a],
      comparing: [i],
      sorted: Array.from({ length: i }, (_, k) => k),
      log: `Insertando Val ${i + 1} (${key}) en la parte ordenada`,
      comparaciones,
      intercambios,
    }

    while (j >= 0 && a[j] > key) {
      comparaciones++
      a[j + 1] = a[j]
      intercambios++
      j--

      yield {
        array: [...a],
        comparing: [j + 1, j + 2],
        swapped: true,
        sorted: Array.from({ length: i }, (_, k) => k),
        log: `Desplazamiento hacia la derecha · posición ${j + 2}`,
        comparaciones,
        intercambios,
      }
    }

    a[j + 1] = key

    yield {
      array: [...a],
      comparing: [j + 1],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      log: `Colocado ${key} en posición ${j + 2}`,
      comparaciones,
      intercambios,
    }
  }

  yield {
    array: [...a],
    comparing: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    log: '✓ Ordenamiento completado (Inserción simple)',
    comparaciones,
    intercambios,
    done: true,
  }
}

function* shakerSort(arr) {
  const a = [...arr]
  let left = 0
  let right = a.length - 1
  let comparaciones = 0
  let intercambios = 0
  let pass = 0

  while (left < right) {
    pass++
    let swapped = false

    for (let i = left; i < right; i++) {
      comparaciones++

      yield {
        array: [...a],
        comparing: [i, i + 1],
        sorted: [],
        log: `Shaker pasada ${pass} (→) · Comparando ${a[i]} y ${a[i + 1]}`,
        comparaciones,
        intercambios,
      }

      if (a[i] > a[i + 1]) {
        ;[a[i], a[i + 1]] = [a[i + 1], a[i]]
        intercambios++
        swapped = true

        yield {
          array: [...a],
          comparing: [i, i + 1],
          swapped: true,
          sorted: [],
          log: `Shaker pasada ${pass} (→) · Intercambio`,
          comparaciones,
          intercambios,
        }
      }
    }

    right--

    if (!swapped) break

    swapped = false

    for (let i = right; i > left; i--) {
      comparaciones++

      yield {
        array: [...a],
        comparing: [i - 1, i],
        sorted: [],
        log: `Shaker pasada ${pass} (←) · Comparando ${a[i - 1]} y ${a[i]}`,
        comparaciones,
        intercambios,
      }

      if (a[i - 1] > a[i]) {
        ;[a[i - 1], a[i]] = [a[i], a[i - 1]]
        intercambios++
        swapped = true

        yield {
          array: [...a],
          comparing: [i - 1, i],
          swapped: true,
          sorted: [],
          log: `Shaker pasada ${pass} (←) · Intercambio`,
          comparaciones,
          intercambios,
        }
      }
    }

    left++
  }

  yield {
    array: [...a],
    comparing: [],
    sorted: Array.from({ length: a.length }, (_, k) => k),
    log: '✓ Ordenamiento completado (ShakerSort)',
    comparaciones,
    intercambios,
    done: true,
  }
}

function* shellSort(arr) {
  const a = [...arr]
  const n = a.length
  let comparaciones = 0
  let intercambios = 0
  let gap = Math.floor(n / 2)

  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      const temp = a[i]
      let j = i

      yield {
        array: [...a],
        comparing: [i],
        sorted: [],
        log: `Shell gap=${gap} · Insertando ${temp} (índice ${i})`,
        comparaciones,
        intercambios,
      }

      while (j >= gap && a[j - gap] > temp) {
        comparaciones++
        a[j] = a[j - gap]
        intercambios++
        j -= gap

        yield {
          array: [...a],
          comparing: [j, j + gap],
          swapped: true,
          sorted: [],
          log: `Shell gap=${gap} · Desplazamiento`,
          comparaciones,
          intercambios,
        }
      }

      a[j] = temp
    }

    gap = Math.floor(gap / 2)
  }

  yield {
    array: [...a],
    comparing: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    log: '✓ Ordenamiento completado (ShellSort)',
    comparaciones,
    intercambios,
    done: true,
  }
}

function* quickSort(arr) {
  const a = [...arr]
  let comparaciones = 0
  let intercambios = 0

  function* partition(low, high) {
    const pivot = a[high]
    let i = low - 1

    yield {
      array: [...a],
      comparing: [high],
      sorted: [],
      log: `QuickSort · Pivote = ${pivot} (índice ${high}) · rango [${low}..${high}]`,
      comparaciones,
      intercambios,
    }

    for (let j = low; j < high; j++) {
      comparaciones++

      yield {
        array: [...a],
        comparing: [j, high],
        sorted: [],
        log: `QuickSort · Comparando ${a[j]} con pivote ${pivot}`,
        comparaciones,
        intercambios,
      }

      if (a[j] < pivot) {
        i++
        ;[a[i], a[j]] = [a[j], a[i]]
        intercambios++

        yield {
          array: [...a],
          comparing: [i, j],
          swapped: true,
          sorted: [],
          log: `QuickSort · Intercambio ${a[i]} ↔ ${a[j]}`,
          comparaciones,
          intercambios,
        }
      }
    }

    ;[a[i + 1], a[high]] = [a[high], a[i + 1]]
    intercambios++

    yield {
      array: [...a],
      comparing: [i + 1, high],
      swapped: true,
      sorted: [],
      log: `QuickSort · Pivote colocado en posición ${i + 1}`,
      comparaciones,
      intercambios,
    }

    return i + 1
  }

  function* qs(low, high) {
    if (low < high) {
      const pi = yield* partition(low, high)
      yield* qs(low, pi - 1)
      yield* qs(pi + 1, high)
    }
  }

  yield* qs(0, a.length - 1)

  yield {
    array: [...a],
    comparing: [],
    sorted: Array.from({ length: a.length }, (_, k) => k),
    log: '✓ Ordenamiento completado (QuickSort)',
    comparaciones,
    intercambios,
    done: true,
  }
}

function* radixSort(arr) {
  const a = [...arr]
  let comparaciones = 0
  let intercambios = 0

  if (a.length === 0) {
    yield {
      array: [],
      comparing: [],
      sorted: [],
      log: 'Array vacío',
      comparaciones,
      intercambios,
      done: true,
    }
    return
  }

  const max = Math.max(...a)
  let exp = 1

  while (Math.floor(max / exp) > 0) {
    const output = new Array(a.length).fill(0)
    const count = new Array(10).fill(0)

    for (let i = 0; i < a.length; i++) {
      count[Math.floor(a[i] / exp) % 10]++
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1]
    }

    for (let i = a.length - 1; i >= 0; i--) {
      const digit = Math.floor(a[i] / exp) % 10
      output[count[digit] - 1] = a[i]
      count[digit]--
      intercambios++
    }

    for (let i = 0; i < a.length; i++) {
      a[i] = output[i]
    }

    yield {
      array: [...a],
      comparing: [],
      sorted: [],
      log: `RadixSort · Dígito (exp=${exp}) procesado`,
      comparaciones,
      intercambios,
    }

    exp *= 10
  }

  yield {
    array: [...a],
    comparing: [],
    sorted: Array.from({ length: a.length }, (_, k) => k),
    log: '✓ Ordenamiento completado (RadixSort)',
    comparaciones,
    intercambios,
    done: true,
  }
}

const GENERATORS = {
  burbuja: bubbleSort,
  burbujaMejorado: bubbleSortMejorado,
  seleccion: selectionSort,
  insercion: insertionSort,
  shaker: shakerSort,
  shell: shellSort,
  quick: quickSort,
  radix: radixSort,
}

function detectarMetodoDesdeTitulo(titulo = '') {
  const t = titulo.toLowerCase()

  if (
    t.includes('burbuja') &&
    (t.includes('mejor') || t.includes('optim'))
  ) {
    return 'burbujaMejorado'
  }

  if (t.includes('burbuja')) return 'burbuja'
  if (t.includes('quick')) return 'quick'
  if (t.includes('shell')) return 'shell'
  if (t.includes('selec')) return 'seleccion'
  if (t.includes('inser')) return 'insercion'
  if (t.includes('shaker') || t.includes('cocktail')) return 'shaker'
  if (t.includes('radix')) return 'radix'

  return 'burbujaMejorado'
}

/**
 * Intenta extraer un arreglo de números o textos
 * del código fuente del ejercicio.
 */
function extraerDatosDelCodigo(codigo = '') {
  if (!codigo || typeof codigo !== 'string') return null

  const patrones = [
    /(?:int|Integer|double|float|long)\s*\[\s*\]\s*\w+\s*=\s*(?:new\s+\w+\s*\[\s*\]\s*)?\{([^}]+)\}/i,
    /(?:int|Integer|double|float|long)\s+\w+\s*\[\s*\]\s*=\s*\{([^}]+)\}/i,
    /String\s*\[\s*\]\s*\w+\s*=\s*(?:new\s+String\s*\[\s*\]\s*)?\{([^}]+)\}/i,
    /String\s+\w+\s*\[\s*\]\s*=\s*\{([^}]+)\}/i,
  ]

  for (const re of patrones) {
    const match = codigo.match(re)

    if (!match?.[1]) continue

    const contenido = match[1].trim()

    const cadenas = [
      ...contenido.matchAll(/"((?:\\.|[^"\\])*)"/g),
    ].map((m) => m[1])

    if (cadenas.length >= 2) {
      return cadenas
    }

    const tokens = contenido
      .split(/[;,\s]+/)
      .filter(Boolean)

    if (
      tokens.length >= 2 &&
      tokens.every((v) => /^-?\d+(?:\.\d+)?$/.test(v))
    ) {
      return tokens.map(Number)
    }
  }

  return null
}

function parseInput(text) {
  if (!text?.trim()) return []

  const quoted = [
    ...text.matchAll(/"((?:\\.|[^"\\])*)"/g),
  ].map((m) => m[1])

  if (quoted.length) return quoted

  const tokens = text
    .split(/[;,\s]+/)
    .filter(Boolean)

  if (
    !tokens.every((v) => /^-?\d+(?:\.\d+)?$/.test(v))
  ) {
    return []
  }

  return tokens.map(Number)
}

export default function SortingVisualizer({
  tituloTrabajo = '',
  metodoInicial = null,
  codigoFuente = '',
  datosIniciales = '',
}) {
  const datosExtraidos = datosIniciales.trim()
    ? parseInput(datosIniciales)
    : extraerDatosDelCodigo(codigoFuente)

  const textoInicial = datosExtraidos
    ? datosExtraidos
        .map((v) =>
          typeof v === 'string' ? `"${v}"` : v
        )
        .join(', ')
    : ''

  const [inputText, setInputText] = useState(textoInicial)

  const [metodo, setMetodo] = useState(
    metodoInicial ||
      detectarMetodoDesdeTitulo(tituloTrabajo)
  )

  const [array, setArray] = useState(() =>
    parseInput(textoInicial)
  )

  const [comparing, setComparing] = useState([])
  const [sorted, setSorted] = useState([])
  const [swapped, setSwapped] = useState(false)
  const [logs, setLogs] = useState([])
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(40)

  const [stats, setStats] = useState({
    comparaciones: 0,
    intercambios: 0,
    iteraciones: 0,
  })

  const [tiempoMs, setTiempoMs] = useState(0)

  const cancelRef = useRef(false)
  const logEndRef = useRef(null)

  const [origenDatos, setOrigenDatos] = useState(
    datosExtraidos
      ? datosIniciales.trim()
        ? 'configurados para este problema'
        : 'extraídos del código del ejercicio'
      : 'no se detectaron datos en el problema'
  )

  const esTexto = array.some(
    (v) => typeof v === 'string'
  )

  const valoresNumericos = esTexto ? [] : array

  const minVal = valoresNumericos.length
    ? Math.min(...valoresNumericos, 0)
    : 0

  const maxVal = valoresNumericos.length
    ? Math.max(...valoresNumericos, 1)
    : 1

  const agregarLog = useCallback((msg) => {
    setLogs((prev) => {
      const next = [...prev, msg]
      return next.length > 80
        ? next.slice(-80)
        : next
    })
  }, [])

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollTop =
        logEndRef.current.scrollHeight
    }
  }, [logs])

  async function ejecutar() {
    const datos = parseInput(inputText)

    if (datos.length === 0) {
      agregarLog(
        'Error: revisa los datos; usa números separados por coma o textos entre comillas'
      )
      return
    }

    cancelRef.current = false

    setRunning(true)
    setArray(datos)
    setComparing([])
    setSorted([])
    setSwapped(false)
    setLogs([])

    setStats({
      comparaciones: 0,
      intercambios: 0,
      iteraciones: 0,
    })

    setTiempoMs(0)

    const gen = GENERATORS[metodo]

    if (!gen) {
      setRunning(false)
      return
    }

    const start = performance.now()

    const delay = Math.max(
      15,
      320 - speed * 3
    )

    try {
      for (const step of gen(datos)) {
        if (cancelRef.current) break

        setArray(step.array)

        setComparing(
          step.comparing || []
        )

        setSorted(
          step.sorted || []
        )

        setSwapped(
          Boolean(step.swapped)
        )

        setStats({
          comparaciones:
            step.comparaciones ?? 0,

          intercambios:
            step.intercambios ?? 0,

          iteraciones:
            (step.comparaciones ?? 0) +
            (step.intercambios ?? 0),
        })

        if (step.log) {
          agregarLog(step.log)
        }

        if (step.done) {
          setTiempoMs(
            Math.round(
              performance.now() - start
            )
          )
        }

        await new Promise((r) =>
          setTimeout(r, delay)
        )
      }
    } finally {
      setRunning(false)
      setComparing([])
      setSwapped(false)
    }
  }

  function detener() {
    cancelRef.current = true
    setRunning(false)
  }

  function resetear() {
    detener()

    const datos = parseInput(inputText)

    setArray(datos)
    setComparing([])
    setSorted([])
    setSwapped(false)
    setLogs([])

    setStats({
      comparaciones: 0,
      intercambios: 0,
      iteraciones: 0,
    })

    setTiempoMs(0)
  }

  if (array.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-panel/60 p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-300">
          No se encontraron datos para simular
        </p>

        <p className="mt-2 text-sm leading-relaxed text-slate">
          Para que la animación represente este ejercicio,
          agrega el arreglo real en el campo «datos del
          problema para la simulación» del administrador o
          declara un arreglo numérico/String en el código
          fuente.
          No se mostrarán valores ficticios.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-line/60 bg-panel/60 overflow-hidden">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 px-4 py-3 md:px-5">

        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-blueLight">
            Representación visual
          </p>

          <h3 className="font-display text-lg font-semibold text-paper">
            Comportamiento gráfico · Métodos de ordenamiento
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 font-mono text-[11px] text-slate">

          <span className="rounded-full border border-line px-2.5 py-1">
            Iteraciones: {stats.iteraciones}
          </span>

          <span className="rounded-full border border-line px-2.5 py-1">
            Comparaciones: {stats.comparaciones}
          </span>

          <span className="rounded-full border border-line px-2.5 py-1">
            Intercambios: {stats.intercambios}
          </span>

          {tiempoMs > 0 && (
            <span className="rounded-full border border-cyan/40 bg-cyan/10 px-2.5 py-1 text-cyan">
              Tiempo: {tiempoMs} ms
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[280px_1fr]">

        {/* Panel de configuración */}
        <div className="space-y-4 border-b border-line/60 p-4 lg:border-b-0 lg:border-r lg:p-5">

          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-slate">
              Entrada de datos (separados por coma)
            </label>

            <textarea
              value={inputText}
              onChange={(e) =>
                setInputText(e.target.value)
              }
              disabled={running}
              rows={3}
              className="w-full rounded-lg border border-line bg-navy px-3 py-2 font-mono text-xs text-paper outline-none focus:border-blue disabled:opacity-60"
              placeholder="45, 17, 23, 67, ..."
            />

            <p className="mt-1 font-mono text-[10px] text-slate/70">
              Acepta arreglos numéricos o de texto.

              {origenDatos && (
                <span className="mt-0.5 block text-cyan/80">
                  → Datos {origenDatos}
                </span>
              )}
            </p>
          </div>

          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-slate">
              Método de ordenamiento
            </label>

            <select
              value={metodo}
              onChange={(e) =>
                setMetodo(e.target.value)
              }
              disabled={running}
              className="w-full rounded-lg border border-line bg-navy px-3 py-2 font-mono text-xs text-paper outline-none focus:border-blue disabled:opacity-60"
            >
              {METODOS.map((m) => (
                <option
                  key={m.id}
                  value={m.id}
                >
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 flex items-center justify-between font-mono text-[11px] uppercase tracking-wide text-slate">

              <span>
                Velocidad de simulación
              </span>

              <span className="text-blueLight">
                {speed}%
              </span>

            </label>

            <input
              type="range"
              min={5}
              max={100}
              value={speed}
              onChange={(e) =>
                setSpeed(
                  Number(e.target.value)
                )
              }
              className="w-full accent-blue"
            />
          </div>

          <div className="flex flex-col gap-2 pt-1">

            {!running ? (
              <button
                onClick={ejecutar}
                className="w-full rounded-lg bg-blue px-4 py-2.5 font-mono text-xs font-medium text-paper transition-colors hover:bg-blueLight"
              >
                EJECUTAR SIMULACIÓN
              </button>
            ) : (
              <button
                onClick={detener}
                className="w-full rounded-lg border border-rose/50 bg-rose/10 px-4 py-2.5 font-mono text-xs font-medium text-rose transition-colors hover:bg-rose/20"
              >
                DETENER
              </button>
            )}

            <button
              onClick={resetear}
              disabled={running}
              className="w-full rounded-lg border border-line px-4 py-2 font-mono text-xs text-slate transition-colors hover:border-blue hover:text-blueLight disabled:opacity-50"
            >
              Reiniciar
            </button>

          </div>
        </div>

        {/* Gráfico de barras + log */}
        <div className="flex flex-col">

          <div className="flex-1 p-4 md:p-5">

            <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate">
              Comportamiento gráfico
            </p>

            <div className="flex h-56 items-end gap-[3px] rounded-xl border border-line/40 bg-navy/60 px-2 pb-2 pt-4 sm:h-64 sm:gap-1 md:h-72">

              {array.map((val, idx) => {

                const heightPct = esTexto
                  ? 58
                  : Math.max(
                      4,
                      ((val - minVal) /
                        (maxVal - minVal || 1)) *
                        100
                    )

                const isComparing =
                  comparing.includes(idx)

                const isSorted =
                  sorted.includes(idx)

                let bg = 'bg-blue/80'

                if (isSorted) {
                  bg = 'bg-cyan/70'
                } else if (
                  isComparing &&
                  swapped
                ) {
                  bg = 'bg-rose/80'
                } else if (
                  isComparing
                ) {
                  bg = 'bg-blueLight'
                }

                return (
                  <div
                    key={idx}
                    className="group relative flex flex-1 flex-col items-center justify-end"
                    style={{
                      height: '100%',
                    }}
                  >

                    {/* Barra */}
                    <div
                      className={`relative w-full max-w-[28px] rounded-t-sm transition-all duration-150 ${bg}`}
                      style={{
                        height: `${heightPct}%`,
                      }}
                      title={`Val ${idx + 1}: ${val}`}
                    >

                      {/* VALOR / NOMBRE ARRIBA DE LA BARRA */}
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 -translate-y-1 whitespace-nowrap text-[10px] font-semibold text-paper">
                        {val}
                      </span>

                    </div>

                    {/* Índice */}
                    <span className="mt-1 hidden font-mono text-[9px] text-slate/60 sm:block">
                      {idx + 1}
                    </span>

                  </div>
                )
              })}

            </div>

            <div className="mt-2 flex flex-wrap gap-3 font-mono text-[10px] text-slate">

              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue/80" />
                Valores
              </span>

              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blueLight" />
                Comparando
              </span>

              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-rose/80" />
                Intercambio
              </span>

              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-cyan/70" />
                Ordenado
              </span>

            </div>
          </div>

          {/* Log */}
          <div className="border-t border-line/60">

            <div className="flex items-center justify-between px-4 py-2 md:px-5">

              <p className="font-mono text-[11px] uppercase tracking-widest text-slate">
                Log de ejecución y recursos
              </p>

            </div>

            <div
              ref={logEndRef}
              className="h-36 overflow-y-auto bg-navy/80 px-4 py-3 font-mono text-[11px] leading-relaxed text-cyan md:px-5"
            >

              {logs.length === 0 ? (
                <p className="text-slate/50">
                  &gt; Listo. Elige un método,
                  ajusta los datos y pulsa
                  «Ejecutar simulación».
                </p>
              ) : (
                logs.map((line, i) => (
                  <p
                    key={i}
                    className="text-cyan/90"
                  >
                    &gt; {line}
                  </p>
                ))
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}