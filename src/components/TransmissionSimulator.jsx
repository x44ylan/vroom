import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Segmented } from './controls/Controls.jsx';
import { Button } from './ui/button.jsx';
import { Stage, Gear, Callout, useClock } from './diagram/kit.jsx';

export default function TransmissionSimulator() {
  const [selectedGear, setSelectedGear] = useState(1);
  const [engineRpm, setEngineRpm] = useState(3000);

  const GEAR_CONFIG = {
    1: { ratio: 3.57, label: '1st Gear', name: 'Starting from a stop', desc: 'The gearbox input turns 3.57 times for each output turn. This increases turning force at the output.' },
    2: { ratio: 1.90, label: '2nd Gear', name: 'Building speed', desc: 'Second gear gives more road speed than first at the same engine RPM, with less turning force.' },
    3: { ratio: 1.38, label: '3rd Gear', name: 'A middle gear', desc: 'Third gear is between the strong turning force of first and the higher road speed of fifth.' },
    4: { ratio: 1.00, label: '4th Gear', name: 'Direct 1:1 Drive', desc: 'The gearbox input and output turn at the same speed. The rear differential still changes the speed before it reaches the wheels.' },
    5: { ratio: 0.78, label: '5th / Overdrive', name: 'Cruising in fifth', desc: 'The gearbox output turns faster than the engine. At a given road speed, this lets the engine turn more slowly.' }
  };

  const current = GEAR_CONFIG[selectedGear];
  const outputRpm = Math.round(engineRpm / current.ratio);
  const finalDriveRatio = 3.73;
  const wheelRpm = Math.round(outputRpm / finalDriveRatio);
  const vehicleSpeed = Math.round((wheelRpm * 2.042 * 60) / 1000);
  const engineTorque = 296;
  const wheelTorque = Math.round(engineTorque * current.ratio * finalDriveRatio);
  const t = useClock();
  // Gear sizes follow the ratio: centre distance fixed, radii split by ratio.
  const centre = 150;
  const rIn = centre / (1 + current.ratio), rOut = centre - rIn;
  const toothPitch = 13;
  const teethIn = Math.max(9, Math.round((2 * Math.PI * rIn) / toothPitch)), teethOut = Math.max(9, Math.round((2 * Math.PI * rOut) / toothPitch));
  const inAngle = (t * engineRpm * 0.012) % 360;
  const outAngle = -(inAngle * teethIn) / teethOut + 180 / teethOut;
  const inX = 250 - centre / 2 - 0, gy = 150;

  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center justify-between gap-3 p-4 sm:p-5">
        <div>
          <CardTitle>Try the five gears</CardTitle>
          <CardDescription>Change gears while keeping engine speed steady. Compare the speed and turning force below.</CardDescription>
        </div>

        <Segmented label="Gear" value={selectedGear} onChange={setSelectedGear}
          options={[1, 2, 3, 4, 5].map(g => ({ value: g, label: <><span className="sr-only">Gear </span>{g}</> }))} />
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center p-4 sm:p-5">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="diagram-frame relative w-full aspect-[5/3]">
            <Stage viewBox="0 0 500 300" label={`Gear ${selectedGear}: a ${rIn > rOut ? 'large' : 'small'} input gear driving a ${rOut > rIn ? 'larger' : 'smaller'} output gear`}>
              <ellipse cx="250" cy="290" rx="220" ry="16" fill="url(#k-floor)" />
              {/* Shafts */}
              <rect x="0" y={gy - 9} width={175 - rIn * 0} height="18" rx="9" fill="url(#k-steel)" transform={`translate(0 0)`} />
              <rect x={175 + centre - 10} y={gy - 9} width={500} height="18" rx="9" fill="url(#k-steel)" />
              <circle cx="100" cy="150" r="80" fill="url(#k-glow)" opacity={Math.min(1, engineRpm / 6500) * 0.6} />
              <g transform={`translate(175 ${gy})`}>
                <Gear r={rIn} teeth={teethIn} angle={inAngle} spokes={rIn > 50 ? 5 : 0} fill="url(#k-blue)" />
              </g>
              <g transform={`translate(${175 + centre} ${gy})`}>
                <Gear r={rOut} teeth={teethOut} angle={outAngle} spokes={rOut > 50 ? 6 : 0} />
              </g>
              <Callout x={175} y={gy - rIn} tx={24} ty={28} color="#d6d6d6">From engine · {engineRpm} RPM</Callout>
              <Callout x={175 + centre} y={gy - rOut} tx={476} ty={28} anchor="end" color="#d5d5d5">To wheels · {outputRpm} RPM</Callout>
                          </Stage>

            <div className="absolute diagram-footer">
              <span className="text-zinc-300 font-medium truncate">{current.label}: {current.name}</span>
              <span className="font-mono text-zinc-100 shrink-0 font-medium">Ratio: {current.ratio}:1</span>
            </div>
          </div>

          <div className="w-full mt-3 p-3 rounded-lg bg-[#1d1d1d] border border-[#3c3c3c]">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-zinc-400">Engine speed:</span>
              <span className="text-zinc-100 font-mono font-medium">{engineRpm} RPM</span>
            </div>
            <input
              type="range" aria-label="Engine speed"
              min="800"
              max="6500"
              step="50"
              value={engineRpm}
              onChange={(e) => setEngineRpm(Number(e.target.value))}
              className="w-full accent-zinc-200 cursor-pointer h-1.5 bg-[#3c3c3c] rounded"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div className="p-3.5 rounded-lg bg-[#1d1d1d] border border-[#3c3c3c] space-y-2 text-xs">
            <span className="font-medium text-zinc-200 block">What changes with the gear</span>

            <div className="space-y-1.5 font-mono">
              <div className="flex items-center justify-between p-2 rounded bg-[#272727] border border-[#3c3c3c]">
                <span className="text-zinc-400">Gearbox output:</span>
                <span className="text-zinc-100">{outputRpm} RPM</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-[#272727] border border-[#3c3c3c]">
                <span className="text-zinc-400">Road speed:</span>
                <span className="text-zinc-100 font-bold">{vehicleSpeed} km/h</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-[#272727] border border-[#3c3c3c]">
                <span className="text-zinc-400">Wheel torque:</span>
                <span className="text-zinc-100 font-bold">{wheelTorque} Nm</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed pt-1 border-t border-[#272727]">
              {current.desc}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
