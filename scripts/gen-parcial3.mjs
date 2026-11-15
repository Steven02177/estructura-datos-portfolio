/**
 * Genera src/data/listasCirculares.js a partir de:
 *   - codechef/*.java            (código fuente del Parcial 3)
 *   - scripts/salidas/*.txt      (salida REAL de compilar y ejecutar)
 *
 * Así, lo que se muestra en la web es exactamente lo que se compiló y corrió.
 * Uso: node scripts/gen-parcial3.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const EJERCICIOS = [
  { id: 'SIMPLE', java: '6_ListaCircularSimple.java', salida: '6_ListaCircularSimple.txt' },
  { id: 'DOBLE', java: '7_ListaCircularDoble.java', salida: '7_ListaCircularDoble.txt' },
  { id: 'ACTUALIZAR', java: '8_ActualizarNodo.java', salida: '8_ActualizarNodo.txt' },
]

/** Escapa un texto para incrustarlo dentro de un template literal de JS. */
function escapeTemplate(texto) {
  return texto
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')
}

let out = `/**
 * Parcial 3 — Listas circulares (ejercicios 3, 4 y 5).
 *
 * Código Java + salida REAL de ejecución.
 * ARCHIVO GENERADO por scripts/gen-parcial3.mjs — no editar a mano.
 * Fuentes: codechef/*.java  ·  scripts/salidas/*.txt
 *
 * Regenerar: node scripts/gen-parcial3.mjs
 */

`

for (const e of EJERCICIOS) {
  const rutaJava = path.join(root, 'codechef', e.java)
  const rutaSalida = path.join(root, 'scripts', 'salidas', e.salida)

  if (!fs.existsSync(rutaJava)) throw new Error(`No existe ${rutaJava}`)
  if (!fs.existsSync(rutaSalida)) throw new Error(`No existe ${rutaSalida}`)

  const java = fs.readFileSync(rutaJava, 'utf8').trimEnd()
  const salida = fs.readFileSync(rutaSalida, 'utf8').trimEnd()

  out += `/** Código de ${e.java} */\n`
  out += `export const CODIGO_${e.id} = \`${escapeTemplate(java)}\`\n\n`
  out += `/** Salida real de ${e.java} */\n`
  out += `export const SALIDA_${e.id} = \`${escapeTemplate(salida)}\`\n\n`
}

const destino = path.join(root, 'src', 'data', 'listasCirculares.js')
fs.writeFileSync(destino, out)
console.log('OK →', path.relative(root, destino))
