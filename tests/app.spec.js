import { test, expect } from '@playwright/test';

async function openLesson(page, name) {
  await page.getByRole('button', { name: 'Toggle Navigation Menu' }).click();
  await page.getByRole('dialog').getByRole('link', { name, exact: true }).click();
}

test.describe('Vroom lessons', () => {
  test('loads home page with Lexus IS300 3D Powertrain tab', async ({ page }) => {
    await page.goto('/#chassis');
    await expect(page).toHaveTitle(/Vroom/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Take the car apart');
    await expect(page.getByRole('group', { name: 'Explore chassis parts' })).toBeVisible();
  });

  test('navigates to 2JZ-GE Engine and tests Inline-6 Audio Synth', async ({ page }) => {
    await page.goto('/');
    await openLesson(page, 'Engine');
    await expect(page.locator('text=The four engine strokes')).toBeVisible();
    await expect(page.locator('text=Hear how engine speed changes the sound')).toBeVisible();
    
    const audioBtn = page.locator('button:has-text("Play engine sound")');
    await expect(audioBtn).toBeVisible();
    await audioBtn.click();
    await expect(page.locator('button:has-text("Mute")')).toBeVisible();
  });

  test('navigates to 2JZ Turbo (NA-T) Build Simulator', async ({ page }) => {
    await page.goto('/');
    await openLesson(page, 'Turbocharger');
    await expect(page.locator('text=Try a turbocharger')).toBeVisible();
    const intercooler = page.getByRole('switch', { name: 'Intercooler' });
    await expect(intercooler).toHaveAttribute('aria-checked', 'true');
    await intercooler.click();
    await expect(intercooler).toHaveAttribute('aria-checked', 'false');
  });

  test('navigates to W55 5-Speed Transmission and tests gear ratios', async ({ page }) => {
    await page.goto('/');
    await openLesson(page, 'Gears');
    await expect(page.locator('text=Try the five gears')).toBeVisible();
    await page.click('button:has-text("Gear 5")');
    await expect(page.locator('text=Cruising in fifth')).toBeVisible();
    await expect(page.locator('text=Ratio: 0.78:1')).toBeVisible();
  });

  test('navigates to Torsen T-2 LSD Simulator', async ({ page }) => {
    await page.goto('/');
    await openLesson(page, 'Differential');
    await expect(page.locator('text=Compare wheel speeds in a turn')).toBeVisible();
    await page.click('button:has-text("Turn left")');
    await expect(page.locator('text=The outside wheel turns faster')).toBeVisible();
  });

  test('navigates to Braking & ABS Simulator', async ({ page }) => {
    await page.goto('/');
    await openLesson(page, 'Brakes & ABS');
    await expect(page.locator('text=Try the brake pedal')).toBeVisible();
    const abs = page.getByRole('switch', { name: 'ABS' });
    await abs.click();
    await expect(abs).toHaveAttribute('aria-checked', 'false');
  });

  test('navigates to Steering Kinematics', async ({ page }) => {
    await page.goto('/');
    await openLesson(page, 'Steering');
    await expect(page.locator('text=Turn the front wheels')).toBeVisible();
  });

  test('navigates to 4-Wheel Double-Wishbone Suspension', async ({ page }) => {
    await page.goto('/');
    await openLesson(page, 'Suspension');
    await expect(page.locator('text=Try a bump in the road')).toBeVisible();
    await page.click('button:has-text("Speed bump")');
    await expect(page.getByText('Damping:', { exact: true })).toBeVisible();
  });

  test('navigates to 2JZ Cooling & oil Lubrication', async ({ page }) => {
    await page.goto('/');
    await openLesson(page, 'Cooling & oil');
    await expect(page.locator('text=Compare cooling and lubrication')).toBeVisible();
    await page.click('button:has-text("10W-40")');
    await expect(page.locator('text=Example oil film:')).toBeVisible();
  });

  test('navigates to Aerodynamics (0.28 Cd)', async ({ page }) => {
    await page.goto('/');
    await openLesson(page, 'Air resistance');
    await expect(page.locator('text=Compare speed and air resistance')).toBeVisible();
    await page.click('button:has-text("Sedan with spoiler")');
    await expect(page.locator('text=Example downforce:')).toBeVisible();
  });

  test('navigates to Denso ECM & MPX Diagnostics', async ({ page }) => {
    await page.goto('/');
    await openLesson(page, 'Sensors & faults');
    await expect(page.locator('text=Try a fault example')).toBeVisible();
    await page.click('button:has-text("Misfire")');
    await expect(page.locator('text=Fault code: P0302')).toBeVisible();
  });

  test('navigates to EV vs 2JZ ICE comparison', async ({ page }) => {
    await page.goto('/');
    await openLesson(page, 'Gas vs electric');
    await expect(page.locator('text=Compare gasoline and electric power')).toBeVisible();
    await expect(page.getByText('Imagine starting with 100 units', { exact: false })).toBeVisible();
  });

  test('navigates to IS300 Quick quiz', async ({ page }) => {
    await page.goto('/');
    await openLesson(page, 'Quick quiz');
    await expect(page.locator('text=Five questions about how cars work')).toBeVisible();
    const option = page.locator('button:has-text("Power: expanding gas pushes the piston down.")');
    await expect(option).toBeVisible();
    await option.click();
    await expect(page.locator('text=Here is why:')).toBeVisible();
  });
});

test.describe('Mobile Viewport & Navigation Drawer Tests', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('renders mobile hamburger menu and navigates across IS300 modules', async ({ page }) => {
    await page.goto('/');
    const mobileBtn = page.locator('button[aria-label="Toggle Navigation Menu"]');
    await expect(mobileBtn).toBeVisible();

    await mobileBtn.click();
    await page.getByRole('dialog').getByRole('link', { name: 'Turbocharger', exact: true }).click();
    await expect(page.locator('text=Try a turbocharger')).toBeVisible();

    await mobileBtn.click();
    await page.getByRole('dialog').getByRole('link', { name: 'Quick quiz', exact: true }).click();
    await expect(page.locator('text=Five questions about how cars work')).toBeVisible();
  });
});


