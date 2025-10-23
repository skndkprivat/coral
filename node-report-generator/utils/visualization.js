import { t } from '../config/i18n.js';

/**
 * Creates a horizontal bar chart in ASCII
 * @param {Array} data - Array of objects with label, count, and percentage
 * @param {string} labelKey - Key for the label
 * @param {string} valueKey - Key for the value
 * @param {number} maxBarLength - Maximum length of the bar
 * @returns {string} ASCII bar chart
 */
export function createASCIIBarChart(data, labelKey = 'label', valueKey = 'count', maxBarLength = 50) {
  if (!data || data.length === 0) {
    return t('visualization.no_data');
  }

  const maxValue = Math.max(...data.map(item => item[valueKey]));
  let chart = '\n';

  data.forEach((item, index) => {
    const label = item[labelKey] || 'Unknown';
    const value = item[valueKey] || 0;
    const percentage = item.percentage || '0.00';

    // Truncate label if too long
    const displayLabel = label.length > 40 ? label.substring(0, 37) + '...' : label;

    // Calculate bar length
    const barLength = Math.round((value / maxValue) * maxBarLength);
    const bar = '█'.repeat(barLength);

    // Format the line
    chart += `${(index + 1).toString().padStart(2)}. ${displayLabel.padEnd(40)} | ${bar} ${value} (${percentage}%)\n`;
  });

  return chart;
}

/**
 * Creates a visual summary for entry points
 * @param {Object} entryPointAnalysis - Entry point analysis data
 * @returns {string} Formatted entry point summary
 */
export function visualizeEntryPoints(entryPointAnalysis) {
  let output = '\n';
  output += '═'.repeat(80) + '\n';
  output += `  ${t('visualization.entry_points_title')}\n`;
  output += '═'.repeat(80) + '\n';
  output += `  ${t('visualization.total_conversations')}: ${entryPointAnalysis.totalConversations}\n`;
  output += '─'.repeat(80) + '\n';

  output += createASCIIBarChart(
    entryPointAnalysis.entryPoints,
    'entryPoint',
    'count'
  );

  output += '═'.repeat(80) + '\n';

  return output;
}

/**
 * Creates a visual summary for customer journeys
 * @param {Object} journeyAnalysis - Journey analysis data
 * @returns {string} Formatted journey summary
 */
export function visualizeCustomerJourneys(journeyAnalysis) {
  let output = '\n';
  output += '═'.repeat(80) + '\n';
  output += `  ${t('visualization.customer_journeys_title')}\n`;
  output += '═'.repeat(80) + '\n';
  output += `  ${t('visualization.total_journeys')}: ${journeyAnalysis.totalJourneys}\n`;
  output += `  ${t('visualization.unique_journeys')}: ${journeyAnalysis.allJourneysCount}\n`;
  output += `  ${t('visualization.showing_top')}: ${journeyAnalysis.journeys.length}\n`;
  output += '─'.repeat(80) + '\n';

  output += createASCIIBarChart(
    journeyAnalysis.journeys,
    'journey',
    'count'
  );

  output += '═'.repeat(80) + '\n';

  return output;
}

/**
 * Generates HTML report with charts
 * @param {Object} analysisData - Complete analysis data
 * @returns {string} HTML content
 */
export function generateHTMLReport(analysisData) {
  const { dateRange, conversationCount, entryPoints, customerJourneys } = analysisData;

  const startDate = new Date(dateRange.startDate).toLocaleDateString();
  const endDate = new Date(dateRange.endDate).toLocaleDateString();

  // Prepare data for charts
  const entryPointsData = entryPoints.entryPoints.map(ep => ({
    label: ep.entryPoint,
    value: ep.count,
    percentage: ep.percentage
  }));

  const journeysData = customerJourneys.journeys.map(j => ({
    label: j.journey,
    value: j.count,
    percentage: j.percentage
  }));

  return `<!DOCTYPE html>
<html lang="${analysisData.language || 'da'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t('visualization.report_title')} - Genesys Cloud</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      color: #333;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }

    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
    }

    .header p {
      font-size: 1.1em;
      opacity: 0.9;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      padding: 40px;
      background: #f8f9fa;
    }

    .summary-card {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }

    .summary-card h3 {
      color: #667eea;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }

    .summary-card .value {
      font-size: 2.5em;
      font-weight: bold;
      color: #333;
    }

    .section {
      padding: 40px;
    }

    .section h2 {
      color: #667eea;
      margin-bottom: 30px;
      font-size: 1.8em;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }

    .chart-item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      transition: transform 0.2s;
    }

    .chart-item:hover {
      transform: translateX(5px);
      background: #e9ecef;
    }

    .chart-rank {
      font-weight: bold;
      color: #667eea;
      margin-right: 15px;
      font-size: 1.2em;
      min-width: 30px;
    }

    .chart-label {
      flex: 0 0 400px;
      padding-right: 20px;
      font-weight: 500;
    }

    .chart-bar-container {
      flex: 1;
      background: #e9ecef;
      height: 30px;
      border-radius: 15px;
      overflow: hidden;
      position: relative;
    }

    .chart-bar {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      border-radius: 15px;
      transition: width 0.5s ease;
    }

    .chart-value {
      margin-left: 15px;
      font-weight: bold;
      color: #333;
      min-width: 120px;
    }

    .footer {
      background: #f8f9fa;
      padding: 20px 40px;
      text-align: center;
      color: #666;
      font-size: 0.9em;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }
      .container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${t('visualization.report_title')}</h1>
      <p>${t('visualization.date_range')}: ${startDate} - ${endDate}</p>
    </div>

    <div class="summary">
      <div class="summary-card">
        <h3>${t('visualization.total_conversations')}</h3>
        <div class="value">${conversationCount}</div>
      </div>
      <div class="summary-card">
        <h3>${t('visualization.entry_points_count')}</h3>
        <div class="value">${entryPoints.entryPoints.length}</div>
      </div>
      <div class="summary-card">
        <h3>${t('visualization.unique_journeys')}</h3>
        <div class="value">${customerJourneys.allJourneysCount}</div>
      </div>
    </div>

    <div class="section">
      <h2>${t('visualization.entry_points_title')}</h2>
      ${entryPointsData.map((item, index) => `
        <div class="chart-item">
          <div class="chart-rank">#${index + 1}</div>
          <div class="chart-label">${item.label}</div>
          <div class="chart-bar-container">
            <div class="chart-bar" style="width: ${item.percentage}%"></div>
          </div>
          <div class="chart-value">${item.value} (${item.percentage}%)</div>
        </div>
      `).join('')}
    </div>

    <div class="section">
      <h2>${t('visualization.customer_journeys_title')}</h2>
      <p style="margin-bottom: 20px; color: #666;">
        ${t('visualization.showing_top')}: ${customerJourneys.journeys.length} ${t('visualization.of')} ${customerJourneys.allJourneysCount}
      </p>
      ${journeysData.map((item, index) => `
        <div class="chart-item">
          <div class="chart-rank">#${index + 1}</div>
          <div class="chart-label">${item.label}</div>
          <div class="chart-bar-container">
            <div class="chart-bar" style="width: ${item.percentage}%"></div>
          </div>
          <div class="chart-value">${item.value} (${item.percentage}%)</div>
        </div>
      `).join('')}
    </div>

    <div class="footer">
      <p>${t('visualization.generated_at')}: ${new Date().toLocaleString()}</p>
      <p>${t('visualization.powered_by')}: Genesys Cloud Analytics</p>
    </div>
  </div>
</body>
</html>`;
}
