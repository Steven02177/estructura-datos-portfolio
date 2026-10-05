import { useState, useRef, useEffect, useCallback } from 'react'
import { ESCENARIOS, METODOS_PARCIAL } from '../data/parcialArrays.js'
import { CODIGOS_JAVA, CODIGOS_JAVA_NOMBRES, generarMainCodeChef } from '../data/codigosJava.js'
import CodeBlock from './CodeBlock.jsx'

// ---------------------------------------------------------------------------
// Generadores de pasos (mismos estilo que SortingVisualizer)
// ---------------------------------------------------------------------------

function* bubbleSort(arr) {
  const a = [...arr]
  const n = a.length
  let comparaciones = 0
  let intercambios = 0
  let iteraciones = 0
  for (let i = 0; i < n - 1; i++) {
    iteraciones++
    for (let j = 0; j < n - i - 1; j++) {
      comparaciones++
      yield { array: [...a], comparing: [j, j + 1], sorted: Array.from({ length: i }, (_, k) => n - 1 - k), log: `Burbuja · Iter ${i + 1} · Comparando ${a[j]} y ${a[j + 1]}`, comparaciones, intercambios, iteraciones }
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        intercambios++
        yield { array: [...a], comparing: [j, j + 1], swapped: true, sorted: Array.from({ length: i }, (_, k) => n - 1 - k), log: `Burbuja · Intercambio «${a[j + 1]}» ↔ «${a[j]}»`, comparaciones, intercambios, iteraciones }
      }
    }
  }
  yield { array: [...a], comparing: [], sorted: Array.from({ length: n }, (_, k) => k), log: '✓ Burbuja Simple completado', comparaciones, intercambios, iteraciones, done: true }
}

function* bubbleSortMejorado(arr) {
  const a = [...arr]
  const n = a.length
  let comparaciones = 0
  let intercambios = 0
  let iteraciones = 0
  let i = 0
  let hubo = true
  while (hubo) {
    hubo = false
    iteraciones++
    for (let j = 0; j < n - i - 1; j++) {
      comparaciones++
      yield { array: [...a], comparing: [j, j + 1], sorted: Array.from({ length: i }, (_, k) => n - 1 - k), log: `Burbuja+ · Iter ${i + 1} · Comparando ${a[j]} y ${a[j + 1]}`, comparaciones, intercambios, iteraciones }
      if (a[j] > a[j + 1]) {
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        intercambios++
        hubo = true
        yield { array: [...a], comparing: [j, j + 1], swapped: true, sorted: Array.from({ length: i }, (_, k) => n - 1 - k), log: `Burbuja+ · Intercambio «${a[j + 1]}» ↔ «${a[j]}»`, comparaciones, intercambios, iteraciones }
      }
    }
    i++
  }
  yield { array: [...a], comparing: [], sorted: Array.from({ length: n }, (_, k) => k), log: '✓ Burbuja Mejorado completado', comparaciones, intercambios, iteraciones, done: true }
}

function* selectionSort(arr) {
  const a = [...arr]
  const n = a.length
  let comparaciones = 0
  let intercambios = 0
  let iteraciones = 0
  for (let i = 0; i < n - 1; i++) {
    iteraciones++
    let minIdx = i
    for (let j = i + 1; j < n; j++) {
      comparaciones++
      yield { array: [...a], comparing: [minIdx, j], sorted: Array.from({ length: i }, (_, k) => k), log: `Selección · Pasada ${i + 1} · Comparando ${a[minIdx]} y ${a[j]}`, comparaciones, intercambios, iteraciones }
      if (a[j] < a[minIdx]) minIdx = j
    }
    if (minIdx !== i) {
      ;[a[i], a[minIdx]] = [a[minIdx], a[i]]
      intercambios++
      yield { array: [...a], comparing: [i, minIdx], swapped: true, sorted: Array.from({ length: i }, (_, k) => k), log: `Selección · Intercambio «${a[i]}» ↔ «${a[minIdx]}»`, comparaciones, intercambios, iteraciones }
    }
  }
  yield { array: [...a], comparing: [], sorted: Array.from({ length: n }, (_, k) => k), log: '✓ Selección Directa completado', comparaciones, intercambios, iteraciones, done: true }
}

function* insertionSort(arr) {
  const a = [...arr]
  const n = a.length
  let comparaciones = 0
  let intercambios = 0
  let iteraciones = 0
  for (let i = 1; i < n; i++) {
    iteraciones++
    const key = a[i]
    let j = i - 1
    yield { array: [...a], comparing: [i], sorted: Array.from({ length: i }, (_, k) => k), log: `Inserción · Insertando ${key}`, comparaciones, intercambios, iteraciones }
    while (j >= 0 && a[j] > key) {
      comparaciones++
      a[j + 1] = a[j]
      intercambios++
      j--
      yield { array: [...a], comparing: [j + 1, j + 2], swapped: true, sorted: Array.from({ length: i }, (_, k) => k), log: `Inserción · Desplaza «${a[j + 2]}» → derecha`, comparaciones, intercambios, iteraciones }
    }
    a[j + 1] = key
  }
  yield { array: [...a], comparing: [], sorted: Array.from({ length: n }, (_, k) => k), log: '✓ Inserción Simple completado', comparaciones, intercambios, iteraciones, done: true }
}

