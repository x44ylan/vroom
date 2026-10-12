import React, { useState } from 'react';
import { Activity, Shield, RefreshCw, Sliders, ArrowDownUp } from 'lucide-react';

export default function SuspensionSimulator() {
  const [springStiffness, setSpringStiffness] = useState(60); // 20 to 100 (Comfort to Track)
  const [damperRate, setDamperRate] = useState(50); // 10 to 90 (Soft to Stiff)
  const [roadBumpType, setRoadBumpType] = useState('pothole'); // 'pothole', 'speedbump', 'washboard'
  const [isBumping, setIsBumping] = useState(false);

  const triggerBump = (type) => {
    setRoadBumpType(type);
    setIsBumping(true);
    setTimeout(() => setIsBumping(false), 900);
  };

  // Suspension physics:
  // Body displacement and wheel hop depend on spring constant k and damping coefficient c
  // Underdamped vs critically damped response:
  const isUnderdamped = damperRate < 35;
  const isHarsh = springStiffness > 80 && damperRate > 75;

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ArrowDownUp className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">Suspension Dynamics: Springs & Hydraulic Dampers</h3>
          </div>
          <p className="text-sm text-slate-400">
            How spring rate and shock absorber orifice damping keep tires glued to the road
          </p>
        </div>

        {/* Bump test trigger buttons */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => triggerBump('pothole')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Hit Pothole
          </button>
          <button
            onClick={() => triggerBump('speedbump')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Speed Bump
          </button>
          <button
            onClick={() => triggerBump('washboard')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Corrugations
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Quarter-Car Suspension Rig */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[16/11] bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 440 300" className="w-full h-full select-none">
              <defs>
                <linearGradient id="chassisWeightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
              </defs>

              {/* SPRUNG MASS (CAR BODY CHASSIS) */}
              <g
                transform={`translate(220, ${isBumping ? (roadBumpType === 'pothole' ? 62 : 48) : 55})`}
                className="transition-transform duration-300 ease-out"
              >
                <rect x="-140" y="-30" width="280" height="40" rx="6" fill="url(#chassisWeightGrad)" stroke="#7dd3fc" strokeWidth="2" />
                <text x="0" y="-8" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">
                  SPRUNG MASS (Chassis Body ~400 kg/corner)
                </text>
              </g>

              {/* COIL SPRING (Left Side of Strut) */}
              <g transform="translate(170, 75)">
                {/* Zigzag coil spring */}
                <path
                  d={`M 0 0 L 15 15 L -15 30 L 15 45 L -15 60 L 15 75 L -15 90 L 15 105 L 0 120`}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={isBumping ? 'transition-all duration-150' : ''}
                />
                <text x="-25" y="65" fill="#fde047" fontSize="9" textAnchor="end" fontWeight="bold">
                  SPRING (k)
                </text>
              </g>

              {/* SHOCK ABSORBER / HYDRAULIC DAMPER (Right Side of Strut) */}
              <g transform="translate(270, 75)">
                {/* Outer oil reservoir cylinder */}
                <rect x="-14" y="45" width="28" height="75" rx="3" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
                {/* Inner piston shaft sliding inside */}
                <rect x="-5" y="0" width="10" height="60" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                <text x="25" y="65" fill="#67e8f9" fontSize="9" fontWeight="bold">
                  DAMPER (c)
                </text>
              </g>

              {/* LOWER WISHBONE SUSPENSION ARM (A-ARM) */}
              <line x1="140" y1="210" x2="220" y2="195" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
              <circle cx="140" cy="210" r="6" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
              <circle cx="220" cy="195" r="6" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />

              {/* UNSPRUNG MASS: WHEEL & TIRE */}
              <g
                transform={`translate(220, ${isBumping ? (roadBumpType === 'pothole' ? 205 : 185) : 195})`}
                className="transition-transform duration-100 ease-out"
              >
                {/* Wheel Rim & Hub Knuckle */}
                <circle cx="0" cy="0" r="30" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
                {/* Rubber Tire */}
                <circle cx="0" cy="0" r="50" fill="none" stroke="#1e293b" strokeWidth="24" />
                <circle cx="0" cy="0" r="62" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="6 4" />
                <circle cx="0" cy="0" r="8" fill="#f8fafc" />
              </g>

              {/* ROAD SURFACE */}
              <line x1="40" y1="258" x2="400" y2="258" stroke="#64748b" strokeWidth="4" />
              {roadBumpType === 'speedbump' && (
                <path d="M 180 258 Q 220 238, 260 258" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
              )}
              {roadBumpType === 'pothole' && (
                <path d="M 190 258 Q 220 274, 250 258" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
              )}
            </svg>

            {/* Response Behavior Tag */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-medium">
                Damping Mode: {isUnderdamped ? 'Underdamped (Bouncy Cadillac float)' : isHarsh ? 'Overdamped (Stiff Track car, harsh impacts)' : 'Critically Damped (Ideal tire grip & comfort)'}
              </span>
              <span className="font-mono text-cyan-400 font-bold">
                {isBumping ? 'Impulse Reaction!' : 'Static Ride Height'}
              </span>
            </div>
          </div>

          {/* Damping and Spring Tuning Sliders */}
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
              <span className="text-[10px] text-slate-500">{springStiffness < 40 ? 'Soft Luxury' : springStiffness > 75 ? 'Firm Track' : 'Balanced'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-400">Damper Rebound (c):</span>
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
              <span className="text-[10px] text-slate-500">{isUnderdamped ? 'Oscillates' : 'Critical Damping'}</span>
            </div>
          </div>
        </div>

        {/* Suspension Principles */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Springs Store Energy; Dampers Dissipate It
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              A common misconception is that shock absorbers support the vehicle's weight. They do not! <strong>Springs support the car's weight</strong> and absorb sudden kinetic shocks.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Without a damper, an impact would cause the car to bounce continuously like a pogo stick. The <strong>hydraulic damper (shock absorber)</strong> forces viscous hydraulic fluid through microscopic shim valves, turning kinetic bounce energy into fluid thermal heat within 1-2 oscillations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Sprung vs Unsprung Weight
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Sprung mass</strong> is everything supported above the suspension (engine, passenger cabin, chassis).<br />
              <strong>Unsprung mass</strong> is everything between suspension and tarmac (wheels, tires, brake calipers). Lower unsprung weight allows the wheel to track road bumps faster without upsetting chassis stability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