test('topic URLs survive refresh and browser history; next step moves focus', async ({ page }) => {
  await page.goto('/#engine');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How the engine makes the wheels turn');
  await page.getByRole('button', { name: 'Next topic: Turbocharger' }).click();
  await expect(page).toHaveURL(/#turbo$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How a turbo pushes more air into the engine');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How the engine makes the wheels turn');
  await page.goto('/#unknown-topic');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How a car really works.');
});

test('mobile topic dialog traps focus, closes on Escape, and restores the trigger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Toggle Navigation Menu' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.getByRole('dialog').getByRole('link', { name: 'Engine', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  const slider = page.getByRole('slider', { name: 'Engine speed', exact: true });
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveValue('1300');
});

test('every topic fits a narrow phone and loads without runtime errors', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const topic of ['home', 'chassis', 'engine', 'turbo', 'transmission', 'differential', 'brakes', 'steering', 'suspension', 'grip', 'cooling', 'aero', 'electronics', 'addons', 'ev', 'quiz']) {
    await page.goto('/#' + topic);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), topic).toBeTruthy();
    for (const header of await page.locator('[data-slot=card-header]').all()) {
      expect((await header.boundingBox()).height, topic + ' header').toBeLessThan(320);
    }
    for (const paragraph of await page.locator('.simulation-content p').all()) {
      if (await paragraph.isVisible()) expect(await paragraph.evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
    }
    for (const slider of await page.getByRole('slider').all()) {
      await expect(slider).toHaveAccessibleName(/.+/);
    }
  }
  expect(errors).toEqual([]);
});

test('chassis controls communicate state and part details remain available', async ({ page }) => {
  await page.goto('/#chassis');
  const orbit = page.getByRole('button', { name: 'Auto-rotate', exact: true });
  await expect(orbit).toHaveAttribute('aria-pressed', 'true');
  await orbit.click();
  await expect(orbit).toHaveAttribute('aria-pressed', 'false');
  const exploded = page.getByRole('button', { name: 'Exploded view', exact: true });
  await exploded.click();
  await expect(exploded).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Transmission', exact: true }).last().click();
  await expect(page.getByText('Five-speed gearbox', { exact: true })).toBeVisible();
});

test('3D failure leaves navigation and part information usable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type.startsWith('webgl') ? null : original.call(this, type, ...args);
    };
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How a car really works.');
  await page.getByRole('button', { name: 'Start learning' }).click();
  await expect(page.getByText('3D view unavailable')).toBeVisible();
  await page.getByRole('button', { name: 'Transmission', exact: true }).last().click();
  await expect(page.getByText('Five-speed gearbox', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next topic: Engine' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How the engine makes the wheels turn');
});

