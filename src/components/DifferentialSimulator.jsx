import React, { useState } from 'react';
import { Compass, ArrowLeftRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Segmented } from './controls/Controls.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { Stage, Gear, Callout, SideWheel, Arrow, useClock } from './diagram/kit.jsx';

export default function DifferentialSimulator() {
  const [turnDirection, setTurnDirection] = useState('straight');
  const [diffType, setDiffType] = useState('torsen'); // 'torsen', 'open'
  const [driveshaftSpeed, setDriveshaftSpeed] = useState(100);

  let leftWheelSpeed = driveshaftSpeed;
  let rightWheelSpeed = driveshaftSpeed;

  if (turnDirection === 'left') {
    leftWheelSpeed = Math.round(driveshaftSpeed * 0.6);
    rightWheelSpeed = Math.round(driveshaftSpeed * 1.4);
  } else if (turnDirection === 'right') {
    leftWheelSpeed = Math.round(driveshaftSpeed * 1.4);
    rightWheelSpeed = Math.round(driveshaftSpeed * 0.6);
  }

  const t = useClock();
  const spinL = (t * leftWheelSpeed * 2.4) % 360, spinR = (t * rightWheelSpeed * 2.4) % 360;
  const ringAngle = (t * driveshaftSpeed * 2.4) % 360;
  const spiderAngle = (t * (rightWheelSpeed - leftWheelSpeed) * 3) % 360;
  const bend = turnDirection === 'left' ? -1 : turnDirection === 'right' ? 1 : 0;

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Compare wheel speeds in a turn</CardTitle>
              <Badge variant="secondary" className="hidden sm:inline-flex">Torsen Type-2 LSD</Badge>
            </div>
            <CardDescription>The outside wheel travels farther around a bend, so it turns faster.</CardDescription>
          </div>
        </div>

        <Segmented label="Driving direction" value={turnDirection} onChange={setTurnDirection}
          options={[{ value: 'left', label: 'Turn left' }, { value: 'straight', label: 'Straight' }, { value: 'right', label: 'Turn right' }]} />
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="diagram-frame relative w-full aspect-[25/16]">
            <Stage viewBox="0 0 500 320" label={`Rear axle seen from above, ${turnDirection === 'straight' ? 'driving straight' : `turning ${turnDirection}`}`}>
              {/* Path of each wheel through the bend */}
              {bend !== 0 && (
                <g fill="none" strokeDasharray="6 8" strokeWidth="2">
                  {[[50, '#777777'], [450, '#c9c9c9']].map(([x, color]) => {
                    // Both wheels circle the same point far off to the side of the bend.
                    const centreX = bend < 0 ? -650 : 1150, R = Math.abs(x - centreX);
                    const pts = Array.from({ length: 33 }, (_, i) => { const y = i * 10; return `${i ? 'L' : 'M'}${(centreX + Math.sign(x - centreX) * Math.sqrt(R * R - (y - 160) ** 2)).toFixed(1)},${y}`; }).join('');
                    return <path key={x} d={pts} stroke={(bend < 0 ? x > 250 : x < 250) ? '#c9c9c9' : '#777777'} />;
                  })}
                </g>
              )}
              {/* Axle shafts */}
              <rect x="70" y="151" width="360" height="18" rx="9" fill="url(#k-steel)" />
              {/* Driveshaft and pinion coming from the front */}
              <rect x="241" y="236" width="18" height="84" rx="9" fill="url(#k-steel-h)" />
              <Callout x={259} y={290} tx={300} ty={290} color="#d6d6d6">From gearbox</Callout>
              {/* Housing with ring gear and spider gears */}
              <circle cx="250" cy="160" r="78" fill="url(#k-iron)" stroke="#202020" />
              <g transform="translate(250 160)">
                <Gear r={66} teeth={36} angle={ringAngle} fill="url(#k-blue)" spokes={0} hub="#272727" />
                <circle r="44" fill="#272727" />
                <g transform={`rotate(${ringAngle})`}>
                  <g transform="translate(0 -28)"><Gear r={12} teeth={10} angle={spiderAngle} /></g>
                  <g transform="translate(0 28)"><Gear r={12} teeth={10} angle={-spiderAngle} /></g>
                </g>
                <g transform="translate(-30 0)"><Gear r={13} teeth={10} angle={spinL} fill="url(#k-steel-h)" /></g>
                <g transform="translate(30 0)"><Gear r={13} teeth={10} angle={-spinR} fill="url(#k-steel-h)" /></g>
              </g>
              {/* Tyres, top-down */}
              {[[50, spinL, leftWheelSpeed, 'Left'], [450, spinR, rightWheelSpeed, 'Right']].map(([x, spin, rpm, label]) => (
                <g key={label}>
                  <rect x={x - 26} y="102" width="52" height="116" rx="14" fill="#1c1c1c" stroke="#0b0b0b" strokeWidth="2" />
                  {Array.from({ length: 7 }, (_, i) => <rect key={i} x={x - 24} y={104 + ((i * 17 + spin * 0.3) % 112)} width="48" height="3" fill="#373737" />)}
                  <text x={x} y="244" fill={rpm > driveshaftSpeed ? '#d6d6d6' : rpm < driveshaftSpeed ? '#a5a5a5' : '#efefef'} fontSize="15" fontWeight="600" textAnchor="middle">{rpm} RPM</text>
                  <text x={x} y="92" fill="#a5a5a5" fontSize="11" textAnchor="middle">{label} wheel</text>
                </g>
              ))}
            </Stage>

            <div className="absolute diagram-footer">
              <span className="text-slate-300 font-medium">
                {turnDirection === 'straight' ? 'Both wheels turn at the same speed' : 'The outside wheel turns faster'}
              </span>
              <span>(L + R) / 2 = {driveshaftSpeed} RPM</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              What happens when a tyre loses grip?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              An open differential lets the wheels turn at different speeds, but the turning force available to both wheels is limited by the wheel with less grip.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              A Torsen limited-slip differential uses gears and friction to send more turning force to the wheel with better grip. This is a separate job from allowing different wheel speeds in a corner.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
