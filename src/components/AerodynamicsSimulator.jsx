import React, { useState } from 'react';
import { Wind, ArrowRight, Gauge, Activity, Compass, Shield } from 'lucide-react';

export default function AerodynamicsSimulator() {
  const [speedKmh, setSpeedKmh] = useState(110);
  const [vehicleType, setVehicleType] = useState('sedan'); // 'sedan', 'suv', 'supercar'

  // Aerodynamic drag force: F_d = 0.5 * rho * v^2 * C_d * A
  // Air density rho ~ 1.225 kg/m^3
  // Power needed to overcome aero drag: P = F_d * v = 0.5 * rho * v^3 * C_d * A
  const PROFILES = {
    sedan: { name: 'Streamlined Sedan', cd: 0.26, frontalAreaM2: 2.2, desc: 'Tapered fastback roof reduces trailing wake turbulence.' },
    suv: { name: 'Boxy SUV / Truck', cd: 0.38, frontalAreaM2: 2.8, desc: 'Upright windshield and blunt rear create a massive low-pressure vacuum zone.' },
    supercar: { name: 'Track Supercar (High Downforce)', cd: 0.34, frontalAreaM2: 2.0, downforceKg: 280, desc: 'Inverted wings and venturi underbody diffusers pull chassis into the asphalt.' }
  };

  const profile = PROFILES[vehicleType];
  const speedMs = (speedKmh * 1000) / 3600;
  const rho = 1.225; // kg/m^3

  // Drag force in Newtons
  const dragForceN = Math.round(0.5 * rho * speedMs * speedMs * profile.cd * profile.frontalAreaM2);
  // Power to overcome aerodynamic drag in Watts -> kW -> HP
  const powerOvercomeWatts = dragForceN * speedMs;
  const powerHp = Math.round((powerOvercomeWatts / 745.7) * 10) / 10;

  // Downforce at given speed (scales with v^2)
  const downforceKg = profile.downforceKg
    ? Math.round(profile.downforceKg * Math.pow(speedKmh / 200, 2))
    : Math.round(25 * Math.pow(speedKmh / 150, 2));

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wind className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">Automotive Aerodynamics & Drag Physics</h3>
          </div>
          <p className="text-sm text-slate-400">
            Why aerodynamic resistance scales with the cube of velocity ($P \propto v^3$) at highway speeds
          </p>
        </div>

        {/* Vehicle Shape Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {Object.entries(PROFILES).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setVehicleType(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                vehicleType === key
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Wind Tunnel Streamlines Visualization */}
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

              {/* ROAD SURFACE */}
              <line x1="20" y1="230" x2="440" y2="230" stroke="#475569" strokeWidth="4" />

              {/* VEHICLE OUTLINE */}
              {vehicleType === 'sedan' && (
                <g transform="translate(140, 140)">
                  {/* Streamlined sedan silhouette */}
                  <path
                    d="M 20 85 L 35 65 Q 60 55, 90 40 Q 140 35, 175 40 Q 210 50, 240 85 Z"
                    fill="#1e293b"
                    stroke="#10b981"
                    strokeWidth="3"
                  />
                  {/* Wheels */}
                  <circle cx="65" cy="88" r="16" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
                  <circle cx="195" cy="88" r="16" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
                </g>
              )}

              {vehicleType === 'suv' && (
                <g transform="translate(140, 130)">
                  {/* Boxy SUV silhouette */}
                  <path
                    d="M 20 95 L 25 55 Q 40 45, 80 40 L 220 40 L 235 95 Z"
                    fill="#1e293b"
                    stroke="#f59e0b"
                    strokeWidth="3"
                  />
                  {/* Wheels */}
                  <circle cx="65" cy="98" r="18" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
                  <circle cx="190" cy="98" r="18" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
                </g>
              )}

              {vehicleType === 'supercar' && (
                <g transform="translate(130, 150)">
                  {/* Low-slung supercar with rear wing */}
                  <path
                    d="M 20 75 L 45 60 Q 80 40, 120 38 Q 180 38, 230 70 L 250 75 Z"
                    fill="#1e293b"
                    stroke="#ec4899"
                    strokeWidth="3"
                  />
                  {/* Rear wing spoiler */}
                  <line x1="230" y1="52" x2="255" y2="50" stroke="#f472b6" strokeWidth="4" />
                  <line x1="240" y1="52" x2="240" y2="70" stroke="#f472b6" strokeWidth="2" />
                  {/* Wheels */}
                  <circle cx="65" cy="78" r="16" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
                  <circle cx="205" cy="78" r="16" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
                </g>
              )}

              {/* WIND TUNNEL STREAMLINES (Flowing from right to left) */}
              {[60, 90, 120, 150, 180, 210].map((y, idx) => (
                <path
                  key={y}
                  d={`M 440 ${y} C 360 ${y}, 280 ${Math.max(40, y - (y < 160 ? 35 : 0))}, 140 ${y} L 30 ${y}`}
                  fill="none"
                  stroke="url(#windStream)"
                  strokeWidth="2.5"
                  strokeDasharray="12 6"
                />
              ))}

              {/* LOW PRESSURE TURBULENT WAKE AT REAR (Behind vehicle) */}
              <ellipse
                cx="120"
                cy="175"
                rx={vehicleType === 'suv' ? 45 : 28}
                ry={vehicleType === 'suv' ? 38 : 20}
                fill="url(#wakeTurbulence)"
                className="animate-pulse"
              />
              <text x="110" y="180" fill="#fca5a5" fontSize="8" textAnchor="middle" fontWeight="bold">
                VACUUM WAKE
              </text>
            </svg>

            {/* Aerodynamic Coefficients Callout */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-medium">
                {profile.name} (Cd: {profile.cd} | Area: {profile.frontalAreaM2} m²)
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                Aero Drag Force: {dragForceN} N
              </span>
            </div>
          </div>

          {/* Speed Velocity Slider */}
          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Road Speed (Velocity v):</span>
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
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>50 km/h (City)</span>
              <span>110 km/h (Highway)</span>
              <span>200+ km/h (Autobahn)</span>
            </div>
          </div>
        </div>

        {/* Physics Formulas & Power Demand */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              The Velocity Cubed ($v^3$) Penalty
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Power Consumed by Aero Drag:</span>
                <span className="text-sm font-mono font-bold text-amber-400">{powerHp} Horsepower</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Aerodynamic Downforce:</span>
                <span className="text-sm font-mono font-bold text-cyan-400">{downforceKg} kg of Grip</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
              Notice what happens when you double speed from <strong>60 km/h to 120 km/h</strong>: drag force quadruples ($4\times$), and the horsepower required to slice through the air increases by an astounding <strong>8-fold ($2^3 = 8\times$)</strong>!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              Why Streamlining Matters
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Most aerodynamic drag on cars is not caused by the nose cutting into the wind—it is caused by <strong>flow separation at the rear</strong>. A steep drop-off creates an eddying low-pressure vacuum pocket that literally sucks the car backward!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
