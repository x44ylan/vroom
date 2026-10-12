import React, { useState } from 'react';
import { Cpu, Zap, Radio, AlertTriangle, ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';

export default function ElectricalEcuSimulator() {
  const [activeFault, setActiveFault] = useState('none'); // 'none', 'o2-sensor', 'wheel-speed', 'misfire'
  const [batteryVoltage, setBatteryVoltage] = useState(14.2); // Volts (alternator running)

  const FAULTS = {
    none: {
      code: 'SYSTEM NORMAL',
      mil: false,
      desc: 'All 70+ Electronic Control Units (ECUs) communicating cleanly across CAN Bus network.',
      action: 'Closed-loop fuel trim active. Stoichiometric lambda = 1.0.'
    },
    'o2-sensor': {
      code: 'P0130 - O2 Sensor Circuit Malfunction (Bank 1 Sensor 1)',
      mil: true,
      desc: 'Zirconia oxygen sensor failed to register exhaust lambda voltage swing.',
      action: 'ECU falls back to Open-Loop fail-safe mapping (rich fuel trim, higher emissions).'
    },
    'wheel-speed': {
      code: 'C0035 - Left Front Wheel Speed Sensor Circuit',
      mil: true,
      desc: 'Hall-effect sensor reluctor pulse lost on front left wheel bearing.',
      action: 'ABS and Electronic Stability Control (ESC) disabled; standard hydraulic braking remains.'
    },
    'misfire': {
      code: 'P0302 - Cylinder 2 Misfire Detected',
      mil: true,
      desc: 'Crankshaft position sensor detected angular deceleration during Cylinder 2 combustion stroke.',
      action: 'ECU cuts fuel injector to Cylinder 2 to protect catalytic converter from melting raw fuel.'
    }
  };

  const fault = FAULTS[activeFault];

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Cpu className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">Automotive Electronics, CAN Bus & ECU Diagnostics</h3>
          </div>
          <p className="text-sm text-slate-400">
            How microcontrollers coordinate engine timing, sensor telemetry, and OBD-II diagnostics
          </p>
        </div>

        {/* Fault injection switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 pl-1 font-medium">Inject OBD-II Fault:</span>
          {['none', 'o2-sensor', 'wheel-speed', 'misfire'].map((key) => (
            <button
              key={key}
              onClick={() => setActiveFault(key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                activeFault === key
                  ? key === 'none'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {key === 'none' ? 'Clear DTCs' : key.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* SVG Controller Area Network (CAN Bus) Topology */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[16/11] bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 460 300" className="w-full h-full select-none">
              <defs>
                <linearGradient id="canBusWires" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>

              {/* CAN HIGH & CAN LOW TWISTED PAIR HIGHWAY */}
              <line x1="30" y1="150" x2="430" y2="150" stroke="#8b5cf6" strokeWidth="4" />
              <line x1="30" y1="160" x2="430" y2="160" stroke="#06b6d4" strokeWidth="4" strokeDasharray="8 4" />
              <text x="230" y="142" fill="#c4b5fd" fontSize="9" textAnchor="middle" fontWeight="bold">
                HIGH SPEED CAN BUS (500 kbps Differential Twisted Pair)
              </text>
              <text x="35" y="174" fill="#a5f3fc" fontSize="8" fontWeight="bold">120Ω Term</text>
              <text x="425" y="174" fill="#a5f3fc" fontSize="8" textAnchor="end" fontWeight="bold">120Ω Term</text>

              {/* NODE 1: ENGINE CONTROL MODULE (ECM / PCM) */}
              <g transform="translate(60, 50)">
                <rect
                  x="0"
                  y="0"
                  width="95"
                  height="60"
                  rx="6"
                  fill="#1e1b4b"
                  stroke={activeFault === 'o2-sensor' || activeFault === 'misfire' ? '#f59e0b' : '#a78bfa'}
                  strokeWidth="2"
                />
                <text x="47" y="22" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">ECM (Engine)</text>
                <text x="47" y="38" fill="#c4b5fd" fontSize="8" textAnchor="middle">Spark / Injectors</text>
                {/* Line to CAN bus */}
                <line x1="47" y1="60" x2="47" y2="100" stroke="#8b5cf6" strokeWidth="3" />
              </g>

              {/* NODE 2: TRANSMISSION CONTROL MODULE (TCM) */}
              <g transform="translate(180, 50)">
                <rect x="0" y="0" width="100" height="60" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="50" y="22" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">TCM (Gearbox)</text>
                <text x="50" y="38" fill="#7dd3fc" fontSize="8" textAnchor="middle">Shift Solenoids</text>
                <line x1="50" y1="60" x2="50" y2="100" stroke="#38bdf8" strokeWidth="3" />
              </g>

              {/* NODE 3: BRAKE & STABILITY MODULE (ABS / ESC) */}
              <g transform="translate(310, 50)">
                <rect
                  x="0"
                  y="0"
                  width="100"
                  height="60"
                  rx="6"
                  fill="#1e1b4b"
                  stroke={activeFault === 'wheel-speed' ? '#ef4444' : '#a78bfa'}
                  strokeWidth="2"
                />
                <text x="50" y="22" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">ABS / ESC</text>
                <text x="50" y="38" fill="#c4b5fd" fontSize="8" textAnchor="middle">Hydraulic Valves</text>
                <line x1="50" y1="60" x2="50" y2="100" stroke="#8b5cf6" strokeWidth="3" />
              </g>

              {/* NODE 4: BODY CONTROL MODULE (BCM) */}
              <g transform="translate(90, 190)">
                <rect x="0" y="0" width="110" height="55" rx="6" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                <text x="55" y="22" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">BCM (Body)</text>
                <text x="55" y="38" fill="#94a3b8" fontSize="8" textAnchor="middle">Lighting / Doors</text>
                <line x1="55" y1="0" x2="55" y2="-30" stroke="#8b5cf6" strokeWidth="3" />
              </g>

              {/* NODE 5: OBD-II DIAGNOSTIC PORT & GATEWAY */}
              <g transform="translate(260, 190)">
                <rect x="0" y="0" width="120" height="55" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                <text x="60" y="22" fill="#34d399" fontSize="10" textAnchor="middle" fontWeight="bold">OBD-II GATEWAY</text>
                <text x="60" y="38" fill="#a7f3d0" fontSize="8" textAnchor="middle">16-Pin Scan Port</text>
                <line x1="60" y1="0" x2="60" y2="-30" stroke="#10b981" strokeWidth="3" />
              </g>
            </svg>

            {/* Check Engine MIL Light Alert */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              {fault.mil ? (
                <span className="text-amber-400 font-bold flex items-center gap-1.5 animate-pulse">
                  <AlertTriangle className="w-4 h-4" /> CHECK ENGINE (MIL) ILLUMINATED: {fault.code.split(' - ')[0]}
                </span>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> All Electronic Systems OK
                </span>
              )}
              <span className="font-mono text-cyan-400 font-bold">12V Bus: {batteryVoltage}V</span>
            </div>
          </div>
        </div>

        {/* OBD-II DTC Diagnostics Readout */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              Live OBD-II Freeze Frame Telemetry
            </h4>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs space-y-1.5">
              <div className="text-amber-300 font-bold">{fault.code}</div>
              <div className="text-slate-400 text-[11px] leading-relaxed pt-1">{fault.desc}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 font-medium">ECU Failsafe Compensation Strategy:</span>
              <p className="text-slate-200 leading-relaxed text-[11px]">{fault.action}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-900/40 text-xs text-violet-200/90 leading-relaxed">
            <div className="font-bold text-violet-300 mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              The CAN Bus Revolution
            </div>
            Before CAN Bus was invented by Bosch in 1986, every vehicle sensor required a dedicated pair of copper wires running through the car, adding over 50 kg of wiring harness weight. CAN Bus allows dozens of computers to share telemetry over just <strong>two twisted copper wires</strong> using message arbitration priority.
          </div>
        </div>
      </div>
    </div>
  );
}
