import React, { useState } from 'react';
import { Compass, MoveHorizontal, RotateCw, Sparkles } from 'lucide-react';

export default function SteeringSimulator() {
  const [steeringAngle, setSteeringAngle] = useState(20); // -35 to +35 degrees

  // Ackermann geometry principles:
  // Inside wheel turns at a sharper angle than outside wheel so radii meet at rear axle center
  // Wheelbase L ~ 2.7m, Track width W ~ 1.6m
  // In our visual model, we compute inside vs outside delta:
  const isTurningLeft = steeringAngle < 0;
  const absAngle = Math.abs(steeringAngle);

  // Ackermann gives ~20% more angle to the inside wheel on tight lock
  const insideWheelAngle = absAngle * 1.25;
  const outsideWheelAngle = absAngle * 0.85;

  const leftWheelVisual = steeringAngle < 0 ? -insideWheelAngle : -outsideWheelAngle;
  const rightWheelVisual = steeringAngle < 0 ? -outsideWheelAngle : -insideWheelAngle;

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Compass className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">Steering Kinematics & Ackermann Geometry</h3>
          </div>
          <p className="text-sm text-slate-400">
            Why front wheels must turn at different angles to prevent tire slip in turns
          </p>
        </div>

        <button
          onClick={() => setSteeringAngle(0)}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
        >
          Center Steering Wheel (0°)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Top-down Ackermann Steering Linkage */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[16/11] bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 460 300" className="w-full h-full select-none">
              <defs>
                <marker id="turnCenterMarker" markerWidth="8" markerHeight="8" refX="4" refY="4">
                  <circle cx="4" cy="4" r="3" fill="#14b8a6" />
                </marker>
              </defs>

              {/* CAR FRONT FRAME CROSSMEMBER */}
              <rect x="80" y="80" width="300" height="14" rx="4" fill="#334155" stroke="#475569" strokeWidth="2" />
              <text x="230" y="72" fill="#64748b" fontSize="10" textAnchor="middle" fontWeight="bold">FRONT SUBFRAME</text>

              {/* RACK AND PINION STEERING GEAR */}
              {/* Steering Column & Pinion */}
              <line x1="230" y1="20" x2="230" y2="120" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
              <circle cx="230" cy="120" r="10" fill="#d97706" stroke="#fef08a" strokeWidth="2" />
              {/* Steering Rack Slider */}
              <rect
                x={120 + steeringAngle * 1.5}
                y="114"
                width="220"
                height="12"
                rx="3"
                fill="#0ea5e9"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />

              {/* TIE RODS LINKING RACK TO STEERING KNUCKLES */}
              {/* Left Tie Rod */}
              <line
                x1={120 + steeringAngle * 1.5}
                y1="120"
                x2="100"
                y2="155"
                stroke="#cbd5e1"
                strokeWidth="4"
              />
              {/* Right Tie Rod */}
              <line
                x1={340 + steeringAngle * 1.5}
                y1="120"
                x2="360"
                y2="155"
                stroke="#cbd5e1"
                strokeWidth="4"
              />

              {/* LEFT FRONT WHEEL ASSEMBLY (Pivot at 90, 150) */}
              <g transform={`translate(90, 150) rotate(${leftWheelVisual})`}>
                {/* Tire */}
                <rect x="-18" y="-55" width="36" height="110" rx="6" fill="#1e293b" stroke="#14b8a6" strokeWidth="3" />
                {/* Hub & brake rotor */}
                <rect x="-8" y="-30" width="16" height="60" rx="3" fill="#64748b" />
                {/* Steering Arm */}
                <line x1="10" y1="5" x2="10" y2="20" stroke="#94a3b8" strokeWidth="4" />
                <circle cx="10" cy="20" r="4" fill="#38bdf8" />
                <text x="0" y="4" fill="#f8fafc" fontSize="11" textAnchor="middle" fontWeight="bold">
                  {Math.round(Math.abs(leftWheelVisual))}°
                </text>
              </g>

              {/* RIGHT FRONT WHEEL ASSEMBLY (Pivot at 370, 150) */}
              <g transform={`translate(370, 150) rotate(${rightWheelVisual})`}>
                {/* Tire */}
                <rect x="-18" y="-55" width="36" height="110" rx="6" fill="#1e293b" stroke="#14b8a6" strokeWidth="3" />
                {/* Hub & brake rotor */}
                <rect x="-8" y="-30" width="16" height="60" rx="3" fill="#64748b" />
                {/* Steering Arm */}
                <line x1="-10" y1="5" x2="-10" y2="20" stroke="#94a3b8" strokeWidth="4" />
                <circle cx="-10" cy="20" r="4" fill="#38bdf8" />
                <text x="0" y="4" fill="#f8fafc" fontSize="11" textAnchor="middle" fontWeight="bold">
                  {Math.round(Math.abs(rightWheelVisual))}°
                </text>
              </g>

              {/* TURN CENTER CONVERGENCE RAYS (when turning) */}
              {steeringAngle !== 0 && (
                <g stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6">
                  {/* Rays extending perpendicular to wheels */}
                  <line
                    x1="90"
                    y1="150"
                    x2={steeringAngle < 0 ? 0 : 460}
                    y2={steeringAngle < 0 ? 250 : 250}
                  />
                  <line
                    x1="370"
                    y1="150"
                    x2={steeringAngle < 0 ? 0 : 460}
                    y2={steeringAngle < 0 ? 250 : 250}
                  />
                </g>
              )}
            </svg>

            {/* Geometry angle readouts */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-medium">
                {steeringAngle === 0
                  ? 'Steering Centered: Both Wheels Parallel'
                  : steeringAngle < 0
                  ? `Left Turn: Inside Wheel (${Math.round(insideWheelAngle)}°) turns sharper than Outside Wheel (${Math.round(outsideWheelAngle)}°)`
                  : `Right Turn: Inside Wheel (${Math.round(insideWheelAngle)}°) turns sharper than Outside Wheel (${Math.round(outsideWheelAngle)}°)`}
              </span>
              <span className="font-mono text-teal-400 font-bold">Ackermann Compensation</span>
            </div>
          </div>

          {/* Steering Angle Slider */}
          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Steering Rack Angle:</span>
              <span className="text-teal-400 font-mono font-bold">{steeringAngle}°</span>
            </div>
            <input
              type="range"
              min="-35"
              max="35"
              step="1"
              value={steeringAngle}
              onChange={(e) => setSteeringAngle(Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>-35° (Full Left Lock)</span>
              <span>0° (Straight)</span>
              <span>+35° (Full Right Lock)</span>
            </div>
          </div>
        </div>

        {/* Technical Explanations */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              The Ackermann Principle
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Because the left and right front wheels trace out arcs of different concentric radii around the instantaneous center of rotation, <strong>they cannot point at identical angles</strong>.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              By angling the steering knuckle arms inward towards the center of the rear axle, the mechanical linkage automatically pulls the inside wheel into a tighter turn angle. Without this, the front tires would scrub sideways, squeal, and reduce grip.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="font-bold text-white mb-1">Camber</div>
              <p className="text-[11px] text-slate-400">
                Inward/outward tilt of wheel. Negative camber maximizes contact patch when body rolls in corners.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="font-bold text-white mb-1">Caster</div>
              <p className="text-[11px] text-slate-400">
                Backward angle of steering pivot. Creates self-aligning torque that centers the wheel after turns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
