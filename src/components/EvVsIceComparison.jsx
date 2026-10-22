import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Segmented } from './controls/Controls.jsx';
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
              <CardTitle>Compare gasoline and electric power</CardTitle>
              <Badge variant="success" className="hidden sm:inline-flex">Two powertrains</Badge>
            </div>
            <CardDescription>Look at energy use, turning force, and where the main parts sit.</CardDescription>
          </div>
        </div>

        <Segmented label="Comparison" value={activeTab} onChange={setActiveTab}
          options={[{ value: 'efficiency', label: 'Energy use' }, { value: 'powertrain', label: 'Turning force' }, { value: 'architecture', label: 'Layout' }]} />
      </CardHeader>

      <CardContent>
        {activeTab === 'efficiency' && <p className="comparison-note">Imagine starting with 100 units of energy in the fuel tank or battery. These example splits show how much reaches the wheels. Real values depend on the vehicle and driving conditions; electricity generation and charging are not included.</p>}
        {activeTab === 'efficiency' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <h4 className="text-sm sm:text-base font-bold text-white">Gasoline car</h4>

              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Heat carried away by coolant:</span>
                    <span className="text-red-400 font-mono font-bold">~35% (Waste)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '35%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Heat leaving in the exhaust:</span>
                    <span className="text-orange-400 font-mono font-bold">~35% (Waste)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '35%' }} />
                  </div>
                </div>

                <div className="flex justify-between text-xs"><span className="text-slate-300">Other mechanical losses:</span><span className="text-slate-300">~5%</span></div>
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-300 font-bold">Energy reaching the wheels:</span>
                    <span className="text-emerald-400 font-mono font-bold">~25%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <h4 className="text-sm sm:text-base font-bold text-white">Electric car</h4>

              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Battery and electronics losses:</span>
                    <span className="text-blue-400 font-mono font-bold">~5%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '5%' }} />
                  </div>
                </div>

                <div className="flex justify-between text-xs"><span className="text-slate-300">Motor and drivetrain losses:</span><span className="text-slate-300">~7%</span></div>
                <div className="pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-300 font-bold">Energy reaching the wheels:</span>
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
                  <line x1="50" y1="210" x2="430" y2="210" stroke="#3c3c3c" strokeWidth="1.5" />
                  <line x1="50" y1="30" x2="50" y2="210" stroke="#3c3c3c" strokeWidth="1.5" />

                  <text x="50" y="225" fill="#7f7f7f" fontSize="10" textAnchor="middle">0 RPM</text>
                  <text x="145" y="225" fill="#7f7f7f" fontSize="10" textAnchor="middle">2,000</text>
                  <text x="240" y="225" fill="#7f7f7f" fontSize="10" textAnchor="middle">4,000</text>
                  <text x="335" y="225" fill="#7f7f7f" fontSize="10" textAnchor="middle">6,000</text>
                  <text x="430" y="225" fill="#7f7f7f" fontSize="10" textAnchor="middle">12,000+ EV</text>

                  <path d="M 50 195 Q 120 180, 200 90 T 310 100 T 360 170" fill="none" stroke="#c9c9c9" strokeWidth="3.5" />
                  <circle cx="240" cy="95" r="5" fill="#c9c9c9" />
                  <text x="245" y="85" fill="#c9c9c9" fontSize="10" fontWeight="bold">Gasoline: peak at higher RPM</text>

                  <path d="M 50 60 L 220 60 Q 300 70, 420 160" fill="none" stroke="#c8c8c8" strokeWidth="3.5" />
                  <circle cx="50" cy="60" r="5" fill="#c8c8c8" />
                  <text x="65" y="50" fill="#d3d3d3" fontSize="10" fontWeight="bold">Electric: strong torque at low RPM</text>
                </svg>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h4 className="font-bold text-emerald-400">Turning force from a standstill</h4>
                <p className="text-slate-300 leading-relaxed">
                  An electric motor can produce strong turning force as soon as it starts moving. A gasoline engine needs to keep turning to run, and its turning force changes with engine speed. This diagram shows the general shapes of the curves, not measurements from specific cars.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <h4 className="font-bold text-amber-400">Engine at the front</h4>
              <p className="text-slate-300 leading-relaxed">
                In the IS300, the engine sits at the front and a driveshaft carries power to the rear wheels. That shaft runs through a raised tunnel in the floor.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <h4 className="font-bold text-emerald-400">Battery under the floor</h4>
              <p className="text-slate-300 leading-relaxed">
                Many electric cars place a large, flat battery under the floor. This puts much of the battery weight low in the car and leaves different options for positioning the motor and passenger space.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
