# How Cars Work (Interactive Automotive Engineering Encyclopedia)

An interactive, visual, physics-based automotive encyclopedia explaining the mechanical, thermodynamic, kinematic, fluid, aerodynamic, and electrical systems that power modern motor vehicles.

## Comprehensive Interactive Modules

1. **3D Powertrain & Chassis Explorer (`ChassisViewer3D`)**
   - WebGL / Three.js 3D assembly model.
   - Interactive 360° orbit rotation, exploded view assembly disassembly, camera angle presets (Perspective, Top-down, Side profile).
   - Component inspections: Engine block, bell housing transmission, driveshaft, hypoid rear differential, disc brakes, suspension knuckles, and exhaust routing.

2. **4-Stroke Internal Combustion Engine Simulator (`EngineSimulator`)**
   - Thermodynamic Otto cycle sequence with interactive piston kinematics:
     - **Intake Stroke (0° - 180°):** Downward piston sweep, intake valve depression, stoichiometric fuel-air charge induction.
     - **Compression Stroke (180° - 360°):** Sealed chamber adiabatic compression to ~10:1 ratio.
     - **Power / Combustion Stroke (360° - 540°):** High-voltage spark ignition, 2,000°C flame expansion, 60+ bar pressure driving positive work.
     - **Exhaust Stroke (540° - 720°):** Upward piston travel sweeping spent combustion gases through the exhaust manifold.
   - Interactive RPM slider (600 to 6,500 RPM) with real-time kinematic calculations.

3. **Acoustic Engine Harmonic Synthesizer (`AudioEngineSynth`)**
   - Web Audio API real-time synthesizer calculating cylinder firing pulses per crankshaft revolution:
     - **Inline-4 (I4):** 2 firings/rev
     - **V6 (60°):** 3 firings/rev
     - **Crossplane V8 (90°):** 4 firings/rev producing iconic low-frequency exhaust rumble.

4. **Turbocharger & Forced Induction Physics (`TurbochargerSimulator`)**
   - Explains how waste exhaust gas enthalpy drives a radial turbine spinning up to 180,000+ RPM.
   - Adiabatic compression temperature rises ($PV = nRT$) and charge-air intercooler heat rejection.
   - Boost pressure telemetry (PSI & Bar), volumetric efficiency (VE), and wastegate boost regulation.

5. **Transmission & Gear Leverage Simulator (`TransmissionSimulator`)**
   - Torque multiplication dynamics ($Power = \tau \times \omega$).
   - 5-speed manual gear selector with real-time pinion/driven gear pitch diameter animations.
   - Live calculations for driveshaft RPM, final drive differential reduction, road speed (km/h), and wheel torque (Nm).
   - Overdrive ratio explanation (how gear ratios $< 1.0$ drop highway engine RPM to conserve fuel).

6. **The Open Differential Simulator (`DifferentialSimulator`)**
   - The cornering radius paradox: why outer wheels must spin faster than inner wheels in a turn.
   - Epicyclic spider gear cutaway diagram with left/straight/right steering modes and formula verification ($(RPM_{left} + RPM_{right}) / 2 = RPM_{carrier}$).

7. **Hydraulic Disc Brakes & ABS Simulator (`BrakeSimulator`)**
   - Pascal's Principle ($P = F_1 / A_1 = F_2 / A_2$) hydraulic force multiplication.
   - Kinetic energy conversion ($E_k = \frac{1}{2}mv^2$) to thermal heat.
   - Pedal pressure control with real-time brake line pressure (bar), rotor temperature (°C), and caliper clamping force (N).
   - ABS toggle demonstrating static vs kinetic friction slip regulation.

8. **Steering Kinematics & Ackermann Geometry (`SteeringSimulator`)**
   - Why front wheels must turn at non-parallel angles to track concentric turning radii.
   - Rack and pinion steering animation with tie rods and steering knuckles.
   - Camber, Caster, and Toe alignment explanations.

9. **Suspension Dynamics: Springs & Dampers (`SuspensionSimulator`)**
   - Quarter-car suspension rig with spring constant ($k$) and viscous hydraulic damping ($c$).
   - Bump response simulation (potholes, speed bumps, corrugations).
   - Explains Sprung vs Unsprung mass, underdamped bounce vs critically damped adhesion.

10. **Cooling & Hydrodynamic Lubrication (`CoolingLubricationSimulator`)**
    - Engine water jacket coolant flow and thermostat heat rejection.
    - Pressurized radiator caps raising boiling point to ~125°C.
    - Hydrodynamic oil wedge physics: how 50 PSI pressurized oil films float rotating crankshaft journals with zero metal-to-metal contact.

11. **Automotive Aerodynamics & Drag Physics (`AerodynamicsSimulator`)**
    - Wind tunnel streamline simulation comparing sedans, boxy SUVs, and high-downforce supercars.
    - Explains aerodynamic drag equation ($F_d = \frac{1}{2}\rho v^2 C_d A$) and the velocity cubed ($P \propto v^3$) power requirement.
    - Rear turbulence wake and vacuum vortex drag.

12. **Automotive Electronics, CAN Bus & ECU Diagnostics (`ElectricalEcuSimulator`)**
    - Topology of high-speed 500 kbps differential twisted-pair Controller Area Network (CAN Bus).
    - ECM, TCM, BCM, and ABS module packet arbitration.
    - Interactive OBD-II fault injector simulating Diagnostic Trouble Codes (P0130 O2 sensor, C0035 wheel speed sensor, P0302 cylinder misfire) and failsafe limp-home strategies.

13. **EV vs Internal Combustion (ICE) Comparison (`EvVsIceComparison`)**
    - Sankey-style thermal loss breakdown (ICE 25% efficiency vs EV 88% efficiency).
    - Instant torque from 0 RPM vs ICE torque curve build-up.
    - Skateboard architecture vs traditional high center-of-gravity unibodies.

14. **Automotive Engineering Knowledge Quiz (`CarQuiz`)**
    - Interactive 5-question test with immediate technical rationales and score feedback.

## Public References & Standards

- **Combustion & Thermodynamics:** SAE J1349 / ISO 1585 standards.
- **Forced Induction:** Garrett Motion / BorgWarner turbocharger compressor map physics.
- **Epicyclic Gearing & Pascal's Law:** SAE Vehicle Dynamics Standards.
- **Ackermann Steering:** Rudolph Ackermann (1818) kinematic steering equations.
- **Vehicle Networking:** ISO 11898 CAN Bus protocol specifications.

## Development & Testing

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev # http://127.0.0.1:5180

# Build for production
npm run build

# Run Playwright E2E tests (13 comprehensive tests)
npm run test:e2e
```
