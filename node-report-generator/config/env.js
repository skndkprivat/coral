import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

/**
 * Configuration object with all environment variables
 */
export const config = {
  // Language settings
  lang: process.env.LANG || 'en',

  // Output directory for reports
  outputDir: process.env.OUTPUT_DIR || './output/reports',

  // Report format (json, csv, txt)
  reportFormat: process.env.REPORT_FORMAT || 'json',

  // Optional API key for future use
  apiKey: process.env.API_KEY || '',
};

/**
 * Validates the configuration
 * @returns {boolean} True if configuration is valid
 */
export function validateConfig() {
  const validLangs = ['en', 'da', 'fr'];
  const validFormats = ['json', 'csv', 'txt'];

  if (!validLangs.includes(config.lang)) {
    console.error(`Invalid language: ${config.lang}. Valid options: ${validLangs.join(', ')}`);
    return false;
  }

  if (!validFormats.includes(config.reportFormat)) {
    console.error(`Invalid report format: ${config.reportFormat}. Valid options: ${validFormats.join(', ')}`);
    return false;
  }

  return true;
}
