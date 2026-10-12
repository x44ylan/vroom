export const CAR_SYSTEMS = [
  {
    id: 'chassis-overview',
    title: 'Complete Vehicle Architecture',
    subtitle: 'From powertrain to contact patch: how power flows and components integrate',
    category: 'overview',
    badge: '3D Chassis Explorer',
    summary: 'A car is an integrated synergy of structural, thermodynamic, kinematic, and electrical subsystems working in microsecond coordination.',
    keyStats: [
      { label: 'Avg Curb Weight', value: '1,500 - 1,900 kg' },
      { label: 'Weight Dist (Ideal)', value: '50:50 Front:Rear' },
      { label: 'Typical Parts Count', value: '~30,000 components' },
      { label: 'Thermal Efficiency (ICE)', value: '30% - 40%' }
    ],
    principles: [
      {
        title: 'Rigid Monocoque Chassis',
        desc: 'Modern unibody design merges the frame and body into one single stress-bearing shell made of high-strength steel and aluminum, engineered with crumple zones that absorb kinetic energy.'
      },
      {
        title: 'Energy Transformation Chain',
        desc: 'Chemical energy (fuel/battery) -> Mechanical torque (engine/motor) -> Transmission gearing -> Driveshaft/Axles -> Differential split -> Wheel traction.'
      },
      {
        title: 'Dynamic Equilibrium',
        desc: 'Acceleration, braking, and steering dynamically shift normal load between all 4 tires (weight transfer), governed by suspension geometry and anti-roll bars.'
      }
    ]
  },
  {
    id: 'four-stroke-engine',
    title: 'Four-Stroke Internal Combustion Engine',
    subtitle: 'The thermodynamic Otto Cycle: Intake, Compression, Power, and Exhaust',
    category: 'engine',
    badge: 'Thermodynamics & Kinematics',
    summary: 'Converts chemical energy from fuel and oxygen into reciprocal linear piston motion, converted into rotational crankshaft torque.',
    strokeData: [
      {
        name: 'Intake',
        pistonMovement: 'Downwards (TDC -> BDC)',
        valves: 'Intake valve open, exhaust closed',
        process: 'Piston creates a vacuum depression inside the cylinder. Atmospheric pressure forces the stoichiometric air-fuel mixture (14.7:1 for gasoline) into the combustion chamber.',
        color: '#38bdf8', // blue
        crankAngle: '0° - 180°'
      },
      {
        name: 'Compression',
        pistonMovement: 'Upwards (BDC -> TDC)',
        valves: 'Both valves sealed shut',
        process: 'Both valves seal tightly. Piston compresses the trapped mixture to ~1/10th its volume (compression ratio ~10:1), raising mixture pressure and temperature close to auto-ignition threshold.',
        color: '#a855f7', // purple
        crankAngle: '180° - 360°'
      },
      {
        name: 'Power (Combustion)',
        pistonMovement: 'Downwards (TDC -> BDC)',
        valves: 'Both valves sealed shut',
        process: 'Spark plug discharges at ~15°-20° before TDC. Flame front expands rapidly, gas temperatures surge to >2,000°C, and pressure reaches 60+ bar, violently forcing the piston down. This stroke creates ALL the positive mechanical work.',
        color: '#ef4444', // red/flame
        crankAngle: '360° - 540°'
      },
      {
        name: 'Exhaust',
        pistonMovement: 'Upwards (BDC -> TDC)',
        valves: 'Exhaust valve open, intake closed',
        process: 'Exhaust valve cracks open before BDC. Spent combustion gases (CO2, H2O, N2, traces of CO/NOx) are swept out by the rising piston into the exhaust manifold and catalytic converter.',
        color: '#f59e0b', // amber/orange
        crankAngle: '540° - 720°'
      }
    ],
    technicalDeepDive: {
      ratio: 'Stoichiometric AFR: 14.7 kg Air to 1 kg Gasoline',
      rpmMath: 'At 6,000 RPM, each cylinder fires 50 times every single second (1 stroke takes only 2.5 milliseconds!).',
      valvesTiming: 'Camshaft spins at exactly 1/2 crankshaft speed via timing belt or chain to synchronize valve lift with piston position.'
    }
  },
  {
    id: 'transmission-gears',
    title: 'Transmission & Gear Ratios',
    subtitle: 'Torque multiplication, RPM matching, and mechanical advantage',
    category: 'drivetrain',
    badge: 'Torque & Leverage',
    summary: 'Internal combustion engines have a narrow power band (typically 2,000 - 6,500 RPM). Transmissions exchange rotational speed for torque leverage.',
    gears: [
      { gear: '1st Gear', ratio: 3.8, desc: 'Maximum torque multiplication for launching from standstill against rolling resistance.', speedRange: '0 - 45 km/h', torqueMult: '3.8x Engine Torque' },
      { gear: '2nd Gear', ratio: 2.2, desc: 'Moderate torque for town acceleration and hill climbing.', speedRange: '30 - 80 km/h', torqueMult: '2.2x Engine Torque' },
      { gear: '3rd Gear', ratio: 1.5, desc: 'Intermediate gear balancing engine load and vehicular inertia.', speedRange: '50 - 110 km/h', torqueMult: '1.5x Engine Torque' },
      { gear: '4th Gear', ratio: 1.0, desc: 'Direct drive: crankshaft and transmission output spin at identical speed.', speedRange: '70 - 140 km/h', torqueMult: '1.0x Engine Torque' },
      { gear: '5th / Overdrive', ratio: 0.75, desc: 'Driveshaft turns faster than engine; drops engine RPM at highway speeds for peak fuel economy.', speedRange: '90 - 200+ km/h', torqueMult: '0.75x Engine Torque' }
    ],
    principles: [
      {
        title: 'Mechanical Work Conservation',
        desc: 'Power = Torque × Angular Velocity. Ignoring small frictional drag, mechanical power in equals mechanical power out. If a gear cuts wheel RPM in half, it doubles wheel torque.'
      },
      {
        title: 'The Clutch / Torque Converter',
        desc: 'Permits the engine to decouple from stationary drive wheels so it does not stall when stopped at traffic lights.'
      }
    ]
  },
  {
    id: 'differential-system',
    title: 'The Open Differential',
    subtitle: 'Why outer wheels must rotate faster than inner wheels in a corner',
    category: 'drivetrain',
    badge: 'Epicyclic Planetary Magic',
    summary: 'When turning a curve, the outside wheel travels along an arc with a larger radius than the inside wheel. Without a differential, tires would violently skip, chirp, or shatter axle shafts.',
    corneringGeometry: {
      innerArc: 'Shorter distance = slower rotational RPM required',
      outerArc: 'Longer distance = faster rotational RPM required',
      diffMechanism: 'Spider gears mesh between side axle gears. In a straight line, spider gears don’t spin on their pins—both wheels turn together. In a turn, spider gears rotate, transferring RPM differential without losing drive torque.'
    },
    keyFormula: 'Wheel Speed (Left) + Wheel Speed (Right) = 2 × Ring Gear Speed'
  },
  {
    id: 'braking-system',
    title: 'Hydraulic Disc Brakes & ABS',
    subtitle: 'Pascal’s Law, hydraulic amplification, and threshold traction control',
    category: 'chassis',
    badge: 'Fluid Dynamics & Friction',
    summary: 'Vehicle brakes convert 100% of kinetic energy (0.5 * m * v²) into thermal heat through high-friction composite pads pressed against ventilated cast iron or carbon rotors.',
    brakingStages: [
      {
        stage: 'Pedal & Brake Booster',
        desc: 'Driver pushes brake pedal (~200 N). Vacuum booster amplifies force 4x - 6x using engine intake manifold vacuum depression against an internal diaphragm.'
      },
      {
        stage: 'Master Cylinder (Pascal’s Principle)',
        desc: 'Hydraulic fluid (DOT 4) is incompressible. Piston pressurizes closed fluid circuits equally throughout the car lines (up to 120 bar / 1,700 psi).'
      },
      {
        stage: 'Caliper Piston Clamping',
        desc: 'Hydraulic pressure acts on larger caliper piston area, creating massive clamping force (10,000+ N) pinching brake pads against rotor.'
      },
      {
        stage: 'ABS (Anti-lock Braking System)',
        desc: 'Wheel speed sensors monitor slip. If a wheel begins to lock up (skid), ABS solenoid valves pulse pressure up to 20 times per second to keep tire in peak static friction zone.'
      }
    ]
  },
  {
    id: 'steering-suspension',
    title: 'Steering Geometry & Suspension',
    subtitle: 'Ackermann angle, MacPherson struts, double wishbones, and tire contact patches',
    category: 'chassis',
    badge: 'Vehicle Kinematics',
    summary: 'Maintains maximum tire contact patch on uneven asphalt while isolating chassis vibrations and providing accurate directional control.',
    geometryTerms: [
      {
        term: 'Ackermann Steering',
        explanation: 'Steering arms angle inward so the inside front wheel turns sharper than the outside wheel, aligning with concentric turning radii.'
      },
      {
        term: 'Camber Angle',
        explanation: 'Inward (negative) or outward (positive) tilt of the wheel from vertical. Negative camber offsets tire roll in high-g cornering.'
      },
      {
        term: 'Caster Angle',
        explanation: 'Tilt of steering axis forward/backward. Positive caster creates a self-centering torque returning wheels to straight-ahead automatically.'
      },
      {
        term: 'Spring & Damper (Shock Absorber)',
        explanation: 'Spring holds vehicle weight and absorbs impact; shock absorber uses hydraulic valving to dissipate kinetic bounce into fluid heat.'
      }
    ]
  },
  {
    id: 'ev-vs-ice',
    title: 'Electric Vehicles (EV) vs ICE Architecture',
    subtitle: 'Comparing internal combustion powertrains with modern EV skateboard architectures',
    category: 'future',
    badge: 'Modern Powertrain Comparison',
    summary: 'EVs replace complex mechanical reciprocal drivetrains with instant electromagnetic stator-rotor flux, single-speed reduction, and regenerative braking.',
    comparisons: [
      {
        metric: 'Energy Source',
        ice: 'Hydrocarbon Fuel (Gasoline / Diesel)',
        ev: 'Lithium-ion Battery Pack (400V / 800V DC)'
      },
      {
        metric: 'Moving Parts in Powertrain',
        ice: '~2,000+ moving mechanical parts (pistons, valves, crankshafts, cams)',
        ev: '~20 moving parts (motor rotor, bearings, reduction gear)'
      },
      {
        metric: 'Torque Delivery',
        ice: 'Requires RPM climb; peak torque typically between 2,500 - 4,500 RPM',
        ev: '100% maximum torque available instantly from 0 RPM'
      },
      {
        metric: 'Transmission',
        ice: 'Multi-ratio gearbox (6 to 10 speeds or CVT) with clutch / torque converter',
        ev: 'Single-speed reduction gearbox (typically ~9:1 fixed ratio)'
      },
      {
        metric: 'Energy Efficiency',
        ice: '25% - 35% tank-to-wheel (65%+ wasted as engine heat and friction)',
        ev: '85% - 93% battery-to-wheel efficiency'
      },
      {
        metric: 'Center of Gravity',
        ice: 'Higher CoG due to heavy engine block and transmission mounted high',
        ev: 'Ultra-low CoG due to flat floor skateboard battery pack'
      }
    ]
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Why do car engines need a transmission with multiple gear ratios?",
    options: [
      { text: "Because the fuel pump can only deliver fuel at one constant pressure.", isCorrect: false },
      { text: "Because combustion engines produce usable torque only within a narrow RPM band, requiring torque multiplication at low speeds.", isCorrect: true },
      { text: "Because tires can only rotate at discrete stepped speeds.", isCorrect: false },
      { text: "To reverse the rotation of the crankshaft whenever the car brakes.", isCorrect: false }
    ],
    explanation: "Internal combustion engines cannot produce torque at 0 RPM and have a limited power band (typically 1,500-6,000 RPM). First gear multiplies engine torque by ~3-4x to overcome vehicle inertia from a dead stop."
  },
  {
    id: 2,
    question: "In a standard four-stroke internal combustion engine, which stroke produces POSITIVE mechanical power?",
    options: [
      { text: "The Compression Stroke", isCorrect: false },
      { text: "The Intake Stroke", isCorrect: false },
      { text: "The Power / Combustion Stroke", isCorrect: true },
      { text: "The Exhaust Stroke", isCorrect: false }
    ],
    explanation: "Only the Power Stroke creates positive mechanical work when the spark ignites the fuel-air charge, rapidly heating gases to push the piston down. The other three strokes consume momentum from the flywheel."
  },
  {
    id: 3,
    question: "What happens when a car without a differential tries to take a tight turn on dry pavement?",
    options: [
      { text: "Both wheels rotate smoothly at identical speeds with no tire wear.", isCorrect: false },
      { text: "The outside tire and inside tire are forced to rotate at identical RPMs, causing tires to scrub, chirp, and straining axles.", isCorrect: true },
      { text: "The engine immediately shuts down due to exhaust backpressure.", isCorrect: false },
      { text: "The steering wheel locks in place automatically.", isCorrect: false }
    ],
    explanation: "The outside wheel covers a larger radius arc and must spin faster. A locked axle forces wheels to rotate at identical rates, forcing one tire to break traction and scrub across the tarmac."
  },
  {
    id: 4,
    question: "How does an Anti-Lock Braking System (ABS) reduce braking distance and preserve steering control?",
    options: [
      { text: "By permanently locking all four wheels so tires dig into the asphalt.", isCorrect: false },
      { text: "By rapidly pulsing hydraulic brake pressure on wheels about to lock, keeping tires in peak static friction rather than kinetic sliding friction.", isCorrect: true },
      { text: "By shifting the transmission into neutral whenever brakes are pressed.", isCorrect: false },
      { text: "By pumping cold air onto the brake rotors to cool them down.", isCorrect: false }
    ],
    explanation: "Static friction between rubber and road is higher than kinetic (sliding) friction. If wheels lock up, steering capability is completely lost. ABS modulates pressure up to 20 times per second to prevent skidding."
  },
  {
    id: 5,
    question: "Why do electric vehicles (EVs) typically NOT require multi-speed transmissions?",
    options: [
      { text: "Electric motors produce max torque immediately from 0 RPM and can spin smoothly up to 18,000+ RPM.", isCorrect: true },
      { text: "Because gears cannot withstand electric magnetic currents.", isCorrect: false },
      { text: "Because EVs only operate at speeds below 80 km/h.", isCorrect: false },
      { text: "Because EV batteries change voltage to change mechanical gear ratios directly.", isCorrect: false }
    ],
    explanation: "Electric traction motors deliver maximum torque from 0 RPM and have broad efficient operating bands (0 to 18,000+ RPM), allowing a single fixed reduction gear to cover both standstill launch and highway cruising."
  }
];
