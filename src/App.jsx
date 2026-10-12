import React, { useState } from 'react';
import { 
  Car, Flame, Layers, ArrowLeftRight, Disc, Compass, Zap, HelpCircle, 
  BookOpen, ExternalLink, Activity, Wind, ArrowDownUp, Thermometer, 
  Cpu, Menu, X
} from 'lucide-react';
import ChassisViewer3D from './components/ChassisViewer3D.jsx';
import EngineSimulator from './components/EngineSimulator.jsx';
import TransmissionSimulator from './components/TransmissionSimulator.jsx';
import DifferentialSimulator from './components/DifferentialSimulator.jsx';
import BrakeSimulator from './components/BrakeSimulator.jsx';
import SteeringSimulator from './components/SteeringSimulator.jsx';
import TurbochargerSimulator from './components/TurbochargerSimulator.jsx';
import SuspensionSimulator from './components/SuspensionSimulator.jsx';
import CoolingLubricationSimulator from './components/CoolingLubricationSimulator.jsx';
import AerodynamicsSimulator from './components/AerodynamicsSimulator.jsx';
import ElectricalEcuSimulator from './components/ElectricalEcuSimulator.jsx';
import AudioEngineSynth from './components/AudioEngineSynth.jsx';
import EvVsIceComparison from './components/EvVsIceComparison.jsx';
import CarQuiz from './components/CarQuiz.jsx';
import { Button } from './components/ui/button.jsx';
import { Badge } from './components/ui/badge.jsx';
import { Card, CardContent } from './components/ui/card.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('chassis');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NAVIGATION_ITEMS = [
    { id: 'chassis', label: '3D Chassis', badge: 'JCE10' },
    { id: 'engine', label: '2JZ Engine', badge: 'Inline-6' },
    { id: 'turbo', label: 'NA-T Turbo', badge: 'Boost' },
    { id: 'transmission', label: 'Transmission', badge: 'W55' },
    { id: 'differential', label: 'Torsen LSD', badge: 'T-2' },
    { id: 'brakes', label: 'Brakes & ABS', badge: 'Hydraulics' },
    { id: 'steering', label: 'Steering', badge: 'Ackermann' },
    { id: 'suspension', label: 'Suspension', badge: 'Double-Wishbone' },
    { id: 'cooling', label: 'Cooling & Oil', badge: 'Thermal' },
    { id: 'aero', label: 'Aerodynamics', badge: '0.28 Cd' },
    { id: 'electronics', label: 'Electronics', badge: 'OBD-II' },
    { id: 'ev', label: 'EV Comparison', badge: 'Architecture' },
    { id: 'quiz', label: 'Knowledge Quiz', badge: 'Test' },
  ];

  const handleSelectTab = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const activeItem = NAVIGATION_ITEMS.find((item) => item.id === activeTab) || NAVIGATION_ITEMS[0];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-zinc-100 selection:text-zinc-950">
      {/* Minimal Top Header */}
      <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-sm tracking-tight text-zinc-100">
              Lexus IS300 <span className="text-zinc-500 font-normal">/ XE10 2JZ-GE</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://en.wikipedia.org/wiki/Lexus_IS_(XE10)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-400 hover:text-zinc-100 hidden sm:flex items-center gap-1 transition px-2.5 py-1 rounded hover:bg-zinc-800/50"
            >
              <span>Heritage</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>

            {/* Mobile menu trigger */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 text-xs"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
              <span>{activeItem.label}</span>
            </Button>
          </div>
        </div>

        {/* Minimal Desktop Clean Tab Rail */}
        <div className="hidden lg:flex max-w-7xl mx-auto px-4 sm:px-6 items-center gap-1 overflow-x-auto py-1.5 scrollbar-none border-t border-zinc-900">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`px-3 py-1 text-xs font-medium rounded transition shrink-0 ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-950 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 p-3 space-y-1 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-1">
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`p-2 rounded text-left text-xs font-medium transition flex items-center justify-between ${
                      isActive
                        ? 'bg-zinc-100 text-zinc-950 font-semibold'
                        : 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] text-zinc-500">{item.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === 'chassis' && (
          <div className="space-y-6">
            <ChassisViewer3D />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card>
                <CardContent className="space-y-1.5 p-4">
                  <div className="text-xs font-semibold text-zinc-200">
                    1. Longitudinal 2JZ-GE Engine
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    215 hp / 218 lb-ft. Cast-iron deep-skirt FC250 block sharing Mk4 Supra architecture with a square 86mm bore and stroke.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-1.5 p-4">
                  <div className="text-xs font-semibold text-zinc-200">
                    2. Front-Engine, Rear-Drive (FR)
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Engine mounted behind the front axle line for 54:46 weight balance, sending torque down a two-piece rubber-isolated propeller shaft.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="space-y-1.5 p-4">
                  <div className="text-xs font-semibold text-zinc-200">
                    3. Double-Wishbone & Torsen LSD
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    High-mount upper A-arms provide negative camber gain during roll, paired with a torque-sensing helical limited-slip differential.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'engine' && (
          <div className="space-y-6">
            <EngineSimulator />
            <AudioEngineSynth />
          </div>
        )}

        {activeTab === 'turbo' && (
          <div className="space-y-6">
            <TurbochargerSimulator />
          </div>
        )}

        {activeTab === 'transmission' && (
          <div className="space-y-6">
            <TransmissionSimulator />
          </div>
        )}

        {activeTab === 'differential' && (
          <div className="space-y-6">
            <DifferentialSimulator />
          </div>
        )}

        {activeTab === 'brakes' && (
          <div className="space-y-6">
            <BrakeSimulator />
          </div>
        )}

        {activeTab === 'steering' && (
          <div className="space-y-6">
            <SteeringSimulator />
          </div>
        )}

        {activeTab === 'suspension' && (
          <div className="space-y-6">
            <SuspensionSimulator />
          </div>
        )}

        {activeTab === 'cooling' && (
          <div className="space-y-6">
            <CoolingLubricationSimulator />
          </div>
        )}

        {activeTab === 'aero' && (
          <div className="space-y-6">
            <AerodynamicsSimulator />
          </div>
        )}

        {activeTab === 'electronics' && (
          <div className="space-y-6">
            <ElectricalEcuSimulator />
          </div>
        )}

        {activeTab === 'ev' && (
          <div className="space-y-6">
            <EvVsIceComparison />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <CarQuiz />
          </div>
        )}

        {/* Minimal Footer Info */}
        <section className="pt-6 border-t border-zinc-800/80 text-xs text-zinc-500 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>Lexus IS300 (XE10 / JCE10) Technical Architecture</span>
            <div className="flex items-center gap-3">
              <a href="https://en.wikipedia.org/wiki/Toyota_JZ_engine#2JZ-GE" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300">
                2JZ-GE
              </a>
              <a href="https://en.wikipedia.org/wiki/Toyota_W_transmission#W55" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300">
                W55 Transmission
              </a>
              <a href="https://en.wikipedia.org/wiki/Torsen" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300">
                Torsen T-2 LSD
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-zinc-600 border-t border-zinc-900">
        Lexus IS300 (XE10) Automotive Physics Guide
      </footer>
    </div>
  );
}
