import React, { useState } from 'react';
import { Thermometer, Droplet, Wind, ShieldCheck, Flame, RotateCw } from 'lucide-react';

export default function CoolingLubricationSimulator() {
  const [engineLoad, setEngineLoad] = useState(50); // 10% to 100%
  const [thermostatOpen, setThermostatOpen] = useState(true);
  const [oilGrade, setOilGrade] = useState('5W-30'); // '0W-20', '5W-30', '10W-60'

  // Thermal dynamics:
  // Heat generated proportional to fuel burn
  const heatGeneratedKw = Math.round(15 + engineLoad * 0.95);
  // Coolant temp balance: 90°C target
  const coolantTempC = thermostatOpen
    ? Math.round(85 + (engineLoad / 100) * 15)
    : Math.round(95 + (engineLoad / 100) * 45); // Overheating if closed!

  // Oil pressure (typically 25 - 65 PSI depending on viscosity and pump speed)
  const oilPressurePsi = Math.round(20 + (engineLoad / 100) * 45);
  const oilFilmThicknessMicrons = oilGrade === '0W-20' ? 2.1 : oilGrade === '5W-30' ? 2.8 : 3.9;

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Thermometer className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">Cooling & Hydrodynamic Lubrication Systems</h3>
          </div>
          <p className="text-sm text-slate-400">
            Preventing catastrophic metal-on-metal seizure via pressurized oil films and radiator heat rejection
          </p>
        </div>

        {/* Thermostat valve toggle */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 pl-1 font-medium">Thermostat:</span>
          <button
            onClick={() => setThermostatOpen(!thermostatOpen)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              thermostatOpen
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-red-900/80 text-red-200 border border-red-700'
            }`}
          >
            {thermostatOpen ? 'OPEN (To Radiator)' : 'CLOSED (Warm-up Bypass)'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Engine Block Cooling & Oil Gallery Schematic */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[16/11] bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 460 300" className="w-full h-full select-none">
              <defs>
                <linearGradient id="coolantFlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <linearGradient id="hotCoolant" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>

              {/* RADIATOR HEAT EXCHANGER (Far Left) */}
              <rect x="25" y="60" width="45" height="180" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              {/* Radiator Cooling Fins */}
              {[80, 100, 120, 140, 160, 180, 200, 220].map((y) => (
                <line key={y} x1="28" y1={y} x2="67" y2={y} stroke="#38bdf8" strokeWidth="1.5" />
              ))}
              <text x="47" y="50" fill="#38bdf8" fontSize="9" textAnchor="middle" fontWeight="bold">RADIATOR</text>

              {/* WATER PUMP */}
              <circle cx="120" cy="210" r="22" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
              <text x="120" y="214" fill="#38bdf8" fontSize="8" textAnchor="middle" fontWeight="bold">PUMP</text>

              {/* ENGINE BLOCK WATER JACKET CASING */}
              <rect x="180" y="70" width="230" height="160" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="3" />
              <text x="295" y="62" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
                ENGINE CYLINDER BLOCK
              </text>

              {/* TWO CYLINDER BORES */}
              <rect x="210" y="90" width="70" height="100" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
              <rect x="310" y="90" width="70" height="100" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />

              {/* COOLANT JACKET CHANNELS SURROUNDING CYLINDERS */}
              <path
                d="M 120 188 L 120 150 L 190 150 L 190 100 L 290 100 L 290 150 L 390 150 L 390 100"
                fill="none"
                stroke={thermostatOpen ? "url(#coolantFlow)" : "url(#hotCoolant)"}
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* THERMOSTAT VALVE */}
              <g transform="translate(145, 90)">
                <circle cx="0" cy="0" r="14" fill={thermostatOpen ? "#0284c7" : "#ef4444"} stroke="#f8fafc" strokeWidth="2" />
                <text x="0" y="3" fill="#ffffff" fontSize="7" textAnchor="middle" fontWeight="bold">
                  {thermostatOpen ? 'OPEN' : 'SHUT'}
                </text>
              </g>

              {/* RETURN HOSE (From Thermostat -> Top of Radiator) */}
              <path
                d="M 145 90 L 70 90"
                fill="none"
                stroke={thermostatOpen ? "#ef4444" : "#475569"}
                strokeWidth="10"
                strokeLinecap="round"
              />
              <text x="105" y="80" fill="#f87171" fontSize="8" textAnchor="middle">Upper Hose</text>

              {/* LOWER HOSE (From Radiator bottom -> Water Pump) */}
              <path
                d="M 70 210 L 98 210"
                fill="none"
                stroke="#0284c7"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* OIL SUMP / PAN (Bottom of Engine) */}
              <rect x="200" y="235" width="190" height="35" rx="4" fill="#451a03" stroke="#d97706" strokeWidth="2" />
              <text x="295" y="256" fill="#fbbf24" fontSize="9" textAnchor="middle" fontWeight="bold">
                OIL SUMP RESERVOIR ({oilGrade})
              </text>
            </svg>

            {/* Overheat warning overlay */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              {coolantTempC > 115 ? (
                <span className="text-red-400 font-bold flex items-center gap-1.5">
                  <Flame className="w-4 h-4 animate-bounce" /> ENGINE OVERHEATING! Blown head gasket risk
                </span>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Thermal Equilibrium Maintained
                </span>
              )}
              <span className="font-mono text-amber-400 font-bold">Coolant: {coolantTempC}°C</span>
            </div>
          </div>

          {/* Engine Load Slider */}
          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Engine Thermal Load:</span>
              <span className="text-blue-400 font-mono font-bold">{engineLoad}% ({heatGeneratedKw} kW Heat Rejection)</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={engineLoad}
              onChange={(e) => setEngineLoad(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* Lubrication & Hydrodynamic Film Physics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5" />
                Hydrodynamic Oil Wedge
              </h4>
              <div className="flex gap-1">
                {['0W-20', '5W-30', '10W-60'].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setOilGrade(grade)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition ${
                      oilGrade === grade ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Crankshaft journals never actually touch the metal bearings during engine operation. A positive displacement oil pump forces engine oil through drilled passages at {oilPressurePsi} PSI.
            </p>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Hydrodynamic Film Thickness:</span>
                <span className="font-mono text-amber-400 font-bold">{oilFilmThicknessMicrons} µm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Oil System Pressure:</span>
                <span className="font-mono text-white font-bold">{oilPressurePsi} PSI</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              As the crankshaft spins, it drags oil into a converging wedge under thousands of kilograms of combustion force, floating the journal entirely on liquid.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs text-blue-200/90 leading-relaxed">
            <div className="font-bold text-blue-300 mb-1 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5" />
              Pressurized Radiator Cap (1.1 Bar)
            </div>
            Why doesn't car coolant boil at 100°C? Water boils at 100°C only at sea level atmospheric pressure. Automotive cooling circuits are pressurized to ~1.1 bar (16 psi) by a spring-loaded radiator cap, elevating the boiling point to ~125°C!
          </div>
        </div>
      </div>
    </div>
  );
}
