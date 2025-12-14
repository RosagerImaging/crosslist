// playwright.config.ts - Central config loader
import { config as dotenvConfig } from 'dotenv';
import path from 'path';
import { defineConfig } from '@playwright/test'; // Import defineConfig

// Load .env from project root
dotenvConfig({
  path: path.resolve(__dirname, '../../.env'), // Adjust path for monorepo root
});

// Central environment config map
const envConfigMap = {
  local: require('./playwright/config/local.config').default,
  staging: require('./playwright/config/staging.config').default,
  production: require('./playwright/config/production.config').default,
};

const environment = process.env.TEST_ENV || 'local';

// Fail fast if environment not supported
if (!Object.keys(envConfigMap).includes(environment)) {
  console.error(`❌ No configuration found for environment: ${environment}`);
  console.error(`   Available environments: ${Object.keys(envConfigMap).join(', ')}`);
  process.exit(1);
}

console.log(`✅ Running tests against: ${environment.toUpperCase()}`);

// Use defineConfig here to properly type the merged configuration
export default defineConfig(envConfigMap[environment as keyof typeof envConfigMap]);