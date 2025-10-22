import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { config } from './env.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Loads translation file for the configured language
 * @returns {Object} Translation object
 */
function loadTranslations() {
  const localesPath = resolve(__dirname, '../locales', `${config.lang}.json`);
  try {
    const data = readFileSync(localesPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Failed to load translations for language: ${config.lang}`);
    // Fallback to English
    const fallbackPath = resolve(__dirname, '../locales', 'en.json');
    const data = readFileSync(fallbackPath, 'utf8');
    return JSON.parse(data);
  }
}

// Load translations
const translations = loadTranslations();

/**
 * Get a translated string by key path
 * @param {string} keyPath - Dot-separated key path (e.g., 'app.title')
 * @param {Object} params - Optional parameters for string interpolation
 * @returns {string} Translated string
 */
export function t(keyPath, params = {}) {
  const keys = keyPath.split('.');
  let value = translations;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return keyPath; // Return the key if translation not found
    }
  }

  // Handle string interpolation
  if (typeof value === 'string') {
    return value.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  }

  return value;
}

/**
 * Get all translations for a namespace
 * @param {string} namespace - Namespace key (e.g., 'app' or 'report')
 * @returns {Object} Translation object for the namespace
 */
export function getNamespace(namespace) {
  return translations[namespace] || {};
}
