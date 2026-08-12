export default function CodeBlock({ codigo }) {
  const lineas = codigo.split('\n')

  return (
    <div className="overflow-x-auto rounded-xl border border-line/60 bg-navy">
      <pre className="flex font-mono text-[13px] leading-relaxed">
        <code className="select-none border-r border-line/50 px-3 py-4 text-right text-slate/60">
          {lineas.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </code>
        <code className="flex-1 whitespace-pre px-4 py-4 text-paper/90">
          {lineas.map((linea, i) => (
            <div key={i}>{linea || '\u00A0'}</div>
          ))}
        </code>
      </pre>
    </div>
  )
}
