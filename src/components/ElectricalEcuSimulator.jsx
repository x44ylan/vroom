import React, { useState } from 'react';
import { Cpu, AlertTriangle, ShieldCheck, Radio } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Segmented } from './controls/Controls.jsx';
import { Stage, Callout, Flow, useClock } from './diagram/kit.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function ElectricalEcuSimulator() {
  const [activeFault, setActiveFault] = useState('none');
  const [batteryVoltage] = useState(14.2);

  const FAULTS = {
    none: {
      code: 'No fault detected in this example',
      mil: false,
      desc: 'The sensors are reporting normal engine operation.',
      action: 'The engine computer uses sensor readings to adjust fuel delivery and valve timing.'
    },
    'vvti-solenoid': {
      code: 'P1349: valve timing problem',
      mil: true,
      desc: 'The system that adjusts when the intake valves open is not responding as expected.',
      action: 'The engine may lose some performance. The code points to the valve-timing system; it does not identify a single failed part.'
    },
    'wheel-speed': {
      code: 'C0200: right front wheel-speed signal problem',
      mil: true,
      desc: 'The brake computer cannot read a reliable speed signal from the right front wheel.',
      action: 'Without reliable wheel-speed information, ABS and traction control may be unavailable. A technician would check the sensor signal and wiring.'
    },
    'misfire': {
      code: 'P0302: cylinder 2 misfire',
      mil: true,
      desc: 'Cylinder 2 is not burning its mixture properly. Ignition, fuel delivery, or compression could be involved.',
      action: 'The engine may run unevenly. The code identifies the cylinder to investigate, but further checks are needed to find the cause.'
    }
  };

  const fault = FAULTS[activeFault];

  const t = useClock();
  const faultNode = activeFault === 'wheel-speed' ? 'brake' : activeFault === 'none' ? null : 'engine';
  const NODES = [
    { id: 'engine', x: 18, y: 30, title: 'Engine computer', sub: 'Fuel and ignition' },
    { id: 'gearbox', x: 176, y: 30, title: 'Gearbox control', sub: 'Gear selection' },
    { id: 'brake', x: 334, y: 30, title: 'Brake control', sub: 'Wheel sensors' },
    { id: 'dash', x: 96, y: 196, title: 'Dashboard', sub: 'Gauges and warnings' },
    { id: 'port', x: 256, y: 196, title: 'Diagnostic port', sub: 'Connect a scan tool' },
  ];
  const bus = 'M20 156 H480';

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Try a fault example</CardTitle>
              <Badge variant="secondary" className="hidden sm:inline-flex">Onboard diagnostics</Badge>
            </div>
            <CardDescription>Choose a fault to see what the computer reports and what it can mean.</CardDescription>
          </div>
        </div>

        <Segmented label="Fault example" value={activeFault} onChange={setActiveFault}
          options={[{ value: 'none', label: 'No fault' }, { value: 'vvti-solenoid', label: 'Valve timing' }, { value: 'wheel-speed', label: 'Wheel sensor' }, { value: 'misfire', label: 'Misfire' }]} />
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="diagram-frame relative w-full aspect-[5/3]">
            <Stage viewBox="0 0 500 280" label="Car computers sharing messages on one network">
              {/* Twisted-pair data bus */}
              <path d={bus} stroke="#424242" strokeWidth="14" strokeLinecap="round" />
              <path d="M20 152 Q32 160 44 152 T68 152 T92 152 T116 152 T140 152 T164 152 T188 152 T212 152 T236 152 T260 152 T284 152 T308 152 T332 152 T356 152 T380 152 T404 152 T428 152 T452 152 T476 152" fill="none" stroke="#c9c9c9" strokeWidth="2" />
              <path d="M20 160 Q32 152 44 160 T68 160 T92 160 T116 160 T140 160 T164 160 T188 160 T212 160 T236 160 T260 160 T284 160 T308 160 T332 160 T356 160 T380 160 T404 160 T428 160 T452 160 T476 160" fill="none" stroke="#969696" strokeWidth="2" />
              <Flow d={bus} t={t} speed={90} color="#e4e4e4" width={5} gap={40} />
              <text x="480" y="182" fill="#777777" fontSize="11" textAnchor="end">Shared network</text>
              {NODES.map(n => {
                const bad = faultNode === n.id;
                const top = n.y < 150;
                const stubY1 = top ? n.y + 64 : n.y, stubY2 = top ? 152 : 160;
                return (
                  <g key={n.id}>
                    <line x1={n.x + 74} y1={stubY1} x2={n.x + 74} y2={stubY2} stroke={bad ? '#c0c0c0' : '#686868'} strokeWidth="3" />
                    <rect x={n.x} y={n.y} width="148" height="64" rx="12" fill="#272727" stroke={bad ? '#c0c0c0' : n.id === 'port' ? '#d8d8d8' : '#686868'} strokeWidth={bad ? 2.5 : 1.5} filter="url(#k-shadow)" />
                    <circle cx={n.x + 16} cy={n.y + 18} r="4" fill={bad ? '#c0c0c0' : '#d8d8d8'} opacity={bad ? 0.5 + 0.5 * Math.sin(t * 8) : 0.9} />
                    <text x={n.x + 26} y={n.y + 22} fill="#efefef" fontSize="12" fontWeight="600">{n.title}</text>
                    <text x={n.x + 14} y={n.y + 44} fill="#a5a5a5" fontSize="11">{n.sub}</text>
                  </g>
                );
              })}
            </Stage>

            <div className="absolute diagram-footer">
              {fault.mil ? (
                <span className="text-amber-400 font-bold flex items-center gap-1.5 truncate">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> Fault code: {fault.code.split(' - ')[0]}
                </span>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1.5 truncate">
                  <ShieldCheck className="w-4 h-4 shrink-0" /> No fault selected
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
              What the code means
            </h4>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs space-y-1.5">
              <div className="text-amber-300 font-bold">{fault.code}</div>
              <p className="text-slate-400 leading-relaxed pt-1">{fault.desc}</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 font-medium">What you might notice</span>
              <p className="text-slate-200 leading-relaxed text-[11px]">{fault.action}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
