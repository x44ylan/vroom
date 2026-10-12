import { test, expect } from '@playwright/test';

test.describe('How Cars Work - App E2E Tests', () => {
  test('loads home page and default 3D Powertrain tab', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/How Cars Work/i);
    await expect(page.locator('h1')).toContainText('HOW CARS WORK');
    await expect(page.locator('text=Interactive 3D Powertrain & Chassis')).toBeVisible();
    await expect(page.locator('text=Inspect Parts:')).toBeVisible();
  });

  test('navigates to 4-Stroke Engine Simulator and interacts with controls', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("4-Stroke Engine")');
    await expect(page.locator('text=Interactive 4-Stroke Engine Simulator')).toBeVisible();
    await expect(page.locator('text=Engine Speed (RPM):')).toBeVisible();
    // Test pause/play button
    const pauseBtn = page.locator('button:has-text("Pause Motion")');
    await expect(pauseBtn).toBeVisible();
    await pauseBtn.click();
    await expect(page.locator('button:has-text("Start Engine")')).toBeVisible();
  });

  test('navigates to Transmission and tests gear selection', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Transmission")');
    await expect(page.locator('text=Transmission Gear Ratio & Torque Explorer')).toBeVisible();
    await expect(page.locator('text=Gear 1')).toBeVisible();
    // Click Gear 5
    await page.click('button:has-text("Gear 5")');
    await expect(page.locator('text=Highway Cruising')).toBeVisible();
    await expect(page.locator('text=Gear Ratio: 0.72:1')).toBeVisible();
  });

  test('navigates to Differential Simulator and tests cornering switch', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Differential")');
    await expect(page.locator('text=The Open Differential Simulator')).toBeVisible();
    await page.click('button:has-text("Turning Left")');
    await expect(page.locator('text=Inside wheel slowed')).toBeVisible();
  });

  test('navigates to Braking & ABS Simulator and tests ABS toggle', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Braking & ABS")');
    await expect(page.locator('text=Hydraulic Disc Brakes & ABS Simulator')).toBeVisible();
    await expect(page.locator('text=ABS ENABLED')).toBeVisible();
    await page.click('button:has-text("ABS ENABLED")');
    await expect(page.locator('text=ABS DISABLED')).toBeVisible();
  });

  test('navigates to Steering & Suspension and checks Ackermann angles', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Steering & Suspension")');
    await expect(page.locator('text=Steering Kinematics & Ackermann Geometry')).toBeVisible();
    await expect(page.locator('text=Ackermann Compensation')).toBeVisible();
  });

  test('navigates to EV vs ICE comparison', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("EV vs ICE")');
    await expect(page.locator('text=EV vs Internal Combustion (ICE) Comparison')).toBeVisible();
    await expect(page.locator('text=Thermal Efficiency')).toBeVisible();
  });

  test('navigates to Knowledge Quiz and completes questions', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Knowledge Quiz")');
    await expect(page.locator('text=Car Engineering Knowledge Quiz')).toBeVisible();
    // Answer question 1
    const option = page.locator('button:has-text("narrow RPM band")');
    await expect(option).toBeVisible();
    await option.click();
    await expect(page.locator('text=Engineering Explanation:')).toBeVisible();
  });
});
