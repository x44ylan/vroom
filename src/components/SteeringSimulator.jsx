import React, { useState } from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function SteeringSimulator() {
  const [steeringAngle, setSteeringAngle] = useState(20);

  const absAngle = Math.abs(steeringAngle);
  const insideWheelAngle = absAngle * 1.25;
  const outsideWheelAngle = absAngle * 0.85;

  const leftWheelVisual = steeringAngle < 0 ? -insideWheelAngle : -outsideWheelAngle;
  const rightWheelVisual = steeringAngle < 0 ? -outsideWheelAngle : -insideWheelAngle;

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Steering Kinematics & Ackermann Geometry</CardTitle>
              <Badge variant="secondary" className="hidden sm:inline-flex">Kinematics</Badge>
            </div>
            <CardDescription>Different turn angles prevent lateral tire scrub in corners</CardDescription>
          </div>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => setSteeringAngle(0)}
          className="w-full sm:w-auto"
        >
          Center Steering (0°)
        </Button>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[16/11] bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 460 300" className="w-full h-full select-none">
              <rect x="80" y="80" width="300" height="14" rx="4" fill="#334155" stroke="#475569" strokeWidth="2" />
              <text x="230" y="72" fill="#64748b" fontSize="10" textAnchor="middle" fontWeight="bold">FRONT SUBFRAME</text>

              <line x1="230" y1="20" x2="230" y2="120" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
              <circle cx="230" cy="120" r="10" fill="#d97706" stroke="#fef08a" strokeWidth="2" />

              <rect
                x={120 + steeringAngle * 1.5}
                y="114"
                width="220"
                height="12"
                rx="3"
                fill="#0ea5e9"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />

              <line x1={120 + steeringAngle * 1.5} y1="120" x2="100" y2="155" stroke="#cbd5e1" strokeWidth="4" />
              <line x1={340 + steeringAngle * 1.5} y1="120" x2="360" y2="155" stroke="#cbd5e1" strokeWidth="4" />

              <g transform={`translate(90, 150) rotate(${leftWheelVisual})`}>
                <rect x="-18" y="-55" width="36" height="110" rx="6" fill="#1e293b" stroke="#14b8a6" strokeWidth="3" />
                <rect x="-8" y="-30" width="16" height="60" rx="3" fill="#64748b" />
                <text x="0" y="4" fill="#f8fafc" fontSize="11" textAnchor="middle" fontWeight="bold">{Math.round(Math.abs(leftWheelVisual))}°</text>
              </g>

              <g transform={`translate(370, 150) rotate(${rightWheelVisual})`}>
                <rect x="-18" y="-55" width="36" height="110" rx="6" fill="#1e293b" stroke="#14b8a6" strokeWidth="3" />
                <rect x="-8" y="-30" width="16" height="60" rx="3" fill="#64748b" />
                <text x="0" y="4" fill="#f8fafc" fontSize="11" textAnchor="middle" fontWeight="bold">{Math.round(Math.abs(rightWheelVisual))}°</text>
              </g>

              {steeringAngle !== 0 && (
                <g stroke="#14b8a6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6">
                  <line x1="90" y1="150" x2={steeringAngle < 0 ? 0 : 460} y2={250} />
                  <line x1="370" y1="150" x2={steeringAngle < 0 ? 0 : 460} y2={250} />
                </g>
              )}
            </svg>

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-medium truncate">
                {steeringAngle === 0
                  ? 'Steering Centered'
                  : `Inside Wheel: ${Math.round(insideWheelAngle)}° | Outside Wheel: ${Math.round(outsideWheelAngle)}°`}
              </span>
              <span className="font-mono text-teal-400 font-bold shrink-0">Ackermann Compensation</span>
            </div>
          </div>

          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Steering Rack Angle:</span>
              <span className="text-teal-400 font-mono font-bold">{steeringAngle}°</span>
            </div>
            <input
              type="range"
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
              The Ackermann Principle
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Because left and right tires trace arcs of different radii in a turn, front wheels cannot point parallel. By angling steering arms toward the rear axle center, the linkage naturally pivots the inner wheel sharper.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
