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

  // Report format (json, csv, txt, html)
  reportFormat: process.env.REPORT_FORMAT || 'json',

  // Genesys Cloud settings
  genesysClientId: process.env.GENESYS_CLIENT_ID || '',
  genesysClientSecret: process.env.GENESYS_CLIENT_SECRET || '',
  genesysRegion: process.env.GENESYS_REGION || 'mypurecloud.de', // Frankfurt region

  // Analysis settings
  analysisDays: parseInt(process.env.ANALYSIS_DAYS || '30', 10),
  topNJourneys: parseInt(process.env.TOP_N_JOURNEYS || '10', 10),

  // Report mode: 'sample' for sample data, 'genesys' for Genesys Cloud data
  reportMode: process.env.REPORT_MODE || 'sample',
};

/**
 * Validates the configuration
 * @returns {boolean} True if configuration is valid
 */
export function validateConfig() {
  const validLangs = ['en', 'da', 'fr'];
  const validFormats = ['json', 'csv', 'txt', 'html'];
  const validModes = ['sample', 'genesys'];
  const validRegions = ['mypurecloud.de', 'mypurecloud.com', 'mypurecloud.com.au', 'mypurecloud.ie', 'mypurecloud.jp'];

  if (!validLangs.includes(config.lang)) {
    console.error(`Invalid language: ${config.lang}. Valid options: ${validLangs.join(', ')}`);
    return false;
  }

  if (!validFormats.includes(config.reportFormat)) {
    console.error(`Invalid report format: ${config.reportFormat}. Valid options: ${validFormats.join(', ')}`);
    return false;
  }

  if (!validModes.includes(config.reportMode)) {
    console.error(`Invalid report mode: ${config.reportMode}. Valid options: ${validModes.join(', ')}`);
    return false;
  }

  // Validate Genesys settings if in Genesys mode
  if (config.reportMode === 'genesys') {
    if (!config.genesysClientId || !config.genesysClientSecret) {
      console.error('Genesys Cloud credentials are required when REPORT_MODE=genesys');
      console.error('Please set GENESYS_CLIENT_ID and GENESYS_CLIENT_SECRET in your .env file');
      return false;
    }

    if (!validRegions.includes(config.genesysRegion)) {
      console.error(`Invalid Genesys region: ${config.genesysRegion}. Valid options: ${validRegions.join(', ')}`);
      return false;
    }

    if (config.analysisDays < 1 || config.analysisDays > 90) {
      console.error('ANALYSIS_DAYS must be between 1 and 90');
      return false;
    }

    if (config.topNJourneys < 1 || config.topNJourneys > 50) {
      console.error('TOP_N_JOURNEYS must be between 1 and 50');
      return false;
    }
  }

  return true;
}
