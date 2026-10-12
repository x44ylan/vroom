import React, { useState } from 'react';
import { Zap, Fuel, Activity, ArrowRight, Gauge, CheckCircle, Sliders } from 'lucide-react';

export default function EvVsIceComparison() {
  const [activeTab, setActiveTab] = useState('efficiency'); // 'efficiency', 'powertrain', 'architecture'

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">EV vs Internal Combustion (ICE) Comparison</h3>
          </div>
          <p className="text-sm text-slate-400">
            Examining energy efficiency, mechanical complexity, and torque generation curves
          </p>
        </div>

        {/* Comparison Category switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'efficiency', label: 'Energy Flow & Loss' },
            { id: 'powertrain', label: 'Torque & RPM Curves' },
            { id: 'architecture', label: 'Skateboard vs Unibody' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === tab.id ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: ENERGY FLOW & THERMAL EFFICIENCY */}
      {activeTab === 'efficiency' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ICE Energy Sankey breakdown */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Fuel className="w-5 h-5 text-amber-500" />
                <h4 className="text-base font-bold text-white">ICE (Gasoline Vehicle)</h4>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                25% - 30% Thermal Efficiency
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              For every 100 Joules of gasoline consumed, roughly 70 to 75 Joules are immediately discarded into the atmosphere as waste engine heat and friction.
            </p>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Cooling & Radiator Heat Loss:</span>
                  <span className="text-red-400 font-mono font-bold">~35% (Waste)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Exhaust Gas Heat Loss:</span>
                  <span className="text-orange-400 font-mono font-bold">~35% (Waste)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Mechanical Friction & Gearing:</span>
                  <span className="text-amber-400 font-mono font-bold">~5% (Waste)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '5%' }} />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-300 font-bold">Useful Kinetic Energy at Wheels:</span>
                  <span className="text-emerald-400 font-mono font-bold">~25% (Net Work)</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* EV Energy breakdown */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <h4 className="text-base font-bold text-white">EV (Electric Vehicle)</h4>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                85% - 92% Grid-to-Wheel Efficiency
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Electric motors convert electromagnetic coil flux into rotor rotation with minimal thermal losses, plus recapture 60-70% of braking energy.
            </p>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Inverter & Battery Internal Resistance:</span>
                  <span className="text-blue-400 font-mono font-bold">~5% (Thermal)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Motor Electromagnetic Stator Losses:</span>
                  <span className="text-indigo-400 font-mono font-bold">~5% (Magnetic drag)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Single-Speed Reduction Gearbox:</span>
                  <span className="text-purple-400 font-mono font-bold">~2% (Mechanical)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '2%' }} />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-300 font-bold">Useful Kinetic Energy at Wheels:</span>
                  <span className="text-emerald-400 font-mono font-bold">~88% (Net Work)</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: TORQUE & RPM CURVES */}
      {activeTab === 'powertrain' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="relative w-full aspect-[16/10] bg-slate-950/80 rounded-2xl border border-slate-800 p-4">
              <svg viewBox="0 0 450 250" className="w-full h-full select-none">
                {/* Grid lines */}
                <line x1="50" y1="210" x2="430" y2="210" stroke="#334155" strokeWidth="1.5" />
                <line x1="50" y1="30" x2="50" y2="210" stroke="#334155" strokeWidth="1.5" />

                {/* X-axis labels */}
                <text x="50" y="225" fill="#64748b" fontSize="10" textAnchor="middle">0 RPM</text>
                <text x="145" y="225" fill="#64748b" fontSize="10" textAnchor="middle">2,000</text>
                <text x="240" y="225" fill="#64748b" fontSize="10" textAnchor="middle">4,000</text>
                <text x="335" y="225" fill="#64748b" fontSize="10" textAnchor="middle">6,000</text>
                <text x="430" y="225" fill="#64748b" fontSize="10" textAnchor="middle">12,000+ EV</text>

                {/* Y-axis label */}
                <text x="25" y="120" fill="#94a3b8" fontSize="11" textAnchor="middle" transform="rotate(-90 25 120)">
                  TORQUE (Nm)
                </text>

                {/* ICE TORQUE CURVE: Starts near 0 at idle, peaks at 3,500, tapers off at redline */}
                <path
                  d="M 50 195 Q 120 180, 200 90 T 310 100 T 360 170"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                />
                <circle cx="240" cy="95" r="5" fill="#f59e0b" />
                <text x="245" y="85" fill="#fde047" fontSize="10" fontWeight="bold">ICE Peak Torque (3,500 RPM)</text>

                {/* EV MOTOR TORQUE CURVE: Flat 100% from 0 RPM, constant power drop-off after base speed */}
                <path
                  d="M 50 60 L 220 60 Q 300 70, 420 160"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                />
                <circle cx="50" cy="60" r="5" fill="#10b981" />
                <text x="65" y="50" fill="#34d399" fontSize="10" fontWeight="bold">EV: 100% Max Torque at 0 RPM</text>
              </svg>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Instant Acceleration from Zero
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                An internal combustion engine stalls at 0 RPM and requires a slipping clutch or hydraulic torque converter to launch.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                By contrast, permanent-magnet synchronous motors (PMSM) produce their maximum rated magnetic torque instantly at zero wheel velocity.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Why EVs Don't Need Multi-Speed Transmissions
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Because an electric motor spins smoothly up to 18,000+ RPM while retaining strong efficiency across a 10x speed band, a single fixed reduction gear (ratio ~9:1) satisfies both 0-100 km/h sprint and 200 km/h autobahn speeds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: CHASSIS ARCHITECTURE COMPARISON */}
      {activeTab === 'architecture' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
              <Fuel className="w-4 h-4" /> Traditional ICE Powertrain
            </h4>
            <ul className="space-y-2 text-slate-300 list-disc pl-4 leading-relaxed">
              <li><strong>Center of Gravity:</strong> High up due to heavy cast-iron or aluminum cylinder block and multi-gear transmission sitting above the front axle.</li>
              <li><strong>Cabin Packaging:</strong> Driveshaft tunnel cuts through the interior floor; engine bay takes up 30% of total vehicle length.</li>
              <li><strong>Weight Distribution:</strong> Frequently front-heavy (60:40) in front-wheel drive cars, causing high understeer tendencies.</li>
              <li><strong>Moving Parts:</strong> Over 2,000 precision mechanical moving parts needing regular oil changes, timing belt replacements, and spark plugs.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Modern EV "Skateboard" Chassis
            </h4>
            <ul className="space-y-2 text-slate-300 list-disc pl-4 leading-relaxed">
              <li><strong>Center of Gravity:</strong> Extremely low due to 400-600 kg battery pack placed flat under the floorboards, virtually eliminating body roll in turns.</li>
              <li><strong>Cabin Packaging:</strong> Completely flat interior floor; compact motors integrated directly between wheel axles create extra front trunk ("frunk") storage.</li>
              <li><strong>Weight Distribution:</strong> Naturally close to ideal 50:50 front-to-rear balance, drastically improving handling agility.</li>
              <li><strong>Moving Parts:</strong> Fewer than 25 moving powertrain components—virtually zero engine wear items.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
