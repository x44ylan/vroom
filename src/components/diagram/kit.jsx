import React from 'react';

// Shared drawing kit so every lesson diagram has the same light, metal, and labels.
export const C = {
  bg: '#181818', panel: '#272727', line: '#474747', steel: '#a0a0a0', steelHi: '#e3e3e3', steelLo: '#555555',
  iron: '#636363', ink: '#efefef', muted: '#a5a5a5', blue: '#c9c9c9', blueHi: '#d6d6d6', blueLo: '#717171',
  hot: '#c0c0c0', warm: '#e1e1e1', good: '#d8d8d8',
};

export function Defs() {
  return (
    <defs>
      <linearGradient id="k-steel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ebebeb" /><stop offset=".45" stopColor="#adadad" /><stop offset=".55" stopColor="#949494" /><stop offset="1" stopColor="#636363" />
      </linearGradient>
      <linearGradient id="k-steel-h" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#636363" /><stop offset=".45" stopColor="#d5d5d5" /><stop offset=".6" stopColor="#a0a0a0" /><stop offset="1" stopColor="#555555" />
      </linearGradient>
      <linearGradient id="k-iron" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#555555" /><stop offset="1" stopColor="#323232" />
      </linearGradient>
      <linearGradient id="k-blue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#cfcfcf" /><stop offset=".5" stopColor="#c9c9c9" /><stop offset="1" stopColor="#9e9e9e" />
      </linearGradient>
      <radialGradient id="k-glow" cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor="#c9c9c9" stopOpacity=".45" /><stop offset="1" stopColor="#c9c9c9" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="k-floor" cx=".5" cy="0" r="1">
        <stop offset="0" stopColor="#686868" stopOpacity=".55" /><stop offset="1" stopColor="#181818" stopOpacity="0" />
      </radialGradient>
      <pattern id="k-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0H0V20" fill="none" stroke="#383838" strokeWidth="1" />
      </pattern>
      <filter id="k-shadow" x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity=".55" />
      </filter>
      <filter id="k-bloom" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <radialGradient id="k-flame" cx=".5" cy=".3" r=".6">
        <stop offset="0" stopColor="#f7f7f7" /><stop offset=".35" stopColor="#e1e1e1" /><stop offset=".75" stopColor="#cdcdcd" stopOpacity=".6" /><stop offset="1" stopColor="#cdcdcd" stopOpacity="0" />
      </radialGradient>
      <marker id="k-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" fill="#c9c9c9" />
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
      <rect width={w} height="38" rx="9" fill="#212121" stroke={C.line} />
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
      <path d={gearPath(r, teeth, Math.max(4, r * 0.12))} fill={fill} stroke="#202020" strokeWidth="1" />
      <circle r={r * 0.62} fill="none" stroke="#202020" strokeOpacity=".35" />
      {Array.from({ length: spokes }, (_, i) => (
        <circle key={i} cx={Math.cos((i / spokes) * Math.PI * 2) * r * 0.42} cy={Math.sin((i / spokes) * Math.PI * 2) * r * 0.42} r={r * 0.1} fill={hub} />
      ))}
      <circle r={Math.max(5, r * 0.18)} fill={hub} stroke="#202020" />
    </g>
  );
}

// Tyre seen from the side.
export function SideWheel({ cx, cy, r, spin = 0 }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle r={r} fill="#1c1c1c" stroke="#0b0b0b" strokeWidth="2" />
      <circle r={r * 0.92} fill="none" stroke="#323232" strokeWidth={r * 0.06} />
      <circle r={r * 0.66} fill="url(#k-steel)" />
      <g transform={`rotate(${spin})`}>
        {[0, 72, 144, 216, 288].map(a => (
          <path key={a} d={`M${-r * 0.07},${-r * 0.16}L${-r * 0.1},${-r * 0.6}L${r * 0.1},${-r * 0.6}L${r * 0.07},${-r * 0.16}Z`} fill="#202020" transform={`rotate(${a})`} />
        ))}
      </g>
      <circle r={r * 0.16} fill="#d5d5d5" stroke="#555555" />
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
export function Pipe({ d, w = 12, color = '#555555', opacity = 1 }) {
  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke="#131313" strokeWidth={w + 3} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#ffffff" strokeOpacity=".14" strokeWidth={w * 0.3} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

// Moving dots along any path: the dash pattern scrolls with time.
export function Flow({ d, t, speed = 40, color = C.blueHi, width = 4, gap = 14, opacity = 0.95 }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={`0.1 ${gap}`} strokeDashoffset={-t * speed} opacity={opacity} />;
}

// Cold-to-hot shade for temperatures and loads: dark grey when cool, white when hot.
export function heatColor(n) {
  const x = Math.min(1, Math.max(0, n));
  const v = Math.round(84 + (250 - 84) * x);
  return `rgb(${v},${v},${v})`;
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
