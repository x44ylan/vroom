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

export default function App() {
  const [activeTab, setActiveTab] = useState('chassis');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NAVIGATION_ITEMS = [
    { id: 'chassis', label: '3D Powertrain', icon: Car, badge: '3D WebGL' },
    { id: 'engine', label: '4-Stroke Engine', icon: Flame, badge: 'Otto Cycle' },
    { id: 'turbo', label: 'Turbocharger', icon: Wind, badge: 'Boost' },
    { id: 'transmission', label: 'Transmission', icon: Layers, badge: 'Gears' },
    { id: 'differential', label: 'Differential', icon: ArrowLeftRight, badge: 'Epicyclic' },
    { id: 'brakes', label: 'Braking & ABS', icon: Disc, badge: 'Hydraulics' },
    { id: 'steering', label: 'Steering', icon: Compass, badge: 'Ackermann' },
    { id: 'suspension', label: 'Suspension', icon: ArrowDownUp, badge: 'Damping' },
    { id: 'cooling', label: 'Cooling & Oil', icon: Thermometer, badge: 'Hydrodynamic' },
    { id: 'aero', label: 'Aerodynamics', icon: Wind, badge: 'Drag' },
    { id: 'electronics', label: 'ECU & CAN Bus', icon: Cpu, badge: 'OBD-II' },
    { id: 'ev', label: 'EV vs ICE', icon: Zap, badge: 'Future Tech' },
    { id: 'quiz', label: 'Knowledge Quiz', icon: HelpCircle, badge: 'Quiz' },
  ];

  const handleSelectTab = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const activeItem = NAVIGATION_ITEMS.find((item) => item.id === activeTab) || NAVIGATION_ITEMS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white leading-none">
                  HOW CARS WORK
                </h1>
                <Badge variant="default" className="text-[10px] hidden xs:inline-flex">
                  Interactive Physics
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">
                Visualizing thermodynamics, kinematics, torque transfer & vehicle dynamics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://en.wikipedia.org/wiki/Car"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-slate-200 hidden md:flex items-center gap-1 transition px-3 py-1.5 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>SAE / ISO Specs</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            {/* Mobile hamburger button */}
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span className="font-semibold">{activeItem.label}</span>
            </Button>
          </div>
        </div>

        {/* Desktop / Tablet Horizontal scrollable Tab bar */}
        <div className="hidden lg:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center gap-1.5 overflow-x-auto py-2 scrollbar-none border-t border-slate-900">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                size="sm"
                variant={isActive ? "default" : "ghost"}
                onClick={() => handleSelectTab(item.id)}
                className={`shrink-0 text-xs px-3 py-1.5 ${
                  isActive ? "text-slate-950 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Mobile dropdown drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-1 max-h-[75vh] overflow-y-auto animate-fadeIn">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
              Select Vehicle System Module:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {NAVIGATION_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between text-xs font-semibold transition ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md ${
                      isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Interactive Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        {/* Module Content Switcher */}
        {activeTab === 'chassis' && (
          <div className="space-y-6">
            <ChassisViewer3D />

            {/* Architectural overview cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Activity className="w-4 h-4" /> 1. Energy Generation
                </div>
                <h4 className="text-sm font-bold text-white">Combustion or Stored Ions</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hydrocarbon fuel ignited at 2,000°C creates expanding pressure pushing pistons downward, turning reciprocating motion into rotational torque.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                  <Layers className="w-4 h-4" /> 2. Torque Multiplication
                </div>
                <h4 className="text-sm font-bold text-white">Transmission & Driveshaft</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Gear ratios multiply engine torque up to ~4x to overcome standstill inertia, then shift into overdrive ratios on highways to lower fuel consumption.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Compass className="w-4 h-4" /> 3. Ground Adhesion
                </div>
                <h4 className="text-sm font-bold text-white">Differential & Tires</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The differential splits rotational power between left and right drive wheels so the car can corner smoothly without scrubbing rubber against asphalt.
                </p>
              </div>
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

        {/* Global Technical Resources footer */}
        <section className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Public Technical References & Automotive Engineering Standards
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Synthesized from SAE International standards, Bosch Automotive Handbooks, and MIT mechanical engineering lecture archives.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 pt-2">
            <a
              href="https://en.wikipedia.org/wiki/Internal_combustion_engine"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between text-xs group"
            >
              <span className="text-slate-300 font-medium">Otto Cycle</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition mt-2 self-end" />
            </a>

            <a
              href="https://en.wikipedia.org/wiki/Turbocharger"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between text-xs group"
            >
              <span className="text-slate-300 font-medium">Turbochargers</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition mt-2 self-end" />
            </a>

            <a
              href="https://en.wikipedia.org/wiki/Differential_(mechanical_device)"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between text-xs group"
            >
              <span className="text-slate-300 font-medium">Differentials</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition mt-2 self-end" />
            </a>

            <a
              href="https://en.wikipedia.org/wiki/Suspension_(vehicle)"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between text-xs group"
            >
              <span className="text-slate-300 font-medium">Dampers & Springs</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition mt-2 self-end" />
            </a>

            <a
              href="https://en.wikipedia.org/wiki/CAN_bus"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between text-xs group"
            >
              <span className="text-slate-300 font-medium">CAN Bus Network</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition mt-2 self-end" />
            </a>

            <a
              href="https://en.wikipedia.org/wiki/Automobile_drag_coefficient"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex flex-col justify-between text-xs group"
            >
              <span className="text-slate-300 font-medium">Aerodynamics</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition mt-2 self-end" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/90 py-4 sm:py-6 text-center text-xs text-slate-500 px-4">
        <p>How Cars Work — Interactive Automotive Physics & Mechanical Engineering Encyclopedia</p>
      </footer>
    </div>
  );
}
