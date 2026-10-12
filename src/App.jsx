import React, { useState } from 'react';
import { 
  Car, Flame, Layers, ArrowLeftRight, Disc, Compass, Zap, HelpCircle, 
  BookOpen, ChevronRight, Cpu, Sparkles, ExternalLink, Activity
} from 'lucide-react';
import ChassisViewer3D from './components/ChassisViewer3D.jsx';
import EngineSimulator from './components/EngineSimulator.jsx';
import TransmissionSimulator from './components/TransmissionSimulator.jsx';
import DifferentialSimulator from './components/DifferentialSimulator.jsx';
import BrakeSimulator from './components/BrakeSimulator.jsx';
import SteeringSimulator from './components/SteeringSimulator.jsx';
import EvVsIceComparison from './components/EvVsIceComparison.jsx';
import CarQuiz from './components/CarQuiz.jsx';
import { CAR_SYSTEMS } from './data/carSystems.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('chassis'); // 'chassis', 'engine', 'transmission', 'differential', 'brakes', 'steering', 'ev', 'quiz'

  const NAVIGATION_ITEMS = [
    { id: 'chassis', label: '3D Powertrain', icon: Car, badge: 'Interactive 3D' },
    { id: 'engine', label: '4-Stroke Engine', icon: Flame, badge: 'Otto Cycle' },
    { id: 'transmission', label: 'Transmission', icon: Layers, badge: 'Gear Leverage' },
    { id: 'differential', label: 'Differential', icon: ArrowLeftRight, badge: 'Epicyclic' },
    { id: 'brakes', label: 'Braking & ABS', icon: Disc, badge: 'Hydraulics' },
    { id: 'steering', label: 'Steering & Suspension', icon: Compass, badge: 'Ackermann' },
    { id: 'ev', label: 'EV vs ICE', icon: Zap, badge: 'Future Tech' },
    { id: 'quiz', label: 'Knowledge Quiz', icon: HelpCircle, badge: 'Test Skills' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                HOW CARS WORK
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Interactive Physics
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Visualizing thermodynamics, kinematics, and torque transfer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://en.wikipedia.org/wiki/Car"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition px-3 py-1.5 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Public References</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Horizontal Module Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none border-t border-slate-900">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
                  Hydrocarbon fuel ignited at 2,000°C creates explosive expanding pressure pushing pistons downward, turning reciprocating motion into rotational torque.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                  <Layers className="w-4 h-4" /> 2. Torque Multiplication
                </div>
                <h4 className="text-sm font-bold text-white">Transmission & Driveshaft</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Gear teeth ratios multiply engine torque up to ~4x to overcome standstill inertia, then shift into overdrive ratios on highways to lower fuel consumption.
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

        {/* Global Summary & Public Resources section */}
        <section className="mt-12 p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Public Technical References & Learning Roadmap
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            This interactive vehicle physics explorer synthesizes automotive engineering principles documented in public open-access textbooks, SAE International standards, and MIT OpenCourseWare engineering curricula.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <a
              href="https://en.wikipedia.org/wiki/Internal_combustion_engine"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between text-xs group"
            >
              <span className="text-slate-300 font-medium">Internal Combustion</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition" />
            </a>

            <a
              href="https://en.wikipedia.org/wiki/Differential_(mechanical_device)"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between text-xs group"
            >
              <span className="text-slate-300 font-medium">Differential Mechanics</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition" />
            </a>

            <a
              href="https://en.wikipedia.org/wiki/Ackermann_steering_geometry"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between text-xs group"
            >
              <span className="text-slate-300 font-medium">Ackermann Steering</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition" />
            </a>

            <a
              href="https://en.wikipedia.org/wiki/Anti-lock_braking_system"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between text-xs group"
            >
              <span className="text-slate-300 font-medium">ABS & Fluid Dynamics</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition" />
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/90 py-6 text-center text-xs text-slate-500">
        <p>How Cars Work — Interactive Automotive Physics & Mechanical Engineering Guide</p>
      </footer>
    </div>
  );
}