function* shakerSort(arr) {
  const a = [...arr]
  let left = 0
  let right = a.length - 1
  let comparaciones = 0
  let intercambios = 0
  let iteraciones = 0
  let pass = 0
  while (left < right) {
    pass++
    let swapped = false
    for (let i = left; i < right; i++) {
      comparaciones++
      yield { array: [...a], comparing: [i, i + 1], sorted: [], log: `Shaker → · Comparando «${a[i]}» y «${a[i + 1]}»`, comparaciones, intercambios, iteraciones }
      if (a[i] > a[i + 1]) {
        ;[a[i], a[i + 1]] = [a[i + 1], a[i]]
        intercambios++
        swapped = true
        yield { array: [...a], comparing: [i, i + 1], swapped: true, sorted: [], log: `Shaker → · Intercambio «${a[i + 1]}» ↔ «${a[i]}»`, comparaciones, intercambios, iteraciones }
      }
    }
    right--
    if (!swapped) break
    swapped = false
    for (let i = right; i > left; i--) {
      comparaciones++
      yield { array: [...a], comparing: [i - 1, i], sorted: [], log: `Shaker ← · Comparando «${a[i - 1]}» y «${a[i]}»`, comparaciones, intercambios, iteraciones }
      if (a[i - 1] > a[i]) {
        ;[a[i - 1], a[i]] = [a[i], a[i - 1]]
        intercambios++
        swapped = true
        yield { array: [...a], comparing: [i - 1, i], swapped: true, sorted: [], log: `Shaker ← · Intercambio «${a[i]}» ↔ «${a[i - 1]}»`, comparaciones, intercambios, iteraciones }
      }
    }
    left++
  }
  yield { array: [...a], comparing: [], sorted: Array.from({ length: a.length }, (_, k) => k), log: '✓ Shaker completado', comparaciones, intercambios, iteraciones, done: true }
}

function* shellSort(arr) {
  const a = [...arr]
  const n = a.length
  let comparaciones = 0
  let intercambios = 0
  let iteraciones = 0
  let gap = Math.floor(n / 2)
  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      const temp = a[i]
      let j = i
      yield { array: [...a], comparing: [i], sorted: [], log: `Shell gap=${gap} · Insertando ${temp}`, comparaciones, intercambios, iteraciones }
      while (j >= gap && a[j - gap] > temp) {
        comparaciones++
        a[j] = a[j - gap]
        intercambios++
        j -= gap
        yield { array: [...a], comparing: [j, j + gap], swapped: true, sorted: [], log: `Shell gap=${gap} · Desplaza «${a[j + gap]}»`, comparaciones, intercambios, iteraciones }
      }
      a[j] = temp
    }
    gap = Math.floor(gap / 2)
  }
  yield { array: [...a], comparing: [], sorted: Array.from({ length: n }, (_, k) => k), log: '✓ Shell Sort completado', comparaciones, intercambios, iteraciones, done: true }
}

