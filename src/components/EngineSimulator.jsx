import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { Stage } from './diagram/kit.jsx';

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
        const visualDegPerSec = (rpm / 1200) * 90;
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

  // Begin intake at top dead centre, moving down. Crank turns clockwise.
  const crankTheta = (cycleAngle % 360) * (Math.PI / 180) + Math.PI;
  const crankRadius = 42;
  const rodLength = 128;
  const crankCenterX = 180;
  const crankCenterY = 330;
  const crankPinX = crankCenterX + crankRadius * Math.sin(crankTheta);
  const crankPinY = crankCenterY + crankRadius * Math.cos(crankTheta);
  const dx = crankPinX - crankCenterX;
  const pistonPinY = crankPinY - Math.sqrt(Math.max(0, rodLength * rodLength - dx * dx));
  const pistonWidth = 104;
  const pistonTopY = pistonPinY - 30;
  const chamberTop = 108;
  const gasHeight = Math.max(4, pistonTopY - chamberTop);
  // Valve lift follows a smooth bump during its stroke.
  const lift = (start) => { const t = (cycleAngle - start) / 180; return t > 0 && t < 1 ? Math.sin(t * Math.PI) * 14 : 0; };
  const intakeLift = lift(0), exhaustLift = lift(540);
  const sparking = cycleAngle >= 352 && cycleAngle <= 380;
  const burnT = isCombustionActive ? Math.max(0, 1 - (cycleAngle - 360) / 70) : 0;
  const gasFill = strokeIndex === 0 ? '#c9c9c9' : strokeIndex === 1 ? '#cccccc' : strokeIndex === 2 ? '#d5d5d5' : '#7f7f7f';
  const gasOpacity = strokeIndex === 0 ? 0.28 : strokeIndex === 1 ? 0.22 + (cycleAngle - 180) / 180 * 0.35 : strokeIndex === 2 ? 0.25 + burnT * 0.55 : 0.32;

  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center justify-between gap-3 p-4 sm:p-5">
        <div>
          <CardTitle>The four engine strokes</CardTitle>
          <CardDescription>The animation is slowed down so you can follow it. Select a step to pause and read what happens.</CardDescription>
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
          <div className="diagram-frame relative w-full max-w-[460px] aspect-[6/7]">
            <Stage viewBox="0 0 360 420" label={`Engine cylinder cutaway during the ${currentStroke}`}>
              <ellipse cx="180" cy="400" rx="150" ry="14" fill="url(#k-floor)" />
              {/* Ports: intake on the left, exhaust on the right */}
              <path d="M4 70 H96 Q120 70 128 96" fill="none" stroke="url(#k-iron)" strokeWidth="30" />
              <path d="M356 70 H264 Q240 70 232 96" fill="none" stroke="url(#k-iron)" strokeWidth="30" />
              {intakeLift > 1 && [0, 1, 2].map(i => <circle key={i} r="3" fill="#cfcfcf" opacity=".8" cx={20 + ((cycleAngle * 1.6 + i * 34) % 100)} cy={70 + Math.sin(i + cycleAngle / 20) * 6} />)}
              {exhaustLift > 1 && [0, 1, 2].map(i => <circle key={i} r="3.5" fill="#b5b5b5" opacity=".6" cx={340 - ((cycleAngle * 1.6 + i * 34) % 100)} cy={70 + Math.sin(i + cycleAngle / 20) * 6} />)}
              <text x="10" y="44" fill={intakeLift > 1 ? '#cfcfcf' : '#777777'} fontSize="11" fontWeight="600">AIR + FUEL IN</text>
              <text x="350" y="44" fill={exhaustLift > 1 ? '#d5d5d5' : '#777777'} fontSize="11" fontWeight="600" textAnchor="end">EXHAUST OUT</text>

              {/* Cylinder head and block walls with water jackets */}
              <path d="M96 48 H264 V108 H232 L226 96 H134 L128 108 H96 Z" fill="url(#k-iron)" stroke="#202020" />
              <rect x="62" y="108" width="54" height="226" rx="6" fill="url(#k-iron)" />
              <rect x="244" y="108" width="54" height="226" rx="6" fill="url(#k-iron)" />
              <rect x="74" y="122" width="14" height="150" rx="7" fill="#585858" opacity=".9" />
              <rect x="272" y="122" width="14" height="150" rx="7" fill="#585858" opacity=".9" />
              <rect x="116" y="108" width="128" height="226" fill="#131313" />
              <rect x="116" y="108" width="4" height="226" fill="#444444" />
              <rect x="240" y="108" width="4" height="226" fill="#444444" />

              {/* Gas in the chamber */}
              <rect x="120" y={chamberTop} width="120" height={gasHeight} fill={gasFill} opacity={gasOpacity} />
              {isCombustionActive && <ellipse cx="180" cy={chamberTop + 6} rx={30 + (1 - burnT) * 70} ry={12 + (1 - burnT) * 40} fill="url(#k-flame)" opacity={0.4 + burnT * 0.6} filter="url(#k-bloom)" />}

              {/* Valves */}
              <g transform={`translate(0 ${intakeLift})`}>
                <rect x="143" y="18" width="6" height="80" fill="url(#k-steel-h)" />
                <path d="M128 98 H164 L156 90 H136 Z" fill="url(#k-steel)" />
              </g>
              <g transform={`translate(0 ${exhaustLift})`}>
                <rect x="211" y="18" width="6" height="80" fill="url(#k-steel-h)" />
                <path d="M196 98 H232 L224 90 H204 Z" fill="url(#k-steel)" />
              </g>
              {/* Cam lobes pushing the valves */}
              <ellipse cx="146" cy="14" rx="14" ry={12 + intakeLift * 0.5} fill="#444444" />
              <ellipse cx="214" cy="14" rx="14" ry={12 + exhaustLift * 0.5} fill="#444444" />

              {/* Spark plug */}
              <rect x="174" y="20" width="12" height="40" rx="2" fill="#efefef" />
              <rect x="176" y="60" width="8" height="36" fill="url(#k-steel-h)" />
              {sparking && <g filter="url(#k-bloom)"><circle cx="180" cy="100" r="7" fill="#ffffff" /><path d="M180 92 L176 100 L183 99 L179 108" stroke="#d6d6d6" strokeWidth="2" fill="none" /></g>}

              {/* Piston with rings */}
              <g data-testid="engine-piston" transform={`translate(${crankCenterX - pistonWidth / 2}, ${pistonTopY})`}>
                <rect width={pistonWidth} height="62" rx="5" fill="url(#k-steel)" stroke="#202020" />
                {[8, 15, 22].map(y => <rect key={y} x="0" y={y} width={pistonWidth} height="3" fill="#555555" />)}
                <circle cx={pistonWidth / 2} cy="30" r="8" fill="#323232" stroke="#a0a0a0" strokeWidth="2" />
              </g>

              {/* Connecting rod */}
              <path d={`M${crankCenterX - 8} ${pistonPinY} L${crankPinX - 12} ${crankPinY} L${crankPinX + 12} ${crankPinY} L${crankCenterX + 8} ${pistonPinY} Z`} fill="url(#k-steel-h)" stroke="#202020" />
              <circle cx={crankCenterX} cy={pistonPinY} r="6" fill="#d5d5d5" />

              {/* Crankcase and crankshaft: web toward the pin, counterweight opposite */}
              <path d="M62 334 H298 V372 Q298 396 274 396 H86 Q62 396 62 372 Z" fill="url(#k-iron)" opacity=".85" />
              <g transform={`translate(${crankCenterX} ${crankCenterY}) rotate(${(Math.atan2(crankPinY - crankCenterY, crankPinX - crankCenterX) * 180) / Math.PI})`}>
                <path d="M -6 -50 A 50 50 0 0 0 -6 50 L 0 16 L 0 -16 Z" fill="#787878" stroke="#202020" />
                <rect x="-4" y="-17" width={crankRadius + 18} height="34" rx="17" fill="url(#k-steel)" stroke="#202020" />
                <circle r="12" fill="#d5d5d5" stroke="#555555" strokeWidth="2" />
              </g>
              <circle cx={crankPinX} cy={crankPinY} r="10" fill="#ebebeb" stroke="#555555" strokeWidth="2" />
            </Stage>

            <div className="absolute diagram-footer">
              <span>{currentStroke}</span>
              <span>{Math.round(cycleAngle)}° / 720°</span>
            </div>
          </div>

          <div className="w-full max-w-[460px] mt-3 p-3 rounded-lg bg-[#1d1d1d] border border-[#3c3c3c]">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-zinc-400">Engine speed:</span>
              <span className="text-zinc-100 font-mono font-medium">{rpm} RPM</span>
            </div>
            <input
              type="range" aria-label="Engine speed"
              min="600"
              max="6500"
              step="100"
              value={rpm}
              onChange={(e) => setRpm(Number(e.target.value))}
              className="w-full accent-zinc-200 cursor-pointer h-1.5 bg-[#3c3c3c] rounded"
            />
          </div>
        </div>

        {/* 4 Step buttons */}
        <div className="lg:col-span-6 space-y-3">
          <div className="engine-strokes grid grid-cols-2 gap-2">
            {[
              { idx: 0, name: '1. Intake', range: '0° - 180°', desc: 'The piston moves down and draws in fresh air and fuel.' },
              { idx: 1, name: '2. Compression', range: '180° - 360°', desc: 'The piston moves up and squeezes the mixture into a smaller space.' },
              { idx: 2, name: '3. Power', range: '360° - 540°', desc: 'A spark lights the mixture. The expanding gas pushes the piston down.' },
              { idx: 3, name: '4. Exhaust', range: '540° - 720°', desc: 'The piston moves up and pushes the used gases out.' }
            ].map((step) => {
              const isActive = strokeIndex === step.idx;
              return (
                <button
                  key={step.idx}
                  aria-pressed={isActive}
                  onClick={() => {
                    setIsPlaying(false);
                    setCycleAngle(step.idx * 180 + 30);
                  }}
                  className={`p-2.5 rounded-lg text-left border transition-[background-color,color,transform] duration-150 ${
                    isActive
                      ? 'bg-[#272727] border-zinc-600 text-zinc-100'
                      : 'bg-[#1d1d1d] border-[#3c3c3c] text-zinc-400 hover:text-zinc-200 hover:bg-[#1d1d1d]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 mb-0.5">
                    <span className="text-xs font-medium text-zinc-200">{step.name}</span>
                    <span className="text-[10px] font-mono text-zinc-500">{step.range}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal line-clamp-2">{step.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-lg bg-[#1d1d1d] border border-[#3c3c3c] space-y-2 text-xs">
            <span className="font-medium text-zinc-200 block">How the cycle keeps going</span>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              The crankshaft keeps turning between power strokes. A heavy rotating disc called the flywheel helps smooth out the pulses. In a running engine, the other cylinders also take turns producing power.
            </p>
            <details className="engine-numbers">
              <summary>What do the numbers mean?</summary>
              <p className="text-zinc-400">RPM counts complete crankshaft turns per minute. The angle above the piston tracks its position in the cycle. One full cycle takes two crankshaft turns, or 720 degrees.</p>
            </details>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
