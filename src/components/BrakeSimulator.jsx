import React, { useState } from 'react';
import { ShieldAlert, Disc, Zap, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function BrakeSimulator() {
  const [pedalForce, setPedalForce] = useState(40); // 0 to 100%
  const [absEnabled, setAbsEnabled] = useState(true);

  // Hydraulic Calculations:
  // Driver foot force: 0 - 500 N
  const footForceN = Math.round((pedalForce / 100) * 500);
  // Booster amplification: ~5x
  const boosterForceN = footForceN * 5;
  // Master cylinder pressure: Pascal's law (P = F / A)
  // Pressure up to 100 bar (10 MPa)
  const linePressureBar = Math.round((pedalForce / 100) * 110);
  // Caliper clamping force: P * Caliper_Piston_Area (caliper pistons are large)
  const clampingForceN = Math.round(linePressureBar * 95); // Up to ~10,450 N
  // Rotor thermal generation
  const rotorTempC = Math.round(50 + (pedalForce / 100) * 380);

  // ABS logic
  const isLockupThreshold = pedalForce > 75;
  const isWheelLocked = isLockupThreshold && !absEnabled;

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <Disc className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">Hydraulic Disc Brakes & ABS Simulator</h3>
          </div>
          <p className="text-sm text-slate-400">
            Pascal's law hydraulic force multiplication and anti-lock slip regulation
          </p>
        </div>

        {/* ABS toggle switch */}
        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-300">ABS Active:</span>
          <button
            onClick={() => setAbsEnabled(!absEnabled)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              absEnabled
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-red-900/80 text-red-200 border border-red-700'
            }`}
          >
            {absEnabled ? 'ABS ENABLED' : 'ABS DISABLED (Wheel Lock)'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Brake Rotor & Caliper Clamp */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[16/11] bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 440 280" className="w-full h-full select-none">
              <defs>
                {/* Rotor glowing hot metal gradient based on temperature */}
                <radialGradient id="rotorHeat" cx="50%" cy="50%" r="50%">
                  <stop
                    offset="0%"
                    stopColor={rotorTempC > 300 ? '#ef4444' : rotorTempC > 180 ? '#f97316' : '#64748b'}
                  />
                  <stop
                    offset="70%"
                    stopColor={rotorTempC > 300 ? '#b91c1c' : rotorTempC > 180 ? '#c2410c' : '#334155'}
                  />
                  <stop offset="100%" stopColor="#1e293b" />
                </radialGradient>
              </defs>

              {/* VENTILATED BRAKE ROTOR DISC */}
              <g transform="translate(220, 140)">
                {/* Rotor outer disc */}
                <circle cx="0" cy="0" r="105" fill="url(#rotorHeat)" stroke="#94a3b8" strokeWidth="3" />
                {/* Cooling ventilation slots / cross drilled holes */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  return (
                    <circle
                      key={deg}
                      cx={75 * Math.cos(rad)}
                      cy={75 * Math.sin(rad)}
                      r="3.5"
                      fill="#0f172a"
                      stroke="#475569"
                    />
                  );
                })}
                {/* Rotor center hub & lug nut studs */}
                <circle cx="0" cy="0" r="45" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                {[0, 72, 144, 216, 288].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  return (
                    <circle
                      key={deg}
                      cx={28 * Math.cos(rad)}
                      cy={28 * Math.sin(rad)}
                      r="4.5"
                      fill="#e2e8f0"
                    />
                  );
                })}
              </g>

              {/* BRAKE CALIPER (Mounted at Top Right) */}
              <g transform="translate(290, 45)">
                {/* Caliper housing body */}
                <path
                  d="M 0 0 C 40 0, 70 30, 70 80 C 70 120, 30 140, 0 140 L -25 140 L -25 0 Z"
                  fill="#be185d"
                  stroke="#f472b6"
                  strokeWidth="3"
                />
                {/* Brake Pad Backplate */}
                <rect
                  x="-22"
                  y={25 + (pedalForce / 100) * 4}
                  width="18"
                  height="90"
                  rx="2"
                  fill="#475569"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />
                {/* Hydraulic Piston Clamping Indicator */}
                <text x="25" y="75" fill="#fdf2f8" fontSize="11" fontWeight="bold">
                  {clampingForceN} N
                </text>
                <text x="25" y="90" fill="#fbcfe8" fontSize="9">
                  CLAMP FORCE
                </text>
              </g>

              {/* HYDRAULIC LINE COMING IN */}
              <path d="M 330 0 L 330 45" fill="none" stroke="#ec4899" strokeWidth="4" />
              <text x="340" y="25" fill="#f472b6" fontSize="9" fontWeight="bold">
                {linePressureBar} BAR
              </text>
            </svg>

            {/* Lockup status alert badge */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              {isWheelLocked ? (
                <div className="flex items-center gap-2 text-red-400 font-bold">
                  <AlertOctagon className="w-4 h-4 animate-bounce" />
                  WHEEL LOCKED & SKIDDING! Steering control 0%
                </div>
              ) : isLockupThreshold && absEnabled ? (
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Zap className="w-4 h-4 animate-pulse" />
                  ABS PULSING (20 Hz): Max static friction retained
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Progressive braking: Good adhesion
                </div>
              )}
              <span className="font-mono text-slate-300 font-bold">Rotor Temp: {rotorTempC}°C</span>
            </div>
          </div>

          {/* Pedal Pressure Slider */}
          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Brake Pedal Pressure:</span>
              <span className="text-pink-400 font-mono font-bold">{pedalForce}% ({footForceN} N Foot Effort)</span>
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
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>0% (Free Roll)</span>
              <span>50% (Firm Decel)</span>
              <span>100% (Emergency Threshold)</span>
            </div>
          </div>
        </div>

        {/* Technical Principles & Physics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400">
              Hydraulic Multiplication (Pascal's Principle)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pressure exerted anywhere in a confined incompressible fluid is transmitted equally in all directions:
            </p>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-center text-pink-300 font-bold">
              Pressure (P) = Force₁ / Area₁ = Force₂ / Area₂
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Because the master cylinder piston has a small cross-sectional area and the caliper slave pistons have a large area, your 40 kg foot press turns into <strong>over 1,000 kg of clamping force</strong> pinching the carbon-steel rotor.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Kinetic Energy Dissipation
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Braking stops a car by converting 100% of the vehicle's kinetic energy (<code className="text-pink-400">E = ½ m v²</code>) into friction heat. Stopping a 1,600 kg car from 100 km/h generates enough heat in 3 seconds to boil 2 liters of water!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