function* quickSort(arr) {
  const a = [...arr]
  let comparaciones = 0
  let intercambios = 0
  let iteraciones = 0
  function* partition(low, high) {
    const pivot = a[high]
    let i = low - 1
    yield { array: [...a], comparing: [high], sorted: [], log: `Quick · Pivote ${pivot} [${low}..${high}]`, comparaciones, intercambios, iteraciones }
    for (let j = low; j < high; j++) {
      comparaciones++
      yield { array: [...a], comparing: [j, high], sorted: [], log: `Quick · Comparando «${a[j]}» con pivote «${pivot}»`, comparaciones, intercambios, iteraciones }
      if (a[j] < pivot) {
        i++
        ;[a[i], a[j]] = [a[j], a[i]]
        intercambios++
        yield { array: [...a], comparing: [i, j], swapped: true, sorted: [], log: `Quick · Intercambio «${a[i]}» ↔ «${a[j]}»`, comparaciones, intercambios, iteraciones }
      }
    }
    ;[a[i + 1], a[high]] = [a[high], a[i + 1]]
    intercambios++
    yield { array: [...a], comparing: [i + 1, high], swapped: true, sorted: [], log: `Quick · Pivote «${a[i + 1]}» colocado en pos ${i + 1}`, comparaciones, intercambios, iteraciones }
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
  yield { array: [...a], comparing: [], sorted: Array.from({ length: a.length }, (_, k) => k), log: '✓ Quick Sort completado', comparaciones, intercambios, iteraciones, done: true }
}

function* mergeSort(arr) {
  const a = [...arr]
  let comparaciones = 0
  let intercambios = 0
  let iteraciones = 0
  function* merge(low, mid, high) {
    const left = a.slice(low, mid + 1)
    const right = a.slice(mid + 1, high + 1)
    let i = 0, j = 0, k = low
    while (i < left.length && j < right.length) {
      comparaciones++
      yield { array: [...a], comparing: [k], sorted: [], log: `Merge · Comparando ${left[i]} y ${right[j]}`, comparaciones, intercambios, iteraciones }
      if (left[i] <= right[j]) {
        a[k++] = left[i++]
      } else {
        a[k++] = right[j++]
      }
      intercambios++
      yield { array: [...a], comparing: [k - 1], swapped: true, sorted: [], log: `Merge · Colocado «${a[k - 1]}»`, comparaciones, intercambios, iteraciones }
    }
    while (i < left.length) {
      a[k++] = left[i++]
      intercambios++
      yield { array: [...a], comparing: [k - 1], swapped: true, sorted: [], log: `Merge · Resto izq «${a[k - 1]}»`, comparaciones, intercambios, iteraciones }
    }
    while (j < right.length) {
      a[k++] = right[j++]
      intercambios++
      yield { array: [...a], comparing: [k - 1], swapped: true, sorted: [], log: `Merge · Resto der «${a[k - 1]}»`, comparaciones, intercambios, iteraciones }
    }
  }
  function* ms(low, high) {
    if (low < high) {
      const mid = Math.floor((low + high) / 2)
      yield { array: [...a], comparing: [low, high], sorted: [], log: `Merge · Dividir [${low}..${high}]`, comparaciones, intercambios, iteraciones }
      yield* ms(low, mid)
      yield* ms(mid + 1, high)
      yield* merge(low, mid, high)
    }
  }
  yield* ms(0, a.length - 1)
  yield { array: [...a], comparing: [], sorted: Array.from({ length: a.length }, (_, k) => k), log: '✓ Merge Sort completado', comparaciones, intercambios, iteraciones, done: true }
}

function* radixSort(arr) {
  // Solo números positivos
  const a = [...arr]
  let comparaciones = 0
  let intercambios = 0
  let iteraciones = 0
  if (a.length === 0 || typeof a[0] !== 'number') {
    yield { array: [...a], comparing: [], sorted: Array.from({ length: a.length }, (_, k) => k), log: 'Radix solo aplica a números', comparaciones, intercambios, iteraciones, done: true }
    return
  }
  const max = Math.max(...a)
  let exp = 1
  while (Math.floor(max / exp) > 0) {
    const output = new Array(a.length).fill(0)
    const count = new Array(10).fill(0)
    for (let i = 0; i < a.length; i++) count[Math.floor(a[i] / exp) % 10]++
    for (let i = 1; i < 10; i++) count[i] += count[i - 1]
    for (let i = a.length - 1; i >= 0; i--) {
      const d = Math.floor(a[i] / exp) % 10
      output[count[d] - 1] = a[i]
      count[d]--
      intercambios++
    }
    for (let i = 0; i < a.length; i++) a[i] = output[i]
    yield { array: [...a], comparing: [], sorted: [], log: `Radix · exp=${exp}`, comparaciones, intercambios, iteraciones }
    exp *= 10
  }
  yield { array: [...a], comparing: [], sorted: Array.from({ length: a.length }, (_, k) => k), log: '✓ Radix Sort completado', comparaciones, intercambios, iteraciones, done: true }
}

function* heapSort(arr) {
  const a = [...arr]
  const n = a.length
  let comparaciones = 0
  let intercambios = 0
  let iteraciones = 0
  function* heapify(size, i) {
    let largest = i
    const l = 2 * i + 1
    const r = 2 * i + 2
    if (l < size) {
      comparaciones++
      if (a[l] > a[largest]) largest = l
    }
    if (r < size) {
      comparaciones++
      if (a[r] > a[largest]) largest = r
    }
    if (largest !== i) {
      ;[a[i], a[largest]] = [a[largest], a[i]]
      intercambios++
      yield { array: [...a], comparing: [i, largest], swapped: true, sorted: [], log: `Heap · Intercambio ${a[i]} ↔ ${a[largest]}`, comparaciones, intercambios, iteraciones }
      yield* heapify(size, largest)
    }
  }
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield { array: [...a], comparing: [i], sorted: [], log: `Heap · Construyendo montículo en ${i}`, comparaciones, intercambios, iteraciones }
    yield* heapify(n, i)
  }
  for (let i = n - 1; i > 0; i--) {
    ;[a[0], a[i]] = [a[i], a[0]]
    intercambios++
    yield { array: [...a], comparing: [0, i], swapped: true, sorted: Array.from({ length: n - i }, (_, k) => n - 1 - k), log: `Heap · Extraer raíz «${a[i]}» → pos ${i}`, comparaciones, intercambios, iteraciones }
    yield* heapify(i, 0)
  }
  yield { array: [...a], comparing: [], sorted: Array.from({ length: n }, (_, k) => k), log: '✓ Montículo (Heap) completado', comparaciones, intercambios, iteraciones, done: true }
}

function* bucketSort(arr) {
  const a = [...arr]
  let comparaciones = 0
  let intercambios = 0
  let iteraciones = 0
  if (a.length === 0 || typeof a[0] !== 'number') {
    // Para strings usamos insertion como fallback visual
    yield* insertionSort(a)
    return
  }
  const n = a.length
  const min = Math.min(...a)
  const max = Math.max(...a)
  const bucketCount = Math.max(5, Math.floor(Math.sqrt(n)))
  const buckets = Array.from({ length: bucketCount }, () => [])
  const range = max - min + 1
  for (let i = 0; i < n; i++) {
    const idx = Math.min(bucketCount - 1, Math.floor(((a[i] - min) / range) * bucketCount))
    buckets[idx].push(a[i])
    yield { array: [...a], comparing: [i], sorted: [], log: `Cubo · ${a[i]} → bucket ${idx}`, comparaciones, intercambios, iteraciones }
  }
  let k = 0
  for (let b = 0; b < bucketCount; b++) {
    buckets[b].sort((x, y) => {
      comparaciones++
      return x - y
    })
    for (const v of buckets[b]) {
      a[k++] = v
      intercambios++
      yield { array: [...a], comparing: [k - 1], swapped: true, sorted: Array.from({ length: k }, (_, i) => i), log: `Cubo · Colocando ${v}`, comparaciones, intercambios, iteraciones }
    }
  }
  yield { array: [...a], comparing: [], sorted: Array.from({ length: n }, (_, k) => k), log: '✓ Método del Cubo completado', comparaciones, intercambios, iteraciones, done: true }
}

