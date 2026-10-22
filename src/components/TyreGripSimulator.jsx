import React, { useState } from 'react';
import { CircleDot } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Stage, Callout, C } from './diagram/kit.jsx';
import { Badge } from './ui/badge.jsx';

// A tyre has one grip budget. It is shared between cornering and
// braking/accelerating. The friction circle shows that budget: as long as the
// combined demand stays inside the circle the tyre holds; cross the edge and it
// slides. A grippier road (dry) gives a bigger circle; ice gives a tiny one.
const SURFACES = {
  dry: { label: 'Dry road', mu: 1.0, note: 'Warm, dry tarmac. The most grip a street tyre usually sees.' },
  wet: { label: 'Wet road', mu: 0.6, note: 'A film of water cuts grip by roughly a third. Brake and turn earlier.' },
  ice: { label: 'Ice', mu: 0.15, note: 'Almost no grip. Even gentle inputs can break the tyre loose.' },
};

export default function TyreGripSimulator() {
  const [surface, setSurface] = useState('dry');
  const [corner, setCorner] = useState(40); // lateral demand, -100..100 (left..right)
  const [drive, setDrive] = useState(30);   // longitudinal demand, -100 brake .. 100 accelerate

  const mu = SURFACES[surface].mu;
  // Demand as a fraction of a full dry-grip budget, then measured against this
  // surface's smaller budget. magnitude > 1 means the tyre has run out of grip.
  const demand = Math.hypot(corner / 100, drive / 100);
  const used = demand / mu;
  const sliding = used > 1.001;
  const headroom = Math.max(0, Math.round((1 - Math.min(1, used)) * 100));

  // Diagram geometry: a circle whose radius scales with the surface grip.
  const cx = 150, cy = 150, rMax = 118;
  const r = rMax * mu;
  const px = cx + (corner / 100) * rMax;
  const py = cy - (drive / 100) * rMax;
  const driveLabel = drive >= 0 ? 'Accelerating' : 'Braking';
  const cornerLabel = corner === 0 ? 'Straight' : corner > 0 ? 'Turning right' : 'Turning left';

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <CircleDot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Spend the tyre's grip</CardTitle>
              <Badge variant="info" className="hidden sm:inline-flex">Friction circle</Badge>
            </div>
            <CardDescription>Share one grip budget between turning and braking, then change the road surface.</CardDescription>
          </div>
        </div>

        <div className="action-chips" role="group" aria-label="Road surface">
          {Object.entries(SURFACES).map(([key, s]) => (
            <button
              key={key}
              type="button"
              className="action-chip"
              aria-pressed={surface === key}
              onClick={() => setSurface(key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="diagram-frame relative w-full aspect-[25/16]">
            <Stage viewBox="0 0 300 300" label="Friction circle: how much of the tyre's grip the current inputs use">
              {/* Grip budget ring for this surface */}
              <circle cx={cx} cy={cy} r={rMax} fill="none" stroke="#333333" strokeWidth="1" strokeDasharray="3 4" />
              <circle cx={cx} cy={cy} r={r} fill={sliding ? '#2a2a2a' : '#222222'} stroke={sliding ? '#e3e3e3' : '#6a6a6a'} strokeWidth="2" />
              {/* Axes */}
              <line x1={cx} y1={cy - rMax} x2={cx} y2={cy + rMax} stroke="#3c3c3c" strokeWidth="1" />
              <line x1={cx - rMax} y1={cy} x2={cx + rMax} y2={cy} stroke="#3c3c3c" strokeWidth="1" />
              <text x={cx} y={cy - rMax - 6} fill={C.muted} fontSize="10" textAnchor="middle">Accelerate</text>
              <text x={cx} y={cy + rMax + 14} fill={C.muted} fontSize="10" textAnchor="middle">Brake</text>
              <text x={cx - rMax - 6} y={cy + 3} fill={C.muted} fontSize="10" textAnchor="end">Left</text>
              <text x={cx + rMax + 6} y={cy + 3} fill={C.muted} fontSize="10" textAnchor="start">Right</text>
              {/* Demand vector from the centre to the current point */}
              <line x1={cx} y1={cy} x2={px} y2={py} stroke={sliding ? '#e3e3e3' : '#c9c9c9'} strokeWidth="2" />
              <circle cx={px} cy={py} r="7" fill={sliding ? '#ffffff' : '#c9c9c9'} stroke="#111111" strokeWidth="1.5" />
              {sliding && <circle cx={px} cy={py} r="12" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity=".5" />}
              <Callout x={cx} y={cy} tx={cx + 8} ty={cy + 40} color={C.muted}>Grip limit</Callout>
            </Stage>

            <div className="absolute diagram-footer">
              <span className="text-slate-300 font-medium truncate">
                {sliding ? 'Past the limit: the tyre slides' : `Grip in reserve: ${headroom}%`}
              </span>
              <span className="font-mono text-emerald-400 font-bold shrink-0">{Math.round(used * 100)}% used</span>
            </div>
          </div>

          <div className="w-full mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">Cornering:</span>
                <span className="text-amber-400 font-mono font-bold">{cornerLabel}</span>
              </div>
              <input
                type="range" aria-label="Cornering force"
                min="-100" max="100" value={corner}
                onChange={(e) => setCorner(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">Pedal:</span>
                <span className="text-cyan-400 font-mono font-bold">{driveLabel}</span>
              </div>
              <input
                type="range" aria-label="Braking or accelerating"
                min="-100" max="100" value={drive}
                onChange={(e) => setDrive(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              One budget, shared every moment
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              A tyre can only grip the road so hard. That grip is spent on turning, on braking, and on accelerating all at once. Ask for a hard turn and hard braking together and the arrow reaches past the circle, so the tyre lets go.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {SURFACES[surface].note} The dashed ring is full dry grip; the solid ring is what this surface actually offers.
            </p>
            <p className="garage-catch text-xs text-slate-300 leading-relaxed">
              <strong>Why drivers brake in a straight line</strong>
              Braking first, then turning, keeps each demand smaller than doing both at once, so the tyre stays inside its circle.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
