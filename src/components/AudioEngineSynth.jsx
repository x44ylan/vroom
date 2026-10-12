import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Activity } from 'lucide-react';

export default function AudioEngineSynth() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rpm, setRpm] = useState(1500);
  const [engineType, setEngineType] = useState('v8'); // 'i4', 'v6', 'v8'

  const audioCtxRef = useRef(null);
  const osc1Ref = useRef(null);
  const osc2Ref = useRef(null);
  const gainNodeRef = useRef(null);

  // Firing frequencies:
  // For 4-stroke engine:
  // I4: 2 cylinder firings per crankshaft revolution
  // V6: 3 cylinder firings per crankshaft revolution
  // V8: 4 cylinder firings per crankshaft revolution
  const cylindersPerRev = engineType === 'i4' ? 2 : engineType === 'v6' ? 3 : 4;
  const fundamentalFreqHz = (rpm / 60) * cylindersPerRev;

  useEffect(() => {
    if (!isPlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      return;
    }

    // Initialize Web Audio API synth
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return;
    const ctx = new AudioCtxClass();
    audioCtxRef.current = ctx;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(fundamentalFreqHz, ctx.currentTime);
    osc2.frequency.setValueAtTime(fundamentalFreqHz * 0.5, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();

    osc1Ref.current = osc1;
    osc2Ref.current = osc2;
    gainNodeRef.current = gain;

    return () => {
      try {
        osc1.stop();
        osc2.stop();
        ctx.close();
      } catch (e) {}
    };
  }, [isPlaying, engineType]);

  // Update frequencies when RPM shifts
  useEffect(() => {
    if (audioCtxRef.current && osc1Ref.current && osc2Ref.current) {
      const now = audioCtxRef.current.currentTime;
      osc1Ref.current.frequency.setTargetAtTime(fundamentalFreqHz, now, 0.05);
      osc2Ref.current.frequency.setTargetAtTime(fundamentalFreqHz * 0.5, now, 0.05);
    }
  }, [rpm, engineType, fundamentalFreqHz]);

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <Volume2 className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">Acoustic Engine Harmonic Synthesizer</h3>
          </div>
          <p className="text-sm text-slate-400">
            Hear how cylinder firing orders and RPM shape the distinctive acoustics of I4, V6, and crossplane V8 engines
          </p>
        </div>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            isPlaying
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
          }`}
        >
          {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {isPlaying ? 'Mute Engine Audio' : 'Start Audio Synthesizer'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Engine Layout buttons */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Select Cylinder Configuration:</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'i4', label: 'Inline-4', pulses: '2 firings/rev' },
              { id: 'v6', label: 'V6 (60°)', pulses: '3 firings/rev' },
              { id: 'v8', label: 'V8 (90°)', pulses: '4 firings/rev' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setEngineType(type.id)}
                className={`p-2 rounded-lg text-center border transition ${
                  engineType === type.id
                    ? 'bg-amber-600 border-amber-500 text-white font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Throttle RPM Slider */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Rev Engine:</span>
            <span className="text-amber-400 font-mono font-bold">{rpm} RPM</span>
          </div>
          <input
            type="range"
            min="700"
            max="7000"
            step="100"
            value={rpm}
            onChange={(e) => setRpm(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Acoustic harmonics readout */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1 text-xs">
          <span className="text-slate-400">Firing Frequency:</span>
          <div className="text-base font-mono font-bold text-white">
            {fundamentalFreqHz.toFixed(1)} Hz
          </div>
          <p className="text-[11px] text-slate-400">
            A crossplane V8 pulses uneven exhaust pulses through headers, producing the iconic deep American burble.
          </p>
        </div>
      </div>
    </div>
  );
}
