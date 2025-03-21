import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	timeout: 5000,
	reporter: 'list',
	use: {
		baseURL: 'http://127.0.0.1:8080',
		trace: 'on-first-retry'
	},
	webServer: {
		command: 'npm run serve',
		url: 'http://127.0.0.1:8080/dist/panel.js',
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
