import React, { useState } from 'react';
import { Wind, Activity, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function AerodynamicsSimulator() {
  const [speedKmh, setSpeedKmh] = useState(110);
  const [vehicleType, setVehicleType] = useState('is300'); // 'is300', 'is300-wing', 'suv'

  const PROFILES = {
    is300: { name: 'Lexus IS300 Stock Sedan', cd: 0.28, frontalAreaM2: 2.15, desc: 'Compact sports sedan with factory underbody trays and slick Altezza wedge profile.' },
    'is300-wing': { name: 'IS300 SportDesign with Rear Spoiler', cd: 0.30, frontalAreaM2: 2.18, downforceKg: 65, desc: 'Adds high-speed rear axle stability and downforce while marginally increasing drag.' },
    suv: { name: 'Full-Size SUV (Lexus LX470)', cd: 0.40, frontalAreaM2: 2.95, desc: 'Upright windshield and bluff rear create heavy aerodynamic turbulence drag.' }
  };

  const profile = PROFILES[vehicleType];
  const speedMs = (speedKmh * 1000) / 3600;
  const rho = 1.225;

  const dragForceN = Math.round(0.5 * rho * speedMs * speedMs * profile.cd * profile.frontalAreaM2);
  const powerOvercomeWatts = dragForceN * speedMs;
  const powerHp = Math.round((powerOvercomeWatts / 745.7) * 10) / 10;

  const downforceKg = profile.downforceKg
    ? Math.round(profile.downforceKg * Math.pow(speedKmh / 160, 2))
    : Math.round(15 * Math.pow(speedKmh / 140, 2));

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Lexus IS300 Aerodynamics & High-Speed Highway Drag</CardTitle>
              <Badge variant="success" className="hidden sm:inline-flex">Cd: 0.28 Drag Coefficient</Badge>
            </div>
            <CardDescription>How the XE10 compact body cuts through air resistance at autobahn speeds</CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
          {Object.entries(PROFILES).map(([key, item]) => (
            <Button
              key={key}
              size="sm"
              variant={vehicleType === key ? "default" : "ghost"}
              onClick={() => setVehicleType(key)}
              className="flex-1 sm:flex-none text-xs whitespace-nowrap"
            >
              {item.name.split(' (')[0]}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[16/11] bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 460 300" className="w-full h-full select-none">
              <defs>
                <linearGradient id="windStream" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="wakeTurbulence" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="20" y1="230" x2="440" y2="230" stroke="#475569" strokeWidth="4" />

              {/* IS300 Silhouette */}
              <g transform="translate(140, 140)">
                <path d="M 20 85 L 35 65 Q 60 55, 90 40 Q 140 35, 175 40 Q 210 50, 240 85 Z" fill="#1e293b" stroke="#10b981" strokeWidth="3" />
                {vehicleType === 'is300-wing' && (
                  <line x1="230" y1="52" x2="245" y2="50" stroke="#34d399" strokeWidth="4" />
                )}
                <circle cx="65" cy="88" r="16" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
                <circle cx="195" cy="88" r="16" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
              </g>

              {[60, 90, 120, 150, 180, 210].map((y) => (
                <path
                  key={y}
                  d={`M 440 ${y} C 360 ${y}, 280 ${Math.max(40, y - (y < 160 ? 35 : 0))}, 140 ${y} L 30 ${y}`}
                  fill="none"
                  stroke="url(#windStream)"
                  strokeWidth="2.5"
                  strokeDasharray="12 6"
                />
              ))}

              <ellipse cx="120" cy="175" rx={vehicleType === 'suv' ? 45 : 26} ry={vehicleType === 'suv' ? 38 : 18} fill="url(#wakeTurbulence)" className="animate-pulse" />
            </svg>

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-medium truncate">
                {profile.name} (Cd: {profile.cd})
              </span>
              <span className="font-mono text-emerald-400 font-bold shrink-0">Drag Force: {dragForceN} N</span>
            </div>
          </div>

          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">IS300 Road Speed:</span>
              <span className="text-emerald-400 font-mono font-bold">{speedKmh} km/h ({(speedKmh * 0.621).toFixed(0)} mph)</span>
            </div>
            <input
              type="range"
              min="30"
              max="240"
              step="5"
              value={speedKmh}
              onChange={(e) => setSpeedKmh(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Aerodynamic Downforce & Power Demand
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Power Consumed by Aero Drag:</span>
                <span className="text-sm font-mono font-bold text-amber-400">{powerHp} Horsepower</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Aerodynamic Downforce:</span>
                <span className="text-sm font-mono font-bold text-cyan-400">{downforceKg} kg Grip</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
              The IS300's smooth underbody and 0.28 Cd allow it to glide efficiently, requiring only <strong>~22 horsepower</strong> from its 215 hp engine to maintain 110 km/h cruising on flat highway tarmac.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
