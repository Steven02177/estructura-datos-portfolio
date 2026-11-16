import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import CodigoConSalida from '../components/CodigoConSalida.jsx'
import GrafoVisualizer from '../components/GrafoVisualizer.jsx'
import WordPreview from '../components/WordPreview.jsx'
import { C, Dato, Enunciado, Titulo, Tabla, Seccion, IndiceNav } from '../components/Contenido.jsx'
import { obtenerTrabajos } from '../firebase.js'
import {
  CODIGO_BASE,
  SALIDA_BASE,
  CODIGO_DFS,
  SALIDA_DFS,
  CODIGO_DIRIGIDO,
  SALIDA_DIRIGIDO,
  CODIGO_TRACERT,
  SALIDA_TRACERT,
  SALIDA_TRACERT_CMD,
} from '../data/tallerGrafos.js'

// ---------------------------------------------------------------------------
// Índice del taller (secciones del Word del profesor)
// ---------------------------------------------------------------------------
const INDICE = [
  { id: 'simulador', n: '★', titulo: 'Visualizador de grafos' },
  { id: 'teoria', n: '1', titulo: 'Marco teórico' },
  { id: 'ejemplo-guia', n: '2', titulo: 'Ejemplo guía (Parte 2)' },
  { id: 'ejercicio-3-1', n: '3', titulo: 'Ejercicio 3.1 · DFS' },
  { id: 'ejercicio-3-2', n: '4', titulo: 'Ejercicio 3.2 · Dirigido' },
  { id: 'tracert', n: '5', titulo: 'Traza CMD (tracert)' },
  { id: 'evidencias', n: '6', titulo: 'Evidencias' },
  { id: 'conclusiones', n: '7', titulo: 'Conclusiones' },
  { id: 'referencias', n: '8', titulo: 'Referencias' },
]

const OBJETIVOS = [
  'Comprender y definir formalmente la estructura de datos Grafo (vértices y aristas).',
  'Diferenciar entre las formas de representación en memoria: Lista de Adyacencia vs. Matriz de Adyacencia.',
  'Implementar y analizar algoritmos de recorrido en grafos: Anchura (BFS) y Profundidad (DFS).',
  'Desarrollar ejercicios prácticos en Java que solucionen problemas de redes reales (redes sociales, mapas de transporte, topología de servidores).',
  'Documentar y presentar la solución con bloques de código y capturas de ejecución.',
]

// ---------------------------------------------------------------------------
// Mini-diagramas de un grafo A → B → C (triángulo) en tres variantes
// ---------------------------------------------------------------------------
function recortar([x1, y1], [x2, y2], d) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy)
  return [
    [x1 + (dx / len) * d, y1 + (dy / len) * d],
    [x2 - (dx / len) * d, y2 - (dy / len) * d],
  ]
}

