import React from 'react';

// Shared drawing kit so every lesson diagram has the same light, metal, and labels.
export const C = {
  bg: '#0a0f18', panel: '#121a27', line: '#22304a', steel: '#8c97ab', steelHi: '#d9e2f0', steelLo: '#3a4558',
  iron: '#4b5568', ink: '#e8eefb', muted: '#8f9bb3', blue: '#4d94ff', blueHi: '#a9cbff', blueLo: '#173a7a',
  hot: '#ff5a4f', warm: '#ffb547', good: '#3ddc97',
};

export function Defs() {
  return (
    <defs>
      <linearGradient id="k-steel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e4ebf6" /><stop offset=".45" stopColor="#9aa6ba" /><stop offset=".55" stopColor="#7d899e" /><stop offset="1" stopColor="#4a5568" />
      </linearGradient>
      <linearGradient id="k-steel-h" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#4a5568" /><stop offset=".45" stopColor="#c9d3e3" /><stop offset=".6" stopColor="#8c97ab" /><stop offset="1" stopColor="#3a4558" />
      </linearGradient>
      <linearGradient id="k-iron" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3b4659" /><stop offset="1" stopColor="#1d2533" />
      </linearGradient>
      <linearGradient id="k-blue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8fbcff" /><stop offset=".5" stopColor="#4d94ff" /><stop offset="1" stopColor="#2457b8" />
      </linearGradient>
      <radialGradient id="k-glow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor="#4d94ff" stopOpacity=".45" /><stop offset="1" stopColor="#4d94ff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="k-floor" cx=".5" cy="0" r="1">
        <stop offset="0" stopColor="#1c3a6e" stopOpacity=".55" /><stop offset="1" stopColor="#0a0f18" stopOpacity="0" />
      </radialGradient>
      <pattern id="k-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0H0V20" fill="none" stroke="#16213a" strokeWidth="1" />
      </pattern>
      <filter id="k-shadow" x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity=".55" />
      </filter>
      <filter id="k-bloom" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <radialGradient id="k-flame" cx=".5" cy=".3" r=".6">
        <stop offset="0" stopColor="#fff6d6" /><stop offset=".35" stopColor="#ffb547" /><stop offset=".75" stopColor="#ff5a2a" stopOpacity=".6" /><stop offset="1" stopColor="#ff5a2a" stopOpacity="0" />
      </radialGradient>
      <marker id="k-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" fill="#4d94ff" />
      </marker>
    </defs>
  );
}

// Stage: the dark panel every diagram sits on.
export function Stage({ viewBox, children, label, className = '' }) {
  const [, , w, h] = viewBox.split(' ').map(Number);
  return (
    <svg viewBox={viewBox} className={`diagram ${className}`} role="img" aria-label={label}>
      <Defs />
      <rect width={w} height={h} fill={C.bg} />
      <rect width={w} height={h} fill="url(#k-grid)" opacity=".6" />
      {children}
    </svg>
  );
}

// Callout: dot on the part, a leader line, and an underline under the label.
// The leader always joins the end of the underline nearest the part, so it never crosses the text.
export function Callout({ x, y, tx, ty, children, anchor = 'start', color = C.muted }) {
  const text = React.Children.toArray(children).join('');
  const w = text.length * 6.1;
  const left = anchor === 'end' ? tx - w - 8 : anchor === 'middle' ? tx - w / 2 - 4 : tx;
  const right = left + w + 8;
  const uy = ty + 8;
  const joinX = x <= left ? left : x >= right ? right : x;
  return (
    <g className="callout">
      <polyline points={`${x},${y} ${joinX},${uy}`} fill="none" stroke={color} strokeWidth="1" opacity=".55" />
      <line x1={left} y1={uy} x2={right} y2={uy} stroke={color} strokeWidth="1" opacity=".35" />
      <circle cx={x} cy={y} r="3" fill={color} />
      <circle cx={x} cy={y} r="6" fill={color} opacity=".18" />
      <text x={left + 4} y={ty + 3} fill={color} fontSize="11" fontWeight="600">{children}</text>
    </g>
  );
}

// Readout chip drawn inside the SVG.
export function Chip({ x, y, label, value, color = C.ink, w = 120 }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width={w} height="38" rx="9" fill="#0d1421" stroke={C.line} />
      <text x="10" y="15" fill={C.muted} fontSize="10">{label}</text>
      <text x="10" y="30" fill={color} fontSize="13" fontWeight="600" style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</text>
    </g>
  );
}

