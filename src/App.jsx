import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import LinkedListMenu from './components/LinkedListMenu.jsx'
import TrabajoDetail from './components/TrabajoDetail.jsx'
import AddTrabajoForm from './components/AddTrabajoForm.jsx'
import { obtenerTrabajos } from './firebase.js'

export default function App() {
  const [trabajos, setTrabajos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [activoId, setActivoId] = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)

  async function cargar() {
    setCargando(true)
    setErrorCarga('')
    try {
      const datos = await obtenerTrabajos()
      setTrabajos(datos)
      if (datos.length > 0) {
        setActivoId((actual) => actual ?? datos[datos.length - 1].id)
      }
    } catch (err) {
      console.error(err)
      setErrorCarga('No se pudo conectar con Firebase. Revisa src/firebase.js y el archivo .env (ver README).')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  const trabajoActivo = trabajos.find((t) => t.id === activoId) ?? null
  const siguienteNumero = trabajos.length
    ? Math.max(...trabajos.map((t) => t.numeroClase)) + 1
    : 1

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-5xl px-6 py-10 md:px-12">
        {errorCarga && (
          <p className="mb-6 rounded border border-rose/50 bg-rose/10 px-4 py-3 font-mono text-xs text-rose">
            {errorCarga}
          </p>
        )}

        {cargando ? (
          <p className="font-mono text-sm text-slate">cargando lista…</p>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[280px_1fr]">
            <LinkedListMenu
              trabajos={trabajos}
              trabajoActivoId={activoId}
              onSelect={setActivoId}
              onAgregar={() => setMostrarForm(true)}
            />
            <TrabajoDetail trabajo={trabajoActivo} />
          </div>
        )}
      </main>

      {mostrarForm && (
        <AddTrabajoForm
          siguienteNumero={siguienteNumero}
          onClose={() => setMostrarForm(false)}
          onCreado={async () => {
            setMostrarForm(false)
            await cargar()
          }}
        />
      )}
    </div>
  )
}
