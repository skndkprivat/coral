/**
 * Generates sample data for the report
 * In a real application, this would fetch data from an API or database
 * @returns {Array<Object>} Array of sample data items
 */
export function generateSampleData() {
  const now = new Date();

  return [
    {
      id: 1,
      name: 'Sample Item 1',
      status: 'completed',
      value: 123.45,
      created: now.toISOString(),
    },
    {
      id: 2,
      name: 'Sample Item 2',
      status: 'pending',
      value: 678.90,
      created: now.toISOString(),
    },
    {
      id: 3,
      name: 'Sample Item 3',
      status: 'in_progress',
      value: 234.56,
      created: now.toISOString(),
    },
    {
      id: 4,
      name: 'Sample Item 4',
      status: 'completed',
      value: 890.12,
      created: now.toISOString(),
    },
    {
      id: 5,
      name: 'Sample Item 5',
      status: 'completed',
      value: 456.78,
      created: now.toISOString(),
    },
  ];
}

/**
 * Calculates statistics from data
 * @param {Array<Object>} data - Array of data items
 * @returns {Object} Statistics object
 */
export function calculateStatistics(data) {
  const totalItems = data.length;
  const totalValue = data.reduce((sum, item) => sum + (item.value || 0), 0);
  const averageValue = totalItems > 0 ? totalValue / totalItems : 0;

  const statusCounts = data.reduce((counts, item) => {
    counts[item.status] = (counts[item.status] || 0) + 1;
    return counts;
  }, {});

  return {
    totalItems,
    totalValue: parseFloat(totalValue.toFixed(2)),
    averageValue: parseFloat(averageValue.toFixed(2)),
    statusBreakdown: statusCounts,
  };
}
