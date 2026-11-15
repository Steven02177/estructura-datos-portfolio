import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import CircularListVisualizer from '../components/CircularListVisualizer.jsx'
import {
  CODIGO_SIMPLE,
  SALIDA_SIMPLE,
  CODIGO_DOBLE,
  SALIDA_DOBLE,
  CODIGO_ACTUALIZAR,
  SALIDA_ACTUALIZAR,
} from '../data/listasCirculares.js'

// ---------------------------------------------------------------------------
// Índice del examen (los cinco enunciados del Word)
// ---------------------------------------------------------------------------
const INDICE = [
  { id: 'simulador', n: '★', titulo: 'Simulador de listas circulares' },
  { id: 'ejercicio-1', n: '1', titulo: 'Diferencia en la eliminación' },
  { id: 'ejercicio-2', n: '2', titulo: 'Reutilización del algoritmo' },
  { id: 'ejercicio-3', n: '3', titulo: 'Eliminar (circular simple)' },
  { id: 'ejercicio-4', n: '4', titulo: 'Eliminar (circular doble)' },
  { id: 'ejercicio-5', n: '5', titulo: 'Actualizar un nodo' },
]

// ---------------------------------------------------------------------------
// Auxiliares de presentación (definidos fuera del componente principal)
// ---------------------------------------------------------------------------

/** Código en línea dentro de respuestas y tablas. */
function C({ children }) {
  return (
    <code className="rounded bg-navy/70 px-1 py-0.5 font-mono text-[11px] text-cyan">
      {children}
    </code>
  )
}

function Dato({ etiqueta, valor }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-slate">{etiqueta}</p>
      <p className="mt-1 text-sm leading-relaxed text-paper">{valor}</p>
    </div>
  )
}

function Enunciado({ children }) {
  return (
    <div className="mt-4 rounded-xl border border-line/60 bg-panel/30 p-4">
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-blueLight">
        Enunciado
      </p>
      <p className="text-sm leading-relaxed text-slate">{children}</p>
    </div>
  )
}

function Titulo({ children }) {
  return (
    <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-cyan">{children}</p>
  )
}

