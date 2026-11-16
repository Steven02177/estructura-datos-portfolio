import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import CodigoConSalida from '../components/CodigoConSalida.jsx'
import HashVisualizer from '../components/HashVisualizer.jsx'
import WordPreview from '../components/WordPreview.jsx'
import { C, Dato, Enunciado, Titulo, Tabla, Seccion, IndiceNav } from '../components/Contenido.jsx'
import { obtenerTrabajos } from '../firebase.js'
import {
  CODIGO_GUIA_MAP,
  SALIDA_GUIA_MAP,
  CODIGO_GUIA_SET,
  SALIDA_GUIA_SET,
  CODIGO_HASHMAP,
  SALIDA_HASHMAP,
  CODIGO_HASHSET,
  SALIDA_HASHSET,
} from '../data/tallerHash.js'

// ---------------------------------------------------------------------------
// Índice del taller (secciones del Word del profesor)
// ---------------------------------------------------------------------------
const INDICE = [
  { id: 'simulador', n: '★', titulo: 'Simulador de tabla hash' },
  { id: 'teoria', n: '1', titulo: 'Marco teórico' },
  { id: 'comparativa', n: '2', titulo: 'Cuadro comparativo' },
  { id: 'ejemplos', n: '3', titulo: 'Ejemplos guía' },
  { id: 'ejercicio-3-1', n: '4', titulo: 'Ejercicio 3.1 · HashMap' },
  { id: 'ejercicio-3-2', n: '5', titulo: 'Ejercicio 3.2 · HashSet' },
  { id: 'evidencias', n: '6', titulo: 'Evidencias' },
  { id: 'conclusiones', n: '7', titulo: 'Conclusiones' },
  { id: 'referencias', n: '8', titulo: 'Referencias' },
]

const OBJETIVOS = [
  'Comprender y diferenciar formalmente el funcionamiento, uso y rendimiento de las estructuras HashMap y HashSet en Java.',
  'Identificar ventajas, desventajas y escenarios reales de aplicación de cada estructura de datos.',
  'Desarrollar ejercicios prácticos en Java que modelen problemas reales mediante el uso de pares Llave-Valor y colecciones de elementos únicos.',
  'Documentar los resultados técnicos mediante una interfaz web interactiva.',
]

