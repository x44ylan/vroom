import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';

export default function AudioEngineSynth() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rpm, setRpm] = useState(1500);
  const [engineType, setEngineType] = useState('2jz');

  const audioCtxRef = useRef(null);
  const osc1Ref = useRef(null);
  const osc2Ref = useRef(null);
  const gainNodeRef = useRef(null);

  const cylindersPerRev = engineType === '3sge' ? 2 : engineType === '2jz' ? 3 : 4;
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

    gain.gain.setValueAtTime(0.06, ctx.currentTime);

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
      <CardHeader className="flex-row items-center justify-between gap-3 p-4 sm:p-5">
        <div>
          <CardTitle>Exhaust Acoustic Harmonic Synthesizer</CardTitle>
          <CardDescription>Cylinder firing orders and primary acoustic harmonics</CardDescription>
        </div>

        <Button
          size="sm"
          variant={isPlaying ? "destructive" : "secondary"}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'Mute' : 'Synthesize Audio'}</span>
        </Button>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 sm:p-5">
        <div className="p-3 rounded-lg bg-[#0e0f11] border border-[#222428] space-y-1.5">
          <span className="text-xs text-zinc-400">Firing Profile:</span>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: '2jz', label: '2JZ I6' },
              { id: '3sge', label: '3S-GE I4' },
              { id: '1uz', label: '1UZ V8' }
            ].map((type) => (
              <Button
                key={type.id}
                size="sm"
                variant={engineType === type.id ? "default" : "outline"}
                onClick={() => setEngineType(type.id)}
                className="text-[11px] px-1.5"
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#0e0f11] border border-[#222428] space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400">Engine Speed:</span>
            <span className="text-zinc-100 font-mono font-medium">{rpm} RPM</span>
          </div>
          <input
            type="range"
            min="700"
            max="6500"
            step="100"
            value={rpm}
            onChange={(e) => setRpm(Number(e.target.value))}
            className="w-full accent-zinc-200 cursor-pointer h-1.5 bg-[#222428] rounded"
          />
        </div>

        <div className="p-3 rounded-lg bg-[#0e0f11] border border-[#222428] space-y-1 text-xs">
          <span className="text-zinc-400">Harmonic Frequency:</span>
          <div className="text-sm font-mono font-medium text-zinc-100">
            {fundamentalFreqHz.toFixed(1)} Hz
          </div>
          <p className="text-[11px] text-zinc-500">
            2JZ firing order 1-5-3-6-2-4 produces 3 pulses/rev with zero secondary vibration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
