import React, { useState, useEffect, useRef } from 'react';
import { Wind, Gauge, Flame, Activity, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export default function TurbochargerSimulator() {
  const [engineRpm, setEngineRpm] = useState(2400);
  const [wastegateOpen, setWastegateOpen] = useState(false);
  const [intercoolerActive, setIntercoolerActive] = useState(true);
  const [animAngle, setAnimAngle] = useState(0);
  const animRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  // Forced induction physics calculations:
  // Spool threshold ~ 1,800 RPM. Max boost at 4,200+ RPM.
  // Ambient air pressure: 1.0 bar (14.7 psi)
  // Max boost: 1.5 bar (21.8 psi) over ambient.
  const spoolFactor = Math.min(1.0, Math.max(0, (engineRpm - 1600) / 2800));
  const turboRpm = Math.round(spoolFactor * 165000 + (engineRpm > 1000 ? 15000 : 0));
  
  // Wastegate cracks open if boost would exceed 18 psi, or manually toggled
  const targetBoostPsi = wastegateOpen ? Math.min(6, spoolFactor * 12) : spoolFactor * 22.5;
  const boostPsi = Math.round(targetBoostPsi * 10) / 10;
  const boostBar = Math.round((boostPsi / 14.7) * 100) / 100;

  // Compressor outlet air heats up dramatically due to adiabatic compression:
  // T2 = T1 * (P2/P1)^((gamma - 1)/gamma)
  const uncooledTempC = Math.round(25 + boostPsi * 5.8);
  // Intercooler heat exchanger removes ~70% of temperature delta
  const intakeAirTempC = intercoolerActive
    ? Math.round(25 + (uncooledTempC - 25) * 0.3)
    : uncooledTempC;

  // Volumetric efficiency & HP multiplier
  // Naturally aspirated baseline ~ 100% VE (200 HP)
  // Turbo boost packs additional air mass into cylinder: VE ~ (P_manifold / P_ambient)
  const manifoldPressureRatio = (14.7 + boostPsi) / 14.7;
  const volumetricEfficiency = Math.round(manifoldPressureRatio * 95);
  // Cooler air is denser: ideal gas law rho = P / (R * T)
  const densityBonus = (273 + 25) / (273 + intakeAirTempC);
  const estimatedHorsepower = Math.round(200 * manifoldPressureRatio * Math.min(1.15, densityBonus));

  // Turbine wheel animation
  useEffect(() => {
    const loop = (now) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      const speed = (turboRpm / 15000) * 360 * dt;
      setAnimAngle((prev) => (prev + speed) % 360);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [turboRpm]);

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Wind className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">Turbocharger & Forced Induction Physics</h3>
          </div>
          <p className="text-sm text-slate-400">
            Harnessing waste exhaust enthalpy to compress intake air density and double power output
          </p>
        </div>

        {/* Quick toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIntercoolerActive(!intercoolerActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              intercoolerActive
                ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {intercoolerActive ? 'Intercooler ACTIVE' : 'Intercooler BYPASS'}
          </button>

          <button
            onClick={() => setWastegateOpen(!wastegateOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              wastegateOpen
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {wastegateOpen ? 'Wastegate DUMPING' : 'Wastegate SHUT'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Animated Turbo System Diagram */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[16/11] bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 460 300" className="w-full h-full select-none">
              <defs>
                <linearGradient id="exhaustFlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="compressedColdAir" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>

              {/* 1. EXHAUST MANIFOLD ENTRY (Bottom Left -> Turbine) */}
              <path
                d="M 20 220 L 100 220 C 130 220, 150 200, 150 170"
                fill="none"
                stroke="url(#exhaustFlow)"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <text x="35" y="240" fill="#f87171" fontSize="9" fontWeight="bold">EXHAUST GAS (&gt;800°C)</text>

              {/* 2. EXHAUST WASTEGATE BYPASS */}
              <path
                d="M 80 220 C 80 260, 170 260, 190 220"
                fill="none"
                stroke={wastegateOpen ? '#f97316' : '#334155'}
                strokeWidth="8"
                strokeDasharray={wastegateOpen ? 'none' : '4 4'}
              />
              <text x="135" y="275" fill={wastegateOpen ? '#fdba74' : '#64748b'} fontSize="8" textAnchor="middle">
                {wastegateOpen ? 'Wastegate Valve Vented' : 'Wastegate Closed'}
              </text>

              {/* 3. TURBINE HOUSING (Hot Side: Left) */}
              <circle cx="160" cy="150" r="48" fill="#1e293b" stroke="#ef4444" strokeWidth="3" />
              {/* Rotating Turbine Blades */}
              <g transform={`translate(160, 150) rotate(${animAngle})`}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <path
                    key={deg}
                    d="M 0 0 L 12 -38 L 4 -40 Z"
                    fill="#f87171"
                    transform={`rotate(${deg})`}
                  />
                ))}
                <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
              </g>
              <text x="160" y="90" fill="#f87171" fontSize="9" textAnchor="middle" fontWeight="bold">HOT TURBINE</text>

              {/* 4. CONNECTING SHAFT (Center Bearing Cartridge - CHRA) */}
              <rect x="200" y="142" width="60" height="16" rx="3" fill="#64748b" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="230" y="153" fill="#f8fafc" fontSize="8" textAnchor="middle" fontWeight="bold">CHRA</text>

              {/* 5. COMPRESSOR HOUSING (Cold Side: Right) */}
              <circle cx="300" cy="150" r="48" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
              {/* Rotating Compressor Impeller */}
              <g transform={`translate(300, 150) rotate(${animAngle})`}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <path
                    key={deg}
                    d="M 0 0 L 12 -38 L 4 -40 Z"
                    fill="#38bdf8"
                    transform={`rotate(${deg})`}
                  />
                ))}
                <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              </g>
              <text x="300" y="90" fill="#38bdf8" fontSize="9" textAnchor="middle" fontWeight="bold">COLD COMPRESSOR</text>

              {/* 6. AMBIENT AIR INTAKE (From Air Filter -> Compressor) */}
              <path
                d="M 440 150 L 348 150"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="16"
                strokeLinecap="round"
              />
              <text x="435" y="135" fill="#93c5fd" fontSize="9" textAnchor="end" fontWeight="bold">FRESH AIR IN</text>

              {/* 7. CHARGE PIPE -> INTERCOOLER -> ENGINE INTAKE */}
              <path
                d="M 300 198 L 300 240 C 300 250, 310 260, 320 260 L 370 260"
                fill="none"
                stroke={intercoolerActive ? '#0284c7' : '#f59e0b'}
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* Intercooler Heat Exchanger Box */}
              <rect x="370" y="240" width="70" height="40" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              {/* Fins inside intercooler */}
              {[380, 390, 400, 410, 420, 430].map((x) => (
                <line key={x} x1={x} y1="243" x2={x} y2="277" stroke="#38bdf8" strokeWidth="1.5" />
              ))}
              <text x="405" y="235" fill="#38bdf8" fontSize="8" textAnchor="middle" fontWeight="bold">
                {intercoolerActive ? 'INTERCOOLER (Air Cooled)' : 'BYPASSED'}
              </text>
            </svg>

            {/* Live Status Overlay */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-medium">
                Shaft Speed: <span className="text-amber-400 font-mono font-bold">{turboRpm.toLocaleString()} RPM</span>
              </span>
              <span className="font-mono text-sky-400 font-bold">
                Boost: +{boostPsi} PSI ({boostBar} Bar)
              </span>
            </div>
          </div>

          {/* Engine RPM Throttle Slider */}
          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Engine Exhaust Flow (Engine RPM):</span>
              <span className="text-orange-400 font-mono font-bold">{engineRpm} RPM</span>
            </div>
            <input
              type="range"
              min="800"
              max="6500"
              step="50"
              value={engineRpm}
              onChange={(e) => setEngineRpm(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>800 (Off Boost / Lag)</span>
              <span>2,500 (Spooling Up)</span>
              <span>4,500+ (Peak Boost)</span>
            </div>
          </div>
        </div>

        {/* Telemetry and Thermodynamics Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Dynamic Engine Performance
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Estimated Power Output:</span>
                <span className="text-sm font-mono font-bold text-amber-400">{estimatedHorsepower} HP</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Volumetric Efficiency (VE):</span>
                <span className="text-sm font-mono font-bold text-emerald-400">{volumetricEfficiency}%</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Intake Air Charge Temp:</span>
                <span className={`text-sm font-mono font-bold ${intakeAirTempC > 65 ? 'text-red-400' : 'text-sky-400'}`}>
                  {intakeAirTempC}°C {intakeAirTempC > 65 ? '(High Risk of Knock!)' : '(Optimal)'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Absolute Manifold Pressure:</span>
                <span className="text-sm font-mono font-bold text-white">
                  {(14.7 + boostPsi).toFixed(1)} PSI / {(1.0 + boostBar).toFixed(2)} Bar
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
              <strong>Thermodynamic Secret:</strong> A turbo does not draw mechanical drag from the crankshaft like a supercharger. It runs entirely on the <em>residual enthalpy and expanding velocity</em> of hot exhaust gas that would otherwise exit the tailpipe as pure waste!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-900/40 text-xs text-sky-200/90 leading-relaxed">
            <div className="font-bold text-sky-300 mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Why the Intercooler is Crucial
            </div>
            Compressing air heats it up (<code className="text-sky-300">PV = nRT</code>). Hot air is less dense and can cause premature pre-ignition (engine knocking / detonation). The air-to-air intercooler cools the charge before it enters the intake manifold, restoring air density so more oxygen atoms fit into the cylinder.
          </div>
        </div>
      </div>
    </div>
  );
}
