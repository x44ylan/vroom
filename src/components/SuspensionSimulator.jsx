import React, { useEffect, useRef, useState } from 'react';
import { ArrowDownUp, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Stage, SideWheel, Callout } from './diagram/kit.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function SuspensionSimulator() {
  const [springStiffness, setSpringStiffness] = useState(60);
  const [damperRate, setDamperRate] = useState(55);
  const [roadBumpType, setRoadBumpType] = useState('pothole');
  const [isBumping, setIsBumping] = useState(false);

  // Quarter-car model: the road moves the wheel, the spring and damper move the body.
  const sim = useRef({ x: 0, v: 0, road: 0, roadT: -1, trace: [] });
  const [frame, setFrame] = useState(0);
  const triggerBump = (type) => {
    setRoadBumpType(type);
    setIsBumping(true);
    sim.current.roadT = 0;
    setTimeout(() => setIsBumping(false), 900);
  };
  useEffect(() => {
    let raf, last = performance.now();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const step = now => {
      const dt = Math.min(0.033, (now - last) / 1000); last = now;
      const st = sim.current;
      // Road input: a short bump (or dip, or ripples) passing under the wheel.
      let road = 0;
      if (st.roadT >= 0) {
        st.roadT += dt;
        const u = st.roadT / 0.35;
        if (roadBumpType === 'washboard') road = st.roadT < 1.2 ? Math.sin(st.roadT * 30) * 5 : 0;
        else if (u < 1) road = Math.sin(u * Math.PI) * (roadBumpType === 'pothole' ? -14 : 18);
        if (st.roadT > 1.4) st.roadT = -1;
      }
      st.road = road;
      const k = 40 + springStiffness * 1.6, c = 1 + damperRate * 0.32;
      const sub = 8;
      for (let i = 0; i < sub; i++) {
        const a = -k * (st.x - road) - c * (st.v - 0);
        st.v += a * (dt / sub); st.x += st.v * (dt / sub);
      }
      st.trace.push(st.x);
      if (st.trace.length > 160) st.trace.shift();
      if (!reduce) setFrame(f => f + 1);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [springStiffness, damperRate, roadBumpType]);

  const isUnderdamped = damperRate < 35;
  const isHarsh = springStiffness > 80 && damperRate > 75;

  const bodyY = 70 - sim.current.x * 1.6;
  const wheelY = 232 - sim.current.road * 1.6;
  const springTop = bodyY + 46, springBottom = wheelY - 34;
  const coils = 7 + Math.round((springStiffness - 20) / 20);
  const springPts = Array.from({ length: coils * 2 + 1 }, (_, i) => {
    const y = springTop + ((springBottom - springTop) * i) / (coils * 2);
    return `${i === 0 || i === coils * 2 ? 200 : i % 2 ? 222 : 178},${y.toFixed(1)}`;
  }).join(' ');
  const trace = sim.current.trace;
  const tracePath = trace.map((x, i) => `${i ? 'L' : 'M'}${370 + i * 0.72},${150 - Math.max(-44, Math.min(44, x * 2.6))}`).join('');
  const roadPath = roadBumpType === 'speedbump'
    ? 'M0 268 H200 Q260 232 320 268 H500'
    : roadBumpType === 'pothole' ? 'M0 268 H210 Q260 296 310 268 H500' : 'M0 268 Q20 260 40 268 T80 268 T120 268 T160 268 T200 268 T240 268 T280 268 T320 268 T360 268 T400 268 T440 268 T480 268';

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
            <ArrowDownUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Try a bump in the road</CardTitle>
              <Badge variant="info" className="hidden sm:inline-flex">Double-Wishbone Geometry</Badge>
            </div>
            <CardDescription>Move the wheel over a bump, then change the spring and damper settings.</CardDescription>
          </div>
        </div>

        <div className="action-chips" role="group" aria-label="Drive over">
          {['pothole', 'speedbump', 'washboard'].map((type) => (
            <Button
              key={type}
              size="sm"
              variant="secondary"
              onClick={() => triggerBump(type)}
              className="action-chip capitalize"
            >
              {type === 'speedbump' ? 'Speed bump' : type}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="diagram-frame relative w-full aspect-[25/16]">
            <Stage viewBox="0 0 500 320" label="Quarter-car suspension: body, spring, damper and wheel">
              {/* Road */}
              <path d={`${roadPath} V320 H0 Z`} fill="#2b2b2b" />
              <path d={roadPath} fill="none" stroke="#555555" strokeWidth="3" />
              {/* Car body (sprung mass) */}
              <g transform={`translate(0 ${bodyY - 70})`}>
                <rect x="80" y="40" width="240" height="66" rx="14" fill="url(#k-blue)" stroke="#202020" />
                <rect x="80" y="40" width="240" height="18" rx="9" fill="#ffffff" opacity=".12" />
                <text x="200" y="80" fill="#2f2f2f" fontSize="13" fontWeight="700" textAnchor="middle">CAR BODY</text>
              </g>
              {/* Upper and lower arms to the wheel */}
              <line x1="96" y1={bodyY + 50} x2="182" y2={wheelY - 24} stroke="#787878" strokeWidth="7" strokeLinecap="round" />
              <line x1="96" y1={bodyY + 86} x2="186" y2={wheelY + 10} stroke="#787878" strokeWidth="9" strokeLinecap="round" />
              {/* Spring */}
              <polyline points={springPts} fill="none" stroke="#c9c9c9" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" />
              {/* Damper: body tube on the wheel, shaft from the car */}
              <rect x="252" y={springTop} width="8" height={Math.max(10, springBottom - springTop - 40)} fill="url(#k-steel-h)" />
              <rect x="244" y={springBottom - 60} width="24" height="60" rx="5" fill="#444444" stroke="#202020" />
              <line x1="256" y1={springBottom} x2="220" y2={wheelY} stroke="#787878" strokeWidth="5" />
              <Callout x={222} y={(springTop + springBottom) / 2} tx={130} ty={160} anchor="end" color="#d6d6d6">Spring</Callout>
              <Callout x={268} y={springBottom - 30} tx={300} ty={238} color="#d5d5d5">Damper</Callout>
              <SideWheel cx={200} cy={wheelY} r={36} spin={frame * 4} />
              {/* Live trace of body movement */}
              <rect x="362" y="96" width="128" height="108" rx="10" fill="#212121" stroke="#474747" />
              <line x1="370" y1="150" x2="484" y2="150" stroke="#474747" />
              <path className="body-trace" d={tracePath} fill="none" stroke="#c9c9c9" strokeWidth="2" />
              <text x="370" y="114" fill="#a5a5a5" fontSize="10">Body movement</text>
            </Stage>

            <div className="absolute diagram-footer">
              <span className="text-slate-300 font-medium truncate">
                Damping: {isUnderdamped ? 'Too little: more bouncing' : isHarsh ? 'Firm' : 'Moderate'}
              </span>
              <span className="font-mono text-cyan-400 font-bold shrink-0">{isBumping ? 'Hitting the bump' : 'Press a road button'}</span>
            </div>
          </div>

          <div className="w-full mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">Spring stiffness:</span>
                <span className="text-amber-400 font-mono font-bold">{springStiffness} N/mm</span>
              </div>
              <input
                type="range" aria-label="Spring rate"
                min="20"
                max="100"
                value={springStiffness}
                onChange={(e) => setSpringStiffness(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">Damping:</span>
                <span className="text-cyan-400 font-mono font-bold">{damperRate}%</span>
              </div>
              <input
                type="range" aria-label="Damper rebound"
                min="10"
                max="90"
                value={damperRate}
                onChange={(e) => setDamperRate(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              The spring and damper have different jobs
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              The spring compresses when the wheel rises over a bump and then pushes back. On its own, it would keep bouncing. The damper resists that movement and helps it settle.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              The suspension arms guide the wheel as it moves. On this car, two arms form a double-wishbone arrangement. They also control how the wheel tilts as the suspension moves.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
