import { resolve } from 'path';
import { config } from '../config/env.js';
import { t } from '../config/i18n.js';
import { saveFile, generateFilename, toCSV, toText } from '../utils/file.js';
import { generateSampleData, calculateStatistics } from '../utils/data.js';

/**
 * Generates a report from provided data
 * @param {Array<Object>} data - Data to include in the report
 * @returns {Object} Report object
 */
export function generateReport(data) {
  const now = new Date();
  const statistics = calculateStatistics(data);

  return {
    title: t('report.title'),
    generatedAt: now.toISOString(),
    generatedDate: now.toLocaleDateString(),
    generatedTime: now.toLocaleTimeString(),
    language: config.lang,
    statistics: {
      [t('report.total_items')]: statistics.totalItems,
      totalValue: statistics.totalValue,
      averageValue: statistics.averageValue,
      [t('report.status')]: statistics.statusBreakdown,
    },
    data: data,
  };
}

/**
 * Formats report data according to the specified format
 * @param {Object} report - Report object
 * @param {string} format - Output format (json, csv, txt)
 * @returns {string} Formatted report content
 */
export function formatReport(report, format) {
  switch (format) {
    case 'json':
      return JSON.stringify(report, null, 2);

    case 'csv':
      // For CSV, we'll export the data array
      return toCSV(report.data);

    case 'txt':
      return toText(report);

    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

/**
 * Saves a report to disk
 * @param {Object} report - Report object
 * @param {string} format - Output format (json, csv, txt)
 * @returns {string} Path to saved file
 */
export function saveReport(report, format = config.reportFormat) {
  const filename = generateFilename('report', format);
  const filepath = resolve(config.outputDir, filename);
  const content = formatReport(report, format);

  saveFile(filepath, content);

  return { filename, filepath };
}

/**
 * Main function to create and save a report
 * @returns {Object} Object with report info and file path
 */
export async function createReport() {
  console.log(t('app.generating'));

  // Generate sample data (in real app, this would fetch from API/database)
  const data = generateSampleData();

  // Generate the report
  const report = generateReport(data);

  console.log(t('app.saving'));

  // Save the report
  const { filename, filepath } = saveReport(report);

  return {
    report,
    filename,
    filepath,
  };
}