test('save desktop and mobile UX review screenshots', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('.hero-car-ready canvas')).toBeVisible({ timeout: 60000 });
  await page.screenshot({ path: testInfo.outputPath('desktop.png'), fullPage: true, animations: 'disabled' });
  await page.goto('/#brakes');
  await page.screenshot({ path: testInfo.outputPath('lesson-desktop.png'), fullPage: true, animations: 'disabled' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.screenshot({ path: testInfo.outputPath('mobile.png'), fullPage: true, animations: 'disabled' });
  await page.goto('/#engine');
  await page.screenshot({ path: testInfo.outputPath('engine-mobile.png'), fullPage: true, animations: 'disabled' });
  await page.goto('/#quiz');
  await page.getByRole('button', { name: 'Power: expanding gas pushes the piston down.', exact: true }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath('quiz-mobile.png'), fullPage: true, animations: 'disabled' });
});


test('keyboard skip link keeps the current topic and focuses content', async ({ page }) => {
  await page.goto('/#engine');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await expect(page).toHaveURL(/#engine$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How the engine makes the wheels turn');
});

test('landing leads into lessons and the home logo returns to it', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How a car really works.');
  await page.getByRole('link', { name: 'See all lessons' }).click();
  await expect(page.getByRole('heading', { name: 'Pick any lesson, or start at one.' })).toBeInViewport();
  await page.locator('#lessons').getByRole('link', { name: /^Brakes & ABS:/ }).click();
  await expect(page).toHaveURL(/#brakes$/);
  await expect(page.getByLabel('Lesson 6 of 15')).toBeVisible();
  await page.getByRole('link', { name: 'Vroom home' }).click();
  await expect(page).not.toHaveURL(/#/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How a car really works.');
  await page.locator('.route-steps').getByRole('link', { name: /Gearbox/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Why a car needs different gears');
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How a car really works.');
});

test('progress tracking records visited lessons and reset clears it', async ({ page }) => {
  await page.goto('/');
  // No progress yet: the hero shows Start learning and no meter.
  await expect(page.getByRole('button', { name: 'Start learning' })).toBeVisible();
  await expect(page.getByLabel(/lessons explored/)).toHaveCount(0);

  // Visit two lessons.
  await page.goto('/#engine');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How the engine makes the wheels turn');
  await page.goto('/#brakes');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How pressing a pedal slows the car');

  // Back home, the meter reflects the two visited lessons and the curriculum marks them.
  await page.goto('/');
  await expect(page.getByLabel('2 of 15 lessons explored')).toBeVisible();
  await expect(page.locator('#lessons .lesson-row[data-done]')).toHaveCount(2);
  await expect(page.locator('.hero-actions').getByRole('button', { name: 'Continue', exact: true })).toBeVisible();

  // Reset clears progress and the meter disappears.
  await page.getByRole('button', { name: 'Reset progress' }).click();
  await expect(page.getByLabel(/lessons explored/)).toHaveCount(0);
  await expect(page.locator('#lessons .lesson-row[data-done]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Start learning' })).toBeVisible();
});

test('the decorative hero model never blocks scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const hero = page.locator('.hero-visual');
  await hero.scrollIntoViewIfNeeded();
  const box = await hero.boundingBox();
  const before = await page.evaluate(() => scrollY);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 200);
});

test('complete the quiz and start again on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#quiz');
  const card = page.locator('[data-slot="card"]');
  for (let question = 0; question < 5; question++) {
    await card.locator('button.w-full').first().click();
    await expect(page.getByText('Here is why:')).toBeVisible();
    if (question < 4) await page.getByRole('button', { name: 'Next question' }).click();
  }
  await page.getByRole('button', { name: 'See my score' }).click();
  await expect(page.getByText('You have finished the quiz')).toBeVisible();
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByText('Question 1 of 5')).toBeVisible();
  await expect(card.locator('button.w-full').first()).toBeEnabled();
});


