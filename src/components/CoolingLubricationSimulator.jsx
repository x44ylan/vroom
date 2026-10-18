import React, { useState } from 'react';
import { Thermometer, Droplet, ShieldCheck, Flame } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Switch, Segmented } from './controls/Controls.jsx';
import { Stage, Pipe, Flow, Callout, heatColor, useClock } from './diagram/kit.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function CoolingLubricationSimulator() {
  const [engineLoad, setEngineLoad] = useState(50);
  const [thermostatOpen, setThermostatOpen] = useState(true);
  const [oilGrade, setOilGrade] = useState('5W-30'); // 5W-30 is factory Lexus 2JZ recommendation

  const heatGeneratedKw = Math.round(18 + engineLoad * 1.1);
  const coolantTempC = thermostatOpen
    ? Math.round(88 + (engineLoad / 100) * 12)
    : Math.round(98 + (engineLoad / 100) * 45);

  const oilPressurePsi = Math.round(25 + (engineLoad / 100) * 50);
  const oilFilmThicknessMicrons = oilGrade === '0W-20' ? 2.1 : oilGrade === '5W-30' ? 2.9 : 4.1;

  const t = useClock();
  const heat = Math.min(1, Math.max(0, (coolantTempC - 70) / 70));
  const hot = heatColor(heat), cool = heatColor(Math.max(0, heat - 0.45));
  const loop = 'M150 236 V198 H196';
  const engineOut = 'M392 120 V68 H160 Q140 68 140 88 V96';
  const radiatorFeed = 'M120 96 H90';
  const radiatorReturn = 'M90 236 H128';
  const bypass = 'M140 96 V196';

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Compare cooling and lubrication</CardTitle>
              <Badge variant="info" className="hidden sm:inline-flex">Coolant and oil</Badge>
            </div>
            <CardDescription>Change the load or thermostat position and watch the example temperature.</CardDescription>
          </div>
        </div>

        <Switch label="Thermostat open" checked={thermostatOpen} onChange={setThermostatOpen} />
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="diagram-frame relative w-full aspect-[25/16]">
            <Stage viewBox="0 0 500 320" label={`Cooling system with the thermostat ${thermostatOpen ? 'open' : 'closed'}`}>
              <ellipse cx="260" cy="306" rx="220" ry="12" fill="url(#k-floor)" />
              {/* Radiator */}
              <rect x="22" y="70" width="70" height="190" rx="8" fill="#121a27" stroke="#2c4470" strokeWidth="2" />
              {Array.from({ length: 16 }, (_, i) => <line key={i} x1="28" y1={80 + i * 11} x2="86" y2={80 + i * 11} stroke={thermostatOpen ? '#3c5c94' : '#26324a'} strokeWidth="2" />)}
              {thermostatOpen && [0, 1, 2].map(i => <path key={i} d={`M18 ${110 + i * 50} q -10 -8 0 -16`} fill="none" stroke="#a9cbff" strokeWidth="2" opacity={0.3 + 0.3 * Math.sin(t * 3 + i)} />)}
              <text x="57" y="56" fill="#a9cbff" fontSize="12" fontWeight="600" textAnchor="middle">RADIATOR</text>
              {/* Engine block with cylinders and water jacket */}
              <rect x="196" y="96" width="220" height="150" rx="14" fill="url(#k-iron)" stroke="#0b1220" />
              <rect x="208" y="108" width="196" height="126" rx="10" fill={hot} opacity={0.18 + heat * 0.3} />
              {[0, 1, 2, 3, 4, 5].map(i => <rect key={i} x={218 + i * 31} y="120" width="24" height="96" rx="6" fill="#0b0f17" stroke="#3a4558" />)}
              <text x="306" y="264" fill="#8f9bb3" fontSize="12" fontWeight="600" textAnchor="middle">ENGINE · {heatGeneratedKw} kW of heat</text>
              {/* Pipes */}
              <Pipe d={engineOut} w={12} color={hot} />
              <Flow d={engineOut} t={t} speed={30 + engineLoad} color="#fff" width={3} opacity={0.6} />
              <Pipe d={radiatorFeed} w={12} color={thermostatOpen ? hot : '#2a3446'} />
              <Pipe d={radiatorReturn} w={12} color={thermostatOpen ? cool : '#2a3446'} />
              {thermostatOpen && <Flow d={radiatorReturn} t={t} speed={30 + engineLoad} color="#fff" width={3} opacity={0.6} />}
              {!thermostatOpen && <Pipe d={bypass} w={8} color={hot} />}
              <Pipe d={loop} w={12} color={thermostatOpen ? cool : hot} />
              <Flow d={loop} t={t} speed={30 + engineLoad} color="#fff" width={3} opacity={0.6} />
              {/* Thermostat valve */}
              <circle cx="130" cy="96" r="16" fill="#121a27" stroke={thermostatOpen ? '#4d94ff' : '#ff5a4f'} strokeWidth="3" />
              <line x1="130" y1="96" x2={thermostatOpen ? 130 : 118} y2={thermostatOpen ? 84 : 96} stroke="#e8eefb" strokeWidth="4" strokeLinecap="round" transform={thermostatOpen ? '' : 'rotate(0)'} />
              <Callout x={130} y={80} tx={150} ty={36} color={thermostatOpen ? '#a9cbff' : '#ff8a80'}>Thermostat {thermostatOpen ? 'open' : 'closed'}</Callout>
              {/* Pump */}
              <circle cx="150" cy="248" r="20" fill="#121a27" stroke="#4d94ff" strokeWidth="2" />
              <g transform={`translate(150 248) rotate(${t * 240})`}>{[0, 90, 180, 270].map(a => <path key={a} d="M0 0 L12 -4 L12 4 Z" fill="#a9cbff" transform={`rotate(${a})`} />)}</g>
              <Callout x={170} y={256} tx={196} ty={290} color="#8f9bb3">Pump</Callout>
              {/* Oil sump */}
              <path d="M220 246 H392 L380 284 H232 Z" fill="#2a2618" stroke="#5c4f2a" />
              <path d={`M226 ${262 + Math.sin(t * 2) * 1.5} Q306 ${258 + Math.sin(t * 2 + 1) * 2} 386 ${262 + Math.sin(t * 2) * 1.5} L380 284 H232 Z`} fill="#c08a2e" opacity=".75" />
              <text x="306" y="300" fill="#c9a96b" fontSize="11" textAnchor="middle">Oil · {oilGrade}</text>
            </Stage>

            <div className="absolute diagram-footer">
              {coolantTempC > 115 ? (
                <span className="text-red-400 font-bold flex items-center gap-1.5 truncate">
                  <Flame className="w-4 h-4" /> Temperature is too high
                </span>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1.5 truncate">
                  <ShieldCheck className="w-4 h-4" /> Coolant temperature
                </span>
              )}
              <span className="font-mono text-amber-400 font-bold shrink-0">{coolantTempC}°C</span>
            </div>
          </div>

          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Engine load:</span>
              <span className="text-blue-400 font-mono font-bold">{engineLoad}% ({heatGeneratedKw} kW)</span>
            </div>
            <input
              type="range" aria-label="Engine thermal load"
              min="10"
              max="100"
              value={engineLoad}
              onChange={(e) => setEngineLoad(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5" />
                Oil between moving parts
              </h4>
              <Segmented size="sm" label="Oil grade" value={oilGrade} onChange={setOilGrade} options={['5W-30', '10W-40', '15W-50'].map(g => ({ value: g, label: g }))} />
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Example oil film:</span>
                <span className="font-mono text-amber-400 font-bold">{oilFilmThicknessMicrons} µm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Oil pressure:</span>
                <span className="font-mono text-white font-bold">{oilPressurePsi} PSI</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              The oil pump supplies oil to the bearings that support the crankshaft. A thin film helps keep the moving metal surfaces apart. The thickness shown here is a simplified example, not a measurement or an oil recommendation.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
