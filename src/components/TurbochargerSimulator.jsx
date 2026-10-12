import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';

export default function TurbochargerSimulator() {
  const [engineRpm, setEngineRpm] = useState(2600);
  const [wastegateOpen, setWastegateOpen] = useState(false);
  const [intercoolerActive, setIntercoolerActive] = useState(true);
  const [animAngle, setAnimAngle] = useState(0);
  const animRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  const spoolFactor = Math.min(1.0, Math.max(0, (engineRpm - 2000) / 2600));
  const turboRpm = Math.round(spoolFactor * 165000 + (engineRpm > 1000 ? 15000 : 0));
  
  const targetBoostPsi = wastegateOpen ? Math.min(5, spoolFactor * 8) : spoolFactor * 16.5;
  const boostPsi = Math.round(targetBoostPsi * 10) / 10;
  const boostBar = Math.round((boostPsi / 14.7) * 100) / 100;

  const uncooledTempC = Math.round(25 + boostPsi * 5.8);
  const intakeAirTempC = intercoolerActive
    ? Math.round(25 + (uncooledTempC - 25) * 0.3)
    : uncooledTempC;

  const manifoldPressureRatio = (14.7 + boostPsi) / 14.7;
  const volumetricEfficiency = Math.round(manifoldPressureRatio * 95);
  const densityBonus = (273 + 25) / (273 + intakeAirTempC);
  const estimatedHorsepower = Math.round(215 * manifoldPressureRatio * Math.min(1.15, densityBonus));

  useEffect(() => {
    const loop = (now) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      const speed = (turboRpm / 15000) * 360 * dt;
      setAnimAngle((prev) => (prev + speed) % 360);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [turboRpm]);

  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center justify-between gap-3 p-4 sm:p-5">
        <div>
          <CardTitle>2JZ-GE Turbo Conversion (NA-T Simulator)</CardTitle>
          <CardDescription>Compressing intake air density using waste exhaust enthalpy</CardDescription>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant={intercoolerActive ? "default" : "secondary"}
            onClick={() => setIntercoolerActive(!intercoolerActive)}
          >
            {intercoolerActive ? 'Intercooler ON' : 'Intercooler BYPASS'}
          </Button>

          <Button
            size="sm"
            variant={wastegateOpen ? "default" : "secondary"}
            onClick={() => setWastegateOpen(!wastegateOpen)}
          >
            {wastegateOpen ? 'Wastegate OPEN' : 'Wastegate SHUT'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center p-4 sm:p-5">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[16/11] bg-[#0c0d0e] rounded-lg border border-[#222428] p-3 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 460 300" className="w-full h-full select-none">
              <path d="M 20 220 L 100 220 C 130 220, 150 200, 150 170" fill="none" stroke="#71717a" strokeWidth="16" strokeLinecap="round" />
              <text x="35" y="240" fill="#a1a1aa" fontSize="9" fontWeight="medium">2JZ EXHAUST MANIFOLD</text>

              <path d="M 80 220 C 80 260, 170 260, 190 220" fill="none" stroke={wastegateOpen ? '#a1a1aa' : '#27272a'} strokeWidth="6" strokeDasharray={wastegateOpen ? 'none' : '4 4'} />

              <circle cx="160" cy="150" r="46" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
              <g transform={`translate(160, 150) rotate(${animAngle})`}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <path key={deg} d="M 0 0 L 10 -36 L 4 -38 Z" fill="#71717a" transform={`rotate(${deg})`} />
                ))}
                <circle cx="0" cy="0" r="8" fill="#0c0d0e" stroke="#52525b" strokeWidth="1.5" />
              </g>

              <rect x="200" y="143" width="60" height="14" rx="2" fill="#3f3f46" stroke="#52525b" strokeWidth="1" />

              <circle cx="300" cy="150" r="46" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
              <g transform={`translate(300, 150) rotate(${animAngle})`}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <path key={deg} d="M 0 0 L 10 -36 L 4 -38 Z" fill="#a1a1aa" transform={`rotate(${deg})`} />
                ))}
                <circle cx="0" cy="0" r="8" fill="#0c0d0e" stroke="#52525b" strokeWidth="1.5" />
              </g>

              <path d="M 440 150 L 346 150" fill="none" stroke="#52525b" strokeWidth="14" strokeLinecap="round" />
              <path d="M 300 196 L 300 240 C 300 250, 310 260, 320 260 L 370 260" fill="none" stroke={intercoolerActive ? '#71717a' : '#a1a1aa'} strokeWidth="12" strokeLinecap="round" />

              <rect x="370" y="240" width="70" height="40" rx="3" fill="#16171a" stroke="#27272a" strokeWidth="1.5" />
              {[380, 390, 400, 410, 420, 430].map((x) => (
                <line key={x} x1={x} y1="243" x2={x} y2="277" stroke="#27272a" strokeWidth="1.5" />
              ))}
            </svg>

            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs bg-[#121316] p-2 rounded border border-[#222428]">
              <span className="text-zinc-400 font-mono">
                Shaft: <span className="text-zinc-100">{turboRpm.toLocaleString()} RPM</span>
              </span>
              <span className="font-mono text-zinc-200">
                Boost: +{boostPsi} PSI ({boostBar} Bar)
              </span>
            </div>
          </div>

          <div className="w-full mt-3 p-3 rounded-lg bg-[#0e0f11] border border-[#222428]">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-zinc-400">2JZ Engine Speed:</span>
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
          <div className="p-3.5 rounded-lg bg-[#0e0f11] border border-[#222428] space-y-2.5 text-xs">
            <span className="font-medium text-zinc-200 block">Calculated Performance Output</span>

            <div className="space-y-1.5 font-mono">
              <div className="flex justify-between p-2 rounded bg-[#16171a] border border-[#222428]">
                <span className="text-zinc-400">Estimated Power:</span>
                <span className="text-zinc-100 font-bold">{estimatedHorsepower} HP</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#16171a] border border-[#222428]">
                <span className="text-zinc-400">Volumetric Efficiency:</span>
                <span className="text-zinc-200">{volumetricEfficiency}%</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#16171a] border border-[#222428]">
                <span className="text-zinc-400">Intake Air Temp:</span>
                <span className={intakeAirTempC > 65 ? 'text-red-400' : 'text-zinc-200'}>
                  {intakeAirTempC}°C
                </span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed pt-1 border-t border-[#1e2024]">
              The factory cast-iron 2JZ-GE block features the exact same reinforced external webbing as the twin-turbo 2JZ-GTE Supra, easily handling 400-500 WHP without cracking sleeves.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
