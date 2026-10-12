import React, { useState } from 'react';
import { Cpu, AlertTriangle, ShieldCheck, Radio } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function ElectricalEcuSimulator() {
  const [activeFault, setActiveFault] = useState('none');
  const [batteryVoltage] = useState(14.2);

  const FAULTS = {
    none: {
      code: 'SYSTEM NORMAL - 2JZ-GE RUNNING CLOSED-LOOP',
      mil: false,
      desc: 'Denso ECM reading dual heated oxygen sensors (Bank 1 & Bank 2), mass airflow, and VVT-i camshaft sensor without error.',
      action: 'Target air-fuel ratio 14.7:1 (Stoichiometric). VVT-i continuously advancing intake cam up to 60° for optimal torque.'
    },
    'vvti-solenoid': {
      code: 'P1349 - VVT System Malfunction (Bank 1)',
      mil: true,
      desc: 'Oil Control Valve (OCV) mesh filter clogged or spool valve jammed; intake camshaft not matching target advance angle.',
      action: 'ECM cuts VVT-i advance signal and locks cam timing in base retarded position; low-end torque noticeably diminishes.'
    },
    'wheel-speed': {
      code: 'C0200 - Right Front Wheel Speed Sensor Signal Malfunction',
      mil: true,
      desc: 'Reluctor tone ring pulse lost on front right hub knuckle.',
      action: 'ABS and Traction Control (TRAC) disabled; TRAC OFF indicator flashes on chronograph cluster; standard hydraulic braking remains.'
    },
    'misfire': {
      code: 'P0302 - Cylinder 2 Misfire Detected',
      mil: true,
      desc: 'Denso igniter module / coil pack or spark plug failed on 2JZ Cylinder 2.',
      action: 'ECM flashes CHECK ENGINE light and disables fuel injector on Cylinder 2 to protect close-coupled catalytic converters from raw unburnt fuel.'
    }
  };

  const fault = FAULTS[activeFault];

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Lexus IS300 Denso ECM & Multiplex Communication (MPX)</CardTitle>
              <Badge variant="secondary" className="hidden sm:inline-flex">OBD-II / BEAN Network</Badge>
            </div>
            <CardDescription>How Denso engine computers regulate VVT-i cam phasing, sequential injection & OBD-II DTCs</CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
          {['none', 'vvti-solenoid', 'wheel-speed', 'misfire'].map((key) => (
            <Button
              key={key}
              size="sm"
              variant={activeFault === key ? (key === 'none' ? "success" : "default") : "ghost"}
              onClick={() => setActiveFault(key)}
              className="flex-1 sm:flex-none text-xs font-mono whitespace-nowrap"
            >
              {key === 'none' ? 'Clear DTCs' : key.toUpperCase()}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[16/11] bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 460 300" className="w-full h-full select-none">
              <line x1="30" y1="150" x2="430" y2="150" stroke="#8b5cf6" strokeWidth="4" />
              <line x1="30" y1="160" x2="430" y2="160" stroke="#06b6d4" strokeWidth="4" strokeDasharray="8 4" />
              <text x="230" y="142" fill="#c4b5fd" fontSize="9" textAnchor="middle" fontWeight="bold">
                TOYOTA BEAN / CAN MULTIPLEX BUS (Body Electronics Area Network)
              </text>

              <g transform="translate(50, 50)">
                <rect x="0" y="0" width="105" height="60" rx="6" fill="#1e1b4b" stroke={activeFault === 'vvti-solenoid' || activeFault === 'misfire' ? '#f59e0b' : '#a78bfa'} strokeWidth="2" />
                <text x="52" y="22" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">DENSO ECM</text>
                <text x="52" y="38" fill="#c4b5fd" fontSize="8" textAnchor="middle">2JZ VVT-i & Spark</text>
                <line x1="52" y1="60" x2="52" y2="100" stroke="#8b5cf6" strokeWidth="3" />
              </g>

              <g transform="translate(180, 50)">
                <rect x="0" y="0" width="100" height="60" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="50" y="22" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">A650E TCM</text>
                <text x="50" y="38" fill="#7dd3fc" fontSize="8" textAnchor="middle">E-Shift Buttons</text>
                <line x1="50" y1="60" x2="50" y2="100" stroke="#38bdf8" strokeWidth="3" />
              </g>

              <g transform="translate(305, 50)">
                <rect x="0" y="0" width="105" height="60" rx="6" fill="#1e1b4b" stroke={activeFault === 'wheel-speed' ? '#ef4444' : '#a78bfa'} strokeWidth="2" />
                <text x="52" y="22" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">ABS / TRAC / VSC</text>
                <text x="52" y="38" fill="#c4b5fd" fontSize="8" textAnchor="middle">4-Wheel Sensors</text>
                <line x1="52" y1="60" x2="52" y2="100" stroke="#8b5cf6" strokeWidth="3" />
              </g>

              <g transform="translate(80, 190)">
                <rect x="0" y="0" width="120" height="55" rx="6" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                <text x="60" y="22" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">CHRONOGRAPH CLUSTER</text>
                <text x="60" y="38" fill="#94a3b8" fontSize="8" textAnchor="middle">Volt / Temp / MPG Dials</text>
                <line x1="60" y1="0" x2="60" y2="-30" stroke="#8b5cf6" strokeWidth="3" />
              </g>

              <g transform="translate(250, 190)">
                <rect x="0" y="0" width="130" height="55" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                <text x="65" y="22" fill="#34d399" fontSize="10" textAnchor="middle" fontWeight="bold">DLC3 (OBD-II PORT)</text>
                <text x="65" y="38" fill="#a7f3d0" fontSize="8" textAnchor="middle">16-Pin Scan Connector</text>
                <line x1="65" y1="0" x2="65" y2="-30" stroke="#10b981" strokeWidth="3" />
              </g>
            </svg>

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              {fault.mil ? (
                <span className="text-amber-400 font-bold flex items-center gap-1.5 animate-pulse truncate">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> CHECK ENGINE (MIL): {fault.code.split(' - ')[0]}
                </span>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1.5 truncate">
                  <ShieldCheck className="w-4 h-4 shrink-0" /> All Denso IS300 Systems Normal
                </span>
              )}
              <span className="font-mono text-cyan-400 font-bold shrink-0">{batteryVoltage}V Alternator</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              Lexus OBD-II Diagnostic Telemetry
            </h4>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs space-y-1.5">
              <div className="text-amber-300 font-bold">{fault.code}</div>
              <div className="text-slate-400 text-[11px] leading-relaxed pt-1">{fault.desc}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 font-medium">ECM Failsafe Strategy:</span>
              <p className="text-slate-200 leading-relaxed text-[11px]">{fault.action}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
