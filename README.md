# How Cars Work (Interactive Automotive Engineering Guide)

An interactive, visual, physics-based explainer project detailing the mechanical, thermodynamic, kinematic, and electrical systems that power modern automobiles.

## Interactive Modules Included

1. **3D Powertrain & Chassis Explorer (`ChassisViewer3D`)**
   - Built with WebGL / Three.js
   - 3D interactive assembly view with orbit rotation, exploded view disassembly, and angle presets (Perspective, Top-down, Side profile).
   - Component inspections: Engine block, bell housing transmission, driveshaft, rear differential, disc brakes, suspension knuckles, and exhaust routing.

2. **4-Stroke Internal Combustion Engine Simulator (`EngineSimulator`)**
   - Detailed Otto cycle thermodynamic sequence:
     - **Intake Stroke (0° - 180°):** Downward piston sweep, intake valve depression, stoichiometric fuel-air charge induction.
     - **Compression Stroke (180° - 360°):** Sealed chamber adiabatic compression to ~10:1 ratio.
     - **Power / Combustion Stroke (360° - 540°):** High-voltage spark ignition, 2,000°C flame expansion, 60+ bar pressure driving positive work.
     - **Exhaust Stroke (540° - 720°):** Upward piston travel sweeping spent combustion gases through the exhaust manifold.
   - Interactive RPM slider (600 RPM idle up to 6,500 RPM redline) with real-time kinematic trigonometry.

3. **Transmission & Gear Ratio Leverage Simulator (`TransmissionSimulator`)**
   - Torque multiplication dynamics ($Power = \tau \times \omega$).
   - 5-speed manual gear selector with real-time pinion/driven gear pitch diameter animations.
   - Live calculations for driveshaft RPM, final drive differential reduction, road speed (km/h), and wheel torque (Nm).
   - Overdrive ratio explanation (how ratios $< 1.0$ drop highway engine RPM to conserve fuel).

4. **The Open Differential Simulator (`DifferentialSimulator`)**
   - The cornering radius paradox: why outer wheels must spin faster than inner wheels in a turn.
   - Cutaway diagram of hypoid ring gear, input pinion, and rotating spider pinions.
   - Interactive turn direction switcher (Straight, Left turn, Right turn) demonstrating $(RPM_{left} + RPM_{right}) / 2 = RPM_{carrier}$.

5. **Hydraulic Disc Brakes & ABS Simulator (`BrakeSimulator`)**
   - Pascal's Principle ($P = F_1 / A_1 = F_2 / A_2$) hydraulic force multiplication.
   - Kinetic energy conversion ($E_k = \frac{1}{2}mv^2$) to thermal heat.
   - Pedal pressure control with real-time brake line pressure (bar), rotor temperature (°C), and caliper clamping force (N).
   - ABS toggle demonstrating static vs kinetic friction slip regulation.

6. **Steering Kinematics & Ackermann Geometry (`SteeringSimulator`)**
   - Why front wheels must turn at non-parallel angles to track concentric turning radii.
   - Rack and pinion steering animation with tie rods and steering knuckles.
   - Camber, Caster, and Toe alignment explanations.

7. **EV vs Internal Combustion (ICE) Comparison (`EvVsIceComparison`)**
   - Sankey-style thermal loss breakdown (ICE 25% efficiency vs EV 88% efficiency).
   - Instant torque from 0 RPM vs ICE torque curve build-up.
   - Skateboard architecture vs traditional high center-of-gravity unibodies.

8. **Automotive Engineering Knowledge Quiz (`CarQuiz`)**
   - Interactive 5-question test with immediate technical rationales and score feedback.

## Public References & Standards

- **Otto Cycle & Thermodynamics:** Standard SAE / ISO 1585 combustion definitions.
- **Differential Mechanics:** Epicyclic gearing principles and Pascal's Law hydraulics.
- **Ackermann Steering Geometry:** Rudolph Ackermann (1818) & Georg Lankensperger kinematic steering principles.

## Development & Testing

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build

# Run Playwright E2E tests
npm run test:e2e
```
