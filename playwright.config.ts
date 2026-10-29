import {defineConfig, devices} from '@playwright/test';

// Uncommon port to avoid clashing with other local tools.
const baseURL = 'http://127.0.0.1:9876';

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'list',
	use: {
		baseURL,
		trace: 'on-first-retry'
	},
	webServer: {
		command: 'npm run serve -- --port 9876',
		url: `${baseURL}/dist/panel.js`,
		reuseExistingServer: !process.env.CI
	},
	projects: [
		{
			name: 'chromium',
			use: {...devices['Desktop Chrome']}
		},
		{
			name: 'firefox',
			use: {...devices['Desktop Firefox']}
		}
	]
});
