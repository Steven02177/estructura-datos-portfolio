import { useEffect, useState } from 'react'

export default function WordPreview({ url }) {
  const [html, setHtml] = useState('')
  const [estado, setEstado] = useState('cargando') // cargando | listo | error

  useEffect(() => {
    let cancelado = false
    setEstado('cargando')

    async function convertir() {
      try {
        const mammoth = await import('mammoth')
        const respuesta = await fetch(url)
        if (!respuesta.ok) throw new Error('No se pudo descargar el documento.')
        const arrayBuffer = await respuesta.arrayBuffer()
        const resultado = await mammoth.convertToHtml({ arrayBuffer })
        if (!cancelado) {
          setHtml(resultado.value)
          setEstado('listo')
        }
      } catch (err) {
        console.error(err)
        if (!cancelado) setEstado('error')
      }
    }

    convertir()
    return () => {
      cancelado = true
    }
  }, [url])

  if (estado === 'cargando') {
    return <p className="font-mono text-xs text-slate">cargando documento…</p>
  }

  if (estado === 'error') {
    return (
      <div className="rounded-xl border border-rose/40 bg-rose/10 px-4 py-3">
        <p className="font-mono text-xs text-rose">
          No se pudo mostrar la vista previa del documento.
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block font-mono text-xs text-blueLight hover:underline"
        >
          Abrir el archivo original →
        </a>
      </div>
    )
  }

  return (
    <div className="max-h-[600px] overflow-y-auto rounded-xl border border-line/60 bg-paper p-6 text-navy">
      <div
        className="word-preview max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