// ---------------------------------------------------------------------------
// Diagrama del flujo llave → hash → índice → bucket
// ---------------------------------------------------------------------------
function DiagramaFlujoHash() {
  const cajas = [
    { x: 8, w: 150, t1: 'LLAVE', t2: '"UDES001"' },
    { x: 205, w: 150, t1: 'hashCode()', t2: 'h = 31·h + c' },
    { x: 402, w: 105, t1: 'ÍNDICE', t2: 'h & 15' },
    { x: 540, w: 92, t1: 'BUCKET', t2: 'tabla[7]' },
  ]
  return (
    <svg
      viewBox="0 0 640 112"
      className="mt-4 w-full"
      role="img"
      aria-label="Flujo de una operación hash: llave, hashCode, índice y bucket"
    >
      <defs>
        <marker id="flechaHash" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#3B82F6" />
        </marker>
      </defs>
      {cajas.map((b) => (
        <g key={b.t1}>
          <rect x={b.x} y={24} width={b.w} height={56} rx={10} fill="#0F1729" stroke="#233047" />
          <text x={b.x + b.w / 2} y={45} textAnchor="middle" className="font-mono" fontSize="10" fill="#94A3B8">
            {b.t1}
          </text>
          <text x={b.x + b.w / 2} y={66} textAnchor="middle" className="font-mono" fontSize="12" fill="#22D3EE">
            {b.t2}
          </text>
        </g>
      ))}
      <line x1={160} y1={52} x2={203} y2={52} stroke="#3B82F6" strokeWidth="1.5" markerEnd="url(#flechaHash)" />
      <line x1={357} y1={52} x2={400} y2={52} stroke="#3B82F6" strokeWidth="1.5" markerEnd="url(#flechaHash)" />
      <line x1={509} y1={52} x2={538} y2={52} stroke="#3B82F6" strokeWidth="1.5" markerEnd="url(#flechaHash)" />
      <text x={320} y={102} textAnchor="middle" className="font-mono" fontSize="10" fill="#94A3B8">
        Java 8: índice = (h ^ (h &gt;&gt;&gt; 16)) &amp; (capacidad − 1)
      </text>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Página del Taller: HashMap vs HashSet
// ---------------------------------------------------------------------------
export default function TallerHash() {
  // Ficha administrativa: si el panel creó un trabajo con paginaEspecial = 'hash',
  // sus capturas/Word/descripción editados se muestran en la sección de evidencias.
  const [ficha, setFicha] = useState(null)
  useEffect(() => {
    let vivo = true
    obtenerTrabajos()
      .then((ts) => {
        if (vivo) setFicha(ts.find((t) => t.paginaEspecial === 'hash') || null)
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
            Taller · Clase 09 · Estructuras de datos
          </p>
          <h1 className="mt-2 text-balance font-display text-3xl font-semibold text-paper md:text-4xl">
            Estructuras de datos basadas en Hash: HashMap vs HashSet
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate">
            Marco teórico de las tablas hash (función hash, buckets, colisiones y el contrato{' '}
            <C>equals()</C>/<C>hashCode()</C>), análisis de los dos códigos guía del profesor y
            desarrollo completo de los ejercicios 3.1 y 3.2 en Java con su salida real de
            ejecución.
          </p>

          <div className="mt-8 grid gap-5 rounded-2xl border border-line/60 bg-panel/20 p-6 sm:grid-cols-2 lg:grid-cols-4">
            <Dato etiqueta="Estudiante" valor="Keyner García" />
            <Dato etiqueta="Docente" valor="Jeison Mauricio Delgado González" />
            <Dato etiqueta="Asignatura" valor="Estructuras de Datos" />
            <Dato etiqueta="Programa" valor="Ingeniería de Software · UDES" />
            <Dato etiqueta="Clase" valor="09" />
            <Dato etiqueta="Fecha" valor="2026-11-05" />
            <Dato etiqueta="Lenguaje" valor="Java (JDK 17)" />
            <Dato etiqueta="Estructuras" valor="HashMap · HashSet" />
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
          <Seccion id="simulador" numero="★" titulo="Simulador de tabla hash">
            <p className="mt-4 max-w-2xl leading-relaxed text-slate">
              Inserta llaves reales y observa cómo Java calcula su <C>hashCode()</C>, en qué
              bucket caen, cómo se encadenan las colisiones y por qué <C>add()</C> rechaza los
              duplicados en el modo <C>HashSet</C>. El índice se calcula exactamente igual que en
              Java 8.
            </p>
            <HashVisualizer />
          </Seccion>

          {/* ------------------------------------------------------ Teoría */}
          <Seccion id="teoria" numero="1" titulo="Marco teórico y conceptual">
            <Titulo>1.1 · Función hash y buckets</Titulo>
            <p className="mt-3 leading-relaxed text-slate">
              Una <strong className="text-paper">función hash</strong> es una transformación que
              recibe una llave (una cadena, un objeto) y devuelve un entero: el{' '}
              <strong className="text-paper">código hash</strong>. En Java esa función es el
              método <C>hashCode()</C>. La tabla hash usa ese entero para calcular la posición
              dentro de un arreglo de casillas llamado <strong className="text-paper">tabla de
              buckets</strong>; cada casilla es un <strong className="text-paper">bucket</strong>.
              Como distintas llaves pueden producir el mismo índice (una <em>colisión</em>), la
              estructura usa además <C>equals()</C> para comprobar si dos elementos representan
              la misma llave.
            </p>
            <DiagramaFlujoHash />

            <Titulo>1.2 · Definición formal de HashMap y HashSet</Titulo>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-line/60 bg-panel/30 p-4">
                <p className="font-mono text-[11px] uppercase tracking-widest text-cyan">
                  HashMap
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  Implementación de la interfaz <C>Map&lt;K, V&gt;</C> respaldada por una tabla
                  hash: almacena asociaciones <strong className="text-paper">llave-valor</strong>:
                  cada llave es única y permite recuperar su valor con <C>get()</C>. Admite una
                  llave <C>null</C>, no garantiza orden y, al insertar una llave existente con{' '}
                  <C>put()</C>, reemplaza el valor anterior sin aumentar <C>size()</C>.
                </p>
              </div>
              <div className="rounded-xl border border-line/60 bg-panel/30 p-4">
                <p className="font-mono text-[11px] uppercase tracking-widest text-cyan">
                  HashSet
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate">
                  Implementación de la interfaz <C>Set&lt;E&gt;</C> que almacena{' '}
                  <strong className="text-paper">elementos únicos</strong> sin llave visible. No
                  permite duplicados, no garantiza orden y internamente utiliza un{' '}
                  <C>HashMap</C> para gestionar sus elementos: <C>add()</C> devuelve{' '}
                  <C>true</C> si el elemento se insertó y <C>false</C> si ya existía uno igual.
                </p>
              </div>
            </div>

            <Titulo>1.3 · Complejidad temporal: ¿por qué O(1)?</Titulo>
            <p className="mt-3 leading-relaxed text-slate">
              El acceso, la inserción y la búsqueda son <strong className="text-paper">
              O(1) promedio</strong> porque la función hash calcula directamente el bucket donde
              debería estar la llave o el elemento: no hay que recorrer la colección. Las
              operaciones <C>put()</C>, <C>get()</C>, <C>containsKey()</C>, <C>add()</C> y{' '}
              <C>contains()</C> requieren un número aproximadamente constante de pasos. Ese{' '}
              <C>O(1)</C> es un valor <em>esperado</em>, no una garantía absoluta para cualquier
              entrada.
            </p>

            <Titulo>1.4 · Colisiones: degradación a O(n) y cómo la previene Java</Titulo>
            <p className="mt-3 leading-relaxed text-slate">
              Una <strong className="text-paper">colisión</strong> ocurre cuando dos llaves
              distintas producen el mismo índice. En Java las colisiones se resuelven con{' '}
              <em>separate chaining</em>: cada bucket mantiene una lista enlazada (y, desde Java
              8, un árbol rojo-negro) de los elementos que caen ahí. Si muchas llaves terminan en
              el mismo bucket, la búsqueda puede degradarse hasta <C>O(n)</C>. Las versiones
              modernas de Java lo previenen: cuando un bucket acumula 8 nodos y la tabla tiene
              capacidad ≥ 64, la lista se transforma en un árbol balanceado y la búsqueda en ese
              bucket pasa a <C>O(log n)</C>; además, la tabla se redimensiona (duplica su
              capacidad) al superar el factor de carga 0.75. Un <C>hashCode()</C> bien
              distribuido completa esta prevención.
            </p>

            <Titulo>1.5 · Contrato equals() y hashCode()</Titulo>
            <p className="mt-3 leading-relaxed text-slate">
              En un <C>HashSet</C>, <C>hashCode()</C> ubica al objeto en su bucket y{' '}
              <C>equals()</C> decide si dentro de ese bucket ya existe uno equivalente. El contrato
              de Java exige que si dos objetos son iguales según <C>equals()</C>, entonces deben
              producir el mismo <C>hashCode()</C>. Si no se sobrescriben ambos métodos en una
              clase personalizada (por ejemplo, <C>Estudiante</C>), Java usa la identidad del
              objeto (<C>==</C>): dos instancias con la misma matrícula se considerarían distintas
              y el conjunto aceptaría <strong className="text-paper">duplicados lógicos</strong>.
              Por eso ambos métodos deben basarse en los mismos atributos que definen la
              identidad lógica (correo, matrícula, cédula).
            </p>
          </Seccion>

          {/* ------------------------------------------------- Comparativa */}
          <Seccion id="comparativa" numero="2" titulo="Cuadro comparativo: HashMap vs HashSet">
            <p className="mt-4 leading-relaxed text-slate">
              Criterios para elegir una u otra estructura, destacando ventajas, desventajas y
              manejo de duplicados (requisito de la Parte 1 del Word):
            </p>
            <Tabla
              columnas={['Criterio', 'HashMap', 'HashSet']}
              filas={[
                ['Almacenamiento', 'Pares llave-valor', 'Elementos únicos'],
                [
                  'Duplicados',
                  'No admite llaves repetidas: al insertar una existente reemplaza su valor',
                  'No admite elementos duplicados',
                ],
                ['Consulta', 'Por llave con get() o containsKey()', 'Por elemento con contains()'],
                ['Inserción', 'put(llave, valor)', 'add(elemento)'],
                ['Orden', 'No garantiza orden', 'No garantiza orden'],
                [
                  'Rendimiento promedio',
                  'O(1) para put(), get() y containsKey()',
                  'O(1) para add(), remove() y contains()',
                ],
                [
                  'Ventaja principal',
                  'Recuperar información mediante un identificador',
                  'Mantener una colección sin repetidos',
                ],
                [
                  'Desventaja principal',
                  'Requiere definir una llave y un valor',
                  'No permite recuperar un valor asociado a una llave',
                ],
                [
                  'Uso recomendado',
                  'Inventarios, matrículas, códigos y registros consultables',
                  'Correos únicos, asistentes, etiquetas y permisos únicos',
                ],
              ]}
            />
            <div className="mt-4 rounded-xl border border-cyan/30 bg-cyan/5 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                Regla práctica
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate">
                Usa <C>HashMap</C> cuando necesites encontrar un valor mediante una llave
                (matrícula → estudiante). Usa <C>HashSet</C> cuando necesites conservar
                elementos sin repetir (correos registrados).
              </p>
            </div>
          </Seccion>

          {/* -------------------------------------------------- Ejemplos */}
          <Seccion id="ejemplos" numero="3" titulo="Análisis de los códigos guía">
            <Titulo>Caso 1 — HashMap: inventario de productos</Titulo>
            <p className="mt-3 leading-relaxed text-slate">
              El programa usa el código del producto como llave <C>String</C> y un objeto{' '}
              <C>Producto</C> como valor: <C>put()</C> inserta 20 registros,{' '}
              <C>containsKey()</C> verifica que el código exista, <C>get()</C> recupera el
              producto en tiempo constante y volver a ejecutar <C>put()</C> con una llave ya
              existente reemplaza el valor <em>sin aumentar</em> <C>size()</C>: por eso el
              inventario conserva la misma cantidad de llaves (20) tras la modificación. Nota: el
              rótulo impreso dice «Nuevo valor de PROD003» porque es el texto heredado del código
              guía; la operación en realidad se realiza sobre <C>PROD002</C>.
            </p>
            <CodigoConSalida
              archivo="scripts/fuentes/GuiaHashMap.java"
              codigo={CODIGO_GUIA_MAP}
              salida={SALIDA_GUIA_MAP}
              etiquetaBoton="Copiar código (Java)"
            />

            <Titulo>Caso 2 — HashSet: control de asistencia</Titulo>
            <p className="mt-3 leading-relaxed text-slate">
              El programa almacena objetos <C>Estudiante</C> en un <C>HashSet</C>. La clase
              sobrescribe <C>equals()</C> y <C>hashCode()</C> usando el código del estudiante,
              así que dos instancias con el mismo código se consideran iguales aunque sean
              objetos distintos: <C>contains()</C> localiza al estudiante por esa identidad
              lógica y <C>add()</C> devuelve <C>false</C> cuando se intenta registrar uno
              repetido (el tamaño permanece en 20).
            </p>
            <CodigoConSalida
              archivo="scripts/fuentes/GuiaHashSet.java"
              codigo={CODIGO_GUIA_SET}
              salida={SALIDA_GUIA_SET}
              etiquetaBoton="Copiar código (Java)"
            />
            <p className="mt-4 text-sm leading-relaxed text-slate">
              En ambos casos, <C>O(1)</C> es el rendimiento promedio esperado; no significa que
              cada operación tarde exactamente el mismo tiempo.
            </p>
          </Seccion>

          {/* ---------------------------------------------- Ejercicio 3.1 */}
          <Seccion id="ejercicio-3-1" numero="4" titulo="Ejercicio 3.1 · Sistema de calificaciones con HashMap">
            <p className="mt-4 leading-relaxed text-slate">
              Problema: almacenar estudiantes y sus calificaciones usando la matrícula
              institucional como llave única y el objeto <C>Estudiante</C> como valor.
            </p>
            <Enunciado>
              <ul className="mt-1 list-disc space-y-1.5 pl-5">
                <li>Crear una clase personalizada (ej. Usuario o Persona) con atributos relevantes.</li>
                <li>
                  Inicializar un <C>HashMap</C> donde la llave sea un identificador único (ej.
                  Cédula, DNI o Matrícula) y el valor sea el objeto creado.
                </li>
                <li>Insertar al menos 5 registros.</li>
                <li>Demostrar la consulta de un registro existente en O(1).</li>
                <li>Demostrar la actualización de uno de los registros (cambio de datos al sobrescribir la llave).</li>
                <li>Imprimir el tamaño total del mapa con .size().</li>
              </ul>
            </Enunciado>

            <CodigoConSalida
              archivo="codechef/9_MainHashMap.java"
              codigo={CODIGO_HASHMAP}
              salida={SALIDA_HASHMAP}
              etiquetaBoton="Copiar código (Java)"
            />

            <Titulo>Comprobación de requisitos</Titulo>
            <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-slate">
              <li>✓ Clase personalizada <C>Estudiante</C> (matrícula, nombre, nota) con getters/setters.</li>
              <li>✓ <C>HashMap&lt;String, Estudiante&gt;</C>: la matrícula es la llave y el objeto el valor.</li>
              <li>✓ Se insertan 5 registros (UDES001 … UDES005).</li>
              <li>✓ Consulta con <C>containsKey()</C> + <C>get()</C> sobre UDES003 en O(1).</li>
              <li>✓ Actualización: un nuevo <C>put()</C> sobre UDES003 reemplaza la nota (4.2 → 4.8).</li>
              <li>✓ <C>size()</C> imprime 5 antes y después de la actualización.</li>
            </ul>
            <p className="mt-3 font-mono text-xs text-slate">
              Ejecución local: <span className="text-cyan">javac 9_MainHashMap.java</span> ·{' '}
              <span className="text-cyan">java MainHashMap</span>
            </p>
          </Seccion>

          {/* ---------------------------------------------- Ejercicio 3.2 */}
          <Seccion id="ejercicio-3-2" numero="5" titulo="Ejercicio 3.2 · Registro de correos únicos con HashSet">
            <p className="mt-4 leading-relaxed text-slate">
              Problema: controlar el registro de asistentes de un evento mediante su correo
              electrónico, normalizado a minúsculas y sin espacios externos.
            </p>
            <Enunciado>
              <ul className="mt-1 list-disc space-y-1.5 pl-5">
                <li>
                  Crear una clase personalizada con sus correspondientes métodos{' '}
                  <C>equals()</C> y <C>hashCode()</C> implementados.
                </li>
                <li>
                  Inicializar un <C>HashSet</C> de esta colección.
                </li>
                <li>Insertar al menos 5 elementos distintos.</li>
                <li>Intentar insertar al menos 2 elementos duplicados (mismo identificador).</li>
                <li>
                  Demostrar que el <C>HashSet</C> rechazó los duplicados verificando el retorno
                  booleano del método <C>.add()</C> e imprimiendo el número real de elementos
                  únicos almacenados.
                </li>
              </ul>
            </Enunciado>

            <CodigoConSalida
              archivo="codechef/9_MainHashSet.java"
              codigo={CODIGO_HASHSET}
              salida={SALIDA_HASHSET}
              etiquetaBoton="Copiar código (Java)"
            />

            <Titulo>Comprobación de requisitos</Titulo>
            <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-slate">
              <li>
                ✓ Clase <C>RegistroCorreo</C> con <C>equals()</C> y <C>hashCode()</C> basados en
                el correo normalizado (<C>Objects.equals</C> / <C>Objects.hash</C>).
              </li>
              <li>✓ <C>HashSet&lt;RegistroCorreo&gt;</C> inicializado vacío.</li>
              <li>✓ Se insertan 5 asistentes distintos.</li>
              <li>
                ✓ Se intentan 2 duplicados con el mismo identificador:{' '}
                <C>"LAURA@gmail.com"</C> (misma llave que <C>laura@gmail.com</C> por la
                normalización) y <C>"camila@gmail.com"</C>.
              </li>
              <li>
                ✓ Ambos <C>add()</C> devuelven <C>false</C> y <C>size()</C> imprime 5 (número
                real de únicos).
              </li>
            </ul>
            <p className="mt-3 font-mono text-xs text-slate">
              Ejecución local: <span className="text-cyan">javac 9_MainHashSet.java</span> ·{' '}
              <span className="text-cyan">java MainHashSet</span>
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
                    <img src={ficha.umlUrl} alt="Diagrama del taller Hash" className="w-full rounded-xl" />
                    <figcaption className="mt-2 font-mono text-[10px] uppercase tracking-widest text-slate">
                      Diagrama adjunto desde el panel
                    </figcaption>
                  </figure>
                )}
                {ficha.salidaImagenUrl && (
                  <figure className="rounded-2xl border border-line/60 bg-panel/30 p-4">
                    <img src={ficha.salidaImagenUrl} alt="Captura de ejecución del taller Hash" className="w-full rounded-xl" />
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
                    Aún no hay capturas adjuntas. Sube la captura del IDE ejecutando{' '}
                    <C>MainHashMap</C>/<C>MainHashSet</C> desde el panel administrativo
                    (campo «captura de salida»).
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-5 rounded-xl border border-dashed border-line/60 p-4 text-sm leading-relaxed text-slate">
                La ficha administrativa de este taller aparecerá aquí cuando se registre en el
                panel con «Página especial → Taller Hash». Si la página está sin conexión a
                Firestore, este bloque queda vacío sin afectar el resto del contenido.
              </p>
            )}
          </Seccion>

          {/* ----------------------------------------------- Conclusiones */}
          <Seccion id="conclusiones" numero="7" titulo="Conclusiones">
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate">
              <li>
                HashMap y HashSet permiten operaciones eficientes gracias a la función hash y a
                la tabla de buckets: acceso, inserción y búsqueda en O(1) promedio.
              </li>
              <li>
                HashMap es apropiado para almacenar información mediante pares llave-valor;
                HashSet es adecuado para administrar colecciones de elementos únicos.
              </li>
              <li>
                El rendimiento promedio O(1) depende de una distribución adecuada de los códigos
                hash: las colisiones pueden degradarlo, pero el redimensionamiento y la
                conversión a árbol (rojo-negro) de Java 8 lo mitiguen.
              </li>
              <li>
                En clases personalizadas, equals() y hashCode() deben implementarse coherentemente
                sobre los mismos atributos para evitar duplicados lógicos.
              </li>
              <li>
                Los ejercicios demostraron la consulta y actualización por matrícula con HashMap
                (size() estable en 5) y el rechazo de dos correos repetidos con HashSet (add()
                devolvió false y size() permaneció en 5).
              </li>
            </ol>
          </Seccion>

          {/* ------------------------------------------------ Referencias */}
          <Seccion id="referencias" numero="8" titulo="Referencias bibliográficas">
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate">
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
                Oracle. (s. f.). <em>HashSet (Java Platform SE)</em>. Java Documentation.{' '}
                <a
                  href="https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/HashSet.html"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blueLight hover:underline"
                >
                  docs.oracle.com
                </a>
              </li>
              <li className="border-l-2 border-blue/50 pl-4">
                Oracle. (s. f.). <em>Object (Java Platform SE): equals() y hashCode()</em>.
                Contrato de Object.{' '}
                <a
                  href="https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Object.html"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blueLight hover:underline"
                >
                  docs.oracle.com
                </a>
              </li>
              <li className="border-l-2 border-blue/50 pl-4">
                Delgado González, J. M. (s. f.). <em>Taller práctico: Estructuras de datos
                basadas en Hash (HashMap vs HashSet)</em>. Universidad de Santander – UDES.
                Material de clase proporcionado.
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
