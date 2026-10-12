import React, { useState, useEffect, useRef } from 'react';
import { Wind, Activity, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function TurbochargerSimulator() {
  const [engineRpm, setEngineRpm] = useState(2400);
  const [wastegateOpen, setWastegateOpen] = useState(false);
  const [intercoolerActive, setIntercoolerActive] = useState(true);
  const [animAngle, setAnimAngle] = useState(0);
  const animRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  const spoolFactor = Math.min(1.0, Math.max(0, (engineRpm - 1600) / 2800));
  const turboRpm = Math.round(spoolFactor * 165000 + (engineRpm > 1000 ? 15000 : 0));
  
  const targetBoostPsi = wastegateOpen ? Math.min(6, spoolFactor * 12) : spoolFactor * 22.5;
  const boostPsi = Math.round(targetBoostPsi * 10) / 10;
  const boostBar = Math.round((boostPsi / 14.7) * 100) / 100;

  const uncooledTempC = Math.round(25 + boostPsi * 5.8);
  const intakeAirTempC = intercoolerActive
    ? Math.round(25 + (uncooledTempC - 25) * 0.3)
    : uncooledTempC;

  const manifoldPressureRatio = (14.7 + boostPsi) / 14.7;
  const volumetricEfficiency = Math.round(manifoldPressureRatio * 95);
  const densityBonus = (273 + 25) / (273 + intakeAirTempC);
  const estimatedHorsepower = Math.round(200 * manifoldPressureRatio * Math.min(1.15, densityBonus));

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
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Turbocharger & Forced Induction Physics</CardTitle>
              <Badge variant="destructive" className="hidden sm:inline-flex">Boost</Badge>
            </div>
            <CardDescription>Harness waste exhaust enthalpy to compress air density and elevate horsepower</CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            size="sm"
            variant={intercoolerActive ? "primary" : "secondary"}
            onClick={() => setIntercoolerActive(!intercoolerActive)}
            className="flex-1 sm:flex-none text-xs"
          >
            {intercoolerActive ? 'Intercooler ACTIVE' : 'Intercooler BYPASS'}
          </Button>

          <Button
            size="sm"
            variant={wastegateOpen ? "default" : "secondary"}
            onClick={() => setWastegateOpen(!wastegateOpen)}
            className="flex-1 sm:flex-none text-xs"
          >
            {wastegateOpen ? 'Wastegate DUMPING' : 'Wastegate SHUT'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[16/11] bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 460 300" className="w-full h-full select-none">
              <defs>
                <linearGradient id="exhaustFlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>

              <path d="M 20 220 L 100 220 C 130 220, 150 200, 150 170" fill="none" stroke="url(#exhaustFlow)" strokeWidth="18" strokeLinecap="round" />
              <text x="35" y="240" fill="#f87171" fontSize="9" fontWeight="bold">EXHAUST GAS (&gt;800°C)</text>

              <path d="M 80 220 C 80 260, 170 260, 190 220" fill="none" stroke={wastegateOpen ? '#f97316' : '#334155'} strokeWidth="8" strokeDasharray={wastegateOpen ? 'none' : '4 4'} />

              <circle cx="160" cy="150" r="48" fill="#1e293b" stroke="#ef4444" strokeWidth="3" />
              <g transform={`translate(160, 150) rotate(${animAngle})`}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <path key={deg} d="M 0 0 L 12 -38 L 4 -40 Z" fill="#f87171" transform={`rotate(${deg})`} />
                ))}
                <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
              </g>

              <rect x="200" y="142" width="60" height="16" rx="3" fill="#64748b" stroke="#cbd5e1" strokeWidth="1.5" />

              <circle cx="300" cy="150" r="48" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
              <g transform={`translate(300, 150) rotate(${animAngle})`}>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <path key={deg} d="M 0 0 L 12 -38 L 4 -40 Z" fill="#38bdf8" transform={`rotate(${deg})`} />
                ))}
                <circle cx="0" cy="0" r="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              </g>

              <path d="M 440 150 L 348 150" fill="none" stroke="#60a5fa" strokeWidth="16" strokeLinecap="round" />
              <path d="M 300 198 L 300 240 C 300 250, 310 260, 320 260 L 370 260" fill="none" stroke={intercoolerActive ? '#0284c7' : '#f59e0b'} strokeWidth="14" strokeLinecap="round" />

              <rect x="370" y="240" width="70" height="40" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              {[380, 390, 400, 410, 420, 430].map((x) => (
                <line key={x} x1={x} y1="243" x2={x} y2="277" stroke="#38bdf8" strokeWidth="1.5" />
              ))}
            </svg>

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-medium">
                Shaft: <span className="text-amber-400 font-mono font-bold">{turboRpm.toLocaleString()} RPM</span>
              </span>
              <span className="font-mono text-sky-400 font-bold">
                Boost: +{boostPsi} PSI ({boostBar} Bar)
              </span>
            </div>
          </div>

          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Engine Exhaust Flow (RPM):</span>
              <span className="text-orange-400 font-mono font-bold">{engineRpm} RPM</span>
            </div>
            <input
              type="range"
              min="800"
              max="6500"
              step="50"
              value={engineRpm}
              onChange={(e) => setEngineRpm(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Dynamic Performance Telemetry
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Power Output:</span>
                <span className="text-sm font-mono font-bold text-amber-400">{estimatedHorsepower} HP</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Volumetric Efficiency:</span>
                <span className="text-sm font-mono font-bold text-emerald-400">{volumetricEfficiency}%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Intake Air Charge Temp:</span>
                <span className={`text-sm font-mono font-bold ${intakeAirTempC > 65 ? 'text-red-400' : 'text-sky-400'}`}>
                  {intakeAirTempC}°C
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