// Gear outline with real teeth.
export function gearPath(r, teeth, depth = 6) {
  const pts = [];
  const step = (Math.PI * 2) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const parts = [[a, r - depth], [a + step * 0.18, r], [a + step * 0.5, r], [a + step * 0.68, r - depth]];
    for (const [ang, rad] of parts) pts.push(`${(Math.cos(ang) * rad).toFixed(2)},${(Math.sin(ang) * rad).toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
}

export function Gear({ r, teeth, angle = 0, fill = 'url(#k-steel)', hub = C.bg, spokes = 0, ...rest }) {
  return (
    <g transform={`rotate(${angle})`} {...rest}>
      <path d={gearPath(r, teeth, Math.max(4, r * 0.12))} fill={fill} stroke="#0b1220" strokeWidth="1" />
      <circle r={r * 0.62} fill="none" stroke="#0b1220" strokeOpacity=".35" />
      {Array.from({ length: spokes }, (_, i) => (
        <circle key={i} cx={Math.cos((i / spokes) * Math.PI * 2) * r * 0.42} cy={Math.sin((i / spokes) * Math.PI * 2) * r * 0.42} r={r * 0.1} fill={hub} />
      ))}
      <circle r={Math.max(5, r * 0.18)} fill={hub} stroke="#0b1220" />
    </g>
  );
}

// Tyre seen from the side.
export function SideWheel({ cx, cy, r, spin = 0 }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle r={r} fill="#10141c" stroke="#05070b" strokeWidth="2" />
      <circle r={r * 0.92} fill="none" stroke="#1d2533" strokeWidth={r * 0.06} />
      <circle r={r * 0.66} fill="url(#k-steel)" />
      <g transform={`rotate(${spin})`}>
        {[0, 72, 144, 216, 288].map(a => (
          <path key={a} d={`M${-r * 0.07},${-r * 0.16}L${-r * 0.1},${-r * 0.6}L${r * 0.1},${-r * 0.6}L${r * 0.07},${-r * 0.16}Z`} fill="#0f1520" transform={`rotate(${a})`} />
        ))}
      </g>
      <circle r={r * 0.16} fill="#c9d3e3" stroke="#3a4558" />
    </g>
  );
}

// Animation clock in seconds. It runs at up to 30 fps, pauses while the tab is hidden,
// and stays at 0 when reduced motion is requested.
export function useClock(running = true) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    if (!running || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf, last = performance.now(), acc = 0;
    const loop = now => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (document.hidden) return;
      acc += dt;
      if (acc >= 1 / 30) { const step = acc; acc = 0; setT(v => v + step); }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);
  return t;
}

// Smooth curve through points (Catmull-Rom converted to cubic Béziers).
export function smoothPath(pts, close = false) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return close ? `${d}Z` : d;
}

// Tube: dark casing, coloured core, soft highlight.
export function Pipe({ d, w = 12, color = '#3a4558', opacity = 1 }) {
  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke="#070b12" strokeWidth={w + 3} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#fff" strokeOpacity=".14" strokeWidth={w * 0.3} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

// Moving dots along any path: the dash pattern scrolls with time.
export function Flow({ d, t, speed = 40, color = C.blueHi, width = 4, gap = 14, opacity = 0.95 }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={`0.1 ${gap}`} strokeDashoffset={-t * speed} opacity={opacity} />;
}

// Cold-to-hot colour for temperatures and loads (0 = cool blue, 1 = red hot).
export function heatColor(n) {
  const stops = [[0, [77, 148, 255]], [0.55, [255, 181, 71]], [1, [255, 77, 64]]];
  const x = Math.min(1, Math.max(0, n));
  for (let i = 0; i < stops.length - 1; i++) {
    const [a, ca] = stops[i], [b, cb] = stops[i + 1];
    if (x <= b) { const k = (x - a) / (b - a); return `rgb(${ca.map((c, j) => Math.round(c + (cb[j] - c) * k)).join(',')})`; }
  }
  return 'rgb(255,77,64)';
}

export function Arrow({ x1, y1, x2, y2, color = C.blue, w = 3 }) {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 7 + w * 1.5;
  const p = (ang) => `${x2 - Math.cos(a + ang) * h},${y2 - Math.sin(a + ang) * h}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - Math.cos(a) * h * 0.6} y2={y2 - Math.sin(a) * h * 0.6} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <path d={`M${x2},${y2} L${p(0.45)} L${p(-0.45)} Z`} fill={color} />
    </g>
  );
}
