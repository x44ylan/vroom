import React, { useState } from 'react';
import { ArrowDownUp, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function SuspensionSimulator() {
  const [springStiffness, setSpringStiffness] = useState(60);
  const [damperRate, setDamperRate] = useState(50);
  const [roadBumpType, setRoadBumpType] = useState('pothole');
  const [isBumping, setIsBumping] = useState(false);

  const triggerBump = (type) => {
    setRoadBumpType(type);
    setIsBumping(true);
    setTimeout(() => setIsBumping(false), 900);
  };

  const isUnderdamped = damperRate < 35;
  const isHarsh = springStiffness > 80 && damperRate > 75;

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
            <ArrowDownUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Suspension Dynamics: Springs & Dampers</CardTitle>
              <Badge variant="info" className="hidden sm:inline-flex">Damping</Badge>
            </div>
            <CardDescription>Spring rate and shock absorber orifice damping keep tires glued to the road</CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          {['pothole', 'speedbump', 'washboard'].map((type) => (
            <Button
              key={type}
              size="sm"
              variant="secondary"
              onClick={() => triggerBump(type)}
              className="flex-1 sm:flex-none text-xs capitalize"
            >
              {type === 'speedbump' ? 'Speed Bump' : type}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[16/11] bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 440 300" className="w-full h-full select-none">
              <defs>
                <linearGradient id="chassisWeightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
              </defs>

              <g
                transform={`translate(220, ${isBumping ? (roadBumpType === 'pothole' ? 62 : 48) : 55})`}
                className="transition-transform duration-300 ease-out"
              >
                <rect x="-140" y="-30" width="280" height="40" rx="6" fill="url(#chassisWeightGrad)" stroke="#7dd3fc" strokeWidth="2" />
                <text x="0" y="-8" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">
                  SPRUNG MASS (Chassis ~400 kg/corner)
                </text>
              </g>

              <g transform="translate(170, 75)">
                <path
                  d={`M 0 0 L 15 15 L -15 30 L 15 45 L -15 60 L 15 75 L -15 90 L 15 105 L 0 120`}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text x="-25" y="65" fill="#fde047" fontSize="9" textAnchor="end" fontWeight="bold">SPRING (k)</text>
              </g>

              <g transform="translate(270, 75)">
                <rect x="-14" y="45" width="28" height="75" rx="3" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
                <rect x="-5" y="0" width="10" height="60" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                <text x="25" y="65" fill="#67e8f9" fontSize="9" fontWeight="bold">DAMPER (c)</text>
              </g>

              <line x1="140" y1="210" x2="220" y2="195" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />

              <g
                transform={`translate(220, ${isBumping ? (roadBumpType === 'pothole' ? 205 : 185) : 195})`}
                className="transition-transform duration-100 ease-out"
              >
                <circle cx="0" cy="0" r="30" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                <circle cx="0" cy="0" r="50" fill="none" stroke="#1e293b" strokeWidth="24" />
                <circle cx="0" cy="0" r="62" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="6 4" />
              </g>

              <line x1="40" y1="258" x2="400" y2="258" stroke="#64748b" strokeWidth="4" />
              {roadBumpType === 'speedbump' && <path d="M 180 258 Q 220 238, 260 258" fill="#475569" stroke="#94a3b8" strokeWidth="2" />}
              {roadBumpType === 'pothole' && <path d="M 190 258 Q 220 274, 250 258" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />}
            </svg>

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-medium truncate">
                Damping: {isUnderdamped ? 'Underdamped (Bouncy)' : isHarsh ? 'Overdamped (Stiff Track)' : 'Critically Damped (Optimal)'}
              </span>
              <span className="font-mono text-cyan-400 font-bold shrink-0">{isBumping ? 'Impulse!' : 'Ride Height'}</span>
            </div>
          </div>

          <div className="w-full mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">Spring Rate (k):</span>
                <span className="text-amber-400 font-mono font-bold">{springStiffness} N/mm</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={springStiffness}
                onChange={(e) => setSpringStiffness(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">Damper Rebound:</span>
                <span className="text-cyan-400 font-mono font-bold">{damperRate}%</span>
              </div>
              <input
                type="range"
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
              Springs Store Energy; Dampers Dissipate It
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Springs support the car's weight. Hydraulic dampers force fluid through microscopic shim valves, turning bounce oscillations into heat within 1-2 cycles.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