function MiniGrafo({ tipo, leyenda }) {
  const nodos = { A: [48, 52], B: [152, 52], C: [100, 118] }
  const aristas = [
    ['A', 'B'],
    ['B', 'C'],
    ['C', 'A'],
  ]
  const pesos = { 'A-B': 5, 'B-C': 8, 'C-A': 4 }
  const medios = {
    'A-B': [100, 42],
    'B-C': [136, 92],
    'C-A': [64, 92],
  }
  return (
    <figure className="rounded-xl border border-line/60 bg-panel/30 p-3">
      <svg viewBox="0 0 200 158" className="w-full" role="img" aria-label={leyenda}>
        <defs>
          <marker id="flechaMini" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="#3B82F6" />
          </marker>
        </defs>
        {aristas.map(([a, b]) => {
          const dirigido = tipo === 'dirigido'
          const [p1, p2] = dirigido
            ? recortar(nodos[a], nodos[b], 22)
            : [nodos[a], nodos[b]]
          return (
            <line
              key={`${a}${b}`}
              x1={p1[0]}
              y1={p1[1]}
              x2={p2[0]}
              y2={p2[1]}
              stroke="#3B82F6"
              strokeOpacity="0.55"
              strokeWidth="1.6"
              markerEnd={dirigido ? 'url(#flechaMini)' : undefined}
            />
          )
        })}
        {tipo === 'ponderado' &&
          Object.entries(pesos).map(([k, peso]) => (
            <text
              key={k}
              x={medios[k][0]}
              y={medios[k][1]}
              textAnchor="middle"
              className="font-mono"
              fontSize="10"
              fill="#22D3EE"
            >
              {peso}
            </text>
          ))}
        {Object.entries(nodos).map(([n, [x, y]]) => (
          <g key={n}>
            <circle cx={x} cy={y} r={16} fill="#141F38" stroke="#3B82F6" strokeWidth="1.4" />
            <text x={x} y={y + 32} textAnchor="middle" className="font-mono" fontSize="10" fill="#F8FAFC">
              {n}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-1 text-center font-mono text-[10px] uppercase tracking-wider text-slate">
        {leyenda}
      </figcaption>
    </figure>
  )
}

/** Bloque de pseudocódigo. */
function Pseudocodigo({ texto }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-xl border border-line/60 bg-navy p-4 font-mono text-[12px] leading-relaxed text-cyan">
      {texto}
    </pre>
  )
}

// ---------------------------------------------------------------------------
// Página del Taller: Grafos
// ---------------------------------------------------------------------------
export default function TallerGrafos() {
  const [ficha, setFicha] = useState(null)
  useEffect(() => {
    let vivo = true
    obtenerTrabajos()
      .then((ts) => {
        if (vivo) setFicha(ts.find((t) => t.paginaEspecial === 'grafos') || null)
      })
      .catch(() => {}) // sin conexión/configuración la página sigue funcionando
    return () => {
      vivo = false
    }
  }, [])

  const adjuntos = ficha
    ? Boolean(ficha.umlUrl || ficha.salidaImagenUrl || ficha.documentoUrl)
    : false

  return (
    <Layout>
      <article className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <Link
          to="/trabajos"
          className="font-mono text-xs text-slate transition-colors hover:text-blueLight"
        >
          ← volver a trabajos
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Portada */}
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-blueLight">
            Taller · Clase 10 · Estructuras de datos
          </p>
          <h1 className="mt-2 text-balance font-display text-3xl font-semibold text-paper md:text-4xl">
            Taller práctico: Grafos
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate">
            Definición formal de G = (V, E), representaciones en memoria (lista y matriz de
            adyacencia), recorridos BFS y DFS, análisis del ejemplo guía de red de campus, los
            ejercicios 3.1 y 3.2 en Java y la traza <C>tracert</C> de Windows modelada como un
            grafo dirigido — todo con salida real de ejecución.
          </p>

          <div className="mt-8 grid gap-5 rounded-2xl border border-line/60 bg-panel/20 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <Dato etiqueta="Estudiante" valor="Keyner García" />
            <Dato etiqueta="Docente" valor="Jeison Mauricio Delgado González" />
            <Dato etiqueta="Asignatura" valor="Estructuras de Datos" />
            <Dato etiqueta="Programa" valor="Ingeniería de Software · UDES" />
            <Dato etiqueta="Clase" valor="10" />
            <Dato etiqueta="Fecha" valor="2026-11-05" />
            <Dato etiqueta="Lenguaje" valor="Java (JDK 17)" />
            <Dato etiqueta="Contenido" valor="Grafos · BFS · DFS" />
          </div>

          <div className="mt-6 rounded-2xl border border-line/60 bg-panel/20 p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-blueLight">
              Objetivos del taller
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate">
              {OBJETIVOS.map((o, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 font-mono text-cyan">0{i + 1}</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          <IndiceNav items={INDICE} />

          {/* ---------------------------------------------------- Simulador */}
          <Seccion id="simulador" numero="★" titulo="Visualizador interactivo de grafos">
            <p className="mt-4 max-w-2xl leading-relaxed text-slate">
              Los cuatro grafos del taller — red de campus (BFS), red social (DFS),
              transferencias dirigidas y la traza real de <C>tracert</C> — con recorrido paso a
              paso, estado de la cola/pila, lista y matriz de adyacencia, grados y consulta de
              conexión directa.
            </p>
            <GrafoVisualizer />
          </Seccion>

          {/* ------------------------------------------------------ Teoría */}
          <Seccion id="teoria" numero="1" titulo="Marco teórico y conceptual">
            <Titulo>1.1 · Definición formal: un grafo G = (V, E)</Titulo>
            <p className="mt-3 leading-relaxed text-slate">
              Un <strong className="text-paper">grafo</strong> G = (V, E) es una estructura
              compuesta por dos conjuntos: <strong className="text-paper">V</strong> (vértices,
              también llamados nodos), un conjunto finito de elementos, y{' '}
              <strong className="text-paper">E</strong> (aristas), un conjunto de pares ordenados
              o no ordenados de vértices que conectan esos elementos. En la red de campus del
              ejemplo guía: V = {'{'}Rectoría, Ingeniería, Biblioteca, Laboratorios, Auditorio,
              Cafetería{'}'} y E = {'{'}(Rectoría, Ingeniería), (Rectoría, Biblioteca), …{'}'}
              con 6 vértices y 6 aristas.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <MiniGrafo tipo="simple" leyenda="No dirigido" />
              <MiniGrafo tipo="dirigido" leyenda="Dirigido (digrafo)" />
              <MiniGrafo tipo="ponderado" leyenda="Ponderado" />
            </div>

            <Titulo>1.2 · Grafo dirigido (digrafo) vs. no dirigido</Titulo>
            <p className="mt-3 leading-relaxed text-slate">
              En un <strong className="text-paper">grafo no dirigido</strong> la arista (u, v) es
              simétrica: si u está conectado con v, entonces v también está conectado con u (ambos
              sentidos existen). En un <strong className="text-paper">digrafo</strong> la arista
              tiene dirección: (u, v) significa que existe una conexión <em>saliente</em> de u
              hacia v y <em>no</em> necesariamente la inversa. Por eso, en el ejercicio 3.2, si
              Laura le transfiere a Andrés existe Laura → Andrés, pero no existe Andrés → Laura
              salvo que se registre expresamente.
            </p>

            <Titulo>1.3 · Grafo ponderado</Titulo>
            <p className="mt-3 leading-relaxed text-slate">
              Un grafo es <strong className="text-paper">ponderado</strong> cuando cada arista
              lleva un peso: un valor numérico que representa distancia, costo, tiempo, ancho de
              banda o probabilidad. Los pesos se usan para resolver problemas de caminos mínimos
              (Dijkstra), árboles recubridores mínimos (Kruskal/Prim) o flujos de red. Los
              grafos de este taller no usan pesos —se muestra su notación en el diagrama—; sus
              aristas solo expresan conexión.
            </p>

            <Titulo>1.4 · Lista de adyacencia vs. matriz de adyacencia</Titulo>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-line/60 bg-panel/30 p-4">
                <p className="font-mono text-[11px] uppercase tracking-widest text-cyan">
                  Lista — HashMap&lt;String, List&lt;String&gt;&gt;
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  Cada vértice guarda la lista de sus adyacentes. Ocupa <C>O(V + E)</C> de
                  memoria, recorrer los vecinos de u cuesta <C>O(grado(u))</C> y es ideal para
                  grafos <em>dispersos</em> (donde E ≪ V²). Es la representación usada por los
                  cuatro códigos Java de este taller.
                </p>
              </div>
              <div className="rounded-xl border border-line/60 bg-panel/30 p-4">
                <p className="font-mono text-[11px] uppercase tracking-widest text-cyan">
                  Matriz — int[][]
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  Un arreglo de V × V donde la celda [i][j] vale 1 si existe la arista (0 si no;
                  en digrafos la fila es el origen y la columna el destino). Comprobar una arista
                  es <C>O(1)</C> y la memoria es <C>O(V²)</C> aunque el grafo tenga pocas aristas:
                  conveniente para grafos <em>densos</em> (E ≈ V²).
                </p>
              </div>
            </div>

            <Titulo>1.5 · Tabla comparativa de complejidad espacial y temporal</Titulo>
            <Tabla
              columnas={['Operación', 'Lista de adyacencia', 'Matriz de adyacencia']}
              filas={[
                ['Comprobar si existe la arista (u, v)', 'O(grado(u))', 'O(1)'],
                ['Recorrer los vecinos de u', 'O(grado(u))', 'O(V)'],
                ['Añadir un vértice', 'O(1)', 'O(V²): hay que rehacer la matriz'],
                ['Añadir una arista', 'O(1) promedio', 'O(1)'],
                ['Eliminar una arista', 'O(grado(u))', 'O(1)'],
                ['Complejidad espacial (memoria)', 'O(V + E)', 'O(V²)'],
                ['Ideal para', 'Grafos dispersos (E cercano a V)', 'Grafos densos (E cercano a V²)'],
              ]}
            />
            <p className="mt-3 text-sm leading-relaxed text-slate">
              Complejidad de los recorridos: BFS y DFS visitan cada vértice una sola vez y
              revisan cada arista una (o dos) veces, es decir <C>O(V + E)</C> en ambas
              representaciones; con la matriz, listar los vecinos obliga a revisar las V columnas
              de cada fila.
            </p>

            <Titulo>1.6 · BFS (recorrido en anchura)</Titulo>
            <p className="mt-3 leading-relaxed text-slate">
              BFS explora el grafo <strong className="text-paper">por niveles</strong>: visita
              primero todos los vértices a distancia 1 del origen, luego los de distancia 2, y
              así sucesivamente. Utiliza una <strong className="text-paper">cola (Queue)</strong>{' '}
              porque su política FIFO garantiza que los descubiertos antes se analicen antes
              (eso es exactamente lo que produce el recorrido por niveles) y un{' '}
              <strong className="text-paper">conjunto de visitados (HashSet)</strong> para no
              reencolar vértices ya descubiertos —evitando ciclos en grafos con aristas de
              regreso— y para registrar cada vértice una única vez.
            </p>
            <Pseudocodigo
              texto={`BFS(inicio):
  visitados.add(inicio);  cola.add(inicio)
  mientras (cola no vacía):
    v = cola.poll()
    para cada vecino w de v:
      si w no está en visitados:
        visitados.add(w);  cola.add(w)`}
            />

            <Titulo>1.7 · DFS (recorrido en profundidad) y su diferencia con BFS</Titulo>
            <p className="mt-3 leading-relaxed text-slate">
              DFS desciende por cada rama hasta que no queda camino sin visitar y luego{' '}
              <em>retrocede</em>: utiliza una <strong className="text-paper">pila (Stack)</strong>{' '}
              o bien la propia <strong className="text-paper">pila de llamadas</strong> mediante
              recursión, más un <C>Set&lt;String&gt;</C> de visitados. La diferencia principal
              con BFS: BFS usa cola y recorre por niveles (amplitud), mientras DFS usa pila y
              recorre por ramas (profundidad); BFS garantiza el camino más corto en número de
              aristas desde el origen y DFS no, pero DFS es útil para detección de ciclos,
              ordenamiento topológico y componentes conexos.
            </p>
            <Pseudocodigo
              texto={`DFS(inicio):
  pila.push(inicio)
  mientras (pila no vacía):
    v = pila.pop()
    si v ya fue visitado: continuar
    visitados.add(v);  recorrido.add(v)
    para cada vecino w de v (en orden inverso):
      si w no está en visitados: pila.push(w)`}
            />
          </Seccion>

          {/* ------------------------------------------------- Ejemplo guía */}
          <Seccion id="ejemplo-guia" numero="2" titulo="Análisis del ejemplo guía (Parte 2)">
            <p className="mt-4 leading-relaxed text-slate">
              El código provisto (<C>Grafos.java</C>, clases <C>GrafoRed</C> y{' '}
              <C>MainGrafo</C>) se analiza según los tres puntos del Word:
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate">
              <li>
                <strong className="text-paper">Representación:</strong> construye una red no
                dirigida de campus universitario donde cada vértice (Rectoría, Ingeniería,
                Biblioteca, …) se asocia a una lista de nodos adyacentes usando{' '}
                <C>HashMap&lt;String, List&lt;String&gt;&gt;</C>.
              </li>
              <li>
                <strong className="text-paper">Construcción no dirigida:</strong> el método{' '}
                <C>agregarArista(origen, destino)</C> añade la conexión en ambos sentidos
                (origen → destino y destino → origen).
              </li>
              <li>
                <strong className="text-paper">Exploración BFS:</strong> explora por niveles
                desde el nodo raíz (Rectoría) utilizando una <C>Queue</C> para el orden de visita
                y un <C>HashSet</C> para evitar ciclos.
              </li>
            </ol>
            <CodigoConSalida
              archivo="codechef/Grafos.java"
              codigo={CODIGO_BASE}
              salida={SALIDA_BASE}
              etiquetaBoton="Copiar código (Java)"
            />
            <p className="mt-4 text-sm leading-relaxed text-slate">
              Nota: el orden de impresión de la estructura puede variar entre ejecuciones porque{' '}
              <C>HashMap</C> no garantiza orden; el recorrido BFS sí es determinista:{' '}
              <C>Rectoría → Ingeniería → Biblioteca → Laboratorios → Auditorio → Cafetería</C>{' '}
              (6 de 6 vértices).
            </p>
            <p className="mt-3 font-mono text-xs text-slate">
              Ejecución local: <span className="text-cyan">javac Grafos.java</span> ·{' '}
              <span className="text-cyan">java MainGrafo</span>
            </p>
          </Seccion>

          {/* ---------------------------------------------- Ejercicio 3.1 */}
          <Seccion id="ejercicio-3-1" numero="3" titulo="Ejercicio 3.1 · Grafo con recorrido en profundidad (DFS)">
            <p className="mt-4 leading-relaxed text-slate">
              Contexto: red social de amistades (7 personas y 9 relaciones).
            </p>
            <Enunciado>
              <ul className="mt-1 list-disc space-y-1.5 pl-5">
                <li>
                  Tomar como base la clase <C>GrafoRed</C> o crear una nueva clase{' '}
                  <C>GrafoDFS</C>.
                </li>
                <li>
                  Implementar el método de recorrido <C>recorrerDFS(String inicio)</C>{' '}
                  utilizando una Pila (Stack) o Recursión apoyado de un Set&lt;String&gt; de
                  visitados.
                </li>
                <li>Crear una red de al menos 7 vértices y 8 aristas.</li>
                <li>
                  Mostrar en pantalla la estructura del grafo y la secuencia exacta de nodos
                  visitados en el recorrido DFS desde un nodo inicial dado.
                </li>
              </ul>
            </Enunciado>

            <CodigoConSalida archivo="codechef/10_GrafoDFS.java" codigo={CODIGO_DFS} salida={SALIDA_DFS} />

            <Titulo>Comprobación de requisitos</Titulo>
            <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-slate">
              <li>
                ✓ Nueva clase <C>GrafoDFS</C> con lista de adyacencia no dirigida.
              </li>
              <li>
                ✓ <C>recorrerDFS(String inicio)</C> usa <C>Stack&lt;String&gt;</C> +{' '}
                <C>HashSet&lt;String&gt;</C> (sin recursión) y devuelve la secuencia.
              </li>
              <li>✓ Red con 7 vértices (Ana … Gabriela) y 9 aristas (≥ 8).</li>
              <li>✓ Imprime la estructura completa (lista de adyacencia de cada nodo).</li>
              <li>
                ✓ Secuencia exacta desde Ana:{' '}
                <C> Ana → Bruno → Diego → Carla → Elena → Fabián → Gabriela</C> (7 de 7
                vértices).
              </li>
            </ul>
          </Seccion>

          {/* ---------------------------------------------- Ejercicio 3.2 */}
          <Seccion id="ejercicio-3-2" numero="4" titulo="Ejercicio 3.2 · Grafo dirigido con verificación de conexión directa">
            <p className="mt-4 leading-relaxed text-slate">
              Contexto: red de transferencias de dinero entre 6 cuentas.
            </p>
            <Enunciado>
              <ul className="mt-1 list-disc space-y-1.5 pl-5">
                <li>
                  Implementar la clase <C>GrafoDirigido</C> donde el método{' '}
                  <C>agregarArista(origen, destino)</C> solo agregue la dirección de origen hacia
                  destino (no bidireccional).
                </li>
                <li>
                  Crear un método <C>boolean existeCaminoDirecto(String origen, String destino)</C>{' '}
                  que determine en tiempo O(1) o O(vecinos) si existe una conexión saliente
                  directa desde origen hacia destino.
                </li>
                <li>
                  Probar el programa con al menos 6 usuarios/cuentas, realizando 2 consultas: una
                  donde SÍ exista camino directo y otra donde NO exista.
                </li>
              </ul>
            </Enunciado>

            <CodigoConSalida archivo="codechef/11_GrafoDirigido.java" codigo={CODIGO_DIRIGIDO} salida={SALIDA_DIRIGIDO} />

            <Titulo>Comprobación de requisitos</Titulo>
            <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-slate">
              <li>
                ✓ <C>GrafoDirigido.agregarArista()</C> solo registra la arista de salida: 7
                transferencias dirigidas entre 6 cuentas.
              </li>
              <li>
                ✓ <C>existeCaminoDirecto()</C> recorre únicamente la lista de salida del origen:{' '}
                <C>O(vecinos)</C> (con <C>HashSet</C> sería O(1) promedio) y devuelve{' '}
                <C>false</C> sin excepciones si el origen no existe — sin{' '}
                <C>NullPointerException</C>.
              </li>
              <li>
                ✓ Consulta con camino: <C>Laura → Andrés = true</C>.
              </li>
              <li>
                ✓ Consulta sin camino: <C>Sofía → Laura = false</C> (Sofía solo transfiere a
                Miguel, aunque Miguel sí le transfiera a Laura: la inversa no existe).
              </li>
            </ul>
          </Seccion>

          {/* ---------------------------------------------------- tracert */}
          <Seccion id="tracert" numero="5" titulo="Traza de red con tracert (CMD de Windows)">
            <Enunciado>
              «Utilizando el CMD en Windows (Windows + R, escribiendo CMD), realice una traza
              desde su equipo hasta una URL de su gusto, por ejemplo{' '}
              <C>tracert www.google.com</C>; esta instrucción construye un grafo dirigido
              calculando en cada paso cuál es el mejor de los caminos; simule este resultado para
              que me muestre un grafo desde su ubicación hasta Google.»
            </Enunciado>

            <p className="mt-4 leading-relaxed text-slate">
              Traza <strong className="text-paper">real</strong> ejecutada en este equipo:
              5 saltos hasta Google (el salto 3 no respondió, se registra como{' '}
              <C>*</C>):
            </p>
            <div className="mt-3 rounded-xl border border-cyan/30 bg-navy p-4 shadow-lg shadow-navy/40">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate">
                Salida real del CMD · tracert -d -h 12 -w 800 www.google.com
              </p>
              <pre className="overflow-x-auto font-mono text-[12px] leading-relaxed text-cyan">
                {SALIDA_TRACERT_CMD}
              </pre>
            </div>

            <p className="mt-5 leading-relaxed text-slate">
              Modelada como grafo dirigido: cada salto es una arista y cada dirección un vértice
              (7 vértices, 6 aristas dirigidas). El programa la construye con{' '}
              <C>LinkedHashMap</C> para conservar el orden de la traza:
            </p>
            <CodigoConSalida archivo="codechef/12_TracertGrafo.java" codigo={CODIGO_TRACERT} salida={SALIDA_TRACERT} />
            <p className="mt-4 text-sm leading-relaxed text-slate">
              El vértice final <C>www.google.com</C> no tiene aristas salientes: es el destino
              de la traza. En el visualizador puedes seleccionar «Traza tracert hasta Google» y
              consultar, por ejemplo, que <C>72.14.213.234 → 142.251.154.119</C> existe pero la
              dirección inversa no.
            </p>
          </Seccion>

          {/* -------------------------------------------------- Evidencias */}
          <Seccion id="evidencias" numero="6" titulo="Evidencias y ficha del trabajo">
            <p className="mt-4 leading-relaxed text-slate">
              Este taller está vinculado al panel administrativo del portafolio: las capturas de
              ejecución, el diagrama y el documento Word que se adjunten desde «Editar trabajo»
              aparecen aquí automáticamente.
            </p>
            {ficha ? (
              <div className="mt-5 space-y-6">
                <div className="grid gap-5 rounded-2xl border border-line/60 bg-panel/20 p-6 sm:grid-cols-2 lg:grid-cols-4">
                  <Dato etiqueta="Nº de clase" valor={String(ficha.numeroClase ?? '—').padStart(2, '0')} />
                  <Dato etiqueta="Fecha" valor={ficha.fecha || '—'} />
                  <Dato etiqueta="Título en el portafolio" valor={ficha.titulo || '—'} />
                  <Dato etiqueta="Adjuntos" valor={adjuntos ? 'sí' : 'ninguno aún'} />
                </div>
                {ficha.descripcion && (
                  <p className="leading-relaxed text-slate">{ficha.descripcion}</p>
                )}
                {ficha.umlUrl && (
                  <figure className="rounded-2xl border border-line/60 bg-panel/30 p-4">
                    <img src={ficha.umlUrl} alt="Diagrama del taller de Grafos" className="w-full rounded-xl" />
                    <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-widest text-slate">
                      Diagrama adjunto desde el panel
                    </figcaption>
                  </figure>
                )}
                {ficha.salidaImagenUrl && (
                  <figure className="rounded-2xl border border-line/60 bg-panel/30 p-4">
                    <img src={ficha.salidaImagenUrl} alt="Captura de ejecución del taller de Grafos" className="w-full rounded-xl" />
                    <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-widest text-slate">
                      Captura de ejecución (IDE / terminal)
                    </figcaption>
                  </figure>
                )}
                {ficha.documentoUrl && (
                  <div>
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-cyan">
                      Documento Word del taller
                    </p>
                    <WordPreview url={ficha.documentoUrl} />
                  </div>
                )}
                {!adjuntos && (
                  <p className="rounded-xl border border-dashed border-line/60 p-4 text-sm text-slate">
                    Aún no hay capturas adjuntas. Sube la captura del IDE ejecutando los tres
                    programas desde el panel administrativo (campo «captura de salida»).
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-5 rounded-xl border border-dashed border-line/60 p-4 text-sm leading-relaxed text-slate">
                La ficha administrativa de este taller aparecerá aquí cuando se registre en el
                panel con «Página especial → Taller de Grafos». Si la página está sin conexión a
                Firestore, este bloque queda vacío sin afectar el resto del contenido.
              </p>
            )}
          </Seccion>

          {/* ----------------------------------------------- Conclusiones */}
          <Seccion id="conclusiones" numero="7" titulo="Conclusiones">
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate">
              <li>
                Un grafo G = (V, E) modela redes reales: la elección entre lista de adyacencia{' '}
                <C>O(V + E)</C> y matriz <C>O(V²)</C> depende de la densidad; los cuatro
                programas de este taller usan la lista con <C>HashMap&lt;String,
                List&lt;String&gt;&gt;</C> porque sus grafos son dispersos.
              </li>
              <li>
                BFS (cola) recorre por niveles y DFS (pila o recursión) por profundidad; ambos
                corren en <C>O(V + E)</C> y usan un conjunto de visitados para no repetir vértices
                ni entrar en ciclos.
              </li>
              <li>
                En un digrafo la dirección importa: <C>existeCaminoDirecto()</C> solo consulta la
                lista de salida del origen (<C>O(vecinos)</C>), por lo que Laura → Andrés existe
                aunque Sofía → Laura no.
              </li>
              <li>
                La traza <C>tracert</C> es un grafo dirigido en vivo: cada salto es una arista;
                simularla conectó la teoría con la red real de este equipo (5 saltos, 1 salto sin
                respuesta).
              </li>
              <li>
                Los cuatro programas (ejemplo guía, 3.1, 3.2 y tracert) compilan y ejecutan con
                JDK 17; sus salidas reales están documentadas en esta página.
              </li>
            </ol>
          </Seccion>

          {/* ------------------------------------------------ Referencias */}
          <Seccion id="referencias" numero="8" titulo="Referencias bibliográficas">
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate">
              <li className="border-l-2 border-blue/50 pl-4">
                Cormen, T. H., Leiserson, C. E., Rivest, R. L., &amp; Stein, C. (2009).{' '}
                <em>Introduction to Algorithms</em> (3.ª ed.). MIT Press. (cap. 22: grafos, BFS y
                DFS).
              </li>
              <li className="border-l-2 border-blue/50 pl-4">
                Sedgewick, R., &amp; Wayne, K. (2011). <em>Algorithms</em> (4.ª ed.).
                Addison-Wesley. (representaciones y recorridos de grafos).
              </li>
              <li className="border-l-2 border-blue/50 pl-4">
                Oracle. (s. f.). <em>HashMap (Java Platform SE)</em>. Java Documentation.{' '}
                <a
                  href="https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/HashMap.html"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blueLight hover:underline"
                >
                  docs.oracle.com
                </a>
              </li>
              <li className="border-l-2 border-blue/50 pl-4">
                Microsoft. (s. f.). <em>tracert — trace route network utility (Windows)</em>.{' '}
                <a
                  href="https://learn.microsoft.com/windows-server/administration/windows-commands/tracert"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blueLight hover:underline"
                >
                  learn.microsoft.com
                </a>
              </li>
              <li className="border-l-2 border-blue/50 pl-4">
                Delgado González, J. M. (s. f.). <em>Taller práctico: Grafos</em>. Universidad de
                Santander – UDES. Material de clase proporcionado.
              </li>
            </ul>
          </Seccion>

          <p className="mt-16 border-t border-line/60 pt-6 font-mono text-xs text-slate">
            Taller práctico · Estructuras de Datos · Universidad de Santander – UDES · Keyner
            García
          </p>
        </motion.div>
      </article>
    </Layout>
  )
}
