import React, { useState } from 'react';
import { Thermometer, Droplet, ShieldCheck, Flame } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function CoolingLubricationSimulator() {
  const [engineLoad, setEngineLoad] = useState(50);
  const [thermostatOpen, setThermostatOpen] = useState(true);
  const [oilGrade, setOilGrade] = useState('5W-30'); // 5W-30 is factory Lexus 2JZ recommendation

  const heatGeneratedKw = Math.round(18 + engineLoad * 1.1);
  const coolantTempC = thermostatOpen
    ? Math.round(88 + (engineLoad / 100) * 12)
    : Math.round(98 + (engineLoad / 100) * 45);

  const oilPressurePsi = Math.round(25 + (engineLoad / 100) * 50);
  const oilFilmThicknessMicrons = oilGrade === '0W-20' ? 2.1 : oilGrade === '5W-30' ? 2.9 : 4.1;

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>2JZ-GE Cooling & Cast-Iron Oil Gallery Lubrication</CardTitle>
              <Badge variant="info" className="hidden sm:inline-flex">2JZ Oil Jets & 5W-30</Badge>
            </div>
            <CardDescription>Toyota dual-stage water pump circulation and 7-main-bearing oil galleries</CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-full sm:w-auto">
          <span className="text-xs text-slate-400 pl-1 font-medium">82°C Thermostat:</span>
          <Button
            size="sm"
            variant={thermostatOpen ? "primary" : "destructive"}
            onClick={() => setThermostatOpen(!thermostatOpen)}
            className="flex-1 sm:flex-none"
          >
            {thermostatOpen ? 'OPEN (To Radiator)' : 'CLOSED (Warm-up)'}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-[16/11] bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 460 300" className="w-full h-full select-none">
              <defs>
                <linearGradient id="coolantFlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <linearGradient id="hotCoolant" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>

              <rect x="25" y="60" width="45" height="180" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              {[80, 100, 120, 140, 160, 180, 200, 220].map((y) => (
                <line key={y} x1="28" y1={y} x2="67" y2={y} stroke="#38bdf8" strokeWidth="1.5" />
              ))}
              <text x="47" y="50" fill="#38bdf8" fontSize="9" textAnchor="middle" fontWeight="bold">IS300 RAD</text>

              <circle cx="120" cy="210" r="22" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />
              <text x="120" y="214" fill="#38bdf8" fontSize="8" textAnchor="middle" fontWeight="bold">PUMP</text>

              <rect x="180" y="70" width="230" height="160" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="3" />
              <text x="295" y="60" fill="#cbd5e1" fontSize="9" textAnchor="middle" fontWeight="bold">2JZ-GE 3.0L INLINE-6 BLOCK</text>

              <rect x="210" y="85" width="45" height="100" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
              <rect x="270" y="85" width="45" height="100" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
              <rect x="330" y="85" width="45" height="100" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />

              <path
                d="M 120 188 L 120 150 L 190 150 L 190 100 L 290 100 L 290 150 L 390 150 L 390 100"
                fill="none"
                stroke={thermostatOpen ? "url(#coolantFlow)" : "url(#hotCoolant)"}
                strokeWidth="8"
                strokeLinecap="round"
              />

              <circle cx="145" cy="90" r="14" fill={thermostatOpen ? "#0284c7" : "#ef4444"} stroke="#f8fafc" strokeWidth="2" />

              <path d="M 145 90 L 70 90" fill="none" stroke={thermostatOpen ? "#ef4444" : "#475569"} strokeWidth="10" strokeLinecap="round" />
              <path d="M 70 210 L 98 210" fill="none" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" />

              <rect x="200" y="235" width="190" height="35" rx="4" fill="#451a03" stroke="#d97706" strokeWidth="2" />
              <text x="295" y="256" fill="#fbbf24" fontSize="9" textAnchor="middle" fontWeight="bold">2JZ OIL PAN ({oilGrade} - 5.7 Liters)</text>
            </svg>

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              {coolantTempC > 115 ? (
                <span className="text-red-400 font-bold flex items-center gap-1.5 truncate">
                  <Flame className="w-4 h-4 animate-bounce" /> 2JZ OVERHEATING RISK!
                </span>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1.5 truncate">
                  <ShieldCheck className="w-4 h-4" /> 2JZ Operating Range (88-95°C)
                </span>
              )}
              <span className="font-mono text-amber-400 font-bold shrink-0">{coolantTempC}°C</span>
            </div>
          </div>

          <div className="w-full mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-400 font-medium">Engine Thermal Load:</span>
              <span className="text-blue-400 font-mono font-bold">{engineLoad}% ({heatGeneratedKw} kW)</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={engineLoad}
              onChange={(e) => setEngineLoad(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5" />
                7-Main Bearing Oil Supply
              </h4>
              <div className="flex gap-1">
                {['5W-30', '10W-40', '15W-50'].map((grade) => (
                  <Button
                    key={grade}
                    size="sm"
                    variant={oilGrade === grade ? "default" : "secondary"}
                    onClick={() => setOilGrade(grade)}
                    className="h-6 px-2 text-[10px]"
                  >
                    {grade}
                  </Button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Main Bearing Oil Film:</span>
                <span className="font-mono text-amber-400 font-bold">{oilFilmThicknessMicrons} µm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">2JZ Oil Pressure:</span>
                <span className="font-mono text-white font-bold">{oilPressurePsi} PSI</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              The 2JZ-GE features <strong>seven full main bearings</strong> supporting the forged crankshaft between every single cylinder journal. Pressurized oil feeds both crankshaft mains and piston under-crown cooling squirts.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
