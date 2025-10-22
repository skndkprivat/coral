#!/usr/bin/env node

import { validateConfig } from './config/env.js';
import { t } from './config/i18n.js';
import { createReport } from './report/generate.js';

/**
 * Main application entry point
 */
async function main() {
  try {
    // Display application title
    console.log('\n' + '='.repeat(50));
    console.log(t('app.title'));
    console.log('='.repeat(50) + '\n');

    // Validate configuration
    if (!validateConfig()) {
      process.exit(1);
    }

    // Start the process
    console.log(t('app.starting'));

    // Create and save the report
    const { filename, filepath } = await createReport();

    // Display success message
    console.log('\n' + t('app.success', { filename }));
    console.log(`Full path: ${filepath}`);

    // Display completion message
    console.log('\n' + t('app.completed'));
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    // Display error message
    console.error('\n' + t('app.error', { message: error.message }));
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the application
main();
