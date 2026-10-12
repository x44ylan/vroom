import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';

export default function TransmissionSimulator() {
  const [selectedGear, setSelectedGear] = useState(1);
  const [engineRpm, setEngineRpm] = useState(3000);

  const GEAR_CONFIG = {
    1: { ratio: 3.57, label: '1st Gear', name: 'Launch & Torque Multiply', desc: 'Accelerates 1,475 kg curb weight from stop using 3.57:1 torque leverage.' },
    2: { ratio: 1.90, label: '2nd Gear', name: 'Town Acceleration', desc: 'Pulls briskly through the 2JZ-GE 3,800 RPM peak torque shelf.' },
    3: { ratio: 1.38, label: '3rd Gear', name: 'Mid-Range Passing', desc: 'Direct throttle response from 50 to 110 km/h.' },
    4: { ratio: 1.00, label: '4th Gear', name: 'Direct 1:1 Drive', desc: 'Mainshaft locked direct with zero transmission gearing drag.' },
    5: { ratio: 0.78, label: '5th / Overdrive', name: 'Highway Cruising', desc: 'Drops 2JZ cruising RPM at 110 km/h to ~2,750 RPM for fuel economy.' }
  };

  const current = GEAR_CONFIG[selectedGear];
  const outputRpm = Math.round(engineRpm / current.ratio);
  const finalDriveRatio = 3.73;
  const wheelRpm = Math.round(outputRpm / finalDriveRatio);
  const vehicleSpeed = Math.round((wheelRpm * 2.042 * 60) / 1000);
  const engineTorque = 296;
  const wheelTorque = Math.round(engineTorque * current.ratio * finalDriveRatio);

  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center justify-between gap-3 p-4 sm:p-5">
        <div>
          <CardTitle>Toyota W55 5-Speed Transmission</CardTitle>
          <CardDescription>Gear tooth count ratios and torque leverage</CardDescription>
        </div>

        <div className="flex items-center gap-1 bg-[#0e0f11] p-0.5 rounded border border-[#222428]">
          {[1, 2, 3, 4, 5].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGear(g)}
              className={`px-2 py-1 text-xs rounded transition ${
                selectedGear === g
                  ? 'bg-[#222428] text-zinc-100 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Gear {g}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center p-4 sm:p-5">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[16/10] bg-[#0c0d0e] rounded-lg border border-[#222428] p-3 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 460 260" className="w-full h-full select-none">
              <rect x="20" y="120" width="80" height="20" fill="#3f3f46" rx="2" />
              <text x="60" y="110" fill="#71717a" fontSize="10" textAnchor="middle" fontWeight="medium">2JZ INPUT</text>

              <g transform="translate(150, 130)">
                <circle cx="0" cy="0" r={38 / Math.sqrt(current.ratio)} fill="#27272a" stroke="#71717a" strokeWidth="1.5" />
                <circle cx="0" cy="0" r={8} fill="#0c0d0e" />
                <text x="0" y="3" fill="#a1a1aa" fontSize="9" textAnchor="middle">IN</text>
              </g>

              <g transform="translate(270, 130)">
                <circle cx="0" cy="0" r={38 * Math.sqrt(current.ratio)} fill="#27272a" stroke="#71717a" strokeWidth="1.5" />
                <circle cx="0" cy="0" r={10} fill="#0c0d0e" />
                <text x="0" y="3" fill="#a1a1aa" fontSize="9" textAnchor="middle">OUT</text>
              </g>

              <rect x="330" y="120" width="100" height="20" fill="#3f3f46" rx="2" />
              <text x="380" y="110" fill="#71717a" fontSize="10" textAnchor="middle" fontWeight="medium">PROPELLER SHAFT</text>
            </svg>

            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs bg-[#121316] p-2 rounded border border-[#222428]">
              <span className="text-zinc-300 font-medium truncate">{current.label}: {current.name}</span>
              <span className="font-mono text-zinc-100 shrink-0 font-medium">Ratio: {current.ratio}:1</span>
            </div>
          </div>

          <div className="w-full mt-3 p-3 rounded-lg bg-[#0e0f11] border border-[#222428]">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-zinc-400">Engine Speed:</span>
              <span className="text-zinc-100 font-mono font-medium">{engineRpm} RPM</span>
            </div>
            <input
              type="range"
              min="800"
              max="6500"
              step="50"
              value={engineRpm}
              onChange={(e) => setEngineRpm(Number(e.target.value))}
              className="w-full accent-zinc-200 cursor-pointer h-1.5 bg-[#222428] rounded"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div className="p-3.5 rounded-lg bg-[#0e0f11] border border-[#222428] space-y-2 text-xs">
            <span className="font-medium text-zinc-200 block">Driveline Measurements</span>

            <div className="space-y-1.5 font-mono">
              <div className="flex items-center justify-between p-2 rounded bg-[#16171a] border border-[#222428]">
                <span className="text-zinc-400">Transmission Output:</span>
                <span className="text-zinc-100">{outputRpm} RPM</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-[#16171a] border border-[#222428]">
                <span className="text-zinc-400">Road Speed:</span>
                <span className="text-zinc-100 font-bold">{vehicleSpeed} km/h</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-[#16171a] border border-[#222428]">
                <span className="text-zinc-400">Rear Wheel Torque:</span>
                <span className="text-zinc-100 font-bold">{wheelTorque} Nm</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed pt-1 border-t border-[#1e2024]">
              In 1st gear (3.57 ratio) with the 3.73 final drive, engine torque is multiplied by 13.3×, delivering nearly 4,000 Nm to the rear tires.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
