import type { Palette } from '@/lib/sky'

/**
 * 2D version of the campus scene: layered hills, the shuttle on its line, campus blocks and the
 * sky of the moment. Shown on devices that don't get the 3D scene, and while the scene loads.
 */
export function CampusPoster({ palette }: { palette: Palette }) {
  const p = palette
  // The sun sinks with the day; after dark the moon hangs high instead.
  const sunY = p.sunHeight > -0.05 ? 300 - p.sunHeight * 220 : 110
  const lit = p.lamps > 0.3
  return (
    <svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <linearGradient id="cp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.top} />
          <stop offset="0.75" stopColor={p.bottom} />
        </linearGradient>
        <radialGradient id="cp-sun">
          <stop offset="0" stopColor={p.sun} />
          <stop offset="1" stopColor={p.sun} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="520" fill="url(#cp-sky)" />
      <g fill="#fff" opacity={p.stars}>
        {Array.from({ length: 60 }, (_, i) => (
          <circle key={i} cx={(i * 197) % 1200} cy={(i * 83) % 230} r={i % 5 === 0 ? 1.6 : 1} />
        ))}
      </g>
      <circle cx="930" cy={sunY} r="110" fill="url(#cp-sun)" opacity="0.8" />
      <circle cx="930" cy={sunY} r={p.sunHeight > -0.05 ? 26 : 18} fill={p.sunHeight > -0.05 ? p.sun : '#e2e8f0'} />
      {/* far and near hills */}
      <path d="M0 300 C120 230 220 250 320 270 C430 190 540 220 640 260 C760 200 880 215 980 250 C1080 220 1150 240 1200 250 V520 H0Z" fill={p.hillFar} />
      <path d="M0 360 C140 300 240 310 330 340 C420 300 470 330 520 350 L700 350 C780 300 860 290 940 320 C1040 270 1120 300 1200 310 V520 H0Z" fill={p.hillNear} />
      {/* valley floor */}
      <path d="M0 520 V420 C200 380 420 370 600 372 C800 374 1000 390 1200 410 V520Z" fill={p.hillNear} opacity="0.85" />
      {/* campus blocks */}
      <g>
        {[
          [610, 330, 70, 36],
          [690, 318, 90, 48],
          [790, 334, 60, 30],
          [560, 342, 46, 26],
        ].map(([x, y, w, h]) => (
          <g key={x}>
            <rect x={x} y={y} width={w} height={h} fill="#f1ece2" opacity="0.92" />
            <rect x={x - 3} y={y - 5} width={w + 6} height="6" fill="#b64b3b" />
            {[0.2, 0.45, 0.7].map((f) => (
              <rect key={f} x={x + w * f} y={y + h * 0.35} width={w * 0.12} height={h * 0.22} fill={lit ? '#fde68a' : '#94a3b8'} />
            ))}
          </g>
        ))}
      </g>
      {/* rail and the shuttle */}
      <path d="M-20 500 C200 470 380 430 560 392 C620 380 660 376 700 376" fill="none" stroke="#5b4636" strokeWidth="10" strokeDasharray="3 7" />
      <path d="M-20 500 C200 470 380 430 560 392 C620 380 660 376 700 376" fill="none" stroke="#9aa5b1" strokeWidth="2" />
      <g transform="translate(380 420) rotate(-11)">
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(${i * 46} 0)`}>
            <rect width="42" height="20" rx="3" fill={i === 3 ? '#b91c1c' : '#1e3a8a'} />
            <rect y="13" width="42" height="3" fill="#fbc900" />
            <rect x="5" y="4" width="32" height="6" fill={lit ? '#fde68a' : '#1f2937'} />
          </g>
        ))}
        {lit && <circle cx="188" cy="10" r="5" fill="#fff4c2" />}
      </g>
    </svg>
  )
}
