import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Segmented } from './controls/Controls.jsx';
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
          <CardTitle>Hear how engine speed changes the sound</CardTitle>
          <CardDescription>Turn the sound on, then move the speed slider. This is a synthesized example, not a recording.</CardDescription>
        </div>

        <Button
          size="sm"
          variant={isPlaying ? "destructive" : "secondary"}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'Mute' : 'Play engine sound'}</span>
        </Button>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 sm:p-5">
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
          <span className="text-xs text-slate-400">Engine type:</span>
          <Segmented size="sm" label="Engine type" value={engineType} onChange={setEngineType}
            options={[{ value: '2jz', label: '2JZ I6' }, { value: '3sge', label: '3S-GE I4' }, { value: '1uz', label: '1UZ V8' }]} />
        </div>

        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Engine speed:</span>
            <span className="text-slate-100 font-mono font-medium">{rpm} RPM</span>
          </div>
          <input
            type="range" aria-label="Audio engine speed"
            min="700"
            max="6500"
            step="100"
            value={rpm}
            onChange={(e) => setRpm(Number(e.target.value))}
            className="w-full accent-slate-200 cursor-pointer h-1.5 bg-slate-800 rounded"
          />
        </div>

        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
          <span className="text-slate-400">Firing frequency:</span>
          <div className="text-sm font-mono font-medium text-slate-100">
            {fundamentalFreqHz.toFixed(1)} Hz
          </div>
          <p className="text-[11px] text-slate-500">
            Each cylinder fires once every two crankshaft turns. More cylinders or a higher engine speed create more firing pulses each second, changing the pitch of the sound.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
