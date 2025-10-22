import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';

/**
 * Ensures that a directory exists, creating it if necessary
 * @param {string} dirPath - Path to the directory
 */
export function ensureDirectoryExists(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Saves content to a file
 * @param {string} filePath - Path where the file should be saved
 * @param {string} content - Content to write to the file
 * @throws {Error} If file cannot be written
 */
export function saveFile(filePath, content) {
  try {
    // Ensure the directory exists
    const dir = dirname(filePath);
    ensureDirectoryExists(dir);

    // Write the file
    writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    throw new Error(`Failed to save file: ${error.message}`);
  }
}

/**
 * Generates a filename with timestamp
 * @param {string} prefix - Prefix for the filename
 * @param {string} extension - File extension (without dot)
 * @returns {string} Generated filename
 */
export function generateFilename(prefix = 'report', extension = 'json') {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${prefix}_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.${extension}`;
}

/**
 * Converts data to CSV format
 * @param {Array<Object>} data - Array of objects to convert
 * @returns {string} CSV formatted string
 */
export function toCSV(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');

  // Convert each row
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Handle values that contain commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });

  return [csvHeaders, ...csvRows].join('\n');
}

/**
 * Converts data to plain text format
 * @param {Object} data - Data object to convert
 * @returns {string} Plain text formatted string
 */
export function toText(data) {
  let text = '';

  function stringify(obj, indent = 0) {
    const spaces = '  '.repeat(indent);

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        text += `${spaces}[${index}]\n`;
        stringify(item, indent + 1);
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          text += `${spaces}${key}:\n`;
          stringify(value, indent + 1);
        } else {
          text += `${spaces}${key}: ${value}\n`;
        }
      });
    } else {
      text += `${spaces}${obj}\n`;
    }
  }

  stringify(data);
  return text;
}
