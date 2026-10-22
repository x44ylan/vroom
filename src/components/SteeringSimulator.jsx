import React, { useState } from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Stage, Callout } from './diagram/kit.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function SteeringSimulator() {
  const [steeringAngle, setSteeringAngle] = useState(20);

  const absAngle = Math.abs(steeringAngle);
  const insideWheelAngle = absAngle * 1.25;
  const outsideWheelAngle = absAngle * 0.85;

  const leftWheelVisual = steeringAngle < 0 ? -insideWheelAngle : -outsideWheelAngle;
  const rightWheelVisual = steeringAngle < 0 ? -outsideWheelAngle : -insideWheelAngle;

  // Front axle seen from above. Turning centre lies on the rear axle line.
  const wheelbase = 210, half = 120, cx = 250, frontY = 90;
  const rackShift = steeringAngle * 1.4;
  const dir = Math.sign(steeringAngle) || 1;
  const innerA = (insideWheelAngle * Math.PI) / 180;
  const turnX = cx - dir * half + dir * (wheelbase / Math.tan(Math.max(innerA, 0.01)));
  const showCentre = absAngle > 3;

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Turn the front wheels</CardTitle>
              <Badge variant="secondary" className="hidden sm:inline-flex">Kinematics</Badge>
            </div>
            <CardDescription>Compare the inside and outside wheel angles as you steer.</CardDescription>
          </div>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => setSteeringAngle(0)}
          className="action-chip"
        >
          Centre steering
        </Button>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="diagram-frame relative w-full aspect-[25/17]">
            <Stage viewBox="0 0 500 340" label={`Front wheels seen from above, steered ${steeringAngle} degrees`}>
              <clipPath id="steer-clip"><rect width="500" height="340" /></clipPath>
              {/* Car outline from above */}
              <path d="M128 340 L134 70 Q140 24 250 20 Q360 24 366 70 L372 340 Z" fill="#272727" stroke="#474747" strokeWidth="2" />
              <line x1="128" y1={frontY + wheelbase} x2="372" y2={frontY + wheelbase} stroke="#474747" strokeWidth="2" strokeDasharray="4 6" />
              <text x="250" y={frontY + wheelbase + 18} fill="#777777" fontSize="11" textAnchor="middle">rear axle: both lines meet here</text>
              {/* Lines from each front wheel to the shared turning point */}
              {showCentre && (
                <g stroke="#c9c9c9" strokeWidth="1.5" strokeDasharray="5 6" opacity=".75" clipPath="url(#steer-clip)">
                  <line x1={cx - half} y1={frontY} x2={turnX} y2={frontY + wheelbase} />
                  <line x1={cx + half} y1={frontY} x2={turnX} y2={frontY + wheelbase} />
                </g>
              )}
              {showCentre && Math.abs(turnX - 250) < 400 && <circle cx={turnX} cy={frontY + wheelbase} r="5" fill="#c9c9c9" />}
              {/* Steering column and rack */}
              <rect x={cx - 92 + rackShift} y={frontY + 34} width="184" height="12" rx="6" fill="url(#k-steel)" />
              <circle cx={cx} cy={frontY + 40} r="12" fill="url(#k-blue)" stroke="#202020" />
              <line x1={cx} y1={frontY + 40} x2={cx} y2={frontY + 130} stroke="#787878" strokeWidth="6" strokeLinecap="round" />
              {/* Tie rods from the rack ends to the steering-arm tips */}
              {[[-1, leftWheelVisual], [1, rightWheelVisual]].map(([side, ang]) => {
                const r = (ang * Math.PI) / 180, lx = -side * 34, ly = 30;
                const tipX = cx + side * half + lx * Math.cos(r) - ly * Math.sin(r);
                const tipY = frontY + lx * Math.sin(r) + ly * Math.cos(r);
                return <line key={side} x1={cx + side * 92 + rackShift} y1={frontY + 40} x2={tipX} y2={tipY} stroke="#d5d5d5" strokeWidth="5" strokeLinecap="round" />;
              })}
              {/* Wheels */}
              {[[-1, leftWheelVisual], [1, rightWheelVisual]].map(([side, ang]) => (
                <g key={side} transform={`translate(${cx + side * half} ${frontY}) rotate(${ang})`}>
                  <rect x="-17" y="-44" width="34" height="88" rx="10" fill="#1c1c1c" stroke="#0b0b0b" strokeWidth="2" />
                  {Array.from({ length: 6 }, (_, i) => <rect key={i} x="-15" y={-40 + i * 14} width="30" height="3" fill="#373737" />)}
                  <line x1={-side * 17} y1="0" x2={-side * 34} y2="30" stroke="#a0a0a0" strokeWidth="5" strokeLinecap="round" />
                </g>
              ))}
              <Callout x={cx - half} y={frontY - 48} tx={60} ty={22} color={steeringAngle < 0 ? '#d6d6d6' : '#d5d5d5'}>Left {Math.round(Math.abs(leftWheelVisual))}°</Callout>
              <Callout x={cx + half} y={frontY - 48} tx={440} ty={22} anchor="end" color={steeringAngle > 0 ? '#d6d6d6' : '#d5d5d5'}>Right {Math.round(Math.abs(rightWheelVisual))}°</Callout>
            </Stage>

            <div className="absolute diagram-footer">
              <span className="text-slate-300 font-medium truncate">
                {steeringAngle === 0
                  ? 'Steering centered'
                  : `Inside wheel: ${Math.round(insideWheelAngle)}° | Outside wheel: ${Math.round(outsideWheelAngle)}°`}
              </span>
              <span className="font-mono text-teal-400 font-bold shrink-0">Inside wheel turns more</span>
            </div>
          </div>

          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400">Steering rack angle:</span>
              <span className="text-teal-400 font-mono font-bold">{steeringAngle}°</span>
            </div>
            <input
              type="range" aria-label="Steering angle"
              min="-35"
              max="35"
              step="1"
              value={steeringAngle}
              onChange={(e) => setSteeringAngle(Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Why the inside wheel turns more
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Imagine two people walking around a bend side by side. The person on the inside follows a tighter curve. The inside front wheel does the same, so the steering linkage turns it more sharply. This arrangement is called Ackermann geometry.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
