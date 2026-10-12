import React, { useState } from 'react';
import { ExternalLink, Menu, X } from 'lucide-react';
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
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-12 sm:h-13 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs sm:text-sm tracking-tight text-zinc-100">
              Lexus IS300 <span className="text-zinc-500 font-normal">/ 2JZ-GE</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href="https://en.wikipedia.org/wiki/Lexus_IS_(XE10)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-400 hover:text-zinc-100 hidden sm:flex items-center gap-1 transition px-2 py-1 rounded hover:bg-zinc-800/50"
            >
              <span>Specs</span>
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

        {/* Desktop Tab Rail */}
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
          <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 p-2.5 space-y-1 max-h-[70vh] overflow-y-auto">
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
                    <span className="text-[10px] text-zinc-500 font-mono">{item.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4">
        {activeTab === 'chassis' && (
          <div className="space-y-3">
            <ChassisViewer3D />

            {/* Quick 3-bullet takeaway */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div className="p-3 rounded-lg bg-[#121316] border border-[#222428] flex items-center justify-between">
                <span className="text-zinc-400">Layout</span>
                <span className="text-zinc-200 font-mono">Front-Mid FR · 54:46</span>
              </div>
              <div className="p-3 rounded-lg bg-[#121316] border border-[#222428] flex items-center justify-between">
                <span className="text-zinc-400">Powertrain</span>
                <span className="text-zinc-200 font-mono">2JZ-GE 3.0L · W55 5MT</span>
              </div>
              <div className="p-3 rounded-lg bg-[#121316] border border-[#222428] flex items-center justify-between">
                <span className="text-zinc-400">Traction</span>
                <span className="text-zinc-200 font-mono">Torsen T-2 LSD · Double-Wishbone</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'engine' && (
          <div className="space-y-4">
            <EngineSimulator />
            <AudioEngineSynth />
          </div>
        )}

        {activeTab === 'turbo' && (
          <div className="space-y-4">
            <TurbochargerSimulator />
          </div>
        )}

        {activeTab === 'transmission' && (
          <div className="space-y-4">
            <TransmissionSimulator />
          </div>
        )}

        {activeTab === 'differential' && (
          <div className="space-y-4">
            <DifferentialSimulator />
          </div>
        )}

        {activeTab === 'brakes' && (
          <div className="space-y-4">
            <BrakeSimulator />
          </div>
        )}

        {activeTab === 'steering' && (
          <div className="space-y-4">
            <SteeringSimulator />
          </div>
        )}

        {activeTab === 'suspension' && (
          <div className="space-y-4">
            <SuspensionSimulator />
          </div>
        )}

        {activeTab === 'cooling' && (
          <div className="space-y-4">
            <CoolingLubricationSimulator />
          </div>
        )}

        {activeTab === 'aero' && (
          <div className="space-y-4">
            <AerodynamicsSimulator />
          </div>
        )}

        {activeTab === 'electronics' && (
          <div className="space-y-4">
            <ElectricalEcuSimulator />
          </div>
        )}

        {activeTab === 'ev' && (
          <div className="space-y-4">
            <EvVsIceComparison />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <CarQuiz />
          </div>
        )}
      </main>

      <footer className="py-3 text-center text-[10px] text-zinc-600 border-t border-zinc-900">
        Lexus IS300 (XE10) 2JZ-GE Interactive Guide
      </footer>
    </div>
  );
}
