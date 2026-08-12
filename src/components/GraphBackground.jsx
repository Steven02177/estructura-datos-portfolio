const NODOS = [
  { x: 90, y: 120 }, { x: 260, y: 60 }, { x: 430, y: 140 },
  { x: 620, y: 70 }, { x: 780, y: 160 }, { x: 180, y: 300 },
  { x: 370, y: 340 }, { x: 560, y: 300 }, { x: 720, y: 360 },
  { x: 60, y: 420 }, { x: 470, y: 460 }, { x: 850, y: 280 },
]

const ARISTAS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [5, 6], [6, 7], [7, 8],
  [2, 6], [5, 9], [6, 10], [8, 11], [3, 7],
]

export default function GraphBackground() {
  return (
    <svg
      viewBox="0 0 900 520"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]"
      aria-hidden="true"
    >
      {ARISTAS.map(([a, b], i) => (
        <line
          key={i}
          x1={NODOS[a].x} y1={NODOS[a].y}
          x2={NODOS[b].x} y2={NODOS[b].y}
          stroke="#233047"
          strokeWidth="1.5"
        >
          <animate
            attributeName="stroke"
            values="#233047;#2563EB;#233047"
            dur={`${6 + (i % 5)}s`}
            begin={`${i * 0.4}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}
      {NODOS.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={i % 3 === 0 ? 5 : 3.5} fill="#3B82F6">
          <animate
            attributeName="r"
            values={`${i % 3 === 0 ? 5 : 3.5};${i % 3 === 0 ? 7 : 5.5};${i % 3 === 0 ? 5 : 3.5}`}
            dur={`${4 + (i % 4)}s`}
            begin={`${i * 0.3}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.6;1;0.6"
            dur={`${4 + (i % 4)}s`}
            begin={`${i * 0.3}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  )
}
