import { test, expect } from '@playwright/test';

test.describe('How Cars Work - Comprehensive E2E Tests', () => {
  test('loads home page and default 3D Powertrain tab', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/How Cars Work/i);
    await expect(page.locator('h1')).toContainText('HOW CARS WORK');
    await expect(page.locator('text=Interactive 3D Powertrain & Chassis')).toBeVisible();
    await expect(page.locator('text=Parts:').first()).toBeVisible();
  });

  test('navigates to 4-Stroke Engine Simulator and tests Web Audio Synth', async ({ page }) => {
    await page.goto('/');
    await page.locator('header nav button:has-text("4-Stroke Engine"), header button:has-text("4-Stroke Engine")').first().click();
    await expect(page.locator('text=Interactive 4-Stroke Engine Simulator')).toBeVisible();
    await expect(page.locator('text=Acoustic Engine Harmonic Synthesizer')).toBeVisible();
    
    // Test audio synth button
    const audioBtn = page.locator('button:has-text("Start Audio Synthesizer")');
    await expect(audioBtn).toBeVisible();
    await audioBtn.click();
    await expect(page.locator('button:has-text("Mute Engine Audio")')).toBeVisible();
  });

  test('navigates to Turbocharger and interacts with wastegate and intercooler', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Turbocharger")').first().click();
    await expect(page.locator('text=Turbocharger & Forced Induction Physics')).toBeVisible();
    await expect(page.locator('button:has-text("Intercooler ACTIVE")')).toBeVisible();
    await page.click('button:has-text("Intercooler ACTIVE")');
    await expect(page.locator('button:has-text("Intercooler BYPASS")')).toBeVisible();
  });

  test('navigates to Transmission and tests gear selection', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Transmission")').first().click();
    await expect(page.locator('text=Transmission Gear Ratio & Torque Explorer')).toBeVisible();
    await page.click('button:has-text("Gear 5")');
    await expect(page.locator('text=Highway Cruising')).toBeVisible();
    await expect(page.locator('text=Gear Ratio: 0.72:1')).toBeVisible();
  });

  test('navigates to Differential Simulator and tests cornering switch', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Differential")').first().click();
    await expect(page.locator('text=The Open Differential Simulator')).toBeVisible();
    await page.click('button:has-text("Turning Left")');
    await expect(page.locator('text=Inside wheel slowed')).toBeVisible();
  });

  test('navigates to Braking & ABS Simulator and tests ABS toggle', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Braking & ABS")').first().click();
    await expect(page.locator('text=Hydraulic Disc Brakes & ABS Simulator')).toBeVisible();
    await page.click('button:has-text("ABS ENABLED")');
    await expect(page.locator('button:has-text("ABS DISABLED")')).toBeVisible();
  });

  test('navigates to Steering Kinematics', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Steering")').first().click();
    await expect(page.locator('text=Steering Kinematics & Ackermann Geometry')).toBeVisible();
    await expect(page.locator('text=Ackermann Compensation')).toBeVisible();
  });

  test('navigates to Suspension and tests road impulses', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Suspension")').first().click();
    await expect(page.locator('text=Suspension Dynamics: Springs & Dampers')).toBeVisible();
    await page.click('button:has-text("Speed Bump")');
    await expect(page.locator('text=Damping:')).toBeVisible();
  });

  test('navigates to Cooling & Oil Lubrication', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Cooling & Oil")').first().click();
    await expect(page.locator('text=Cooling & Hydrodynamic Lubrication Systems')).toBeVisible();
    await page.click('button:has-text("10W-60")');
    await expect(page.locator('text=3.9 µm')).toBeVisible();
  });

  test('navigates to Aerodynamics and tests vehicle body styles', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Aerodynamics")').first().click();
    await expect(page.locator('text=Automotive Aerodynamics & Drag Physics')).toBeVisible();
    await page.click('button:has-text("Track Supercar")');
    await expect(page.locator('text=Aerodynamic Downforce:')).toBeVisible();
  });

  test('navigates to ECU & CAN Bus and injects diagnostic trouble codes', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("ECU & CAN Bus")').first().click();
    await expect(page.locator('text=Automotive Electronics, CAN Bus & ECU Diagnostics')).toBeVisible();
    await page.click('button:has-text("MISFIRE")');
    await expect(page.locator('text=CHECK ENGINE (MIL) ILLUMINATED: P0302')).toBeVisible();
  });

  test('navigates to EV vs ICE comparison', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("EV vs ICE")').first().click();
    await expect(page.locator('text=EV vs Internal Combustion (ICE) Comparison')).toBeVisible();
    await expect(page.locator('text=Thermal Efficiency')).toBeVisible();
  });

  test('navigates to Knowledge Quiz and completes questions', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("Knowledge Quiz")').first().click();
    await expect(page.locator('text=Car Engineering Knowledge Quiz')).toBeVisible();
    const option = page.locator('button:has-text("narrow RPM band")');
    await expect(option).toBeVisible();
    await option.click();
    await expect(page.locator('text=Engineering Explanation:')).toBeVisible();
  });
});

test.describe('Mobile Viewport & Navigation Drawer Tests', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('renders mobile hamburger menu and navigates across modules', async ({ page }) => {
    await page.goto('/');
    const mobileBtn = page.locator('button[aria-label="Toggle Navigation Menu"]');
    await expect(mobileBtn).toBeVisible();

    // Open menu drawer
    await mobileBtn.click();
    await expect(page.locator('text=Select Vehicle System Module:')).toBeVisible();

    // Click Turbocharger from drawer using role selector
    await page.getByRole('button', { name: 'Turbocharger Boost' }).click();
    await expect(page.locator('text=Turbocharger & Forced Induction Physics')).toBeVisible();

    // Open menu again and select Knowledge Quiz
    await mobileBtn.click();
    await page.getByRole('button', { name: 'Knowledge Quiz Quiz' }).click();
    await expect(page.locator('text=Car Engineering Knowledge Quiz')).toBeVisible();
  });
});
