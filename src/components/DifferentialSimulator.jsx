import React, { useState } from 'react';
import { Compass, ArrowLeftRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function DifferentialSimulator() {
  const [turnDirection, setTurnDirection] = useState('straight');
  const [diffType, setDiffType] = useState('torsen'); // 'torsen', 'open'
  const [driveshaftSpeed, setDriveshaftSpeed] = useState(100);

  let leftWheelSpeed = driveshaftSpeed;
  let rightWheelSpeed = driveshaftSpeed;

  if (turnDirection === 'left') {
    leftWheelSpeed = Math.round(driveshaftSpeed * 0.6);
    rightWheelSpeed = Math.round(driveshaftSpeed * 1.4);
  } else if (turnDirection === 'right') {
    leftWheelSpeed = Math.round(driveshaftSpeed * 1.4);
    rightWheelSpeed = Math.round(driveshaftSpeed * 0.6);
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Lexus IS300 Torsen T-2 LSD vs Open Differential</CardTitle>
              <Badge variant="secondary" className="hidden sm:inline-flex">Torsen Type-2 LSD</Badge>
            </div>
            <CardDescription>Torque-sensing crossed helical gears bias drive torque to the tire with maximum adhesion</CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'left', label: 'Turning Left ↰' },
            { id: 'straight', label: 'Straight Ahead ↑' },
            { id: 'right', label: 'Turning Right ↱' }
          ].map((item) => (
            <Button
              key={item.id}
              size="sm"
              variant={turnDirection === item.id ? "secondary" : "ghost"}
              onClick={() => setTurnDirection(item.id)}
              className="flex-1 sm:flex-none text-xs whitespace-nowrap"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[16/11] bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 460 300" className="w-full h-full select-none">
              <defs>
                <radialGradient id="ringGearGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="60%" stopColor="#8b5cf6" />
                  <stop offset="90%" stopColor="#6d28d9" />
                  <stop offset="100%" stopColor="#4c1d95" />
                </radialGradient>
              </defs>

              <g transform="translate(230, 250)">
                <rect x="-10" y="0" width="20" height="45" fill="#38bdf8" />
                <polygon points="-22,0 22,0 0,-18" fill="#0ea5e9" stroke="#38bdf8" strokeWidth="2" />
                <text x="0" y="40" fill="#bae6fd" fontSize="9" textAnchor="middle" fontWeight="bold">PROPELLER PINION</text>
              </g>

              <g transform="translate(230, 150)">
                <circle cx="0" cy="0" r="85" fill="none" stroke="url(#ringGearGrad)" strokeWidth="18" strokeDasharray="10 5" />
                <circle cx="0" cy="0" r="70" fill="#1e1b4b" opacity="0.6" />
                <text x="0" y="-55" fill="#c4b5fd" fontSize="10" textAnchor="middle" fontWeight="bold">3.73:1 M85 RING GEAR</text>
              </g>

              <g transform="translate(60, 150)">
                <rect x="0" y="-8" width="130" height="16" fill="#64748b" />
                <polygon points="130,-22 130,22 145,15 145,-15" fill="#a78bfa" stroke="#c4b5fd" strokeWidth="2" />
                <rect x="-30" y="-45" width="25" height="90" rx="4" fill="#334155" stroke="#64748b" strokeWidth="3" />
                <text x="-18" y="-52" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">LEFT REAR TIRE</text>
                <text x="50" y="25" fill="#e2e8f0" fontSize="12" fontWeight="bold" fontFamily="monospace">{leftWheelSpeed} RPM</text>
              </g>

              <g transform="translate(400, 150)">
                <rect x="-130" y="-8" width="130" height="16" fill="#64748b" />
                <polygon points="-130,-22 -130,22 -145,15 -145,-15" fill="#a78bfa" stroke="#c4b5fd" strokeWidth="2" />
                <rect x="5" y="-45" width="25" height="90" rx="4" fill="#334155" stroke="#64748b" strokeWidth="3" />
                <text x="18" y="-52" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">RIGHT REAR TIRE</text>
                <text x="-90" y="25" fill="#e2e8f0" fontSize="12" fontWeight="bold" fontFamily="monospace">{rightWheelSpeed} RPM</text>
              </g>

              <g transform="translate(230, 115)">
                <polygon points="-16,-5 16,-5 12,12 -12,12" fill="#f59e0b" stroke="#fef08a" strokeWidth="2" />
                <text x="0" y="-12" fill="#fde047" fontSize="9" textAnchor="middle" fontWeight="bold">TORSEN HELICAL PINION</text>
              </g>
              <g transform="translate(230, 185)">
                <polygon points="-16,5 16,5 12,-12 -12,-12" fill="#f59e0b" stroke="#fef08a" strokeWidth="2" />
              </g>
            </svg>

            <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-medium">
                {turnDirection === 'straight' ? 'Straight Line Drive' : 'Cornering: Outer wheel speeds up smoothly'}
              </span>
              <span className="font-mono text-purple-400 font-bold hidden sm:inline">(L + R) / 2 = {driveshaftSpeed} RPM</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Why the IS300 Torsen T-2 is Special
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard base models use an open differential. If the inside wheel lifts or encounters slippery rain, all 218 lb-ft of torque spins that tire helplessly.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              The factory Lexus IS300 sport option <strong>Torsen Type-2 LSD</strong> uses crossed helical planet gears. Friction between the teeth dynamically biases up to <strong>2.5× more torque</strong> to the gripping outer tire, propelling the IS300 out of corners with zero clutch-plate wear!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