function* countingSort(arr) {
  const a = [...arr]
  let comparaciones = 0
  let intercambios = 0
  let iteraciones = 0
  if (a.length === 0 || typeof a[0] !== 'number') {
    yield { array: [...a], comparing: [], sorted: Array.from({ length: a.length }, (_, k) => k), log: 'Counting Sort solo aplica a números enteros', comparaciones, intercambios, iteraciones, done: true }
    return
  }
  const min = Math.min(...a)
  const max = Math.max(...a)
  const rango = max - min + 1
  const count = new Array(rango).fill(0)
  for (let i = 0; i < a.length; i++) {
    count[a[i] - min]++
    yield { array: [...a], comparing: [i], sorted: [], log: `Counting · Contando ${a[i]}`, comparaciones, intercambios, iteraciones }
  }
  for (let i = 1; i < rango; i++) count[i] += count[i - 1]
  const ordenado = new Array(a.length)
  for (let i = a.length - 1; i >= 0; i--) {
    const idx = a[i] - min
    ordenado[count[idx] - 1] = a[i]
    count[idx]--
    intercambios++
    yield { array: [...ordenado], comparing: [count[idx]], swapped: true, sorted: [], log: `Counting · Colocando ${a[i]}`, comparaciones, intercambios, iteraciones }
  }
  for (let i = 0; i < a.length; i++) a[i] = ordenado[i]
  yield { array: [...a], comparing: [], sorted: Array.from({ length: a.length }, (_, k) => k), log: '✓ Counting Sort completado', comparaciones, intercambios, iteraciones, done: true }
}

const GENERATORS = {
  burbuja: bubbleSort,
  burbujaMejorado: bubbleSortMejorado,
  seleccion: selectionSort,
  insercion: insertionSort,
  shaker: shakerSort,
  shell: shellSort,
  quick: quickSort,
  merge: mergeSort,
  radix: radixSort,
  heap: heapSort,
  bucket: bucketSort,
  counting: countingSort,
}

// ---------------------------------------------------------------------------
// Métricas: MISMA lógica que la animación (mismo generador → mismos números)
// ---------------------------------------------------------------------------

function medir(arr, metodoId) {
  const genFn = GENERATORS[metodoId]
  if (!genFn) {
    return { comparaciones: 0, intercambios: 0, iteraciones: 0, tiempo: '0.000' }
  }
  // Métodos solo numéricos: si el array tiene strings, no medir
  const esTexto = arr.length > 0 && typeof arr[0] === 'string'
  if (esTexto && ['radix', 'counting'].includes(metodoId)) {
    return { comparaciones: 0, intercambios: 0, iteraciones: 0, tiempo: '—', skipped: true }
  }

  const t0 = performance.now()
  let last = { comparaciones: 0, intercambios: 0, iteraciones: 0 }
  for (const step of genFn([...arr])) {
    last = step
  }
  const tiempo = (performance.now() - t0).toFixed(3)
  return {
    comparaciones: last.comparaciones ?? 0,
    intercambios: last.intercambios ?? 0,
    // Si el generador no expone iteraciones, usamos 0 y la columna sigue coherente
    iteraciones: last.iteraciones ?? 0,
    tiempo,
  }
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

function parseInput(text) {
  if (!text?.trim()) return []
  const quoted = [...text.matchAll(/"((?:\\.|[^"\\])*)"/g)].map((m) => m[1])
  if (quoted.length >= 2) return quoted
  // también acepta 'comillas simples'
  const single = [...text.matchAll(/'((?:\\.|[^'\\])*)'/g)].map((m) => m[1])
  if (single.length >= 2) return single
  const tokens = text.split(/[\s,;]+/).filter(Boolean)
  if (tokens.length >= 1 && tokens.every((v) => /^-?\d+(?:\.\d+)?$/.test(v))) {
    return tokens.map(Number)
  }
  // fallback: líneas o comas de texto sin comillas
  const plain = text
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
  if (plain.length >= 2 && !plain.every((v) => /^-?\d+(?:\.\d+)?$/.test(v))) {
    return plain
  }
  return []
}

