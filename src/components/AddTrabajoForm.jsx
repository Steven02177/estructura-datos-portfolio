import { useState } from 'react'
import { crearTrabajo } from '../firebase.js'

const ESTADO_INICIAL = {
  titulo: '',
  numeroClase: '',
  fecha: '',
  descripcion: '',
  codigo: '',
  salidaTexto: '',
}

export default function AddTrabajoForm({ siguienteNumero, onClose, onCreado }) {
  const [form, setForm] = useState({ ...ESTADO_INICIAL, numeroClase: siguienteNumero })
  const [umlFile, setUmlFile] = useState(null)
  const [salidaFile, setSalidaFile] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

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
      await crearTrabajo(
        {
          ...form,
          numeroClase: Number(form.numeroClase),
        },
        { umlFile, salidaFile }
      )
      onCreado()
    } catch (err) {
      console.error(err)
      setError('No se pudo guardar el nodo. Revisa la configuración de Firebase (ver README).')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/80 px-4 py-10 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg border border-line bg-panel p-6 md:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-amber">
              nuevo Nodo
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold text-paper">
              Agregar trabajo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded border border-line px-2 py-1 font-mono text-xs text-slate hover:border-rose hover:text-rose"
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
                className="w-full rounded border border-line bg-ink px-3 py-2 font-body text-sm text-paper outline-none focus:border-sage"
              />
            </div>
            <div>
              <label className="mb-1 block font-mono text-xs text-slate">clase # *</label>
              <input
                type="number"
                value={form.numeroClase}
                onChange={(e) => actualizar('numeroClase', e.target.value)}
                className="w-full rounded border border-line bg-ink px-3 py-2 font-body text-sm text-paper outline-none focus:border-sage"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-slate">fecha</label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => actualizar('fecha', e.target.value)}
              className="w-full rounded border border-line bg-ink px-3 py-2 font-body text-sm text-paper outline-none focus:border-sage sm:w-52"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-slate">descripción breve</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => actualizar('descripcion', e.target.value)}
              rows={2}
              placeholder="Qué ejercicio es y qué resuelve"
              className="w-full rounded border border-line bg-ink px-3 py-2 font-body text-sm text-paper outline-none focus:border-sage"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-slate">diagrama UML (imagen)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUmlFile(e.target.files?.[0] ?? null)}
              className="w-full font-mono text-xs text-slate file:mr-3 file:rounded file:border file:border-line file:bg-ink file:px-3 file:py-1.5 file:text-paper"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-slate">código fuente *</label>
            <textarea
              value={form.codigo}
              onChange={(e) => actualizar('codigo', e.target.value)}
              rows={8}
              placeholder="Pega aquí el código completo del ejercicio"
              className="w-full rounded border border-line bg-ink px-3 py-2 font-mono text-xs text-paper outline-none focus:border-sage"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-slate">salida (texto de consola)</label>
            <textarea
              value={form.salidaTexto}
              onChange={(e) => actualizar('salidaTexto', e.target.value)}
              rows={4}
              placeholder="Pega la salida del programa"
              className="w-full rounded border border-line bg-ink px-3 py-2 font-mono text-xs text-sage outline-none focus:border-sage"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono text-xs text-slate">salida (imagen, opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSalidaFile(e.target.files?.[0] ?? null)}
              className="w-full font-mono text-xs text-slate file:mr-3 file:rounded file:border file:border-line file:bg-ink file:px-3 file:py-1.5 file:text-paper"
            />
          </div>

          {error && (
            <p className="rounded border border-rose/50 bg-rose/10 px-3 py-2 font-mono text-xs text-rose">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-line px-4 py-2 font-mono text-xs text-slate hover:text-paper"
            >
              cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="rounded border border-sage bg-sage/10 px-4 py-2 font-mono text-xs text-sage hover:bg-sage/20 disabled:opacity-50"
            >
              {enviando ? 'guardando…' : 'guardar nodo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
