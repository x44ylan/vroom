import React, { useState } from 'react';
import { Compass, RotateCw, GitFork, ArrowLeftRight } from 'lucide-react';

export default function DifferentialSimulator() {
  const [turnDirection, setTurnDirection] = useState('straight'); // 'straight', 'left', 'right'
  const [driveshaftSpeed, setDriveshaftSpeed] = useState(100); // RPM baseline

  // In an open differential:
  // Speed_left + Speed_right = 2 * Carrier_speed
  let carrierSpeed = driveshaftSpeed;
  let leftWheelSpeed = driveshaftSpeed;
  let rightWheelSpeed = driveshaftSpeed;

  if (turnDirection === 'left') {
    // Left wheel is inside wheel (slower), right wheel is outside wheel (faster)
    leftWheelSpeed = Math.round(driveshaftSpeed * 0.6);
    rightWheelSpeed = Math.round(driveshaftSpeed * 1.4);
  } else if (turnDirection === 'right') {
    leftWheelSpeed = Math.round(driveshaftSpeed * 1.4);
    rightWheelSpeed = Math.round(driveshaftSpeed * 0.6);
  }

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ArrowLeftRight className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">The Open Differential Simulator</h3>
          </div>
          <p className="text-sm text-slate-400">
            Why cornering requires independent wheel speeds and how epicyclic spider gears solve it
          </p>
        </div>

        {/* Turn steering switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setTurnDirection('left')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              turnDirection === 'left' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Turning Left ↰
          </button>
          <button
            onClick={() => setTurnDirection('straight')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              turnDirection === 'straight' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Straight Ahead ↑
          </button>
          <button
            onClick={() => setTurnDirection('right')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              turnDirection === 'right' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Turning Right ↱
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Differential Cutaway Diagram */}
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

              {/* INPUT PINION (from driveshaft) */}
              <g transform="translate(230, 250)">
                <rect x="-10" y="0" width="20" height="45" fill="#38bdf8" />
                <polygon points="-22,0 22,0 0,-18" fill="#0ea5e9" stroke="#38bdf8" strokeWidth="2" />
                <text x="0" y="40" fill="#bae6fd" fontSize="9" textAnchor="middle" fontWeight="bold">INPUT PINION</text>
              </g>

              {/* LARGE RING GEAR (Carrier) */}
              <g transform="translate(230, 150)">
                <circle cx="0" cy="0" r="85" fill="none" stroke="url(#ringGearGrad)" strokeWidth="18" strokeDasharray="10 5" />
                <circle cx="0" cy="0" r="70" fill="#1e1b4b" opacity="0.6" />
                <text x="0" y="-55" fill="#c4b5fd" fontSize="10" textAnchor="middle" fontWeight="bold">
                  RING GEAR (CARRIER)
                </text>
              </g>

              {/* LEFT AXLE SHAFT */}
              <g transform="translate(60, 150)">
                <rect x="0" y="-8" width="130" height="16" fill="#64748b" />
                {/* Left Side Gear */}
                <polygon points="130,-22 130,22 145,15 145,-15" fill="#a78bfa" stroke="#c4b5fd" strokeWidth="2" />
                {/* Left Wheel */}
                <rect x="-30" y="-45" width="25" height="90" rx="4" fill="#334155" stroke="#64748b" strokeWidth="3" />
                <text x="-18" y="-52" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">LEFT WHEEL</text>
                <text x="50" y="25" fill="#e2e8f0" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {leftWheelSpeed} RPM
                </text>
              </g>

              {/* RIGHT AXLE SHAFT */}
              <g transform="translate(400, 150)">
                <rect x="-130" y="-8" width="130" height="16" fill="#64748b" />
                {/* Right Side Gear */}
                <polygon points="-130,-22 -130,22 -145,15 -145,-15" fill="#a78bfa" stroke="#c4b5fd" strokeWidth="2" />
                {/* Right Wheel */}
                <rect x="5" y="-45" width="25" height="90" rx="4" fill="#334155" stroke="#64748b" strokeWidth="3" />
                <text x="18" y="-52" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">RIGHT WHEEL</text>
                <text x="-90" y="25" fill="#e2e8f0" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {rightWheelSpeed} RPM
                </text>
              </g>

              {/* TOP AND BOTTOM SPIDER PINION GEARS */}
              <g transform="translate(230, 115)">
                <polygon points="-16,-5 16,-5 12,12 -12,12" fill="#f59e0b" stroke="#fef08a" strokeWidth="2" />
                <text x="0" y="-12" fill="#fde047" fontSize="9" textAnchor="middle" fontWeight="bold">SPIDER PINION</text>
              </g>
              <g transform="translate(230, 185)">
                <polygon points="-16,5 16,5 12,-12 -12,-12" fill="#f59e0b" stroke="#fef08a" strokeWidth="2" />
              </g>
            </svg>

            {/* Differential Status Callout */}
            <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-medium">
                Status: {turnDirection === 'straight' ? 'Straight Line (No spider gear spin)' : `Turning: Inside wheel slowed, Outside wheel sped up`}
              </span>
              <span className="font-mono text-purple-400 font-bold">
                Formula: (L + R) / 2 = {driveshaftSpeed} RPM
              </span>
            </div>
          </div>
        </div>

        {/* Technical Mechanics explanation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              The Cornering Paradox
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              When a car rounds a corner, the outside tire must travel along an arc of larger circumference than the inside tire in the exact same time window.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              If both wheels were locked onto a solid steel rod:
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
              <li>The inner tire would chirp, slide, and violently scrub the pavement.</li>
              <li>Massive torsional shear stress would twist and eventually snap axle shafts.</li>
              <li>Steering would resist turning and try to push the car in a straight line (severe understeer).</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/40 text-xs text-purple-200/90 leading-relaxed">
            <div className="font-bold text-purple-300 mb-1">
              The Drawback: The "One-Wheel Peel"
            </div>
            Because an open differential always splits torque 50/50, if one wheel encounters ice or lifts into the air, all engine power spins that slipping wheel at double speed while zero torque reaches the gripping wheel. This is why performance cars use <strong>Limited-Slip Differentials (LSD)</strong> or electronic torque vectoring!
          </div>
        </div>
      </div>
    </div>
  );
}
