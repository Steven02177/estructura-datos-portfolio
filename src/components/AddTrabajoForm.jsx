import { useState } from 'react'
import { crearTrabajo, editarTrabajo } from '../firebase.js'

function estadoInicial(trabajoExistente, siguienteNumero) {
  if (trabajoExistente) {
    return {
      titulo: trabajoExistente.titulo || '',
      numeroClase: trabajoExistente.numeroClase ?? '',
      fecha: trabajoExistente.fecha || '',
      paginaEspecial: trabajoExistente.paginaEspecial || '',
      descripcion: trabajoExistente.descripcion || '',
      codigo: trabajoExistente.codigo || '',
      salidaTexto: trabajoExistente.salidaTexto || '',
      datosVisualizacion: trabajoExistente.datosVisualizacion || '',
      visualOrdenamiento: Boolean(trabajoExistente.visualOrdenamiento),
    }
  }
  return {
    titulo: '',
    numeroClase: siguienteNumero,
    fecha: '',
    paginaEspecial: '',
    descripcion: '',
    codigo: '',
    salidaTexto: '',
    datosVisualizacion: '',
    visualOrdenamiento: false,
  }
}

export default function AddTrabajoForm({ siguienteNumero, trabajoExistente, onClose, onGuardado }) {
  const [form, setForm] = useState(estadoInicial(trabajoExistente, siguienteNumero))
  const [umlFile, setUmlFile] = useState(null)
  const [salidaFile, setSalidaFile] = useState(null)
  const [docFile, setDocFile] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const editando = Boolean(trabajoExistente)

  function actualizar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  async function manejarEnvio(e) {
    e.preventDefault()
    setError('')

    if (!form.titulo.trim() || !form.numeroClase) {
      setError('El título y el número de clase son obligatorios.')
      return
    }

    setEnviando(true)
    try {
      const datos = { ...form, numeroClase: Number(form.numeroClase) }
      if (editando) {
        await editarTrabajo(trabajoExistente.id, datos, { umlFile, salidaFile, docFile })
      } else {
        await crearTrabajo(datos, { umlFile, salidaFile, docFile })
      }
      onGuardado()
    } catch (err) {
      console.error(err)
      setError(err.message || 'No se pudo guardar. Revisa la configuración de Firebase/Cloudinary.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/85 px-4 py-10 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-line bg-panel p-6 md:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-blueLight">
              {editando ? 'editar trabajo' : 'nuevo trabajo'}
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold text-paper">
              {editando ? trabajoExistente.titulo : 'Agregar trabajo'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-line px-2.5 py-1 font-mono text-xs text-slate hover:border-rose hover:text-rose"
            aria-label="Cerrar"
          >
            cerrar
          </button>
        </div>

        <form onSubmit={manejarEnvio} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-1 block font-mono text-xs text-slate">título *</label>
              <input
                type="text"
                value={form.titulo}
                onChange={(e) => actualizar('titulo', e.target.value)}
                placeholder="Ej: Pila con arreglo dinámico"
                className="w-full rounded-lg border border-line bg-navy px-3 py-2 text-sm text-paper outline-none focus:border-blue"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-slate">clase # *</label>
              <input
                type="number"
                value={form.numeroClase}
                onChange={(e) => actualizar('numeroClase', e.target.value)}
                className="w-full rounded-lg border border-line bg-navy px-3 py-2 text-sm text-paper outline-none focus:border-blue"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-slate">fecha</label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => actualizar('fecha', e.target.value)}
              className="w-full rounded-lg border border-line bg-navy px-3 py-2 text-sm text-paper outline-none focus:border-blue sm:w-52"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-slate">
              página especial (vincular con una sección del portafolio)
            </label>
            <select
              value={form.paginaEspecial}
              onChange={(e) => actualizar('paginaEspecial', e.target.value)}
              className="w-full rounded-lg border border-line bg-navy px-3 py-2 text-sm text-paper outline-none focus:border-blue"
            >
              <option value="">Ninguna — ficha estándar en /trabajos/id</option>
              <option value="hash">Taller HashMap vs HashSet → /taller-hash</option>
              <option value="grafos">Taller de Grafos → /taller-grafos</option>
            </select>
            <p className="mt-1 font-mono text-[11px] text-slate/70">
              Si eliges un taller, la tarjeta en «Trabajos» abrirá su página completa y las
              capturas, diagramas y Word de ESTE trabajo se mostrarán en la sección «Evidencias»
              de ese taller.
            </p>
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-slate">descripción breve</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => actualizar('descripcion', e.target.value)}
              rows={2}
              placeholder="Qué ejercicio es y qué resuelve"
              className="w-full rounded-lg border border-line bg-navy px-3 py-2 text-sm text-paper outline-none focus:border-blue"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-slate">
              diagrama UML (imagen){editando && trabajoExistente.umlUrl ? ' — deja vacío para no cambiarla' : ''}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUmlFile(e.target.files?.[0] ?? null)}
              className="w-full font-mono text-xs text-slate file:mr-3 file:rounded-lg file:border file:border-line file:bg-navy file:px-3 file:py-1.5 file:text-paper"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-slate">código fuente *</label>
            <textarea
              value={form.codigo}
              onChange={(e) => actualizar('codigo', e.target.value)}
              rows={8}
              placeholder="Pega aquí el código completo del ejercicio"
              className="w-full rounded-lg border border-line bg-navy px-3 py-2 font-mono text-xs text-paper outline-none focus:border-blue"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-slate">salida (texto de consola)</label>
            <textarea
              value={form.salidaTexto}
              onChange={(e) => actualizar('salidaTexto', e.target.value)}
              rows={4}
              placeholder="Pega la salida del programa"
              className="w-full rounded-lg border border-line bg-navy px-3 py-2 font-mono text-xs text-cyan outline-none focus:border-blue"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-slate">
              salida (imagen, opcional){editando && trabajoExistente.salidaImagenUrl ? ' — deja vacío para no cambiarla' : ''}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSalidaFile(e.target.files?.[0] ?? null)}
              className="w-full font-mono text-xs text-slate file:mr-3 file:rounded-lg file:border file:border-line file:bg-navy file:px-3 file:py-1.5 file:text-paper"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-slate">
              documento Word .docx (opcional){editando && trabajoExistente.documentoUrl ? ' — deja vacío para no cambiarlo' : ''}
            </label>
            <input
              type="file"
              accept=".doc,.docx"
              onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
              className="w-full font-mono text-xs text-slate file:mr-3 file:rounded-lg file:border file:border-line file:bg-navy file:px-3 file:py-1.5 file:text-paper"
            />
            <p className="mt-1 font-mono text-[11px] text-slate/70">
              se muestra directo en la página del trabajo, sin descargarlo
            </p>
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-slate">
              datos del problema para la simulación (opcional)
            </label>
            <textarea
              value={form.datosVisualizacion}
              onChange={(e) => actualizar('datosVisualizacion', e.target.value)}
              rows={2}
              placeholder={'Ejemplo: 45, 12, 78, 3, 25, 9  o  "Pedro", "Karla", "Andrés"'}
              className="w-full rounded-lg border border-line bg-navy px-3 py-2 font-mono text-xs text-paper outline-none focus:border-blue"
            />
            <p className="mt-1 font-mono text-[11px] text-slate/70">
              Si lo dejas vacío, el simulador intentará leer el arreglo directamente del código fuente. No inventará datos de ejemplo.
            </p>
          </div>

          <div className="rounded-xl border border-line/60 bg-navy/40 px-4 py-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={form.visualOrdenamiento}
                onChange={(e) => actualizar('visualOrdenamiento', e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-blue"
              />
              <span>
                <span className="block font-mono text-xs text-paper">
                  Activar representación visual de ordenamiento
                </span>
                <span className="mt-0.5 block font-mono text-[11px] text-slate/70">
                  Muestra un simulador interactivo (barras + log de pasos) en la página del trabajo.
                  Ideal para métodos de ordenamiento (Burbuja, Quick, Shell, Selección, etc.).
                </span>
              </span>
            </label>
          </div>

          {error && (
            <p className="rounded-lg border border-rose/40 bg-rose/10 px-3 py-2 font-mono text-xs text-rose">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line px-4 py-2 font-mono text-xs text-slate hover:text-paper"
            >
              cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="rounded-lg border border-blue bg-blue/10 px-4 py-2 font-mono text-xs text-blueLight hover:bg-blue/20 disabled:opacity-50"
            >
              {enviando ? 'guardando…' : editando ? 'guardar cambios' : 'guardar trabajo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
