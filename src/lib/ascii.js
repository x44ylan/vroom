// Monospace ASCII art for Vroom. Kept here so the console banner, the hero
// loading frame, and the WebGL fallback all draw from one source of truth.

// Side-profile sedan, drawn on a fixed grid so every row lines up in a
// monospace font. Used as a quiet placeholder while the 3D car loads and
// as the fallback when WebGL is unavailable.
export const CAR = String.raw`
                 ______________
            ____/ |   |   |    \___
       ____/      |   |   |        \____
   ,--/___________|___|___|_____________\--,
  //  _    .-------------------------.    _  \\
 ||  / \  /                           \  / \  ||
  \\_\o/_/_____________________________\_\o/_//
     '-'                                 '-'
`;

// Compact wordmark for the dev-tools console.
export const WORDMARK = String.raw`
 ██╗   ██╗██████╗  ██████╗  ██████╗ ███╗   ███╗
 ██║   ██║██╔══██╗██╔═══██╗██╔═══██╗████╗ ████║
 ██║   ██║██████╔╝██║   ██║██║   ██║██╔████╔██║
 ╚██╗ ██╔╝██╔══██╗██║   ██║██║   ██║██║╚██╔╝██║
  ╚████╔╝ ██║  ██║╚██████╔╝╚██████╔╝██║ ╚═╝ ██║
   ╚═══╝  ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝     ╚═╝`;

// Print the banner once to the console as an easter egg for anyone who looks
// under the hood. Grey on the site's near-black, so it stays on-brand.
export function printConsoleBanner() {
  if (typeof console === 'undefined') return;
  const ink = 'color:#fafafa;font-family:monospace;font-size:12px;line-height:1.25;';
  const dim = 'color:#8a8a8a;font-family:monospace;font-size:11px;';
  console.log(`%c${WORDMARK}`, ink);
  console.log('%cHow a car really works — 15 interactive lessons.', dim);
  console.log('%c> engine · gearbox · diff · brakes · grip · aero · ecu · ev', dim);
  console.log('%c> peek the source: https://github.com/x44ylan/vroom', dim);
}
