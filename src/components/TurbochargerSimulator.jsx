import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.jsx';
import { Switch } from './controls/Controls.jsx';
import { Stage, Pipe, Flow, Callout, heatColor, useClock } from './diagram/kit.jsx';
import { Button } from './ui/button.jsx';

export default function TurbochargerSimulator() {
  const [engineRpm, setEngineRpm] = useState(2600);
  const [wastegateOpen, setWastegateOpen] = useState(false);
  const [intercoolerActive, setIntercoolerActive] = useState(true);
  const [animAngle, setAnimAngle] = useState(0);
  const animRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  const spoolFactor = Math.min(1.0, Math.max(0, (engineRpm - 2000) / 2600));
  const turboRpm = Math.round(spoolFactor * 165000 + (engineRpm > 1000 ? 15000 : 0));
  
  const targetBoostPsi = wastegateOpen ? Math.min(5, spoolFactor * 8) : spoolFactor * 16.5;
  const boostPsi = Math.round(targetBoostPsi * 10) / 10;
  const boostBar = Math.round((boostPsi / 14.7) * 100) / 100;

  const uncooledTempC = Math.round(25 + boostPsi * 5.8);
  const intakeAirTempC = intercoolerActive
    ? Math.round(25 + (uncooledTempC - 25) * 0.3)
    : uncooledTempC;

  const manifoldPressureRatio = (14.7 + boostPsi) / 14.7;
  const volumetricEfficiency = Math.round(manifoldPressureRatio * 95);
  const densityBonus = (273 + 25) / (273 + intakeAirTempC);
  const estimatedHorsepower = Math.round(215 * manifoldPressureRatio * Math.min(1.15, densityBonus));

  useEffect(() => {
    const loop = (now) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      const speed = (turboRpm / 15000) * 360 * dt;
      setAnimAngle((prev) => (prev + speed) % 360);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [turboRpm]);

  const t = useClock();
  const boostN = Math.min(1, boostPsi / 16.5);
  const hotAir = heatColor((uncooledTempC - 25) / 90);
  const chargeAir = heatColor((intakeAirTempC - 25) / 90);
  const exhaustPath = 'M20 250 C120 250 140 250 150 214';
  const wastegatePath = 'M110 250 C120 292 250 292 262 262';
  const coldIn = 'M480 150 H348';
  const toCooler = intercoolerActive ? 'M300 196 V250 Q300 266 316 266 H350' : 'M300 196 V250 Q300 266 316 266 H470';
  const toEngine = 'M444 248 V214 Q444 196 426 196 H380';

  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center justify-between gap-3 p-4 sm:p-5">
        <div>
          <CardTitle>Try a turbocharger</CardTitle>
          <CardDescription>Exhaust drives the turbine on one side. The compressor on the other side pushes air into the engine.</CardDescription>
        </div>

        <div className="switch-row">
          <Switch label="Intercooler" checked={intercoolerActive} onChange={setIntercoolerActive} />
          <Switch label="Wastegate open" checked={wastegateOpen} onChange={setWastegateOpen} />
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center p-4 sm:p-5">
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="diagram-frame relative w-full aspect-[25/16]">
            <Stage viewBox="0 0 500 320" label="Turbocharger: exhaust spins a turbine that drives a compressor">
              <ellipse cx="250" cy="306" rx="220" ry="12" fill="url(#k-floor)" />
              {/* Exhaust side */}
              <Pipe d={exhaustPath} w={22} color="#494949" />
              <Flow d={exhaustPath} t={t} speed={40 + boostN * 120} color="#d4d4d4" width={5} />
              <Pipe d={wastegatePath} w={10} color="#555555" opacity={wastegateOpen ? 1 : 0.45} />
              {wastegateOpen && <Flow d={wastegatePath} t={t} speed={80} color="#d4d4d4" width={4} />}
              <Callout x={60} y={250} tx={24} ty={222} color="#bababa">Hot exhaust</Callout>
              {/* Turbine housing (snail) */}
              <path d="M160 108 A 56 56 0 1 1 104 164 L 104 214 L 150 214 A 50 50 0 0 0 160 108 Z" fill="#393939" opacity=".0" />
              <circle cx="160" cy="160" r="58" fill="url(#k-iron)" stroke="#202020" />
              <circle cx="160" cy="160" r="44" fill="#171717" />
              <g transform={`translate(160 160) rotate(${animAngle})`}>
                {Array.from({ length: 11 }, (_, i) => <path key={i} d="M0 -6 Q 16 -20 10 -42 L 4 -42 Q 8 -22 -4 -8 Z" fill="#a6a6a6" transform={`rotate(${i * (360 / 11)})`} />)}
                <circle r="8" fill="#ebebeb" />
              </g>
              {/* Shaft */}
              <rect x="214" y="150" width="34" height="20" rx="4" fill="url(#k-steel)" />
              <rect x="208" y="140" width="46" height="40" rx="8" fill="#3b3b3b" opacity=".6" />
              {/* Compressor side */}
              <Pipe d={coldIn} w={22} color="#505050" />
              <Flow d={coldIn} t={t} speed={40 + boostN * 120} color="#d6d6d6" width={5} />
              <Callout x={460} y={150} tx={476} ty={118} anchor="end" color="#d6d6d6">Fresh air</Callout>
              <circle cx="300" cy="160" r="58" fill="url(#k-iron)" stroke="#202020" />
              <circle cx="300" cy="160" r="44" fill="#171717" />
              <g transform={`translate(300 160) rotate(${animAngle})`}>
                {Array.from({ length: 12 }, (_, i) => <path key={i} d="M0 -6 Q -16 -20 -10 -42 L -4 -42 Q -8 -22 4 -8 Z" fill="#d5d5d5" transform={`rotate(${i * 30})`} />)}
                <circle r="8" fill="#ebebeb" />
              </g>
              <Pipe d={toCooler} w={18} color={hotAir} />
              <Flow d={toCooler} t={t} speed={30 + boostN * 110} color="#ffffff" width={3} opacity={0.5} />
              {intercoolerActive && (
                <g>
                  <rect x="350" y="236" width="94" height="58" rx="8" fill="#3a3a3a" stroke="#686868" />
                  {Array.from({ length: 10 }, (_, i) => <rect key={i} x={356 + i * 8.6} y="242" width="3" height="46" fill="#848484" />)}
                  <Pipe d={toEngine} w={18} color={chargeAir} />
                  <Flow d={toEngine} t={t} speed={30 + boostN * 110} color="#ffffff" width={3} opacity={0.5} />
                  <Callout x={397} y={294} tx={420} ty={312} anchor="end" color="#a5a5a5">Intercooler</Callout>
                </g>
              )}
              <text x="160" y="72" fill="#bababa" fontSize="12" fontWeight="600" textAnchor="middle">TURBINE</text>
              <text x="300" y="72" fill="#d6d6d6" fontSize="12" fontWeight="600" textAnchor="middle">COMPRESSOR</text>
              <text x="230" y="110" fill="#a5a5a5" fontSize="11" textAnchor="middle">shared shaft</text>
            </Stage>

            <div className="absolute diagram-footer">
              <span className="text-slate-400 font-mono">
                Shaft: <span className="text-slate-100">{turboRpm.toLocaleString()} RPM</span>
              </span>
              <span className="font-mono text-slate-200">
                Boost: +{boostPsi} PSI ({boostBar} Bar)
              </span>
            </div>
          </div>

          <div className="w-full mt-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-400">Engine speed:</span>
              <span className="text-slate-100 font-mono font-medium">{engineRpm} RPM</span>
            </div>
            <input
              type="range" aria-label="Engine speed"
              min="800"
              max="6500"
              step="50"
              value={engineRpm}
              onChange={(e) => setEngineRpm(Number(e.target.value))}
              className="w-full accent-slate-200 cursor-pointer h-1.5 bg-slate-800 rounded"
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2.5 text-xs">
            <span className="font-medium text-slate-200 block">Watch the air temperature and power</span>

            <div className="space-y-1.5 font-mono">
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Estimated power:</span>
                <span className="text-slate-100 font-bold">{estimatedHorsepower} HP</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Relative air charge:</span>
                <span className="text-slate-200">{volumetricEfficiency}%</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Intake temperature:</span>
                <span className={intakeAirTempC > 65 ? 'text-red-400' : 'text-slate-200'}>
                  {intakeAirTempC}°C
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-[#272727]">
              More boost pushes more air into the engine. Cooling that air makes it denser, which is why the power estimate changes when you switch the intercooler. These values illustrate the relationship; they are not a prediction for a real turbo conversion.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
