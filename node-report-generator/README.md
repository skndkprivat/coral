# Node.js Multilingual Report Generator

A modular Node.js application that generates reports with multi-language support (English, Danish, and French). The application uses `.env` configuration and can save reports in multiple formats (JSON, CSV, TXT).

## Features

- **Multi-language support**: English (en), Danish (da), French (fr)
- **Multiple output formats**: JSON, CSV, TXT
- **Modular architecture**: Clean separation of concerns
- **Environment-based configuration**: Easy setup via `.env` file
- **ES6 modules**: Modern JavaScript syntax throughout
- **Minimal dependencies**: Only uses `dotenv` for configuration

## Project Structure

```
node-report-generator/
├── .env.example          # Example environment configuration
├── index.js              # Main entry point
├── package.json          # Project dependencies and scripts
├── config/               # Configuration modules
│   ├── env.js           # Environment variable handling
│   └── i18n.js          # Internationalization/translation system
├── locales/             # Translation files
│   ├── en.json          # English translations
│   ├── da.json          # Danish translations
│   └── fr.json          # French translations
├── report/              # Report generation logic
│   └── generate.js      # Report creation and formatting
├── utils/               # Utility functions
│   ├── file.js          # File operations and formatting
│   └── data.js          # Data generation and statistics
└── output/
    └── reports/         # Generated reports saved here
```

## Installation

1. Navigate to the project directory:
   ```bash
   cd node-report-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` to configure your preferences:
   ```env
   LANG=da
   OUTPUT_DIR=./output/reports
   REPORT_FORMAT=json
   ```

## Usage

### Run the application

```bash
npm start
```

Or directly with Node.js:

```bash
node index.js
```

### Configuration Options

Edit the `.env` file to customize the application:

| Variable | Description | Valid Values | Default |
|----------|-------------|--------------|---------|
| `LANG` | Application language | `en`, `da`, `fr` | `en` |
| `OUTPUT_DIR` | Report output directory | Any valid path | `./output/reports` |
| `REPORT_FORMAT` | Output file format | `json`, `csv`, `txt` | `json` |

### Example: Running in Different Languages

**Danish (Dansk):**
```env
LANG=da
```
```bash
npm start
```

**English:**
```env
LANG=en
```
```bash
npm start
```

**French (Français):**
```env
LANG=fr
```
```bash
npm start
```

### Example: Different Output Formats

**JSON format (default):**
```env
REPORT_FORMAT=json
```

**CSV format:**
```env
REPORT_FORMAT=csv
```

**Plain text format:**
```env
REPORT_FORMAT=txt
```

## Output Examples

### JSON Format
```json
{
  "title": "Generated Report",
  "generatedAt": "2025-10-22T12:30:45.123Z",
  "language": "da",
  "statistics": {
    "Antal Elementer": 5,
    "totalValue": 1783.81,
    "averageValue": 356.76
  },
  "data": [...]
}
```

### CSV Format
```csv
id,name,status,value,created
1,Sample Item 1,completed,123.45,2025-10-22T12:30:45.123Z
2,Sample Item 2,pending,678.90,2025-10-22T12:30:45.123Z
...
```

### Text Format
```
title: Genereret Rapport
generatedAt: 2025-10-22T12:30:45.123Z
language: da
...
```

## Extending the Application

### Adding a New Language

1. Create a new JSON file in `locales/` (e.g., `locales/es.json` for Spanish)
2. Copy the structure from `en.json` and translate the values
3. Update `config/env.js` to include the new language in `validLangs`

### Adding Custom Data Sources

Replace the `generateSampleData()` function in `utils/data.js` with your own data fetching logic:

```javascript
export async function fetchRealData() {
  // Fetch from API, database, etc.
  const response = await fetch('https://api.example.com/data');
  return response.json();
}
```

Then update `report/generate.js` to use your custom function.

### Adding New Report Formats

1. Add format conversion logic in `utils/file.js`
2. Update the `formatReport()` function in `report/generate.js`
3. Add the new format to `validFormats` in `config/env.js`

## Requirements

- Node.js >= 18.0.0
- npm or yarn

## Dependencies

- `dotenv` (^16.4.5) - Environment variable management

## License

MIT

## Contributing

Feel free to submit issues or pull requests to improve the application.

## Notes

- Reports are automatically named with timestamps (e.g., `report_2025-10-22_12-30-45.json`)
- The `output/reports/` directory is created automatically if it doesn't exist
- Sample data is generated automatically for demonstration purposes
- All dates and times are in ISO 8601 format