test('beginner can open definitions and see the selected engine stroke', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#engine');
  await page.getByText('What do these words mean?', { exact: true }).click();
  await expect(page.getByText('Revolutions per minute:', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: '1. Intake' }).click();
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeVisible();
  const position = () => page.getByTestId('engine-piston').getAttribute('transform').then(value => Number(value.split(',')[1].replace(')', '')));
  const earlyIntake = await position();
  await page.getByRole('button', { name: '2. Compression' }).click();
  const earlyCompression = await position();
  expect(earlyIntake).toBeLessThan(earlyCompression);
  await expect(page.getByRole('heading', { name: 'What to remember' })).toBeVisible();
});

test('quiz explains a wrong answer and links to a lesson without losing the answer', async ({ page, context }) => {
  await page.goto('/#quiz');
  await expect(page.getByRole('button', { name: 'Next question' })).toBeDisabled();
  await page.getByRole('button', { name: 'Intake: the piston draws in air and fuel.', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Not quite. Here is why:');
  const lessonPromise = context.waitForEvent('page');
  await page.getByRole('link', { name: 'Review: Engine' }).click();
  const lesson = await lessonPromise;
  await expect(lesson).toHaveURL(/#engine$/);
  await expect(lesson.getByRole('heading', { level: 1 })).toHaveText('How the engine makes the wheels turn');
  await lesson.close();
  await expect(page.getByRole('status')).toContainText('Not quite.');
  await page.getByRole('button', { name: 'Next question' }).click();
  await expect(page.getByText('Question 2 of 5')).toBeVisible();
});

test('lesson exercises produce the observations described in the text', async ({ page }) => {
  await page.goto('/#brakes');
  const brake = page.getByRole('slider', { name: 'Brake pedal pressure' });
  await brake.fill('90');
  await page.getByRole('switch', { name: 'ABS' }).click();
  await expect(page.getByText('Wheel locked: the tire is sliding')).toBeVisible();
  await page.getByRole('switch', { name: 'ABS' }).click();
  await expect(page.getByText('ABS is adjusting brake pressure')).toBeVisible();
  await page.goto('/#cooling');
  await page.getByRole('switch', { name: 'Thermostat open' }).click();
  await expect(page.getByText('Temperature is too high')).toBeVisible();
});

test('every lesson diagram responds to its controls', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const diagram = () => page.locator('.simulation-content .diagram').first();
  const snapshot = async () => (await diagram().innerHTML()).replace(/rotate\([^)]*\)|stroke-dashoffset="[^"]*"/g, '');

  await page.goto('/#transmission');
  const gear1 = await snapshot();
  await page.getByRole('button', { name: 'Gear 5' }).click();
  expect(await snapshot()).not.toEqual(gear1);

  await page.goto('/#differential');
  await page.getByRole('button', { name: 'Turn left' }).click();
  await expect(diagram()).toContainText('140 RPM');
  await expect(diagram()).toContainText('60 RPM');

  await page.goto('/#steering');
  await page.getByRole('slider', { name: 'Steering angle' }).fill('-30');
  await expect(diagram()).toContainText('Left 38°');

  await page.goto('/#brakes');
  await page.getByRole('slider', { name: 'Brake pedal pressure' }).fill('92');
  await expect(diagram()).toContainText('101 bar');

  await page.goto('/#cooling');
  await page.getByRole('switch', { name: 'Thermostat open' }).click();
  await expect(diagram()).toContainText('Thermostat closed');

  await page.goto('/#aero');
  const sedan = await snapshot();
  await page.getByRole('button', { name: 'Large SUV' }).click();
  expect(await snapshot()).not.toEqual(sedan);

  await page.goto('/#electronics');
  await page.getByRole('button', { name: 'Wheel sensor' }).click();
  await expect(page.locator('.diagram-footer')).toContainText('C0200');

  // Tyre grip: combined demand uses grip, and a slippery surface shrinks the circle.
  await page.goto('/#grip');
  await page.getByRole('slider', { name: 'Cornering force' }).fill('90');
  await page.getByRole('slider', { name: 'Braking or accelerating' }).fill('-90');
  await expect(page.locator('.diagram-footer')).toContainText('the tyre slides');
  const dryGrip = await snapshot();
  await page.getByRole('button', { name: 'Ice', exact: true }).click();
  expect(await snapshot()).not.toEqual(dryGrip);

  // Suspension: weak damping should keep the body moving after a bump.
  await page.goto('/#suspension');
  await page.getByRole('slider', { name: 'Damper rebound' }).fill('10');
  await expect(page.locator('.diagram-footer')).toContainText('Too little');
  // Retry the bump until the trace shows it; under heavy load a single frame can be skipped.
  const swing = async () => {
    const d = await page.locator('.simulation-content .diagram .body-trace').getAttribute('d');
    const ys = (d.match(/,(-?[\d.]+)/g) || []).map(v => Number(v.slice(1)));
    return ys.length ? Math.max(...ys) - Math.min(...ys) : 0;
  };
  await expect.poll(async () => {
    if ((await swing()) <= 20) await page.getByRole('button', { name: 'Speed bump' }).click();
    return swing();
  }, { timeout: 15000, intervals: [700] }).toBeGreaterThan(20);
  expect(errors).toEqual([]);
});

test('3D part buttons move the camera and the engine view frames the engine', async ({ page }) => {
  await page.goto('/#chassis');
  await expect(page.locator('.chassis-stage canvas')).toBeVisible();
  await page.locator('.part-picker').getByRole('button', { name: 'Brakes' }).click();
  await expect(page.locator('.part-picker').getByRole('button', { name: 'Brakes' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Auto-rotate' })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Engine', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Engine', exact: true }).first()).toHaveAttribute('aria-pressed', 'true');
});


test('choosing a part shows where it sits on the car, and tapping the car finds a part', async ({ page }) => {
  test.setTimeout(60000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#chassis');
  const stage = page.locator('.chassis-stage');
  const callout = page.locator('.part-callout');
  await expect(stage.locator('canvas')).toBeVisible();
  await expect(callout).toHaveClass(/is-visible/, { timeout: 30000 });
  await expect(callout).toContainText('Under the bonnet');

  await page.locator('.part-picker').getByRole('button', { name: 'Differential' }).click();
  await expect(callout).toContainText('Between the rear wheels');
  await expect(callout).toHaveClass(/is-visible/);

  // From the top view, tap where the engine callout pointed: the engine is selected again.
  // Headless WebGL renders slowly, so wait for the camera to settle before reading positions.
  const settled = async () => {
    let last = '';
    await expect.poll(async () => {
      const now = await callout.evaluate(el => el.style.translate);
      const same = now === last;
      last = now;
      return same;
    }, { timeout: 20000, intervals: [600] }).toBe(true);
    return last.split(' ').map(parseFloat);
  };
  await page.locator('.part-picker').getByRole('button', { name: 'Engine' }).click();
  await page.getByRole('button', { name: 'Top', exact: true }).click();
  await expect(callout).toHaveClass(/is-visible/);
  const [x, y] = await settled();
  await page.locator('.part-picker').getByRole('button', { name: 'Exhaust' }).click();
  await page.getByRole('button', { name: 'Top', exact: true }).click();
  await expect(callout).toContainText('out the back');
  await settled();
  await stage.locator('canvas').click({ position: { x, y } });
  await expect(page.locator('.part-picker').getByRole('button', { name: 'Engine' })).toHaveAttribute('aria-pressed', 'true');
  await expect(callout).toContainText('Under the bonnet');
  expect(errors).toEqual([]);
});


test('segmented controls and switches work from the keyboard', async ({ page }) => {
  await page.goto('/#transmission');
  const gear1 = page.getByRole('button', { name: 'Gear 1', exact: true });
  await gear1.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('button', { name: 'Gear 2', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: 'Gear 2', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('button', { name: 'Gear 5', exact: true })).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/#cooling');
  const thermostat = page.getByRole('switch', { name: 'Thermostat open' });
  await thermostat.focus();
  await page.keyboard.press('Space');
  await expect(thermostat).toHaveAttribute('aria-checked', 'false');
  await expect(page.locator('.diagram')).toContainText('Thermostat closed');
});

test('keyboard shortcuts page between lessons, open the help, and never hijack a slider', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 860 });
  await page.goto('/#engine');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How the engine makes the wheels turn');

  // Right/left arrows move between lessons when focus is not in a field.
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/#turbo$/);
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(/#engine$/);

  // "?" opens the shortcuts dialog and Escape closes it.
  await page.keyboard.press('Shift+/');
  const dialog = page.getByRole('dialog', { name: 'Keyboard shortcuts' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);

  // A focused slider keeps its own arrow-key behaviour; the lesson does not change.
  const slider = page.getByRole('slider', { name: 'Engine speed', exact: true });
  await slider.focus();
  const before = await slider.inputValue();
  await page.keyboard.press('ArrowRight');
  await expect(slider).not.toHaveValue(before);
  await expect(page).toHaveURL(/#engine$/);
});

test('reduced motion keeps the landing content fully visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How a car really works.');
  const opacity = await page.locator('.hero-copy').evaluate(el => getComputedStyle(el).opacity);
  expect(Number(opacity)).toBe(1);
});


test('landing car loads the compressed model and credits its author', async ({ page }) => {
  const responses = [];
  page.on('response', r => { if (r.url().endsWith('.glb')) responses.push({ status: r.status(), size: Number(r.headers()['content-length'] || 0) }); });
  await page.goto('/');
  await expect(page.locator('.hero-car-ready canvas')).toBeVisible({ timeout: 60000 });
  expect(responses[0]?.status).toBe(200);
  expect(responses[0].size).toBeLessThan(1_000_000);
  await expect(page.locator('.app-footer')).toContainText('CC BY 4.0');
});


test.describe('phone layout', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('bottom bar moves between lessons, the sheet drags closed, and home offers to continue', async ({ page }) => {
    test.setTimeout(90000);
    await page.goto('/');
    const dock = page.locator('.mobile-dock');
    await expect(dock).toBeVisible();
    await expect(page.locator('.app-header .menu-button')).toHaveCount(0);
    await dock.getByRole('button', { name: 'Start learning' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Take the car apart');

    await dock.getByRole('button', { name: 'Next topic: Engine' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('How the engine makes the wheels turn');
    await expect(dock).toContainText('02 of 15');
    await dock.getByRole('button', { name: 'Previous topic: Car overview' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Take the car apart');

    // The lesson list opens as a bottom sheet; dragging its grabber down closes it.
    await dock.getByRole('button', { name: 'Toggle Navigation Menu' }).click();
    const sheet = page.getByRole('dialog');
    await expect(sheet).toHaveClass(/menu-sheet/);
    const handle = await sheet.locator('.menu-heading').boundingBox();
    await page.mouse.move(handle.x + 40, handle.y + 20);
    await page.mouse.down();
    await page.mouse.move(handle.x + 40, handle.y + 260, { steps: 8 });
    await page.mouse.up();
    await expect(sheet).toHaveCount(0);

    await dock.getByRole('button', { name: 'Toggle Navigation Menu' }).click();
    await page.getByRole('dialog').getByRole('link', { name: 'Brakes & ABS', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('How pressing a pedal slows the car');

    await page.goto('/');
    await expect(dock.getByRole('button', { name: /Continue/ })).toContainText('Brakes & ABS');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
});


test('fitting add-ons changes the numbers, conflicting parts swap, and stock resets', async ({ page }) => {
  test.setTimeout(60000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Toggle Navigation Menu' }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'Add-ons', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('What you can bolt onto a car');
  await expect(page.locator('.garage-stage canvas')).toBeVisible();

  const stats = page.locator('.garage-stats');
  await expect(stats).toContainText('0 kg');
  await expect(stats).toContainText('135 mm');

  const wing = page.getByRole('button', { name: 'Rear wing', exact: true });
  await wing.click();
  await expect(wing).toHaveAttribute('aria-pressed', 'true');
  await expect(stats).toContainText('+7 kg');
  await expect(stats).toContainText('+4%');
  await expect(page.locator('.garage-detail')).toContainText('The catch');

  await page.getByRole('button', { name: 'Lowering springs', exact: true }).click();
  await expect(stats).toContainText('95 mm');

  // The diffuser and the tow hitch share the space under the rear bumper.
  const diffuser = page.getByRole('button', { name: 'Rear diffuser', exact: true });
  const hitch = page.getByRole('button', { name: 'Tow hitch', exact: true });
  await diffuser.click();
  await hitch.click();
  await expect(hitch).toHaveAttribute('aria-pressed', 'true');
  await expect(diffuser).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.garage-note')).toContainText('Rear diffuser removed');

  await page.getByRole('button', { name: 'Back to stock' }).click();
  await expect(stats).toContainText('0 kg');
  await expect(page.locator('.addon-toggle[aria-pressed="true"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});
