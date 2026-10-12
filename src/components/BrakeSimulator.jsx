import React, { useState } from 'react';
import { Disc, Zap, CheckCircle2, AlertOctagon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function BrakeSimulator() {
  const [pedalForce, setPedalForce] = useState(40);
  const [absEnabled, setAbsEnabled] = useState(true);

  const footForceN = Math.round((pedalForce / 100) * 500);
  const linePressureBar = Math.round((pedalForce / 100) * 110);
  const clampingForceN = Math.round(linePressureBar * 95);
  const rotorTempC = Math.round(50 + (pedalForce / 100) * 380);

  const isLockupThreshold = pedalForce > 75;
  const isWheelLocked = isLockupThreshold && !absEnabled;

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 shrink-0">
            <Disc className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Hydraulic Disc Brakes & ABS Simulator</CardTitle>
              <Badge variant="destructive" className="hidden sm:inline-flex">Hydraulics</Badge>
            </div>
            <CardDescription>Pascal's law hydraulic force multiplication and anti-lock slip regulation</CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-300 pl-1">ABS Status:</span>
          <Button
            size="sm"
            variant={absEnabled ? "success" : "destructive"}
            onClick={() => setAbsEnabled(!absEnabled)}
            className="flex-1 sm:flex-none"
          >
            {absEnabled ? 'ABS ENABLED' : 'ABS DISABLED'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[16/11] bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 440 280" className="w-full h-full select-none">
              <defs>
                <radialGradient id="rotorHeat" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={rotorTempC > 300 ? '#ef4444' : rotorTempC > 180 ? '#f97316' : '#64748b'} />
                  <stop offset="70%" stopColor={rotorTempC > 300 ? '#b91c1c' : rotorTempC > 180 ? '#c2410c' : '#334155'} />
                  <stop offset="100%" stopColor="#1e293b" />
                </radialGradient>
              </defs>

              <g transform="translate(220, 140)">
                <circle cx="0" cy="0" r="105" fill="url(#rotorHeat)" stroke="#94a3b8" strokeWidth="3" />
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  return <circle key={deg} cx={75 * Math.cos(rad)} cy={75 * Math.sin(rad)} r="3.5" fill="#0f172a" stroke="#475569" />;
                })}
                <circle cx="0" cy="0" r="45" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              </g>

              <g transform="translate(290, 45)">
                <path d="M 0 0 C 40 0, 70 30, 70 80 C 70 120, 30 140, 0 140 L -25 140 L -25 0 Z" fill="#be185d" stroke="#f472b6" strokeWidth="3" />
                <rect x="-22" y={25 + (pedalForce / 100) * 4} width="18" height="90" rx="2" fill="#475569" stroke="#cbd5e1" strokeWidth="1.5" />
                <text x="25" y="75" fill="#fdf2f8" fontSize="11" fontWeight="bold">{clampingForceN} N</text>
                <text x="25" y="90" fill="#fbcfe8" fontSize="9">CLAMP FORCE</text>
              </g>

              <path d="M 330 0 L 330 45" fill="none" stroke="#ec4899" strokeWidth="4" />
              <text x="340" y="25" fill="#f472b6" fontSize="9" fontWeight="bold">{linePressureBar} BAR</text>
            </svg>

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              {isWheelLocked ? (
                <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs truncate">
                  <AlertOctagon className="w-4 h-4 shrink-0" /> WHEEL LOCKED & SKIDDING!
                </div>
              ) : isLockupThreshold && absEnabled ? (
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs truncate">
                  <Zap className="w-4 h-4 shrink-0" /> ABS PULSING (20 Hz)
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-xs truncate">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Progressive braking
                </div>
              )}
              <span className="font-mono text-slate-300 font-bold shrink-0">{rotorTempC}°C</span>
            </div>
          </div>

          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Brake Pedal Pressure:</span>
              <span className="text-pink-400 font-mono font-bold">{pedalForce}% ({footForceN} N Effort)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="2"
              value={pedalForce}
              onChange={(e) => setPedalForce(Number(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400">
              Pascal's Principle (Hydraulic Amplification)
            </h4>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-center text-pink-300 font-bold">
              Pressure (P) = F₁ / A₁ = F₂ / A₂
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Incompressible hydraulic fluid transfers foot pedal pressure into large caliper pistons, resulting in over <strong>1,000 kg of clamping force</strong> against spinning steel rotors.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
