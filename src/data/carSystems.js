export const LEXUS_IS300_SPECS = {
  model: 'Lexus IS300 (XE10 / JCE10)',
  generation: 'First Generation (2001 - 2005)',
  chassisCode: 'JCE10',
  japaneseSibling: 'Toyota Altezza Gita / RS200 (SXE10)',
  engine: {
    code: '2JZ-GE',
    type: 'Naturally Aspirated DOHC 24-Valve Inline-6 with VVT-i',
    displacement: '2,997 cc (3.0 Liters)',
    boreStroke: '86.0 mm × 86.0 mm (Square 1:1 bore-to-stroke)',
    blockHead: 'Cast Iron (FC250) Deep-Skirt Block / Aluminum Crossflow Cylinder Head',
    compressionRatio: '10.5:1',
    horsepower: '215 hp (160 kW) @ 5,800 RPM',
    torque: '218 lb-ft (296 Nm) @ 3,800 RPM',
    redline: '6,400 RPM (Fuel cut at 6,500 RPM)',
    firingOrder: '1 - 5 - 3 - 6 - 2 - 4 (Perfect primary & secondary harmonic balance)',
    valvetrain: 'Belt-driven DOHC, 4 valves per cylinder, VVT-i on intake cam'
  },
  transmission: {
    manual: 'Toyota W55 5-Speed Manual (Close-ratio)',
    automatic: 'Aisin A650E 5-Speed Automatic with Steering Wheel E-Shift Buttons',
    clutch: 'Hydraulic dry single-plate with dual-mass flywheel',
    ratios: {
      first: 3.57,
      second: 1.90,
      third: 1.38,
      fourth: 1.00,
      fifth: 0.78,
      reverse: 4.04,
      finalDrive: 3.73 // 3.91 on automatic models
    }
  },
  drivetrain: {
    layout: 'FR (Front-Engine, Rear-Wheel Drive)',
    driveshaft: 'Two-piece steel propeller shaft with center support bearing',
    differential: 'Optional / Manual-standard Torsen Type-2 (T-2) Torque-Sensing LSD (M85 casing)'
  },
  chassisSuspension: {
    platform: 'Compact FR Sports Platform (derived from Toyota Crown / Mark II)',
    frontSuspension: 'Double Wishbone with high-mount upper arm, coil springs, gas dampers & anti-roll bar',
    rearSuspension: 'Multi-link / Double Wishbone with toe control link & anti-roll bar',
    steering: 'Engine-speed sensitive rack-and-pinion power steering (Ratio 15.7:1)',
    turningCircle: '10.4 m (34.1 ft)'
  },
  brakes: {
    front: '296 mm (11.7 in) Ventilated cast-iron discs with 2-piston sliding calipers',
    rear: '307 mm (12.1 in) Solid discs with single-piston calipers',
    systems: '4-sensor 3-channel ABS with Electronic Brakeforce Distribution (EBD) and Brake Assist (BA)'
  },
  dimensionsWeight: {
    curbWeight: '1,475 kg (3,255 lbs) Manual / 1,515 kg (3,340 lbs) Auto',
    weightDistribution: '54 : 46 Front:Rear',
    wheelbase: '2,670 mm (105.1 in)',
    length: '4,485 mm (176.6 in)',
    width: '1,720 mm (67.7 in)',
    height: '1,420 mm (55.9 in)',
    fuelTank: '66 Liters (17.4 US gal)'
  },
  specialFeatures: [
    'Chronograph watch-style instrument gauge cluster with built-in battery volt meter and fuel flow gauge',
    'Altezza clear-lens jewel taillights that sparked an entire 2000s automotive styling movement',
    'Legendary 2JZ cast-iron bottom end capable of supporting 500+ WHP on stock internals with turbo (NA-T) kit',
    'Perfect primary & secondary rotational harmonic balance inherent to Inline-6 cylinder architecture'
  ]
};

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What makes the Lexus IS300's 2JZ-GE Inline-6 engine renowned among automotive tuners?",
    options: [
      { text: "It uses a rotary wankel core with no pistons.", isCorrect: false },
      { text: "Its ultra-strong cast-iron (FC250) deep-skirt engine block can handle 500+ horsepower on stock internals when turbocharged (NA-T builds).", isCorrect: true },
      { text: "It was the first engine made entirely of plastic composites.", isCorrect: false },
      { text: "It does not require motor oil or cooling radiators.", isCorrect: false }
    ],
    explanation: "The 2JZ-GE in the IS300 shares its cast-iron cylinder block architecture with the twin-turbo Mk4 Toyota Supra (JZA80). Its heavy-duty deep-skirt block and forged steel crankshaft provide legendary durability for aftermarket turbocharging."
  },
  {
    id: 2,
    question: "Why does the Lexus IS300 Inline-6 have inherently smoother running harmonics than a V6 or Inline-4?",
    options: [
      { text: "Because it uses three spark plugs per cylinder.", isCorrect: false },
      { text: "Because an Inline-6 has inherent perfect primary and secondary harmonic balance, with mirror-image piston motions canceling out reciprocating vibrations.", isCorrect: true },
      { text: "Because the transmission spins in the opposite direction.", isCorrect: false },
      { text: "Because it only fires when the car turns right.", isCorrect: false }
    ],
    explanation: "In an inline-6 with firing order 1-5-3-6-2-4, cylinders 1&6, 2&5, and 3&4 move in tandem pairs 120° apart. All primary and secondary vertical forces and rocking moments naturally cancel each other out without needing heavy balance shafts."
  },
  {
    id: 3,
    question: "What is the purpose of the Torsen Type-2 (T-2) Limited-Slip Differential equipped on sport-package Lexus IS300s?",
    options: [
      { text: "It permanently locks the rear wheels at all times for drifting only.", isCorrect: false },
      { text: "It uses crossed helical worm gears to mechanically bias torque to the rear wheel with traction without using wearing clutch plates.", isCorrect: true },
      { text: "It cuts engine fuel whenever cornering g-forces exceed 0.2g.", isCorrect: false },
      { text: "It redirects exhaust gas into the rear tires to heat them up.", isCorrect: false }
    ],
    explanation: "The Torsen (TORque-SENsing) differential uses helical gears to multiply torque toward the tire that has grip, preventing the open-diff 'one-wheel peel' while preserving smooth, chirp-free street cornering."
  },
  {
    id: 4,
    question: "What iconic interior design feature was uniquely created for the first-generation Lexus IS300 (XE10)?",
    options: [
      { text: "A heads-up holographic windshield laser projector.", isCorrect: false },
      { text: "The Chronograph luxury wristwatch-style gauge cluster with inset voltage, water temperature, and MPG sub-dials.", isCorrect: true },
      { text: "A digital CRT television built into the center console.", isCorrect: false },
      { text: "A steering wheel with an integrated joystick instead of pedals.", isCorrect: false }
    ],
    explanation: "Chief engineer Nobuaki Katayama designed the IS300 instrument cluster to mimic a Swiss chronograph sports watch, featuring sub-dials for battery voltage, engine temperature, and instantaneous fuel economy nested inside the central speedometer."
  },
  {
    id: 5,
    question: "What suspension design gives the Lexus IS300 its celebrated sports car road handling and tire contact patch control?",
    options: [
      { text: "Four-wheel independent double-wishbone suspension front and rear.", isCorrect: true },
      { text: "Solid beam live truck axles front and back.", isCorrect: false },
      { text: "Pneumatic air bladders with no control arms.", isCorrect: false },
      { text: "Leaf springs mounted transversely.", isCorrect: false }
    ],
    explanation: "Unlike economy sedans with cheap MacPherson struts, the Lexus IS300 utilizes high-mount double wishbones at the front and a sophisticated multi-link double-wishbone setup at the rear, keeping tire contact patches optimal under high lateral g-loads."
  }
];
