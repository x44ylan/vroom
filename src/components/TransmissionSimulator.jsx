import React, { useState } from 'react';
import { Layers, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function TransmissionSimulator() {
  const [selectedGear, setSelectedGear] = useState(1);
  const [engineRpm, setEngineRpm] = useState(3000);

  // Exact Toyota W55 5-Speed Manual Gearing for Lexus IS300
  const GEAR_CONFIG = {
    1: { ratio: 3.57, label: '1st Gear', name: 'Launch & Torque Multiply', desc: 'Accelerates 1,475 kg curb weight from stop using 3.57:1 torque leverage.' },
    2: { ratio: 1.90, label: '2nd Gear', name: 'Town Acceleration', desc: 'Pulls briskly through the 2JZ-GE 3,800 RPM peak torque shelf.' },
    3: { ratio: 1.38, label: '3rd Gear', name: 'Mid-Range Passing', desc: 'Direct throttle response from 50 to 110 km/h.' },
    4: { ratio: 1.00, label: '4th Gear', name: 'Direct 1:1 Drive', desc: 'Mainshaft locked direct with zero transmission gearing drag.' },
    5: { ratio: 0.78, label: '5th / Overdrive', name: 'Highway Cruising', desc: 'Drops 2JZ cruising RPM at 110 km/h to ~2,750 RPM for fuel economy.' }
  };

  const current = GEAR_CONFIG[selectedGear];
  const outputRpm = Math.round(engineRpm / current.ratio);
  const finalDriveRatio = 3.73; // Lexus IS300 manual final drive
  const wheelRpm = Math.round(outputRpm / finalDriveRatio);
  const vehicleSpeed = Math.round((wheelRpm * 2.042 * 60) / 1000);
  const engineTorque = 296; // 2JZ-GE rated 296 Nm (218 lb-ft)
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
              <CardTitle>Lexus IS300 W55 5-Speed Transmission & Torque Multiplication</CardTitle>
              <Badge variant="default" className="hidden sm:inline-flex">W55 / A650E Gearing</Badge>
            </div>
            <CardDescription>Torque leverage and speed multiplication through the 2JZ-GE powertrain</CardDescription>
          </div>
        </div>

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
              <text x="60" y="110" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">2JZ CRANKSHAFT</text>

              <g transform="translate(150, 130)">
                <circle cx="0" cy="0" r={40 / Math.sqrt(current.ratio)} fill="url(#driveMetallic)" stroke="#fef08a" strokeWidth="2" />
                <circle cx="0" cy="0" r={40 / Math.sqrt(current.ratio) + 6} stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" fill="none" />
                <circle cx="0" cy="0" r="10" fill="#0f172a" />
                <text x="0" y="4" fill="#0f172a" fontSize="10" textAnchor="middle" fontWeight="bold">INPUT</text>
              </g>

              <g transform="translate(270, 130)">
                <circle cx="0" cy="0" r={40 * Math.sqrt(current.ratio)} fill="url(#gearMetallic)" stroke="#cbd5e1" strokeWidth="2" />
                <circle cx="0" cy="0" r={40 * Math.sqrt(current.ratio) + 6} stroke="#64748b" strokeWidth="3" strokeDasharray="6 4" fill="none" />
                <circle cx="0" cy="0" r="12" fill="#0f172a" />
                <text x="0" y="4" fill="#cbd5e1" fontSize="10" textAnchor="middle" fontWeight="bold">OUTPUT</text>
              </g>

              <rect x="330" y="120" width="100" height="20" fill="#3b82f6" rx="3" />
              <text x="380" y="110" fill="#60a5fa" fontSize="10" textAnchor="middle" fontWeight="bold">PROPELLER SHAFT</text>
            </svg>

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-medium truncate">{current.label}: {current.name}</span>
              <span className="font-mono text-amber-400 font-bold shrink-0">Ratio: {current.ratio}:1</span>
            </div>
          </div>

          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">2JZ-GE Engine RPM:</span>
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
              Live Powertrain Calculations (IS300 Specific)
            </h4>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                <span className="text-xs text-slate-400">Transmission Output Speed:</span>
                <span className="text-sm font-mono font-bold text-white">{outputRpm} RPM</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                <span className="text-xs text-slate-400">Road Speed:</span>
                <span className="text-base font-mono font-bold text-emerald-400">{vehicleSpeed} km/h</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                <span className="text-xs text-slate-400">Rear Wheel Torque:</span>
                <span className="text-base font-mono font-bold text-amber-400">{wheelTorque} Nm</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
              In 1st gear (3.57 ratio) with the 3.73 final drive, the 2JZ-GE engine's 296 Nm of torque is multiplied by <strong>13.3×</strong>, delivering nearly <strong>4,000 Nm</strong> to the rear tires to rocket the IS300 off the line.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
