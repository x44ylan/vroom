import React, { useState } from 'react';
import { ExternalLink, Menu, X, ArrowUpRight } from 'lucide-react';
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
    <div className="min-h-screen bg-black text-white flex flex-col font-heading selection:bg-white selection:text-black">
      {/* zPod Top Minimal Navbar */}
      <header className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-heading font-bold text-lg sm:text-xl tracking-wider text-white">
              IS300<span className="text-zinc-500 font-normal">.2JZ</span>
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono tracking-widest text-zinc-300">
              CHASSIS JCE10
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://en.wikipedia.org/wiki/Lexus_IS_(XE10)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-400 hover:text-white hidden sm:flex items-center gap-1.5 transition px-3 py-1.5 rounded-full hover:bg-white/10 border border-white/10"
            >
              <span className="tracking-wider uppercase text-[11px]">Heritage</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
            </a>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/15 text-xs font-medium text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
              <span className="uppercase tracking-wider">{activeItem.label}</span>
            </button>
          </div>
        </div>

        {/* zPod Clean Pill Segment Rail */}
        <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 items-center gap-1.5 overflow-x-auto py-2 scrollbar-none border-t border-white/10">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`px-3.5 py-1 text-xs uppercase tracking-wider font-medium rounded-full transition shrink-0 ${
                  isActive
                    ? 'bg-white text-black font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#080808] border-b border-white/15 p-3 space-y-1.5 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-1.5">
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`p-2.5 rounded-xl text-left text-xs uppercase tracking-wider font-medium transition flex items-center justify-between ${
                      isActive
                        ? 'bg-white text-black font-semibold'
                        : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 border border-white/5'
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

      {/* Main Showcase Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {activeTab === 'chassis' && (
          <div className="space-y-6">
            {/* zPod Hero Title Block */}
            <div className="text-center py-4 sm:py-8 space-y-2">
              <span className="zpod-tag">NATURE-INSPIRED BALANCE</span>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight uppercase text-white mt-3">
                FR SPORT SEDAN
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto font-normal">
                Longitudinal 2JZ-GE power meets 54:46 front-mid chassis equilibrium.
              </p>
            </div>

            <ChassisViewer3D />

            {/* zPod Clean 3-Column Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl zpod-card space-y-1.5">
                <span className="text-[10px] tracking-widest uppercase font-mono text-zinc-500">01 / ARCHITECTURE</span>
                <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Front-Mid FR Layout</h4>
                <p className="text-xs text-zinc-400 leading-normal">
                  Engine mounted behind front axle line for near 50:50 cornering dynamics.
                </p>
              </div>

              <div className="p-4 rounded-xl zpod-card space-y-1.5">
                <span className="text-[10px] tracking-widest uppercase font-mono text-zinc-500">02 / MOTOR</span>
                <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Cast-Iron 2JZ-GE</h4>
                <p className="text-xs text-zinc-400 leading-normal">
                  7 main bearings guarantee zero secondary shake; holds 500+ HP under turbo.
                </p>
              </div>

              <div className="p-4 rounded-xl zpod-card space-y-1.5">
                <span className="text-[10px] tracking-widest uppercase font-mono text-zinc-500">03 / TRACTION</span>
                <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Torsen T-2 LSD</h4>
                <p className="text-xs text-zinc-400 leading-normal">
                  Helical worm gears bias 2.5× more torque to the gripping outer tire.
                </p>
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

      {/* zPod Clean Minimal Footer */}
      <footer className="py-6 border-t border-white/10 text-center text-xs text-zinc-500 tracking-wider uppercase">
        © Lexus IS300 (XE10) · 2JZ-GE Engineering Explorer
      </footer>
    </div>
  );
}
