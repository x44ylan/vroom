import React, { useState } from 'react';
import { Zap, Fuel } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function EvVsIceComparison() {
  const [activeTab, setActiveTab] = useState('efficiency');

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>EV vs Internal Combustion (ICE) Comparison</CardTitle>
              <Badge variant="success" className="hidden sm:inline-flex">Future Tech</Badge>
            </div>
            <CardDescription>Energy conversion efficiency, mechanical complexity, and instant torque</CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'efficiency', label: 'Energy Flow & Loss' },
            { id: 'powertrain', label: 'Torque & RPM Curves' },
            { id: 'architecture', label: 'Skateboard vs Unibody' }
          ].map((tab) => (
            <Button
              key={tab.id}
              size="sm"
              variant={activeTab === tab.id ? "success" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 sm:flex-none text-xs whitespace-nowrap"
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {activeTab === 'efficiency' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fuel className="w-5 h-5 text-amber-500" />
                  <h4 className="text-sm sm:text-base font-bold text-white">ICE (Gasoline Vehicle)</h4>
                </div>
                <Badge variant="default">25% - 30% Thermal Efficiency</Badge>
              </div>

              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Cooling & Radiator Heat Loss:</span>
                    <span className="text-red-400 font-mono font-bold">~35% (Waste)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '35%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Exhaust Gas Heat Loss:</span>
                    <span className="text-orange-400 font-mono font-bold">~35% (Waste)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '35%' }} />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-300 font-bold">Useful Work at Wheels:</span>
                    <span className="text-emerald-400 font-mono font-bold">~25%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm sm:text-base font-bold text-white">EV (Electric Vehicle)</h4>
                </div>
                <Badge variant="success">88% - 92% Grid-to-Wheel</Badge>
              </div>

              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Inverter & Battery Resistance:</span>
                    <span className="text-blue-400 font-mono font-bold">~5%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '5%' }} />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-300 font-bold">Useful Work at Wheels:</span>
                    <span className="text-emerald-400 font-mono font-bold">~88%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'powertrain' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <div className="relative w-full aspect-[16/10] bg-slate-950/80 rounded-2xl border border-slate-800 p-4">
                <svg viewBox="0 0 450 250" className="w-full h-full select-none">
                  <line x1="50" y1="210" x2="430" y2="210" stroke="#334155" strokeWidth="1.5" />
                  <line x1="50" y1="30" x2="50" y2="210" stroke="#334155" strokeWidth="1.5" />

                  <text x="50" y="225" fill="#64748b" fontSize="10" textAnchor="middle">0 RPM</text>
                  <text x="145" y="225" fill="#64748b" fontSize="10" textAnchor="middle">2,000</text>
                  <text x="240" y="225" fill="#64748b" fontSize="10" textAnchor="middle">4,000</text>
                  <text x="335" y="225" fill="#64748b" fontSize="10" textAnchor="middle">6,000</text>
                  <text x="430" y="225" fill="#64748b" fontSize="10" textAnchor="middle">12,000+ EV</text>

                  <path d="M 50 195 Q 120 180, 200 90 T 310 100 T 360 170" fill="none" stroke="#f59e0b" strokeWidth="3.5" />
                  <circle cx="240" cy="95" r="5" fill="#f59e0b" />
                  <text x="245" y="85" fill="#fde047" fontSize="10" fontWeight="bold">ICE Peak Torque (3,500 RPM)</text>

                  <path d="M 50 60 L 220 60 Q 300 70, 420 160" fill="none" stroke="#10b981" strokeWidth="3.5" />
                  <circle cx="50" cy="60" r="5" fill="#10b981" />
                  <text x="65" y="50" fill="#34d399" fontSize="10" fontWeight="bold">EV: 100% Torque at 0 RPM</text>
                </svg>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h4 className="font-bold text-emerald-400">Instant Max Torque</h4>
                <p className="text-slate-300 leading-relaxed">
                  Electric motors generate rated magnetic rotor torque immediately from a dead standstill, completely eliminating the need for a slipping clutch or multi-speed gearbox.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-400">Traditional ICE Packaging</h4>
              <p className="text-slate-300 leading-relaxed">
                High center of gravity, heavy engine block placed over the steering axle, and a driveshaft tunnel dividing the passenger cabin floor.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <h4 className="font-bold text-emerald-400">EV Flat Skateboard Architecture</h4>
              <p className="text-slate-300 leading-relaxed">
                Ultra-low center of gravity with structural battery packs mounted flat along the floor, providing superior rollover resistance and 50:50 weight distribution.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
