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
    "id": 1,
    "lessonId": "engine",
    "lessonLabel": "Engine",
    "question": "Which stroke gets its push from burning fuel?",
    "options": [
      {
        "text": "Intake: the piston draws in air and fuel.",
        "isCorrect": false
      },
      {
        "text": "Power: expanding gas pushes the piston down.",
        "isCorrect": true
      },
      {
        "text": "Exhaust: the piston pushes used gases out.",
        "isCorrect": false
      }
    ],
    "explanation": "During the power stroke, the burning mixture expands and pushes the piston down. The connecting rod transfers that movement to the crankshaft. Intake and exhaust prepare the cylinder for the next cycle."
  },
  {
    "id": 2,
    "lessonId": "transmission",
    "lessonLabel": "Gears",
    "question": "Keep engine speed the same and shift from first to fifth. What changes?",
    "options": [
      {
        "text": "The wheels turn more slowly with more turning force.",
        "isCorrect": false
      },
      {
        "text": "The gearbox creates extra engine power.",
        "isCorrect": false
      },
      {
        "text": "The wheels turn faster with less turning force.",
        "isCorrect": true
      }
    ],
    "explanation": "Higher gears give more wheel speed for the same engine speed. The trade-off is less turning force at the wheels. First gear gives more turning force to help the car start moving."
  },
  {
    "id": 3,
    "lessonId": "differential",
    "lessonLabel": "Differential",
    "question": "The car turns left. Why does the right rear wheel turn faster?",
    "options": [
      {
        "text": "It travels farther around the outside of the bend.",
        "isCorrect": true
      },
      {
        "text": "It is closer to the center of the bend.",
        "isCorrect": false
      },
      {
        "text": "The differential locks both wheels together.",
        "isCorrect": false
      }
    ],
    "explanation": "The right wheel is on the outside of a left turn. It follows a longer path in the same time, so it must turn faster. The differential allows this difference."
  },
  {
    "id": 4,
    "lessonId": "suspension",
    "lessonLabel": "Suspension",
    "question": "What helps stop the car from bouncing after a bump?",
    "options": [
      {
        "text": "The differential, by changing wheel speeds.",
        "isCorrect": false
      },
      {
        "text": "The damper, by resisting suspension movement.",
        "isCorrect": true
      },
      {
        "text": "The spring alone, by pushing back without losing energy.",
        "isCorrect": false
      }
    ],
    "explanation": "The spring compresses and then pushes back. The damper resists the movement and dissipates energy, so the bouncing settles."
  },
  {
    "id": 5,
    "lessonId": "aero",
    "lessonLabel": "Air resistance",
    "question": "With the same body shape and air conditions, what happens to drag when speed doubles?",
    "options": [
      {
        "text": "It stays the same.",
        "isCorrect": false
      },
      {
        "text": "It doubles.",
        "isCorrect": false
      },
      {
        "text": "It becomes about four times as large.",
        "isCorrect": true
      }
    ],
    "explanation": "Drag depends on speed squared. Doubling speed gives 2 × 2, or four times the drag. Moving against that force at twice the speed takes about eight times the power."
  }
];
