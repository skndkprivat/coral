import { resolve } from 'path';
import { config } from '../config/env.js';
import { t } from '../config/i18n.js';
import { saveFile, generateFilename, toCSV, toText } from '../utils/file.js';
import { generateSampleData, calculateStatistics } from '../utils/data.js';
import { performAnalysis } from '../genesys/analytics.js';
import {
  visualizeEntryPoints,
  visualizeCustomerJourneys,
  generateHTMLReport
} from '../utils/visualization.js';

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
 * Generates a Genesys analysis report
 * @param {Object} analysisData - Genesys analysis data
 * @returns {Object} Report object
 */
export function generateGenesysReport(analysisData) {
  return {
    title: t('visualization.report_title'),
    generatedAt: new Date().toISOString(),
    language: config.lang,
    dateRange: analysisData.dateRange,
    conversationCount: analysisData.conversationCount,
    entryPoints: analysisData.entryPoints,
    customerJourneys: analysisData.customerJourneys,
  };
}

/**
 * Formats report data according to the specified format
 * @param {Object} report - Report object
 * @param {string} format - Output format (json, csv, txt, html)
 * @param {string} reportType - Type of report ('sample' or 'genesys')
 * @returns {string} Formatted report content
 */
export function formatReport(report, format, reportType = 'sample') {
  switch (format) {
    case 'json':
      return JSON.stringify(report, null, 2);

    case 'csv':
      // For CSV, export appropriate data based on report type
      if (reportType === 'genesys' && report.entryPoints) {
        return toCSV(report.entryPoints.entryPoints);
      }
      return toCSV(report.data || []);

    case 'txt':
      if (reportType === 'genesys') {
        // For Genesys reports, create a text visualization
        let text = `${report.title}\n`;
        text += `${'='.repeat(80)}\n`;
        text += `${t('visualization.date_range')}: ${new Date(report.dateRange.startDate).toLocaleDateString()} - ${new Date(report.dateRange.endDate).toLocaleDateString()}\n`;
        text += `${t('visualization.total_conversations')}: ${report.conversationCount}\n\n`;
        text += visualizeEntryPoints(report.entryPoints);
        text += '\n';
        text += visualizeCustomerJourneys(report.customerJourneys);
        return text;
      }
      return toText(report);

    case 'html':
      if (reportType === 'genesys') {
        return generateHTMLReport(report);
      }
      // For sample reports, create a simple HTML
      return `<!DOCTYPE html><html><head><title>${report.title}</title></head><body><pre>${JSON.stringify(report, null, 2)}</pre></body></html>`;

    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

/**
 * Saves a report to disk
 * @param {Object} report - Report object
 * @param {string} format - Output format (json, csv, txt, html)
 * @param {string} reportType - Type of report ('sample' or 'genesys')
 * @returns {string} Path to saved file
 */
export function saveReport(report, format = config.reportFormat, reportType = 'sample') {
  const prefix = reportType === 'genesys' ? 'genesys_analysis' : 'report';
  const filename = generateFilename(prefix, format);
  const filepath = resolve(config.outputDir, filename);
  const content = formatReport(report, format, reportType);

  saveFile(filepath, content);

  return { filename, filepath };
}

/**
 * Main function to create and save a report
 * @returns {Object} Object with report info and file path
 */
export async function createReport() {
  console.log(t('app.generating'));

  let report, filename, filepath;

  if (config.reportMode === 'genesys') {
    // Genesys Cloud mode
    console.log(t('genesys.analyzing'));

    // Perform Genesys analysis
    const analysisData = await performAnalysis(config.analysisDays);

    // Display console visualization
    console.log(visualizeEntryPoints(analysisData.entryPoints));
    console.log(visualizeCustomerJourneys(analysisData.customerJourneys));

    // Generate the report
    report = generateGenesysReport(analysisData);

    console.log(t('app.saving'));

    // Save the report
    const saved = saveReport(report, config.reportFormat, 'genesys');
    filename = saved.filename;
    filepath = saved.filepath;

  } else {
    // Sample data mode
    const data = generateSampleData();
    report = generateReport(data);

    console.log(t('app.saving'));

    const saved = saveReport(report);
    filename = saved.filename;
    filepath = saved.filepath;
  }

  return {
    report,
    filename,
    filepath,
  };
}
