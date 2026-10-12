import React, { useState } from 'react';
import { Layers, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function TransmissionSimulator() {
  const [selectedGear, setSelectedGear] = useState(1);
  const [engineRpm, setEngineRpm] = useState(3000);

  const GEAR_CONFIG = {
    1: { ratio: 3.82, label: '1st Gear', name: 'High Torque / Launch', desc: 'Maximum leverage to get heavy chassis moving from a dead stop.' },
    2: { ratio: 2.15, label: '2nd Gear', name: 'Town Acceleration', desc: 'Balances strong wheel acceleration with manageable engine revs.' },
    3: { ratio: 1.48, label: '3rd Gear', name: 'Mid-Range Passing', desc: 'Direct response for moderate speeds between 45 - 85 km/h.' },
    4: { ratio: 1.00, label: '4th Gear', name: 'Direct 1:1 Drive', desc: 'Input and output shafts rotate at identical RPM with zero gearing loss.' },
    5: { ratio: 0.72, label: '5th / Overdrive', name: 'Highway Cruising', desc: 'Output spins faster than crankshaft. Lowers engine RPM for maximum fuel efficiency.' }
  };

  const current = GEAR_CONFIG[selectedGear];
  const outputRpm = Math.round(engineRpm / current.ratio);
  const finalDriveRatio = 3.73;
  const wheelRpm = Math.round(outputRpm / finalDriveRatio);
  const vehicleSpeed = Math.round((wheelRpm * 2.042 * 60) / 1000);
  const engineTorque = 250;
  const wheelTorque = Math.round(engineTorque * current.ratio * finalDriveRatio);

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Transmission Gear Ratio & Torque Explorer</CardTitle>
              <Badge variant="default" className="hidden sm:inline-flex">Leverage</Badge>
            </div>
            <CardDescription>Gear tooth count ratios multiply torque and regulate highway engine RPM</CardDescription>
          </div>
        </div>

        {/* Mobile touch-friendly gear switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
          {[1, 2, 3, 4, 5].map((g) => (
            <Button
              key={g}
              size="sm"
              variant={selectedGear === g ? "default" : "ghost"}
              onClick={() => setSelectedGear(g)}
              className="flex-1 sm:flex-none px-3 text-xs"
            >
              Gear {g}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[16/10] bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 460 260" className="w-full h-full select-none">
              <defs>
                <radialGradient id="gearMetallic" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="70%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1e293b" />
                </radialGradient>
                <radialGradient id="driveMetallic" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="80%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#78350f" />
                </radialGradient>
              </defs>

              <rect x="20" y="120" width="80" height="20" fill="#64748b" rx="3" />
              <text x="60" y="110" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">ENGINE INPUT</text>

              <g transform="translate(150, 130)">
                <circle cx="0" cy="0" r={40 / Math.sqrt(current.ratio)} fill="url(#driveMetallic)" stroke="#fef08a" strokeWidth="2" />
                <circle cx="0" cy="0" r={40 / Math.sqrt(current.ratio) + 6} stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" fill="none" />
                <circle cx="0" cy="0" r="10" fill="#0f172a" />
                <text x="0" y="4" fill="#0f172a" fontSize="10" textAnchor="middle" fontWeight="bold">IN</text>
              </g>

              <g transform="translate(270, 130)">
                <circle cx="0" cy="0" r={40 * Math.sqrt(current.ratio)} fill="url(#gearMetallic)" stroke="#cbd5e1" strokeWidth="2" />
                <circle cx="0" cy="0" r={40 * Math.sqrt(current.ratio) + 6} stroke="#64748b" strokeWidth="3" strokeDasharray="6 4" fill="none" />
                <circle cx="0" cy="0" r="12" fill="#0f172a" />
                <text x="0" y="4" fill="#cbd5e1" fontSize="10" textAnchor="middle" fontWeight="bold">OUT</text>
              </g>

              <rect x="330" y="120" width="100" height="20" fill="#3b82f6" rx="3" />
              <text x="380" y="110" fill="#60a5fa" fontSize="10" textAnchor="middle" fontWeight="bold">DRIVESHAFT</text>
            </svg>

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-medium">{current.label}: {current.name}</span>
              <span className="font-mono text-amber-400 font-bold">Gear Ratio: {current.ratio}:1</span>
            </div>
          </div>

          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Input Engine RPM:</span>
              <span className="text-amber-400 font-mono font-bold">{engineRpm} RPM</span>
            </div>
            <input
              type="range"
              min="800"
              max="6500"
              step="50"
              value={engineRpm}
              onChange={(e) => setEngineRpm(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Powertrain Calculations
            </h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                <span className="text-xs text-slate-400">Gearbox Output Speed:</span>
                <span className="text-sm font-mono font-bold text-white">{outputRpm} RPM</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                <span className="text-xs text-slate-400">Road Speed:</span>
                <span className="text-base font-mono font-bold text-emerald-400">{vehicleSpeed} km/h</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                <span className="text-xs text-slate-400">Torque at Wheels:</span>
                <span className="text-base font-mono font-bold text-amber-400">{wheelTorque} Nm</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
              <strong>Conservation of Power:</strong> <code className="text-amber-400">Power = Torque × RPM</code>. Reducing rotational speed doubles mechanical torque to launch the vehicle.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs text-blue-200/90 leading-relaxed">
            <div className="font-bold text-blue-300 mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              What is Overdrive?
            </div>
            In 5th gear (ratio 0.72:1), output turns faster than engine. This drops cruising RPM at 110 km/h from ~4,500 down to ~2,200 RPM, drastically reducing fuel consumption.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
