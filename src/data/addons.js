// Bolt-on extensions for the IS300. Weight and drag are rough example values for a car like this one.
export const BASE_CD = 0.28;
export const BASE_CLEARANCE = 135; // mm, lowest point of the stock body
export const ADDON_GROUPS = ['Aero', 'Stance and looks', 'Practical'];

export const ADDONS = [
  {
    id: 'lip', group: 'Aero', name: 'Front lip', weight: 3, cd: -0.004,
    what: 'A thin blade under the front bumper. It stops some air from slipping under the car, so the nose lifts less at speed.',
    catch: 'It hangs below the bumper right at the front, so steep driveways catch it first.',
  },
  {
    id: 'skirts', group: 'Aero', name: 'Side skirts', weight: 6, cd: -0.002, lowest: 100,
    what: 'Panels along the bottom of the doors. They block air from rushing in under the sides of the car.',
    catch: 'They sit close to the ground and crack easily on high kerbs.',
  },
  {
    id: 'diffuser', group: 'Aero', name: 'Rear diffuser', weight: 4, cd: -0.003,
    what: 'Fins under the rear bumper. They let the fast air under the car slow down gently as it leaves, which pulls the back down a little.',
    catch: 'Under a road car with a bumpy floor the effect is small.',
    conflicts: { hitch: 'A diffuser and a tow hitch need the same space under the rear bumper.' },
  },
  {
    id: 'wing', group: 'Aero', name: 'Rear wing', weight: 7, cd: 0.012,
    what: 'An upside-down aeroplane wing. Moving air pushes it down, pressing the rear tyres into the road for more grip.',
    catch: 'It adds drag all the time but only helps at high speed. Below about 100 km/h you will barely feel it.',
  },
  {
    id: 'lowering', group: 'Stance and looks', name: 'Lowering springs', weight: 0, cd: -0.006, ride: -40,
    what: 'Shorter, stiffer springs drop the body about 40 mm. The car sits lower and leans less in corners.',
    catch: 'The ride gets firmer, and speed bumps and car park ramps become a problem.',
  },
  {
    id: 'tint', group: 'Stance and looks', name: 'Window tint', weight: 0, cd: 0,
    what: 'A dark film on the windows. It keeps the cabin cooler and blocks most UV light.',
    catch: 'Many countries limit how dark the front windows can be, and it is harder to see out at night.',
  },
  {
    id: 'roofbox', group: 'Practical', name: 'Roof box', weight: 20, cd: 0.04,
    what: 'A pod on roof bars that adds room for luggage.',
    catch: 'It catches a lot of air, so fuel use rises at highway speed. The car is also taller, so watch car park height limits.',
  },
  {
    id: 'hitch', group: 'Practical', name: 'Tow hitch', weight: 18, cd: 0.002,
    what: 'A bar and ball at the back that let the car pull a small trailer.',
    catch: 'It adds weight at the very back of the car.',
    conflicts: { diffuser: 'A tow hitch and a diffuser need the same space under the rear bumper.' },
  },
];
export const ADDON_BY_ID = Object.fromEntries(ADDONS.map(a => [a.id, a]));