export default function ParcialVisualizer() {
  const [escenarioId, setEscenarioId] = useState('desordenados')
  const [tipoDato, setTipoDato] = useState('numeros') // 'numeros' | 'nombres'
  const [metodo, setMetodo] = useState('burbujaMejorado')
  const [array, setArray] = useState([])
  const [comparing, setComparing] = useState([])
  const [sorted, setSorted] = useState([])
  const [swapped, setSwapped] = useState(false)
  const [logs, setLogs] = useState([])
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [stats, setStats] = useState({ comparaciones: 0, intercambios: 0 })
  const [tabla, setTabla] = useState([])
  const [analisis, setAnalisis] = useState('')
  const [codigoAbierto, setCodigoAbierto] = useState(null)
  const [copiado, setCopiado] = useState(false)
  const [inputText, setInputText] = useState('')
  const [datosCustom, setDatosCustom] = useState(null) // null = usar escenario
  const [origen, setOrigen] = useState('escenario') // 'escenario' | 'pegado'
  const stopRef = useRef(false)
  const logEndRef = useRef(null)

  const escenario = ESCENARIOS.find((e) => e.id === escenarioId) || ESCENARIOS[0]
  const datosEscenario = tipoDato === 'nombres' ? escenario.nombres : escenario.numeros
  const datosActuales = datosCustom ?? datosEscenario
  const esTexto =
    datosCustom != null
      ? typeof datosCustom[0] === 'string'
      : tipoDato === 'nombres'

  // Cargar datos del escenario (solo si no hay datos pegados)
  useEffect(() => {
    if (datosCustom != null) return
    setArray([...datosEscenario])
    setComparing([])
    setSorted([])
    setSwapped(false)
    setLogs([])
    setStats({ comparaciones: 0, intercambios: 0 })
    stopRef.current = true
    setRunning(false)
  }, [escenarioId, tipoDato, datosCustom, datosEscenario])

  function aplicarPegado() {
    const parsed = parseInput(inputText)
    if (parsed.length === 0) {
      setLogs([
        '⚠ No se detectaron datos. Pega números separados por coma (1, 2, 3) o textos entre comillas ("Ana", "Luis").',
      ])
      return
    }
    setDatosCustom(parsed)
    setOrigen('pegado')
    setTipoDato(typeof parsed[0] === 'string' ? 'nombres' : 'numeros')
    setArray([...parsed])
    setComparing([])
    setSorted([])
    setSwapped(false)
    setStats({ comparaciones: 0, intercambios: 0 })
    setLogs([`✓ Cargados ${parsed.length} elementos desde el texto pegado.`])
    stopRef.current = true
    setRunning(false)
  }

  function usarEscenario() {
    setDatosCustom(null)
    setOrigen('escenario')
    setInputText('')
    setArray([...datosEscenario])
    setComparing([])
    setSorted([])
    setSwapped(false)
    setStats({ comparaciones: 0, intercambios: 0 })
    setLogs([`✓ Volviendo al escenario «${escenario.nombre}» (${datosEscenario.length} elementos).`])
  }

  // Auto-scroll log
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollTop = logEndRef.current.scrollHeight
    }
  }, [logs])

  const minVal = esTexto ? 0 : Math.min(...(array.length ? array : [0]))
  const maxVal = esTexto ? 1 : Math.max(...(array.length ? array : [1]))

  const ejecutar = useCallback(async () => {
    if (running) return
    const gen = GENERATORS[metodo]
    if (!gen) return

    // Radix / Counting / Bucket solo números
    if (['radix', 'counting'].includes(metodo) && esTexto) {
      setLogs(['⚠ Este método solo aplica a números enteros. Cambia a «Números».'])
      return
    }

    stopRef.current = false
    setRunning(true)
    setLogs([`Iniciando ${METODOS_PARCIAL.find((m) => m.id === metodo)?.nombre}…`])
    setComparing([])
    setSorted([])
    setSwapped(false)

    const datos = [...datosActuales]
    setArray(datos)

    try {
      // Con arreglos grandes (200–500), no pintamos cada comparación:
      // saltamos frames para que la animación sea usable.
      const n = datos.length
      const skipEvery = n > 120 ? Math.max(8, Math.floor(n / 8)) : n > 60 ? 4 : 1
      let stepIdx = 0
      let last = null
      for (const step of gen(datos)) {
        if (stopRef.current) break
        last = step
        stepIdx++
        const esFinal = step.done
        const esSwap = step.swapped
        if (!esFinal && !esSwap && stepIdx % skipEvery !== 0) continue

        setArray(step.array)
        setComparing(step.comparing || [])
        setSorted(step.sorted || [])
        setSwapped(!!step.swapped)
        setStats({ comparaciones: step.comparaciones, intercambios: step.intercambios })
        if (step.log) setLogs((prev) => [...prev.slice(-50), step.log])
        await new Promise((r) => setTimeout(r, Math.max(4, 110 - speed)))
      }
      if (last && !stopRef.current) {
        setArray(last.array)
        setComparing([])
        setSorted(Array.from({ length: last.array.length }, (_, k) => k))
        setSwapped(false)
        setStats({ comparaciones: last.comparaciones, intercambios: last.intercambios })
      }
    } finally {
      setRunning(false)
      setSwapped(false)
    }
  }, [metodo, datosActuales, esTexto, running, speed])

  const detener = () => {
    stopRef.current = true
    setRunning(false)
  }

  const reset = () => {
    stopRef.current = true
    setRunning(false)
    setArray([...datosActuales])
    setComparing([])
    setSorted([])
    setSwapped(false)
    setLogs([])
    setStats({ comparaciones: 0, intercambios: 0 })
  }

  const generarTabla = () => {
    const filas = METODOS_PARCIAL.map((m) => {
      if (['radix', 'counting'].includes(m.id) && esTexto) {
        return {
          ...m,
          comparaciones: '—',
          intercambios: '—',
          iteraciones: '—',
          tiempo: '—',
          skipped: true,
        }
      }
      const r = medir(datosActuales, m.id)
      return {
        ...m,
        comparaciones: r.comparaciones,
        intercambios: r.intercambios,
        iteraciones: r.iteraciones,
        tiempo: r.tiempo + ' ms',
        skipped: false,
      }
    })
    setTabla(filas)

    const validas = filas.filter((f) => !f.skipped && typeof f.comparaciones === 'number')
    if (validas.length === 0) {
      setAnalisis('No hay métricas disponibles para este tipo de dato.')
      return
    }
    const mejor = validas.reduce((a, b) => (a.comparaciones < b.comparaciones ? a : b))
    const peor = validas.reduce((a, b) => (a.comparaciones > b.comparaciones ? a : b))
    const masRapido = validas.reduce((a, b) =>
      parseFloat(a.tiempo) < parseFloat(b.tiempo) ? a : b
    )
    setAnalisis(
      `Escenario: «${escenario.nombre}» · Tipo: ${tipoDato} · n = ${datosActuales.length}\n\n` +
        `✓ Más eficiente (menos comparaciones): ${mejor.nombre}\n` +
        `   → ${mejor.comparaciones} comparaciones · ${mejor.intercambios} intercambios · ${mejor.iteraciones} iteraciones · ${mejor.tiempo}\n\n` +
        `✗ Menos eficiente (más comparaciones): ${peor.nombre}\n` +
        `   → ${peor.comparaciones} comparaciones · ${peor.intercambios} intercambios · ${peor.iteraciones} iteraciones · ${peor.tiempo}\n\n` +
        `⚡ Más rápido en tiempo real: ${masRapido.nombre} (${masRapido.tiempo})\n\n` +
        `Criterio principal: número de comparaciones. En empates se priorizan intercambios y tiempo.`
    )
  }

  return (
    <div className="space-y-8">
      {/* Selectores de escenario y tipo */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-slate">Escenario del parcial</p>
          <div className="flex flex-wrap gap-2">
            {ESCENARIOS.map((e) => (
              <button
                key={e.id}
                onClick={() => setEscenarioId(e.id)}
                disabled={running}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  escenarioId === e.id
                    ? 'bg-blue text-paper'
                    : 'border border-line/60 bg-panel/40 text-slate hover:border-blue/40 hover:text-paper'
                }`}
              >
                {e.nombre}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate/70">{escenario.descripcion}</p>
        </div>

        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-slate">Tipo de dato</p>
          <div className="flex gap-2">
            {['numeros', 'nombres'].map((t) => (
              <button
                key={t}
                onClick={() => setTipoDato(t)}
                disabled={running}
                className={`rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-colors ${
                  tipoDato === t
                    ? 'bg-cyan/20 text-cyan border border-cyan/40'
                    : 'border border-line/60 bg-panel/40 text-slate hover:text-paper'
                }`}
              >
                {t === 'numeros' ? 'Números' : 'Nombres'}
              </button>
            ))}
          </div>
          <p className="mt-2 font-mono text-[11px] text-slate/60">
            <strong className="text-paper">{datosActuales.length}</strong> elementos (arreglo completo del enunciado)
          </p>
        </div>
      </div>

      {/* Controles del visualizador */}
      <div className="rounded-2xl border border-line/60 bg-panel/30 overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-line/60 p-4 md:flex-row md:items-end md:justify-between md:p-5">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-slate">Método</p>
              <select
                value={metodo}
                onChange={(e) => setMetodo(e.target.value)}
                disabled={running}
                className="rounded-lg border border-line/60 bg-navy px-3 py-2 font-mono text-sm text-paper outline-none focus:border-blue"
              >
                {METODOS_PARCIAL.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-slate">Velocidad</p>
              <input
                type="range"
                min="5"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-28 accent-blue"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={ejecutar}
              disabled={running}
              className="rounded-full bg-blue px-5 py-2 text-sm font-medium text-paper transition-colors hover:bg-blueLight disabled:opacity-50"
            >
              {running ? 'Ejecutando…' : 'Ejecutar simulación'}
            </button>
            <button
              onClick={detener}
              disabled={!running}
              className="rounded-full border border-rose/40 px-4 py-2 text-sm text-rose transition-colors hover:bg-rose/10 disabled:opacity-40"
            >
              Detener
            </button>
            <button
              onClick={reset}
              className="rounded-full border border-line/60 px-4 py-2 text-sm text-slate transition-colors hover:text-paper"
            >
              Reiniciar
            </button>
          </div>
        </div>

        {/* Stats en vivo */}
        <div className="flex flex-wrap gap-6 border-b border-line/60 px-4 py-3 font-mono text-xs text-slate md:px-5">
          <span>Comparaciones: <strong className="text-cyan">{stats.comparaciones}</strong></span>
          <span>Intercambios: <strong className="text-cyan">{stats.intercambios}</strong></span>
          <span>Elementos: <strong className="text-paper">{array.length}</strong></span>
        </div>

        {/* Gráfico de barras */}
        <div className="p-4 md:p-5">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-slate">
            Comportamiento gráfico
          </p>

          {/* Banner: qué se está comparando / moviendo ahora */}
          {comparing.length > 0 && (
            <div
              className={`mb-3 flex flex-wrap items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-center ${
                swapped
                  ? 'border-rose/40 bg-rose/10'
                  : 'border-blueLight/30 bg-blue/10'
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate">
                {swapped ? 'Intercambio' : 'Comparando'}
              </span>
              {comparing.map((ci, i) => (
                <span key={ci} className="flex items-center gap-2">
                  {i > 0 && (
                    <span className={`font-mono text-sm ${swapped ? 'text-rose' : 'text-blueLight'}`}>
                      {swapped ? '↔' : '·'}
                    </span>
                  )}
                  <span
                    className={`rounded-lg px-3 py-1 font-display text-sm font-semibold md:text-base ${
                      swapped ? 'bg-rose/20 text-rose' : 'bg-blue/30 text-blueLight'
                    }`}
                  >
                    {array[ci] != null ? String(array[ci]) : '—'}
                  </span>
                </span>
              ))}
            </div>
          )}

          <div
            className={`relative flex items-end rounded-xl border border-line/40 bg-navy/60 px-1 pb-2 pt-8 ${
              array.length > 80 ? 'h-64 gap-px sm:h-72' : 'h-56 gap-[2px] sm:h-64 sm:gap-1 md:h-72'
            }`}
          >
            {(() => {
              // Ranking alfabético / numérico para altura de barras con nombres
              const ranks = (() => {
                if (!esTexto || array.length === 0) return null
                const sorted = [...array].map(String).sort((a, b) => a.localeCompare(b, 'es'))
                const map = new Map()
                sorted.forEach((v, i) => {
                  if (!map.has(v)) map.set(v, i)
                })
                const maxR = Math.max(1, sorted.length - 1)
                return map
                  ? { map, maxR }
                  : null
              })()

              return array.map((val, idx) => {
                let heightPct
                if (esTexto && ranks) {
                  const r = ranks.map.get(String(val)) ?? 0
                  heightPct = 12 + (r / ranks.maxR) * 88
                } else {
                  heightPct = Math.max(4, ((val - minVal) / (maxVal - minVal || 1)) * 100)
                }

                const isComparing = comparing.includes(idx)
                const isSorted = sorted.includes(idx)
                let bg = 'bg-blue/80'
                if (isSorted) bg = 'bg-cyan/70'
                else if (isComparing && swapped) bg = 'bg-rose/80'
                else if (isComparing) bg = 'bg-blueLight'

                const label = String(val)
                // Etiqueta en barra: siempre en activos; si hay pocos elementos, en todas
                const mostrarLabel = isComparing || isSorted || array.length <= 40
                const labelCorto =
                  esTexto && array.length > 60
                    ? label.slice(0, 4)
                    : esTexto && array.length > 30
                      ? label.slice(0, 6)
                      : label

                return (
                  <div
                    key={idx}
                    className="group relative flex flex-1 flex-col items-center justify-end"
                    style={{ height: '100%' }}
                  >
                    {/* Etiqueta flotante sobre la barra activa */}
                    {mostrarLabel && (
                      <span
                        className={`pointer-events-none absolute z-10 whitespace-nowrap font-semibold leading-none ${
                          isComparing
                            ? 'bottom-full mb-1 rounded bg-navy/95 px-1.5 py-0.5 text-[10px] text-paper shadow-lg ring-1 ring-blueLight/40'
                            : array.length <= 28
                              ? '-top-1 left-1/2 origin-bottom -translate-x-1/2 -rotate-45 text-[8px] text-paper/80'
                              : 'hidden'
                        }`}
                        title={label}
                      >
                        {labelCorto}
                      </span>
                    )}
                    <div
                      className={`relative w-full rounded-t-sm transition-all duration-100 ${bg} ${
                        isComparing ? 'ring-1 ring-paper/30' : ''
                      } ${array.length > 100 ? 'max-w-none' : 'max-w-[28px]'}`}
                      style={{ height: `${heightPct}%` }}
                      title={`#${idx + 1}: ${label}`}
                    />
                  </div>
                )
              })
            })()}
          </div>

          <div className="mt-2 flex flex-wrap gap-3 font-mono text-[10px] text-slate">
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue/80" /> Valores</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-blueLight" /> Comparando</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-rose/80" /> Intercambio</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-cyan/70" /> Ordenado</span>
            {esTexto && (
              <span className="text-slate/50">· altura = orden alfabético · nombre en la barra activa</span>
            )}
          </div>
        </div>

        {/* Log */}
        <div className="border-t border-line/60">
          <div className="px-4 py-2 md:px-5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate">
              Log de ejecución
              <span className="ml-2 normal-case tracking-normal text-slate/50">
                (muestra el nombre o número que se está moviendo)
              </span>
            </p>
          </div>
          <div ref={logEndRef} className="h-40 overflow-y-auto bg-navy/80 px-4 py-3 font-mono text-[11px] leading-relaxed text-cyan md:px-5">
            {logs.length === 0 ? (
              <p className="text-slate/50">&gt; Elige escenario, método y pulsa «Ejecutar simulación».</p>
            ) : (
              logs.map((line, i) => (
                <p
                  key={i}
                  className={
                    line.includes('Intercambio') || line.includes('↔')
                      ? 'text-rose/90'
                      : line.includes('✓')
                        ? 'text-cyan'
                        : 'text-cyan/85'
                  }
                >
                  &gt; {line}
                </p>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tabla comparativa completa */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate">
              Tabla comparativa de las estructuras
            </p>
            <p className="mt-0.5 text-[11px] text-slate/60">
              Columnas del enunciado · datos medidos sobre el arreglo completo del enunciado
            </p>
          </div>
          <button
            onClick={generarTabla}
            className="rounded-full border border-blue/50 bg-blue/10 px-4 py-1.5 text-xs text-blueLight transition-colors hover:bg-blue/20"
          >
            Generar / actualizar tabla
          </button>
        </div>

        {tabla.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-line/60 shadow-lg shadow-navy/40">
            <table className="w-full min-w-[820px] text-left font-mono text-xs">
              <thead>
                <tr className="bg-navy text-[10px] uppercase tracking-wider text-slate">
                  <th className="px-3 py-3 font-medium">Estructura</th>
                  <th className="px-3 py-3 font-medium">Memoria</th>
                  <th className="px-3 py-3 font-medium">Tiempo</th>
                  <th className="px-3 py-3 font-medium">Iteraciones</th>
                  <th className="px-3 py-3 font-medium">Comparaciones</th>
                  <th className="px-3 py-3 font-medium">Intercambios</th>
                  <th className="px-3 py-3 font-medium">Recursiva</th>
                </tr>
              </thead>
              <tbody>
                {tabla.map((f, idx) => {
                  const validas = tabla.filter((x) => !x.skipped && typeof x.comparaciones === 'number')
                  const minComp = validas.length
                    ? Math.min(...validas.map((x) => x.comparaciones))
                    : null
                  const maxComp = validas.length
                    ? Math.max(...validas.map((x) => x.comparaciones))
                    : null
                  const esMejor = !f.skipped && f.comparaciones === minComp
                  const esPeor = !f.skipped && f.comparaciones === maxComp && minComp !== maxComp

                  return (
                    <tr
                      key={f.id}
                      className={`border-t border-line/40 transition-colors ${
                        esMejor
                          ? 'bg-cyan/10 text-paper'
                          : esPeor
                            ? 'bg-rose/10 text-paper'
                            : idx % 2 === 0
                              ? 'bg-panel/20 text-paper/90'
                              : 'text-paper/90 hover:bg-panel/40'
                      }`}
                    >
                      <td className="px-3 py-2.5 font-medium">
                        {f.nombre}
                        {esMejor && (
                          <span className="ml-2 rounded bg-cyan/20 px-1.5 py-0.5 text-[9px] text-cyan">
                            mejor
                          </span>
                        )}
                        {esPeor && (
                          <span className="ml-2 rounded bg-rose/20 px-1.5 py-0.5 text-[9px] text-rose">
                            peor
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-slate">{f.memoria}</td>
                      <td className="px-3 py-2.5 text-cyan">{f.tiempo}</td>
                      <td className="px-3 py-2.5 text-cyan">{f.iteraciones}</td>
                      <td className="px-3 py-2.5 font-semibold text-cyan">{f.comparaciones}</td>
                      <td className="px-3 py-2.5 text-cyan">{f.intercambios}</td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] ${
                            f.recursiva
                              ? 'bg-blue/20 text-blueLight'
                              : 'bg-panel text-slate'
                          }`}
                        >
                          {f.recursiva ? 'Sí' : 'No'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {analisis && (
          <div className="mt-4 rounded-xl border border-cyan/30 bg-cyan/5 px-5 py-4">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-cyan">
              Análisis del método más y menos eficiente
            </p>
            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-paper/90">
              {analisis}
            </pre>
          </div>
        )}
      </div>

      {/* Código fuente Java + CodeChef */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate">
              Código fuente de cada método (Java · CodeChef)
            </p>
            <p className="mt-0.5 text-[11px] text-slate/60">
              Datos tomados de <code className="text-cyan">parcialArrays.js</code>
              {' '}· escenario actual: {escenario.nombre} · {tipoDato} ({datosActuales.length} elems)
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              const src = generarMainCodeChef({
                label: escenario.nombre,
                tipo: tipoDato,
                datos: datosActuales,
                metodoId: metodo,
              })
              try {
                await navigator.clipboard.writeText(src)
                setCopiado(true)
                setTimeout(() => setCopiado(false), 2500)
              } catch {
                // fallback: abrir en estado para seleccionar
                setCodigoAbierto('__codechef__')
              }
            }}
            className="rounded-full border border-cyan/40 bg-cyan/10 px-4 py-1.5 text-xs font-medium text-cyan transition-colors hover:bg-cyan/20"
          >
            {copiado
              ? '✓ Copiado — pega en CodeChef'
              : `Copiar Main.java (${METODOS_PARCIAL.find((x) => x.id === metodo)?.nombre || metodo})`}
          </button>
        </div>

        {/* Bloque completo CodeChef cuando se abre */}
        {codigoAbierto === '__codechef__' && (
          <div className="mb-4 overflow-hidden rounded-xl border border-cyan/40 bg-navy/60">
            <div className="flex items-center justify-between border-b border-line/40 px-4 py-2">
              <p className="font-mono text-[11px] text-cyan">Main.java listo para CodeChef</p>
              <button
                type="button"
                onClick={() => setCodigoAbierto(null)}
                className="text-xs text-slate hover:text-paper"
              >
                cerrar
              </button>
            </div>
            <CodeBlock
              codigo={generarMainCodeChef({
                label: escenario.nombre,
                tipo: tipoDato,
                datos: datosActuales,
                metodoId: metodo,
              })}
            />
          </div>
        )}

        <div className="space-y-2">
          {METODOS_PARCIAL.map((m) => {
            const abierto = codigoAbierto === m.id
            const codigo =
              tipoDato === 'nombres'
                ? CODIGOS_JAVA_NOMBRES[m.id]
                : CODIGOS_JAVA[m.id]
            return (
              <div
                key={m.id}
                className="overflow-hidden rounded-xl border border-line/60 bg-panel/20"
              >
                <button
                  type="button"
                  onClick={() => setCodigoAbierto(abierto ? null : m.id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-panel/40"
                >
                  <span className="font-mono text-sm text-paper">
                    {m.nombre}
                    <span className="ml-2 text-[10px] text-slate">
                      · {m.memoria} · {m.recursiva ? 'recursiva' : 'iterativa'} · Java
                    </span>
                  </span>
                  <span className="font-mono text-xs text-blueLight">
                    {abierto ? '▲ ocultar' : '▼ ver código'}
                  </span>
                </button>
                {abierto && codigo && (
                  <div className="border-t border-line/40 px-2 pb-3 pt-1 md:px-3">
                    <div className="mb-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          const src = generarMainCodeChef({
                            label: escenario.nombre,
                            tipo: tipoDato,
                            datos: datosActuales,
                            metodoId: m.id,
                          })
                          try {
                            await navigator.clipboard.writeText(src)
                            setCopiado(true)
                            setTimeout(() => setCopiado(false), 2500)
                          } catch { /* ignore */ }
                        }}
                        className="rounded-full border border-blue/40 bg-blue/10 px-3 py-1 text-[10px] text-blueLight hover:bg-blue/20"
                      >
                        Copiar Main.java de este método (con datos actuales)
                      </button>
                    </div>
                    <CodeBlock codigo={codigo} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
