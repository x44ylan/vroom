import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
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
  let valveIntakeOpen = false;
  let valveExhaustOpen = false;
  let isCombustionActive = false;

  if (cycleAngle < 180) {
    currentStroke = '1. Intake Stroke';
    strokeIndex = 0;
    valveIntakeOpen = true;
  } else if (cycleAngle < 360) {
    currentStroke = '2. Compression Stroke';
    strokeIndex = 1;
  } else if (cycleAngle < 540) {
    currentStroke = '3. Power / Combustion';
    strokeIndex = 2;
    if (cycleAngle < 430) isCombustionActive = true;
  } else {
    currentStroke = '4. Exhaust Stroke';
    strokeIndex = 3;
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
      <CardHeader className="flex-row items-center justify-between gap-3 p-4 sm:p-5">
        <div>
          <CardTitle>4-Stroke 2JZ Cylinder Simulation</CardTitle>
          <CardDescription>Piston kinematics, valve events, and combustion cycle</CardDescription>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant={isPlaying ? "secondary" : "default"}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Start'}</span>
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={() => setCycleAngle(0)}
            title="Reset"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center p-4 sm:p-5">
        {/* SVG Engine Cross Section */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-[320px] aspect-[4/5] bg-[#0c0d0e] rounded-lg border border-[#222428] p-2 overflow-hidden">
            <svg viewBox="0 0 320 380" className="w-full h-full select-none">
              <defs>
                <radialGradient id="combustionFlame" cx="50%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#fafafa" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#d4d4d8" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#27272a" stopOpacity="0.0" />
                </radialGradient>
              </defs>

              <rect x="70" y="40" width="180" height="230" rx="4" fill="#16171a" stroke="#27272a" strokeWidth="2" />
              <rect x="115" y="60" width="90" height="190" fill="#0c0d0e" stroke="#27272a" strokeWidth="1.5" />

              <path d="M 60 70 C 85 70, 115 80, 130 95" fill="none" stroke={valveIntakeOpen ? "#a1a1aa" : "#27272a"} strokeWidth="14" strokeLinecap="round" />
              <path d="M 260 70 C 235 70, 205 80, 190 95" fill="none" stroke={valveExhaustOpen ? "#a1a1aa" : "#27272a"} strokeWidth="14" strokeLinecap="round" />

              {isCombustionActive && <rect x="116" y="62" width="88" height={Math.max(10, pistonTopY - 60)} fill="url(#combustionFlame)" />}
              {cycleAngle < 180 && <rect x="116" y="62" width="88" height={Math.max(10, pistonTopY - 60)} fill="#27272a" opacity="0.4" />}
              {cycleAngle >= 540 && <rect x="116" y="62" width="88" height={Math.max(10, pistonTopY - 60)} fill="#27272a" opacity="0.6" />}

              <rect x="156" y="32" width="8" height="28" fill="#d4d4d8" stroke="#18181b" strokeWidth="1" />
              <line x1="160" y1="20" x2="160" y2="40" stroke="#71717a" strokeWidth="2" />
              {(cycleAngle >= 350 && cycleAngle <= 375) && (
                <circle cx="160" cy="62" r="5" fill="#fafafa" stroke="#71717a" strokeWidth="1" />
              )}

              <g transform={`translate(0, ${valveIntakeOpen ? 10 : 0})`}>
                <line x1="130" y1="45" x2="130" y2="78" stroke="#71717a" strokeWidth="3" />
                <polygon points="120,78 140,78 130,88" fill="#a1a1aa" />
              </g>

              <g transform={`translate(0, ${valveExhaustOpen ? 10 : 0})`}>
                <line x1="190" y1="45" x2="190" y2="78" stroke="#71717a" strokeWidth="3" />
                <polygon points="180,78 200,78 190,88" fill="#a1a1aa" />
              </g>

              <g transform={`translate(${crankCenterX - pistonWidth / 2}, ${pistonTopY})`}>
                <rect x="0" y="0" width={pistonWidth} height={pistonHeight} rx="2" fill="#27272a" stroke="#52525b" strokeWidth="1.5" />
                <line x1="4" y1="8" x2={pistonWidth - 4} y2="8" stroke="#3f3f46" strokeWidth="1.5" />
                <line x1="4" y1="16" x2={pistonWidth - 4} y2="16" stroke="#3f3f46" strokeWidth="1.5" />
                <circle cx={pistonWidth / 2} cy={25} r="5" fill="#18181b" stroke="#71717a" strokeWidth="1.5" />
              </g>

              <line x1={crankCenterX} y1={pistonPinY} x2={crankPinX} y2={crankPinY} stroke="#71717a" strokeWidth="6" strokeLinecap="round" />
              <circle cx={crankCenterX} cy={pistonPinY} r="4" fill="#d4d4d8" />
              <circle cx={crankPinX} cy={crankPinY} r="7" fill="#d4d4d8" stroke="#27272a" strokeWidth="1.5" />

              <g transform={`translate(${crankCenterX}, ${crankCenterY})`}>
                <circle cx="0" cy="0" r="14" fill="#27272a" stroke="#52525b" strokeWidth="2" />
                <path d={`M 0 0 L ${crankPinX - crankCenterX} ${crankPinY - crankCenterY}`} stroke="#a1a1aa" strokeWidth="4" strokeLinecap="round" />
                <circle cx={-(crankPinX - crankCenterX) * 0.7} cy={-(crankPinY - crankCenterY) * 0.7} r="22" fill="#1c1d21" />
              </g>
            </svg>

            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[11px] font-medium bg-[#16171a] border border-[#27272a] text-zinc-200">
              {currentStroke}
            </div>

            <div className="absolute top-2.5 right-2.5 text-[10px] font-mono text-zinc-400 bg-[#16171a] px-1.5 py-0.5 rounded border border-[#27272a]">
              {Math.round(cycleAngle)}° / 720°
            </div>
          </div>

          <div className="w-full max-w-[320px] mt-3 p-3 rounded-lg bg-[#0e0f11] border border-[#222428]">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-zinc-400">Engine Speed:</span>
              <span className="text-zinc-100 font-mono font-medium">{rpm} RPM</span>
            </div>
            <input
              type="range"
              min="600"
              max="6500"
              step="100"
              value={rpm}
              onChange={(e) => setRpm(Number(e.target.value))}
              className="w-full accent-zinc-200 cursor-pointer h-1.5 bg-[#222428] rounded"
            />
          </div>
        </div>

        {/* 4 Step buttons */}
        <div className="lg:col-span-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {[
              { idx: 0, name: '1. Intake', range: '0° - 180°', desc: 'Intake valve opens; depression pulls in air-fuel mixture.' },
              { idx: 1, name: '2. Compression', range: '180° - 360°', desc: 'Valves seal; mixture compressed ~10.5:1 ratio.' },
              { idx: 2, name: '3. Power', range: '360° - 540°', desc: 'Spark ignites fuel; expanding gas drives piston downward.' },
              { idx: 3, name: '4. Exhaust', range: '540° - 720°', desc: 'Exhaust valve opens; rising piston sweeps spent gas.' }
            ].map((step) => {
              const isActive = strokeIndex === step.idx;
              return (
                <button
                  key={step.idx}
                  onClick={() => {
                    setIsPlaying(false);
                    setCycleAngle(step.idx * 180 + 30);
                  }}
                  className={`p-2.5 rounded-lg text-left border transition ${
                    isActive
                      ? 'bg-[#18191d] border-zinc-600 text-zinc-100'
                      : 'bg-[#0e0f11] border-[#222428] text-zinc-400 hover:text-zinc-200 hover:bg-[#121316]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-zinc-200">{step.name}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{step.range}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal line-clamp-2">{step.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-lg bg-[#0e0f11] border border-[#222428] space-y-2 text-xs">
            <span className="font-medium text-zinc-200 block">Toyota 2JZ-GE Thermodynamics</span>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              In an internal combustion engine, only 1 out of 4 strokes creates positive forward torque. The dual-mass flywheel stores momentum to keep the crankshaft rotating smoothly between cylinder pulses.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1e2024] text-[11px] font-mono">
              <div><span className="text-zinc-500">Camshaft:</span> <span className="text-zinc-200">1:2 Crank</span></div>
              <div><span className="text-zinc-500">Peak Pressure:</span> <span className="text-zinc-200">60+ Bar</span></div>
              <div><span className="text-zinc-500">Compression:</span> <span className="text-zinc-200">10.5:1</span></div>
              <div><span className="text-zinc-500">Air-Fuel:</span> <span className="text-zinc-200">14.7:1</span></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
