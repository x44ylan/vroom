import React, { useState } from 'react';
import { Wind, Activity, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Segmented } from './controls/Controls.jsx';
import { Stage, Callout, SideWheel, smoothPath, useClock } from './diagram/kit.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function AerodynamicsSimulator() {
  const [speedKmh, setSpeedKmh] = useState(110);
  const [vehicleType, setVehicleType] = useState('is300'); // 'is300', 'is300-wing', 'suv'

  const PROFILES = {
    is300: { name: 'Sedan', cd: 0.28, frontalAreaM2: 2.15, desc: 'Compact sports sedan with factory underbody trays and slick Altezza wedge profile.' },
    'is300-wing': { name: 'Sedan with spoiler', cd: 0.30, frontalAreaM2: 2.18, downforceKg: 65, desc: 'Adds high-speed rear axle stability and downforce while marginally increasing drag.' },
    suv: { name: 'Large SUV', cd: 0.40, frontalAreaM2: 2.95, desc: 'Upright windshield and bluff rear create heavy aerodynamic turbulence drag.' }
  };

  const profile = PROFILES[vehicleType];
  const speedMs = (speedKmh * 1000) / 3600;
  const rho = 1.225;

  const dragForceN = Math.round(0.5 * rho * speedMs * speedMs * profile.cd * profile.frontalAreaM2);
  const powerOvercomeWatts = dragForceN * speedMs;
  const powerHp = Math.round((powerOvercomeWatts / 745.7) * 10) / 10;

  const downforceKg = profile.downforceKg
    ? Math.round(profile.downforceKg * Math.pow(speedKmh / 160, 2))
    : Math.round(15 * Math.pow(speedKmh / 140, 2));

  const t = useClock();
  // Side silhouettes, ground at y = 250.
  const SHAPES = {
    is300: [[40, 232], [44, 206], [92, 194], [150, 186], [196, 150], [262, 142], [318, 152], [366, 186], [404, 192], [414, 220], [410, 238]],
    'is300-wing': [[40, 232], [44, 206], [92, 194], [150, 186], [196, 150], [262, 142], [318, 152], [366, 186], [404, 192], [414, 220], [410, 238]],
    suv: [[40, 236], [42, 196], [70, 180], [130, 170], [170, 112], [370, 108], [396, 116], [408, 180], [412, 236]],
  };
  const shape = SHAPES[vehicleType];
  const bodyPath = smoothPath(shape) + ' L410 238 L40 238 Z';
  const roofAt = x => { let best = 250; for (let i = 0; i < shape.length - 1; i++) { const [x1, y1] = shape[i], [x2, y2] = shape[i + 1]; if (x >= Math.min(x1, x2) && x <= Math.max(x1, x2)) best = Math.min(best, y1 + ((y2 - y1) * (x - x1)) / (x2 - x1 || 1)); } return best; };
  // Height of the obstacle the air sees, eased in ahead of the nose and out behind the tail.
  const heightAt = x => {
    if (x < 40) return (250 - roofAt(40)) * Math.exp(-(40 - x) / 26);
    if (x > 412) return (250 - roofAt(412)) * Math.exp(-(x - 412) / (vehicleType === 'suv' ? 70 : 45));
    return 250 - roofAt(x);
  };
  const flowSpeed = 20 + speedKmh * 0.9;
  const wakeSize = vehicleType === 'suv' ? 1.6 : vehicleType === 'is300-wing' ? 1.1 : 1;
  const lines = [52, 98, 142, 184, 222].map(y0 => {
    const f = Math.pow((y0 - 20) / 216, 1.3);
    const pts = [];
    for (let x = -10; x <= 510; x += 12) pts.push([x, Math.round(y0 - heightAt(x) * f - (y0 > 200 ? 10 : 0) * Math.min(1, heightAt(x) / 30))]);
    return smoothPath(pts);
  });

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Compare speed and air resistance</CardTitle>
              <Badge variant="success" className="hidden sm:inline-flex">Cd: 0.28 Drag Coefficient</Badge>
            </div>
            <CardDescription>Choose a body shape and change speed. Watch the drag force and power readouts.</CardDescription>
          </div>
        </div>

        <Segmented label="Body shape" value={vehicleType} onChange={setVehicleType}
          options={Object.entries(PROFILES).map(([key, item]) => ({ value: key, label: item.name }))} />
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="diagram-frame relative w-full aspect-[5/3]">
            <Stage viewBox="0 0 500 280" label={`Air flowing over a ${profile.name.toLowerCase()} at ${speedKmh} km/h`}>
              <rect x="0" y="250" width="500" height="30" fill="#272727" />
              <line x1="0" y1="250" x2="500" y2="250" stroke="#555555" strokeWidth="2" />
              {Array.from({ length: 12 }, (_, i) => <rect key={i} x={((i * 48 + t * flowSpeed * 3) % 576 + 576) % 576 - 40} y="268" width="24" height="3" fill="#444444" />)}
              {/* Streamlines bending over the body */}
              {lines.map((d, i) => (
                <g key={i}>
                  <path d={d} fill="none" stroke="#c9c9c9" strokeWidth="1.5" opacity=".25" />
                  <path d={d} fill="none" stroke="#d6d6d6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="14 22" strokeDashoffset={-t * flowSpeed} opacity={0.5 + i * 0.08} />
                </g>
              ))}
              {/* Turbulent wake behind the car */}
              <g opacity={Math.min(1, 0.35 + speedKmh / 240)}>
                {Array.from({ length: 7 }, (_, i) => {
                  const r = (7 + i * 4) * wakeSize, a = t * (2.5 + i * 0.6) + i * 1.7;
                  const baseY = vehicleType === 'suv' ? 160 : 200;
                  return <circle key={i} cx={430 + i * 9 + Math.cos(a) * 5} cy={baseY + i * 3 + Math.sin(a) * 9 * wakeSize} r={r} fill="none" stroke="#969696" strokeWidth="1.5" strokeDasharray="4 5" opacity={0.65 - i * 0.07} />;
                })}
              </g>
              <text x="480" y="244" fill="#a5a5a5" fontSize="11" textAnchor="end">wake</text>
              <text x="20" y="24" fill="#a5a5a5" fontSize="11">Airflow →</text>
              {/* Car */}
              <path d={bodyPath} fill="url(#k-iron)" stroke="#787878" strokeWidth="2" />
              <path d={smoothPath(shape.slice(3, 8))} fill="none" stroke="#d6d6d6" strokeWidth="2" opacity=".5" />
              {vehicleType === 'is300-wing' && <path d="M372 176 L404 172 L406 178 L374 182 Z" fill="#c9c9c9" />}
              <SideWheel cx={vehicleType === 'suv' ? 110 : 108} cy={232} r={vehicleType === 'suv' ? 26 : 22} spin={t * speedKmh * 4} />
              <SideWheel cx={vehicleType === 'suv' ? 340 : 342} cy={232} r={vehicleType === 'suv' ? 26 : 22} spin={t * speedKmh * 4} />
            </Stage>

            <div className="absolute diagram-footer">
              <span className="text-slate-300 font-medium truncate">
                {profile.name} (Cd: {profile.cd})
              </span>
              <span className="font-mono text-emerald-400 font-bold shrink-0">Drag Force: {dragForceN} N</span>
            </div>
          </div>

          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400">Road speed:</span>
              <span className="text-emerald-400 font-mono font-bold">{speedKmh} km/h ({(speedKmh * 0.621).toFixed(0)} mph)</span>
            </div>
            <input
              type="range" aria-label="Road speed"
              min="30"
              max="240"
              step="5"
              value={speedKmh}
              onChange={(e) => setSpeedKmh(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Power needed to push through the air
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Power used against drag:</span>
                <span className="text-sm font-mono font-bold text-amber-400">{powerHp} Horsepower</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Example downforce:</span>
                <span className="text-sm font-mono font-bold text-cyan-400">{downforceKg} kg-force</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
              A larger front area or a higher drag coefficient produces more air resistance at the same speed. The power shown covers air resistance only; a real car also uses power to overcome tyre resistance and other losses. The body profiles are simplified examples.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
