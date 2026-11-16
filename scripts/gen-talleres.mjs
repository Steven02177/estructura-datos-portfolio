import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Genera src/data/tallerHash.js y src/data/tallerGrafos.js a partir de:
 *   - codechef/*.java          (codigos fuente)
 *   - scripts/salidas/*.txt    (salidas reales ejecutadas con JDK 17)
 *   - scripts/fuentes/*.java   (codigos guia entregados por el profesor)
 *
 * Uso:  node scripts/gen-talleres.mjs
 * El resultado es identico siempre que los .java / .txt no cambien.
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const raiz = path.join(__dirname, '..')

const leer = (rel) => fs.readFileSync(path.join(raiz, rel), 'utf8')

function plantilla(exportaciones) {
  const cuerpo = exportaciones
    .map(([nombre, archivo]) => `export const ${nombre} = ${JSON.stringify(leer(archivo))}`)
    .join('\n\n')
  return [
    '// ARCHIVO GENERADO — no editar a mano.',
    '// Fuente: scripts/gen-talleres.mjs  (node scripts/gen-talleres.mjs)',
    '// Cada constante es el contenido exacto de un archivo .java o su salida real.',
    '',
    cuerpo,
    '',
  ].join('\n')
}

// Clase 9 — Taller Hash (HashMap vs HashSet)
const hash = [
  ['CODIGO_GUIA_MAP', 'scripts/fuentes/GuiaHashMap.java'],
  ['SALIDA_GUIA_MAP', 'scripts/salidas/GuiaHashMap.txt'],
  ['CODIGO_GUIA_SET', 'scripts/fuentes/GuiaHashSet.java'],
  ['SALIDA_GUIA_SET', 'scripts/salidas/GuiaHashSet.txt'],
  ['CODIGO_HASHMAP', 'codechef/9_MainHashMap.java'],
  ['SALIDA_HASHMAP', 'scripts/salidas/9_MainHashMap.txt'],
  ['CODIGO_HASHSET', 'codechef/9_MainHashSet.java'],
  ['SALIDA_HASHSET', 'scripts/salidas/9_MainHashSet.txt'],
]

// Clase 10 — Taller Grafos
const grafos = [
  ['CODIGO_BASE', 'codechef/Grafos.java'],
  ['SALIDA_BASE', 'scripts/salidas/Grafos.txt'],
  ['CODIGO_DFS', 'codechef/10_GrafoDFS.java'],
  ['SALIDA_DFS', 'scripts/salidas/10_GrafoDFS.txt'],
  ['CODIGO_DIRIGIDO', 'codechef/11_GrafoDirigido.java'],
  ['SALIDA_DIRIGIDO', 'scripts/salidas/11_GrafoDirigido.txt'],
  ['CODIGO_TRACERT', 'codechef/12_TracertGrafo.java'],
  ['SALIDA_TRACERT', 'scripts/salidas/12_TracertGrafo.txt'],
  ['SALIDA_TRACERT_CMD', 'scripts/salidas/tracert_cmd.txt'],
]

fs.writeFileSync(path.join(raiz, 'src/data/tallerHash.js'), plantilla(hash))
console.log('OK → src/data/tallerHash.js')

fs.writeFileSync(path.join(raiz, 'src/data/tallerGrafos.js'), plantilla(grafos))
console.log('OK → src/data/tallerGrafos.js')
