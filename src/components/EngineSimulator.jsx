import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Flame, Wind, Gauge, Sparkles, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function EngineSimulator() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [rpm, setRpm] = useState(1200);
  const [cycleAngle, setCycleAngle] = useState(0);
  const animRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    const loop = (now) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      if (isPlaying) {
        const visualDegPerSec = (rpm / 60) * 360 * 0.35;
        setCycleAngle((prev) => (prev + visualDegPerSec * dt) % 720);
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, rpm]);

  let currentStroke = 'Intake';
  let strokeIndex = 0;
  let strokeColor = '#38bdf8';
  let valveIntakeOpen = false;
  let valveExhaustOpen = false;
  let isCombustionActive = false;

  if (cycleAngle < 180) {
    currentStroke = '1. Intake Stroke';
    strokeIndex = 0;
    strokeColor = '#38bdf8';
    valveIntakeOpen = true;
  } else if (cycleAngle < 360) {
    currentStroke = '2. Compression Stroke';
    strokeIndex = 1;
    strokeColor = '#a855f7';
  } else if (cycleAngle < 540) {
    currentStroke = '3. Power / Combustion';
    strokeIndex = 2;
    strokeColor = '#ef4444';
    if (cycleAngle < 430) isCombustionActive = true;
  } else {
    currentStroke = '4. Exhaust Stroke';
    strokeIndex = 3;
    strokeColor = '#f59e0b';
    valveExhaustOpen = true;
  }

  const crankTheta = (cycleAngle % 360) * (Math.PI / 180);
  const crankRadius = 45;
  const rodLength = 120;
  const crankCenterX = 160;
  const crankCenterY = 290;
  const crankPinX = crankCenterX + crankRadius * Math.sin(crankTheta);
  const crankPinY = crankCenterY + crankRadius * Math.cos(crankTheta);
  const dx = crankPinX - crankCenterX;
  const pistonPinY = crankPinY - Math.sqrt(Math.max(0, rodLength * rodLength - dx * dx));
  const pistonHeight = 55;
  const pistonWidth = 84;
  const pistonTopY = pistonPinY - 25;

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Interactive 4-Stroke Engine Simulator</CardTitle>
              <Badge variant="destructive" className="hidden sm:inline-flex">Otto Cycle</Badge>
            </div>
            <CardDescription>Piston kinematics, valve events, and cylinder combustion pressure</CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            size="sm"
            variant={isPlaying ? "default" : "success"}
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex-1 sm:flex-none"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause Motion' : 'Start Engine'}
          </Button>

          <Button
            size="icon"
            variant="secondary"
            onClick={() => setCycleAngle(0)}
            title="Reset to Top Dead Center"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* SVG Engine Cross Section */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-[320px] aspect-[4/5] bg-slate-950/80 rounded-2xl border border-slate-800 p-2 shadow-inner overflow-hidden">
            <svg viewBox="0 0 320 380" className="w-full h-full select-none">
              <defs>
                <radialGradient id="combustionFlame" cx="50%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                  <stop offset="40%" stopColor="#f97316" stopOpacity="0.85" />
                  <stop offset="80%" stopColor="#ef4444" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.0" />
                </radialGradient>
                <linearGradient id="intakeAir" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="exhaustGas" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              <rect x="70" y="40" width="180" height="230" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="4" />
              <rect x="115" y="60" width="90" height="190" fill="#0f172a" stroke="#475569" strokeWidth="2" />

              <path d="M 60 70 C 85 70, 115 80, 130 95" fill="none" stroke={valveIntakeOpen ? "#38bdf8" : "#334155"} strokeWidth="16" strokeLinecap="round" />
              <path d="M 260 70 C 235 70, 205 80, 190 95" fill="none" stroke={valveExhaustOpen ? "#f59e0b" : "#334155"} strokeWidth="16" strokeLinecap="round" />

              {isCombustionActive && <rect x="116" y="62" width="88" height={Math.max(10, pistonTopY - 60)} fill="url(#combustionFlame)" className="animate-pulse" />}
              {cycleAngle < 180 && <rect x="116" y="62" width="88" height={Math.max(10, pistonTopY - 60)} fill="url(#intakeAir)" />}
              {cycleAngle >= 540 && <rect x="116" y="62" width="88" height={Math.max(10, pistonTopY - 60)} fill="url(#exhaustGas)" />}

              <rect x="156" y="32" width="8" height="28" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1" />
              <line x1="160" y1="20" x2="160" y2="40" stroke="#f59e0b" strokeWidth="3" />
              {(cycleAngle >= 350 && cycleAngle <= 375) && (
                <circle cx="160" cy="62" r="7" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" className="animate-ping" />
              )}

              <g transform={`translate(0, ${valveIntakeOpen ? 10 : 0})`} className="transition-transform duration-75">
                <line x1="130" y1="45" x2="130" y2="78" stroke="#94a3b8" strokeWidth="4" />
                <polygon points="120,78 140,78 130,88" fill="#cbd5e1" />
              </g>

              <g transform={`translate(0, ${valveExhaustOpen ? 10 : 0})`} className="transition-transform duration-75">
                <line x1="190" y1="45" x2="190" y2="78" stroke="#94a3b8" strokeWidth="4" />
                <polygon points="180,78 200,78 190,88" fill="#cbd5e1" />
              </g>

              <g transform={`translate(${crankCenterX - pistonWidth / 2}, ${pistonTopY})`}>
                <rect x="0" y="0" width={pistonWidth} height={pistonHeight} rx="4" fill="#64748b" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="4" y1="8" x2={pistonWidth - 4} y2="8" stroke="#334155" strokeWidth="2" />
                <line x1="4" y1="16" x2={pistonWidth - 4} y2="16" stroke="#334155" strokeWidth="2" />
                <circle cx={pistonWidth / 2} cy={25} r="6" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
              </g>

              <line x1={crankCenterX} y1={pistonPinY} x2={crankPinX} y2={crankPinY} stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
              <circle cx={crankCenterX} cy={pistonPinY} r="5" fill="#f8fafc" />
              <circle cx={crankPinX} cy={crankPinY} r="8" fill="#f8fafc" stroke="#334155" strokeWidth="2" />

              <g transform={`translate(${crankCenterX}, ${crankCenterY})`}>
                <circle cx="0" cy="0" r="16" fill="#334155" stroke="#64748b" strokeWidth="3" />
                <path d={`M 0 0 L ${crankPinX - crankCenterX} ${crankPinY - crankCenterY}`} stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
                <circle cx={-(crankPinX - crankCenterX) * 0.7} cy={-(crankPinY - crankCenterY) * 0.7} r="26" fill="#475569" opacity="0.8" />
              </g>
            </svg>

            <div
              className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md shadow"
              style={{ backgroundColor: `${strokeColor}20`, borderColor: `${strokeColor}60`, color: strokeColor }}
            >
              {currentStroke}
            </div>

            <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
              {Math.round(cycleAngle)}° / 720°
            </div>
          </div>

          <div className="w-full max-w-[320px] mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Engine Speed (RPM):</span>
              <span className="text-amber-400 font-mono font-bold">{rpm} RPM</span>
            </div>
            <input
              type="range"
              min="600"
              max="6500"
              step="100"
              value={rpm}
              onChange={(e) => setRpm(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* 4 Steps grid & Deep dive */}
        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { idx: 0, name: '1. Intake', range: '0° - 180°', desc: 'Intake valve opens; depression pulls in air-fuel mixture.' },
              { idx: 1, name: '2. Compression', range: '180° - 360°', desc: 'Valves seal; mixture compressed ~10:1 ratio.' },
              { idx: 2, name: '3. Power', range: '360° - 540°', desc: 'Spark ignites fuel; violent expansion creates all positive work.' },
              { idx: 3, name: '4. Exhaust', range: '540° - 720°', desc: 'Exhaust valve opens; rising piston purges spent gas.' }
            ].map((step) => {
              const isActive = strokeIndex === step.idx;
              return (
                <button
                  key={step.idx}
                  onClick={() => {
                    setIsPlaying(false);
                    setCycleAngle(step.idx * 180 + 30);
                  }}
                  className={`p-3 rounded-xl text-left border transition ${
                    isActive
                      ? 'bg-slate-800/90 border-amber-500/80 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-slate-950/40 border-slate-800 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {step.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{step.range}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{step.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              The Thermodynamics: The Otto Cycle
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              In an internal combustion engine, only <strong>1 out of 4 strokes</strong> creates positive forward torque. The other 3 strokes consume kinetic energy, stored in a heavy rotating <strong>flywheel</strong> to smooth out crankshaft rotation.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
              <div><span className="text-slate-400">Camshaft Ratio:</span> <span className="text-white font-mono font-bold">1:2 Crank</span></div>
              <div><span className="text-slate-400">Peak Pressure:</span> <span className="text-white font-mono font-bold">60+ Bar</span></div>
              <div><span className="text-slate-400">Flame Temp:</span> <span className="text-white font-mono font-bold">&gt; 2,000° C</span></div>
              <div><span className="text-slate-400">Fuel Mix:</span> <span className="text-white font-mono font-bold">14.7:1</span></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
