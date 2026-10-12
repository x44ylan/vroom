import { test, expect } from '@playwright/test';

test.describe('Lexus IS300 (XE10) Engineering Guide - E2E Tests', () => {
  test('loads home page with Lexus IS300 3D Powertrain tab', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Lexus IS300/i);
    await expect(page.locator('text=Lexus IS300 (XE10) 3D Chassis & 2JZ Powertrain')).toBeVisible();
    await expect(page.locator('text=Parts:').first()).toBeVisible();
  });

  test('navigates to 2JZ-GE Engine and tests Inline-6 Audio Synth', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("2JZ Engine")').first().click();
    await expect(page.locator('text=Interactive 4-Stroke Engine Simulator')).toBeVisible();
    await expect(page.locator('text=2JZ-GE Acoustic Exhaust Harmonics Synthesizer')).toBeVisible();
    
    const audioBtn = page.locator('button:has-text("Start Audio Synthesizer")');
    await expect(audioBtn).toBeVisible();
    await audioBtn.click();
    await expect(page.locator('button:has-text("Mute Engine Audio")')).toBeVisible();
  });

  test('navigates to 2JZ Turbo (NA-T) Build Simulator', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("NA-T Turbo")').first().click();
    await expect(page.locator('text=2JZ-GE Turbo Conversion (NA-T Build Simulator)')).toBeVisible();
    await expect(page.locator('button:has-text("Intercooler ACTIVE")')).toBeVisible();
    await page.click('button:has-text("Intercooler ACTIVE")');
    await expect(page.locator('button:has-text("Intercooler BYPASS")')).toBeVisible();
  });

  test('navigates to W55 5-Speed Transmission and tests gear ratios', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Transmission")').first().click();
    await expect(page.locator('text=Lexus IS300 W55 5-Speed Transmission')).toBeVisible();
    await page.click('button:has-text("Gear 5")');
    await expect(page.locator('text=Highway Cruising')).toBeVisible();
    await expect(page.locator('text=Ratio: 0.78:1')).toBeVisible();
  });

  test('navigates to Torsen T-2 LSD Simulator', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Torsen LSD")').first().click();
    await expect(page.locator('text=Lexus IS300 Torsen T-2 LSD vs Open Differential')).toBeVisible();
    await page.click('button:has-text("Turning Left")');
    await expect(page.locator('text=Outer wheel speeds up smoothly')).toBeVisible();
  });

  test('navigates to Braking & ABS Simulator', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Brakes & ABS")').first().click();
    await expect(page.locator('text=Hydraulic Disc Brakes & ABS Simulator')).toBeVisible();
    await page.click('button:has-text("ABS ENABLED")');
    await expect(page.locator('button:has-text("ABS DISABLED")')).toBeVisible();
  });

  test('navigates to Steering Kinematics', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Steering")').first().click();
    await expect(page.locator('text=Steering Kinematics & Ackermann Geometry')).toBeVisible();
  });

  test('navigates to 4-Wheel Double-Wishbone Suspension', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Suspension")').first().click();
    await expect(page.locator('text=Lexus IS300 4-Wheel Double-Wishbone Suspension')).toBeVisible();
    await page.click('button:has-text("Speed Bump")');
    await expect(page.locator('text=Damping:')).toBeVisible();
  });

  test('navigates to 2JZ Cooling & Oil Lubrication', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Cooling & Oil")').first().click();
    await expect(page.locator('text=2JZ-GE Cooling & Cast-Iron Oil Gallery Lubrication')).toBeVisible();
    await page.click('button:has-text("10W-40")');
    await expect(page.locator('text=Main Bearing Oil Film:')).toBeVisible();
  });

  test('navigates to Aerodynamics (0.28 Cd)', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Aerodynamics")').first().click();
    await expect(page.locator('text=Lexus IS300 Aerodynamics & High-Speed Highway Drag')).toBeVisible();
    await page.click('button:has-text("IS300 SportDesign with Rear Spoiler")');
    await expect(page.locator('text=Aerodynamic Downforce:')).toBeVisible();
  });

  test('navigates to Denso ECM & MPX Diagnostics', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Electronics")').first().click();
    await expect(page.locator('text=Lexus IS300 Denso ECM & Multiplex Communication')).toBeVisible();
    await page.click('button:has-text("MISFIRE")');
    await expect(page.locator('text=CHECK ENGINE (MIL): P0302')).toBeVisible();
  });

  test('navigates to EV vs 2JZ ICE comparison', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("EV Comparison")').first().click();
    await expect(page.locator('text=EV vs Internal Combustion (ICE) Comparison')).toBeVisible();
    await expect(page.locator('text=Thermal Efficiency')).toBeVisible();
  });

  test('navigates to IS300 Knowledge Quiz', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Knowledge Quiz")').first().click();
    await expect(page.locator('text=Car Engineering Knowledge Quiz')).toBeVisible();
    const option = page.locator('button:has-text("cast-iron (FC250) deep-skirt engine block")');
    await expect(option).toBeVisible();
    await option.click();
    await expect(page.locator('text=Engineering Explanation:')).toBeVisible();
  });
});

test.describe('Mobile Viewport & Navigation Drawer Tests', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('renders mobile hamburger menu and navigates across IS300 modules', async ({ page }) => {
    await page.goto('/');
    const mobileBtn = page.locator('button[aria-label="Toggle Navigation Menu"]');
    await expect(mobileBtn).toBeVisible();

    await mobileBtn.click();
    await page.getByRole('button', { name: 'NA-T Turbo Boost' }).click();
    await expect(page.locator('text=2JZ-GE Turbo Conversion (NA-T Build Simulator)')).toBeVisible();

    await mobileBtn.click();
    await page.getByRole('button', { name: 'Knowledge Quiz Test' }).click();
    await expect(page.locator('text=Car Engineering Knowledge Quiz')).toBeVisible();
  });
});
