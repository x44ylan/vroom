import React, { useState } from 'react';
import { Disc, Zap, CheckCircle2, AlertOctagon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Switch } from './controls/Controls.jsx';
import { Stage, Pipe, Flow, Callout, heatColor, useClock } from './diagram/kit.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function BrakeSimulator() {
  const [pedalForce, setPedalForce] = useState(40);
  const [absEnabled, setAbsEnabled] = useState(true);

  const footForceN = Math.round((pedalForce / 100) * 500);
  const linePressureBar = Math.round((pedalForce / 100) * 110);
  const clampingForceN = Math.round(linePressureBar * 95);
  const rotorTempC = Math.round(50 + (pedalForce / 100) * 380);

  const isLockupThreshold = pedalForce > 75;
  const isWheelLocked = isLockupThreshold && !absEnabled;

  const t = useClock();
  const absPulse = isLockupThreshold && absEnabled ? (Math.sin(t * 40) > 0 ? 1 : 0.55) : 1;
  const discSpin = isWheelLocked ? 0 : t * (220 - pedalForce * 1.6);
  const heat = (rotorTempC - 50) / 380;
  const squeeze = (pedalForce / 100) * 6 * absPulse;
  const lineD = 'M40 30 H120 Q140 30 140 50 V64 H300 Q330 64 330 90';

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 shrink-0">
            <Disc className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Try the brake pedal</CardTitle>
              <Badge variant="destructive" className="hidden sm:inline-flex">Hydraulics</Badge>
            </div>
            <CardDescription>More pedal pressure means a harder squeeze on the brake disc.</CardDescription>
          </div>
        </div>

        <Switch label="ABS" checked={absEnabled} onChange={setAbsEnabled} />
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="diagram-frame relative w-full aspect-[25/16]">
            <Stage viewBox="0 0 500 320" label={`Brake disc and caliper at ${pedalForce}% pedal pressure`}>
              <ellipse cx="230" cy="306" rx="200" ry="12" fill="url(#k-floor)" />
              {/* Brake line from the pedal */}
              <Pipe d={lineD} w={6} color="#b7b7b7" />
              <Flow d={lineD} t={t} speed={20 + pedalForce * 1.5} color="#e4e4e4" width={3} gap={10} opacity={pedalForce > 2 ? 0.9 : 0} />
              <Callout x={40} y={30} tx={24} ty={54} color="#d6d6d6">From pedal · {linePressureBar} bar</Callout>
              {/* Disc */}
              <g transform="translate(230 180)">
                <circle r="118" fill="url(#k-steel)" />
                <circle r="118" fill={heatColor(heat)} opacity={Math.max(0, heat - 0.15) * 0.9} />
                <circle r="118" fill="none" stroke="#202020" strokeWidth="2" />
                <g transform={`rotate(${discSpin})`}>
                  {Array.from({ length: 24 }, (_, i) => {
                    const a = (i / 24) * Math.PI * 2;
                    return <circle key={i} cx={Math.cos(a) * 92} cy={Math.sin(a) * 92} r="4" fill="#323232" />;
                  })}
                  {Array.from({ length: 6 }, (_, i) => <path key={i} d="M 0 -70 A 70 70 0 0 1 30 -63" stroke="#787878" strokeWidth="2" fill="none" transform={`rotate(${i * 60})`} />)}
                </g>
                <circle r="56" fill="url(#k-iron)" stroke="#202020" />
                {Array.from({ length: 5 }, (_, i) => { const a = (i / 5) * Math.PI * 2 + discSpin * Math.PI / 180; return <circle key={i} cx={Math.cos(a) * 32} cy={Math.sin(a) * 32} r="6" fill="#d5d5d5" />; })}
                <circle r="14" fill="#171717" />
              </g>
              {/* Caliper straddling the disc at the top right */}
              <g transform="translate(330 120) rotate(35)">
                <rect x={-44} y={-24 - squeeze} width="88" height="16" rx="5" fill="#adadad" />
                <rect x={-44} y={8 + squeeze} width="88" height="16" rx="5" fill="#adadad" />
                <path d="M -58 -50 H 58 Q 72 -50 72 -36 V 36 Q 72 50 58 50 H -58 Q -72 50 -72 36 V 24 H -48 V -24 H -72 V -36 Q -72 -50 -58 -50 Z" fill="url(#k-blue)" stroke="#202020" />
                <text x="0" y="-30" fill="#efefef" fontSize="12" fontWeight="700" textAnchor="middle">CALIPER</text>
              </g>
              <Callout x={300} y={220} tx={480} ty={268} anchor="end" color="#d5d5d5">{clampingForceN} N squeeze</Callout>
              {isLockupThreshold && absEnabled && <text x="24" y="300" fill="#e1e1e1" fontSize="12" fontWeight="600">ABS pulsing pressure</text>}
            </Stage>

            <div className="absolute diagram-footer">
              {isWheelLocked ? (
                <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs truncate">
                  <AlertOctagon className="w-4 h-4 shrink-0" /> Wheel locked: the tyre is sliding
                </div>
              ) : isLockupThreshold && absEnabled ? (
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs truncate">
                  <Zap className="w-4 h-4 shrink-0" /> ABS is adjusting brake pressure
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-xs truncate">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Progressive braking
                </div>
              )}
              <span className="font-mono text-slate-300 font-bold shrink-0">{rotorTempC}°C</span>
            </div>
          </div>

          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400">Brake pedal pressure:</span>
              <span className="text-pink-400 font-mono font-bold">{pedalForce}% ({footForceN} N effort)</span>
            </div>
            <input
              type="range" aria-label="Brake pedal pressure"
              min="0"
              max="100"
              step="2"
              value={pedalForce}
              onChange={(e) => setPedalForce(Number(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400">
              Why a small pedal force can stop a car
            </h4>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-center text-pink-300 font-bold">
              Pressure (P) = F₁ / A₁ = F₂ / A₂
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pressure travels through the brake fluid to the caliper pistons. Their larger area turns that pressure into a strong squeeze on the disc. The formula above says that pressure is force divided by area.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
