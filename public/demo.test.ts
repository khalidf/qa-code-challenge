import { test, expect } from '@playwright/test';

// Define a base URL for easier use throughout the tests
const baseURL = 'http://localhost:3000';

// Helper function for logging in
const login = async (page, username: string, password: string) => {
  await page.fill('#username', username);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
};

test.describe('Authentication and Product List Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the base URL before each test
    await page.goto(baseURL);
  });

  test.afterEach(async ({ page }) => {
    // Clear local storage after each test to ensure a clean state
    await page.evaluate(() => localStorage.clear());
  });

  test('Verify user can successfully login using valid credentials and ', async ({ page }) => {
    await page.fill('#username', 'emilys');
    await page.fill('#password', 'emilyspass');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${baseURL}/dashboard.html`);
    expect(page.url()).toBe(`${baseURL}/dashboard.html`);
  });

  test('Verify user cannot login with invalid credentials', async ({ page }) => {
    await page.fill('#username', 'invalidUser');
    await page.fill('#password', 'invalidPass');
    await page.click('button[type="submit"]');
    await page.waitForSelector('#error-message'); // Wait for the error message to appear
    const errorMessage = await page.textContent('#error-message');
    expect(errorMessage).toContain('Invalid credentials. Please try again.');
  });

  test('Verify user cannot access without dashboard without authentication', async ({ page }) => {
    await page.goto(`${baseURL}/dashboard.html`);
    expect(page.url()).toBe(`${baseURL}/index.html`);
  });

  test('Verify user can access Dashboard upon successful login', async ({ page }) => {
    // Simulate login
    await login(page, 'emilys', 'emilyspass');
    await page.waitForURL(`${baseURL}/dashboard.html`);
    const pageTitle = await page.title();
    expect(pageTitle).toBe('Dashboard');
  });

  test('Verify when logout is clicked, user is logged out and token is cleared', async ({ page }) => {
    // Simulate login
    await login(page, 'emilys', 'emilyspass');
    await page.waitForURL(`${baseURL}/dashboard.html`);

    // Click the logout button
    await page.click('#logout-button');
    await page.waitForURL(`${baseURL}/index.html`);

    // Ensure the user is redirected to the login page
    expect(page.url()).toBe(`${baseURL}/index.html`);

    // Ensure local storage is cleared
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  });

});
