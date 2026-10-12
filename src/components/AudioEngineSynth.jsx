import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';

export default function AudioEngineSynth() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rpm, setRpm] = useState(1500);
  const [engineType, setEngineType] = useState('v8');

  const audioCtxRef = useRef(null);
  const osc1Ref = useRef(null);
  const osc2Ref = useRef(null);
  const gainNodeRef = useRef(null);

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

  useEffect(() => {
    if (audioCtxRef.current && osc1Ref.current && osc2Ref.current) {
      const now = audioCtxRef.current.currentTime;
      osc1Ref.current.frequency.setTargetAtTime(fundamentalFreqHz, now, 0.05);
      osc2Ref.current.frequency.setTargetAtTime(fundamentalFreqHz * 0.5, now, 0.05);
    }
  }, [rpm, engineType, fundamentalFreqHz]);

  return (
    <Card className="w-full">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Acoustic Engine Harmonic Synthesizer</CardTitle>
              <Badge variant="destructive" className="hidden sm:inline-flex">Acoustics</Badge>
            </div>
            <CardDescription>Hear how cylinder firing orders and RPM shape acoustic harmonics</CardDescription>
          </div>
        </div>

        <Button
          size="sm"
          variant={isPlaying ? "destructive" : "success"}
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-full sm:w-auto text-xs"
        >
          {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {isPlaying ? 'Mute Engine Audio' : 'Start Audio Synthesizer'}
        </Button>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="p-3 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-medium">Cylinder Layout:</span>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'i4', label: 'Inline-4' },
              { id: 'v6', label: 'V6 (60°)' },
              { id: 'v8', label: 'V8 (90°)' }
            ].map((type) => (
              <Button
                key={type.id}
                size="sm"
                variant={engineType === type.id ? "default" : "secondary"}
                onClick={() => setEngineType(type.id)}
                className="text-xs px-2"
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
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

        <div className="p-3 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1 text-xs">
          <span className="text-slate-400">Firing Frequency:</span>
          <div className="text-base font-mono font-bold text-white">
            {fundamentalFreqHz.toFixed(1)} Hz
          </div>
          <p className="text-[11px] text-slate-400">
            Crossplane V8 exhaust headers create distinctive low-frequency rumble.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