function Tabla({ columnas, filas }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-line/60 shadow-lg shadow-navy/40">
      <table className="w-full min-w-[640px] text-left text-xs">
        <thead>
          <tr className="bg-navy text-[10px] uppercase tracking-wider text-slate">
            {columnas.map((c) => (
              <th key={c} className="px-3 py-3 font-mono font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f, i) => (
            <tr
              key={i}
              className={`border-t border-line/40 ${i % 2 === 0 ? 'bg-panel/30' : 'bg-panel/10'}`}
            >
              {f.map((celda, j) => (
                <td
                  key={j}
                  className={`px-3 py-2.5 align-top leading-relaxed ${
                    j === 0 ? 'font-mono text-paper' : 'text-slate'
                  }`}
                >
                  {celda}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Seccion({ id, numero, titulo, children }) {
  return (
    <section id={id} className="mt-16 scroll-mt-24">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue/50 bg-blue/10 font-mono text-sm text-blueLight">
          {numero}
        </span>
        <h2 className="text-balance font-display text-2xl font-semibold text-paper md:text-3xl">
          {titulo}
        </h2>
      </div>
      {children}
    </section>
  )
}

function CodigoConSalida({ archivo, codigo, salida }) {
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
          {copiado ? '✓ Copiado — pega en CodeChef' : 'Copiar código (CodeChef)'}
        </button>
      </div>

      <CodeBlock codigo={codigo} />

      <div>
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-slate">
          Salida de la ejecución
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
    </div>
  )
}

// ---------------------------------------------------------------------------
// Página del Parcial 3
// ---------------------------------------------------------------------------

export default function Parcial3() {
  return (
    <Layout>
      <article className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <Link
          to="/trabajos"
          className="font-mono text-xs text-slate transition-colors hover:text-blueLight"
        >
          ← volver a trabajos
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-blueLight">
            Parcial 3 · Listas circulares
          </p>
          <h1 className="mt-2 text-balance font-display text-3xl font-semibold text-paper md:text-4xl">
            Manipulación de punteros en estructuras circulares
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate">
            Eliminación por posición específica y actualización de datos en listas circulares
            sencilla y doblemente enlazada: respuestas teóricas de los dos primeros enunciados,
            simulador interactivo del manejo de punteros y el código Java completo de los
            ejercicios 3, 4 y 5 con su salida real de ejecución.
          </p>

          {/* Datos de la hoja de examen */}
          <div className="mt-8 grid gap-5 rounded-2xl border border-line/60 bg-panel/20 p-6 sm:grid-cols-2 lg:grid-cols-3">
            <Dato etiqueta="Nombre" valor="Keyner García" />
            <Dato etiqueta="Docente" valor="Jeison Mauricio Delgado González" />
            <Dato etiqueta="Asignatura" valor="Estructuras de Datos" />
            <Dato etiqueta="Programa" valor="Ingeniería de Software · UDES" />
            <Dato etiqueta="Lenguaje" valor="Java" />
            <Dato
              etiqueta="Objetivo de aprendizaje"
              valor="Dominar la manipulación de punteros en estructuras de datos circulares, con eliminación por posición específica y actualización de datos."
            />
          </div>

          {/* Índice */}
          <nav className="mt-8 flex flex-wrap gap-2">
            {INDICE.map((e) => (
              <a
                key={e.id}
                href={`#${e.id}`}
                className="rounded-full border border-line/60 bg-panel/40 px-4 py-1.5 text-xs text-slate transition-colors hover:border-blue/40 hover:text-paper"
              >
                <span className="mr-1.5 font-mono text-blueLight">{e.n}</span>
                {e.titulo}
              </a>
            ))}
          </nav>

          {/* ---------------------------------------------------------------
              Simulador interactivo (cubre los ejercicios 3, 4 y 5)
              --------------------------------------------------------------- */}
          <section id="simulador" className="mt-14 scroll-mt-24">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-blueLight">
              Simulador interactivo · ejercicios 3, 4 y 5
            </p>
            <h2 className="mt-2 text-balance font-display text-2xl font-semibold text-paper md:text-3xl">
              Recorre, elimina y actualiza la lista, nodo por nodo
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate">
              Cada operación se anima paso a paso: el recorrido hasta el nodo objetivo, las
              ecuaciones de punteros que se aplican y el resultado —mismas líneas que el código
              Java de abajo. Alterna entre la lista circular sencilla (ejercicio 3) y la doble
              (ejercicios 4 y 5) para comparar el manejo de punteros.
            </p>
            <div className="mt-6">
              <CircularListVisualizer />
            </div>
          </section>

          {/* ---------------------------------------------------------------
              Ejercicio 1
              --------------------------------------------------------------- */}
          <Seccion id="ejercicio-1" numero="1" titulo="Diferencia en la operación de eliminación">
            <Enunciado>
              Explique detalladamente las diferencias lógicas y en el manejo de punteros al
              eliminar un nodo en una posición específica dentro de una Lista Circular
              Sencillamente Enlazada frente a una Lista Circular Doblemente Enlazada.
            </Enunciado>

            <Titulo>Respuesta</Titulo>
            <div className="mt-3 space-y-4 text-sm leading-relaxed text-slate">
              <p>
                La diferencia central es que en la lista circular sencilla <strong className="text-paper">ningún
                nodo sabe quién lo apunta</strong>: el nodo solo guarda <C>dato</C> y <C>siguiente</C>.
                Para eliminar el nodo de la posición <C>k</C> hay que recorrer desde la cabeza con un
                único puntero auxiliar hasta llegar al nodo <C>k-1</C> (el predecesor) y recién ahí
                desvincular con <C>anterior.siguiente = eliminado.siguiente</C>. La posición 1 es un
                caso especial: el predecesor de la cabeza es el último nodo, así que hay que llegar a
                él —o guardar la referencia <C>ultimo</C>— para que apunte a la nueva cabeza; si se
                olvida, el círculo queda roto apuntando a un nodo eliminado y cualquier recorrido
                posterior se vuelve infinito.
              </p>
              <p>
                En la lista circular doble cada nodo conoce a sus dos vecinos, por lo que el nodo a
                eliminar <strong className="text-paper">trae implícito quién lo apunta</strong>:{' '}
                <C>objetivo.anterior</C> es el predecesor sin necesidad de recorrer. La desvinculación
                toca dos punteros a la vez y es simétrica:{' '}
                <C>objetivo.anterior.siguiente = objetivo.siguiente</C> y{' '}
                <C>objetivo.siguiente.anterior = objetivo.anterior</C>. Por eso eliminar la cabeza no
                es un caso especial para los enlaces (solo se mueve la referencia <C>cabeza</C>), y el
                cierre circular se mantiene solo porque el último nodo siempre es{' '}
                <C>cabeza.anterior</C>. Además se puede entrar desde la cabeza o desde el último y
                recorrer el lado más corto (a lo sumo n/2 pasos).
              </p>
            </div>

            {/* Ejemplo gráfico */}
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-line/60 bg-navy/50 p-4">
                <p className="font-mono text-[11px] uppercase tracking-widest text-blueLight">
                  Circular simple · eliminar C
                </p>
                <p className="mt-3 font-mono text-sm text-paper">A → B → C → D → (regresa a A)</p>
                <p className="mt-3 font-mono text-xs text-cyan">B.siguiente = D</p>
                <p className="mt-1 text-xs leading-relaxed text-slate">
                  Un solo puntero. B se consigue recorriendo desde la cabeza: O(k).
                </p>
              </div>
              <div className="rounded-xl border border-line/60 bg-navy/50 p-4">
                <p className="font-mono text-[11px] uppercase tracking-widest text-cyan">
                  Circular doble · eliminar C
                </p>
                <p className="mt-3 font-mono text-sm text-paper">A ⇄ B ⇄ C ⇄ D ⇄ A</p>
                <p className="mt-3 font-mono text-xs text-cyan">
                  B.siguiente = D &nbsp;·&nbsp; D.anterior = B
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate">
                  Dos punteros, y B y D salen del propio C con <C>anterior</C>/<C>siguiente</C>: O(1).
                </p>
              </div>
            </div>

            <Tabla
              columnas={['Aspecto', 'Circular sencilla', 'Circular doble']}
              filas={[
                [
                  'Localizar el predecesor',
                  <>
                    Recorrido obligatorio desde la cabeza hasta <C>k-1</C> con un puntero auxiliar.
                    Costo <C>O(k)</C>.
                  </>,
                  <>
                    Ya está en <C>objetivo.anterior</C>: no hace falta recorrido previo ni puntero
                    externo.
                  </>,
                ],
                [
                  'Punteros a modificar',
                  <>1: <C>anterior.siguiente = objetivo.siguiente</C></>,
                  <>
                    2: <C>objetivo.anterior.siguiente = objetivo.siguiente</C> y{' '}
                    <C>objetivo.siguiente.anterior = objetivo.anterior</C>
                  </>,
                ],
                [
                  'Eliminar la cabeza (k = 1)',
                  'Caso especial: hay que llegar al último nodo (o usar la referencia «ultimo») para reapuntarlo a la nueva cabeza; si no, el círculo se rompe.',
                  'No es un caso especial para los enlaces: los vecinos se reconectan igual y solo se mueve la referencia «cabeza».',
                ],
                [
                  'Eliminar el último',
                  'Hay que actualizar «ultimo = anterior» y conservar el cierre hacia la cabeza.',
                  'El cierre queda correcto solo: el último siempre es «cabeza.anterior».',
                ],
                [
                  'Lista con un solo nodo',
                  <>
                    Debe quedar en <C>null</C> (cabeza y último); el nodo se apuntaba a sí mismo.
                  </>,
                  <>
                    <C>cabeza = null</C>; los dos punteros del nodo eliminado se anulan.
                  </>,
                ],
                [
                  'Con el nodo ya identificado',
                  'O(n): hay que buscar quién lo apunta.',
                  'O(1): se desvincula directamente.',
                ],
                [
                  'Riesgo típico',
                  'Dejar al último apuntando a un nodo eliminado o perder el cierre → recorrido sin fin.',
                  'Actualizar solo un sentido → enlaces inconsistentes entre el recorrido adelante y atrás.',
                ],
                ['Memoria por nodo', '1 puntero.', '2 punteros.'],
              ]}
            />

            <div className="mt-5 rounded-xl border border-blue/30 bg-blue/5 p-4 text-sm leading-relaxed text-slate">
              <strong className="text-paper">Conclusión:</strong> la lista doble paga un puntero
              extra por nodo a cambio de eliminar sin recorrer al predecesor y con menos casos
              especiales; la sencilla ahorra memoria, pero obliga a recorrer siempre con un puntero
              previo y a cuidar manualmente el cierre circular en la cabeza y en la cola.
            </div>
          </Seccion>

          {/* ---------------------------------------------------------------
              Ejercicio 2
              --------------------------------------------------------------- */}
          <Seccion
            id="ejercicio-2"
            numero="2"
            titulo="Reutilización de algoritmos de actualización"
          >
            <Enunciado>
              ¿Se puede utilizar exactamente el mismo algoritmo o método para actualizar
              (modificar) el valor de un nodo sin importar si la lista es simplemente enlazada
              lineal, circular simple o circular doblemente enlazada? Justifique qué parte del
              proceso depende de la estructura de enlaces y qué parte es completamente
              independiente de los punteros.
            </Enunciado>

            <Titulo>Respuesta</Titulo>
            <div className="mt-3 space-y-4 text-sm leading-relaxed text-slate">
              <p>
                <strong className="text-paper">No exactamente el mismo algoritmo completo, pero sí
                se reutiliza casi todo.</strong> Actualizar un nodo se divide en dos fases y solo la
                primera depende de la estructura.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-line/60 bg-navy/50 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-blueLight">
                    Fase 1 · Localizar (depende de los enlaces)
                  </p>
                  <ul className="mt-2 space-y-2 text-xs leading-relaxed text-slate">
                    <li>
                      <strong className="text-paper">Lineal simple:</strong> el recorrido termina
                      cuando <C>actual == null</C>.
                    </li>
                    <li>
                      <strong className="text-paper">Circular simple:</strong> nunca aparece{' '}
                      <C>null</C>; hay que parar al volver a la cabeza o tras <C>tamano</C> pasos.
                      Sin esa condición el bucle es infinito.
                    </li>
                    <li>
                      <strong className="text-paper">Circular doble:</strong> mismo criterio de
                      parada, pero se puede recorrer desde cualquiera de los dos extremos eligiendo
                      el lado más corto.
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border border-cyan/30 bg-cyan/5 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-cyan">
                    Fase 2 · Modificar (independiente)
                  </p>
                  <p className="mt-2 font-mono text-sm text-paper">nodo.dato = nuevoDato;</p>
                  <p className="mt-2 text-xs leading-relaxed text-slate">
                    Es una asignación sobre el campo de datos: no toca <C>siguiente</C> ni{' '}
                    <C>anterior</C>, no cambia el tamaño, no exige actualizar <C>cabeza</C> o{' '}
                    <C>ultimo</C> y no tiene casos especiales para la cabeza o la cola. Es la misma
                    línea de código en las tres estructuras.
                  </p>
                </div>
              </div>
            </div>

            <Tabla
              columnas={[
                'Estructura',
                'Condición de parada al buscar el nodo',
                '¿Cambia punteros al actualizar?',
              ]}
              filas={[
                ['Lineal simple', <C>actual != null</C>, <>No</>],
                [
                  'Circular simple',
                  <>
                    <C>actual != cabeza</C> (do-while) o contador <C>&lt; tamano</C>
                  </>,
                  <>No</>,
                ],
                [
                  'Circular doble',
                  <>
                    <C>actual != cabeza</C>, en el sentido que se elija
                  </>,
                  <>No</>,
                ],
              ]}
            />

            <div className="mt-5 rounded-xl border border-blue/30 bg-blue/5 p-4 text-sm leading-relaxed text-slate">
              <strong className="text-paper">Conclusión:</strong> lo único que cambia entre
              estructuras es el recorrido, así que conviene separar un método{' '}
              <C>buscarNodo(...)</C> propio de cada lista de la asignación del nuevo dato, que es
              idéntica en las tres. Como una actualización no modifica ningún enlace, nunca rompe
              la circularidad ni obliga a mover las referencias de cabeza o último; y si la
              posición o el dato no existen, se controla con un <C>boolean</C> y un mensaje, sin{' '}
              <C>NullPointerException</C> (así lo implementa el ejercicio 5).
            </div>
          </Seccion>

          {/* ---------------------------------------------------------------
              Ejercicio 3
              --------------------------------------------------------------- */}
          <Seccion
            id="ejercicio-3"
            numero="3"
            titulo="Eliminación por posición en Lista Circular Sencillamente Enlazada"
          >
            <Enunciado>
              Implemente una clase en Java para una Lista Circular Sencillamente Enlazada con un
              método <C>eliminarEnPosicion(int posicion)</C> (base 1) que maneje correctamente la
              eliminación del primer nodo (actualizando la referencia del último), de nodos
              intermedios y del último. En el <C>main</C>: inserte al menos 10 nodos y elimine un
              nodo intermedio, uno en la cabeza y uno en la cola, imprimiendo la lista antes y
              después de cada caso.
            </Enunciado>

            <Titulo>Idea del algoritmo</Titulo>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate">
              <li>
                Estructura: nodo con <C>dato</C> y <C>siguiente</C>, más las referencias{' '}
                <C>cabeza</C>, <C>ultimo</C> (imprescindible para llegar al predecesor de la
                cabeza) y <C>tamano</C>.
              </li>
              <li>
                Validación: lista vacía o posición fuera de <C>1..tamano</C> → aviso controlado y
                no cambia nada.
              </li>
              <li>
                Un solo nodo → <C>cabeza = ultimo = null</C>.
              </li>
              <li>
                Cabeza → <C>ultimo.siguiente = cabeza.siguiente</C> para que el último apunte a la
                nueva cabeza, y luego <C>cabeza = cabeza.siguiente</C>.
              </li>
              <li>
                Intermedio o cola → se avanza hasta la posición <C>posicion - 1</C> y se hace{' '}
                <C>anterior.siguiente = eliminado.siguiente</C>; si el eliminado era el{' '}
                <C>ultimo</C>, se actualiza <C>ultimo = anterior</C>.
              </li>
              <li>
                Impresión con <C>do-while</C>: el recorrido se detiene al volver a la cabeza (una
                sola vuelta, nunca infinita).
              </li>
            </ul>

            <CodigoConSalida
              archivo="codechef/6_ListaCircularSimple.java"
              codigo={CODIGO_SIMPLE}
              salida={SALIDA_SIMPLE}
            />
          </Seccion>

          {/* ---------------------------------------------------------------
              Ejercicio 4
              --------------------------------------------------------------- */}
          <Seccion
            id="ejercicio-4"
            numero="4"
            titulo="Eliminación por posición en Lista Circular Doblemente Enlazada"
          >
            <Enunciado>
              Implemente una clase en Java para una Lista Circular Doblemente Enlazada (nodo con{' '}
              <C>dato</C>, <C>siguiente</C> y <C>anterior</C>, con el último nodo conectado al
              primero en ambos sentidos) y agregue <C>eliminarEnPosicionDoble(int posicion)</C>{' '}
              ajustando de manera bidireccional los punteros de los nodos adyacentes. Contemple el
              mantenimiento del enlace circular cuando la lista quede con pocos elementos o vacía,
              e incluya un <C>mostrarLista()</C> que recorra en ambas direcciones para verificar
              la integridad. Pruebe al menos tres posiciones como en el ejercicio anterior.
            </Enunciado>

            <Titulo>Idea del algoritmo</Titulo>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate">
              <li>
                El último nodo siempre es <C>cabeza.anterior</C>: no se necesita una referencia
                aparte.
              </li>
              <li>
                Localizar: desde <C>cabeza</C> se avanza <C>posicion - 1</C> pasos; con el puntero{' '}
                <C>anterior</C> también se podría entrar por <C>cabeza.anterior</C> y recorrer el
                lado más corto.
              </li>
              <li>
                Desvincular en ambos sentidos:{' '}
                <C>objetivo.anterior.siguiente = objetivo.siguiente</C> y{' '}
                <C>objetivo.siguiente.anterior = objetivo.anterior</C>.
              </li>
              <li>
                Con dos nodos, el que queda se apunta a sí mismo en ambos sentidos; con un solo
                nodo la lista queda vacía (<C>cabeza = null</C>).
              </li>
              <li>
                Si se eliminó la cabeza, <C>cabeza = objetivo.siguiente</C>.
              </li>
              <li>
                <C>mostrarLista()</C> imprime el recorrido adelante desde <C>cabeza</C> y hacia
                atrás desde <C>cabeza.anterior</C>: si ambos son espejo, los enlaces son
                consistentes.
              </li>
            </ul>

            <CodigoConSalida
              archivo="codechef/7_ListaCircularDoble.java"
              codigo={CODIGO_DOBLE}
              salida={SALIDA_DOBLE}
            />
          </Seccion>

          {/* ---------------------------------------------------------------
              Ejercicio 5
              --------------------------------------------------------------- */}
          <Seccion id="ejercicio-5" numero="5" titulo="Actualización de datos en un Nodo">
            <Enunciado>
              Diseñe e implemente un método de actualización dentro de una clase de lista enlazada
              llamado <C>actualizarValorEnPosicion(int posicion, int nuevoDato)</C> o{' '}
              <C>actualizarPorDato(int datoAntiguo, int datoNuevo)</C>. El método debe buscar el
              nodo objetivo (por posición o por coincidencia de valor) y modificar su campo{' '}
              <C>dato</C>. Si la posición o el elemento no existen, imprima un mensaje de
              advertencia controlado (sin <C>NullPointerException</C>). Pruebe en el <C>main</C>{' '}
              imprimiendo el estado de la lista antes y después de la modificación.
            </Enunciado>

            <Titulo>Idea del algoritmo</Titulo>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate">
              <li>
                Se elige la lista circular doble del ejercicio 4 para demostrar lo analizado en el
                ejercicio 2: el recorrido depende de la estructura, la asignación no.
              </li>
              <li>
                Por posición: valida <C>1..tamano</C>, avanza <C>posicion - 1</C> veces desde{' '}
                <C>cabeza</C> y asigna <C>objetivo.dato = nuevoDato</C>.
              </li>
              <li>
                Por dato: recorre una sola vuelta con <C>do-while</C> y se detiene al volver a la
                cabeza; actualiza la primera coincidencia.
              </li>
              <li>
                Sin excepciones: lista vacía, posición inexistente o dato inexistente se resuelven
                con un mensaje y <C>return false</C>.
              </li>
              <li>
                Complejidad: <C>O(n)</C> en tiempo y <C>O(1)</C> en memoria extra. No se modifica
                ningún enlace, por eso la circularidad queda intacta.
              </li>
            </ul>

            <CodigoConSalida
              archivo="codechef/8_ActualizarNodo.java"
              codigo={CODIGO_ACTUALIZAR}
              salida={SALIDA_ACTUALIZAR}
            />
          </Seccion>

          <p className="mt-16 text-center font-mono text-xs text-slate">
            Keyner García · Estructuras de Datos · Ingeniería de Software · UDES · Parcial 3
          </p>
        </motion.div>
      </article>
    </Layout>
  )
}
