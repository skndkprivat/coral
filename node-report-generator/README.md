# Genesys Cloud Conversation Analytics Report Generator

Et avanceret Node.js-program der forbinder til Genesys Cloud og genererer detaljerede rapporter over samtaler, indgangspunkter (DNIS) og kunderejser. Programmet understøtter flere sprog (Dansk, Engelsk, Fransk) og kan eksportere rapporter i forskellige formater inkl. interaktive HTML-rapporter.

## Funktioner

- **Genesys Cloud Integration**: Direkte forbindelse til Genesys Cloud API (Frankfurt region som standard)
- **Samtaleanalyse**: Analyserer samtaler for de sidste 30 dage (konfigurerbart)
- **Indgangspunkt-analyse**: Viser hvilke telefonnumre/DNIS kunder ringer til
- **Kunderejse-visualisering**: Mapper og visualiserer kunde flows gennem systemet
- **Top N Rejser**: Viser kun de mest benyttede rejser (konfigurerbart)
- **Flersprogethed**: Dansk, Engelsk, Fransk
- **Multiple formater**: JSON, CSV, TXT, HTML (anbefalet)
- **Visuelle rapporter**: Smukke HTML-rapporter med grafer og procenter
- **Console visualisering**: ASCII bar charts direkte i terminalen
- **Modulær arkitektur**: Ren og let at udvide

## Projekt Struktur

```
node-report-generator/
├── .env.example          # Eksempel konfiguration
├── index.js              # Hovedprogram
├── package.json          # Dependencies
├── config/               # Konfigurationsmoduler
│   ├── env.js           # Environment variabler
│   └── i18n.js          # Flersprogethed
├── locales/             # Oversættelsesfiler
│   ├── en.json          # Engelsk
│   ├── da.json          # Dansk
│   └── fr.json          # Fransk
├── genesys/             # Genesys Cloud integration
│   ├── client.js        # API klient og authentication
│   └── analytics.js     # Samtaleanalyse og journey tracking
├── report/              # Rapportgenerering
│   └── generate.js      # Rapport formatering og lagring
├── utils/               # Hjælpefunktioner
│   ├── file.js          # Fil operationer
│   ├── data.js          # Data processing
│   └── visualization.js # Charts og HTML generering
└── output/
    └── reports/         # Genererede rapporter gemmes her
```

## Installation

### 1. Installer dependencies

```bash
cd node-report-generator
npm install
```

### 2. Opret Genesys Cloud OAuth Client

For at bruge programmet med Genesys Cloud skal du oprette en OAuth Client:

1. Log ind på Genesys Cloud Admin: https://apps.mypurecloud.de/
2. Gå til **Admin** → **Integrations** → **OAuth**
3. Klik **Add Client**
4. Udfyld:
   - **App Name**: Report Generator
   - **Grant Type**: Client Credentials
   - **Roles**:
     - Analytics > Conversation Detail > View
     - Analytics > Conversation Aggregate > View
5. Gem Client ID og Client Secret

### 3. Konfigurer .env filen

```bash
cp .env.example .env
```

Rediger `.env` og tilføj dine Genesys Cloud credentials:

```env
# Sprog (da, en, fr)
LANG=da

# Output format (html anbefales for bedst visualisering)
REPORT_FORMAT=html

# Mode: sample eller genesys
REPORT_MODE=genesys

# Genesys Cloud Credentials
GENESYS_CLIENT_ID=din_client_id_her
GENESYS_CLIENT_SECRET=din_client_secret_her
GENESYS_REGION=mypurecloud.de

# Analyse indstillinger
ANALYSIS_DAYS=30
TOP_N_JOURNEYS=10
```

## Brug

### Kør med Genesys Cloud data

```bash
npm start
```

Programmet vil:
1. Forbinde til Genesys Cloud (Frankfurt)
2. Hente samtaledata for de sidste 30 dage
3. Analysere indgangspunkter (DNIS/telefonnumre)
4. Identificere og analysere kunderejser
5. Vise top 10 mest brugte rejser
6. Generere en smuk HTML rapport med grafer
7. Vise ASCII visualisering i konsollen

### Test med sample data

Hvis du vil teste uden Genesys Cloud forbindelse:

```env
REPORT_MODE=sample
```

## Konfiguration

### Sprogsupport

Skift sprog ved at ændre `LANG` i `.env`:

```env
LANG=da    # Dansk
LANG=en    # English
LANG=fr    # Français
```

### Output Formater

| Format | Beskrivelse | Anvendelse |
|--------|-------------|------------|
| `html` | Interaktiv HTML med grafer | ⭐ Anbefalet - Bedste visualisering |
| `json` | Struktureret data | For videre bearbejdning |
| `csv` | Kommaseparerede værdier | Excel import |
| `txt` | Plain text med ASCII charts | Console/log output |

```env
REPORT_FORMAT=html
```

### Analyse Periode

Konfigurer hvor mange dage tilbage der skal analyseres (1-90 dage):

```env
ANALYSIS_DAYS=30
```

### Top N Kunderejser

Vis kun de mest benyttede rejser (1-50):

```env
TOP_N_JOURNEYS=10
```

Hvis der f.eks. er 100 forskellige kunderejser, vil kun de 10 mest brugte blive vist.

## Output Eksempler

### HTML Rapport (Anbefalet)

HTML-rapporten inkluderer:
- Samlet oversigt med nøgletal
- Interaktive bar charts for indgangspunkter
- Visuelle kunderejser med procenter
- Responsivt design (fungerer på mobile)
- Kan gemmes som PDF fra browseren

Åbn rapporten i en browser:
```bash
open output/reports/genesys_analysis_2025-10-22_22-30-45.html
```

### Console Output

Programmet viser også live ASCII visualisering:

```
═══════════════════════════════════════════════════════════════════════════════
  INDGANGSPUNKTER (DNIS/Telefonnumre)
═══════════════════════════════════════════════════════════════════════════════
  Samlede Samtaler: 1543
───────────────────────────────────────────────────────────────────────────────

 1. +45 70 12 34 56                       | ████████████████████████ 387 (25.08%)
 2. +45 70 12 34 57                       | ███████████████████ 289 (18.74%)
 3. +45 70 12 34 58                       | ██████████████ 234 (15.17%)
...
```

## Genesys Cloud Regioner

Programmet understøtter følgende Genesys Cloud regioner:

| Region | Værdi | Placering |
|--------|-------|-----------|
| Frankfurt | `mypurecloud.de` | Tyskland (EMEA) |
| US East | `mypurecloud.com` | USA |
| Sydney | `mypurecloud.com.au` | Australien |
| Dublin | `mypurecloud.ie` | Irland (EMEA) |
| Tokyo | `mypurecloud.jp` | Japan |

Skift region i `.env`:
```env
GENESYS_REGION=mypurecloud.de
```

## Hvad Analyseres?

### Indgangspunkter (Entry Points)
- DNIS (Dialed Number Identification Service) - hvilket nummer kunden ringede til
- Telefonnumre
- Fordeling og procenter
- Sorteret efter mest brugte

### Kunderejser (Customer Journeys)
- Hvilke køer kunden passerede gennem
- Segment typer (IVR, ACD, osv.)
- Fulde flow paths
- Top N mest benyttede rejser
- Procent-fordeling

## Fejlfinding

### "Genesys Cloud credentials are required"
Sørg for at `REPORT_MODE=genesys` og at `GENESYS_CLIENT_ID` og `GENESYS_CLIENT_SECRET` er udfyldt i `.env`.

### "Failed to connect to Genesys Cloud"
- Kontroller at Client ID og Secret er korrekte
- Verificer at OAuth clienten har de rette roller (Analytics permissions)
- Tjek at regionen er korrekt (`mypurecloud.de` for Frankfurt)

### "Invalid region"
Brug en af de understøttede regioner:
- `mypurecloud.de` (Frankfurt)
- `mypurecloud.com` (US)
- `mypurecloud.com.au` (Sydney)
- `mypurecloud.ie` (Dublin)
- `mypurecloud.jp` (Tokyo)

### Ingen data returneret
- Tjek at der faktisk er samtaler i den valgte periode
- Verificer at OAuth clienten har Analytics > Conversation Detail > View rettighed
- Prøv at øge `ANALYSIS_DAYS`

## API Rate Limiting

Programmet håndterer automatisk Genesys Cloud API rate limits ved at:
- Hente data i chunks (100 samtaler ad gangen)
- Vente 500ms mellem requests
- Logge progress undervejs

## Udvid Programmet

### Tilføj Nyt Sprog

1. Opret ny JSON fil i `locales/` (f.eks. `es.json`)
2. Kopier struktur fra `en.json` og oversæt
3. Tilføj sprog i `config/env.js` under `validLangs`

### Tilpas Analysen

Rediger `genesys/analytics.js` for at:
- Ændre query filtre
- Tilføje flere metrics
- Ændre hvordan journeys identifies

### Custom HTML Design

Rediger `utils/visualization.js` funktionen `generateHTMLReport()` for at tilpasse HTML rapport designet.

## Teknisk Information

### Dependencies
- `purecloud-platform-client-v2` - Genesys Cloud SDK
- `dotenv` - Environment variable management

### Node.js Version
- Kræver Node.js >= 18.0.0
- Bruger ES6 modules (import/export)

### Authentication
- OAuth 2.0 Client Credentials flow
- Tokens håndteres automatisk af SDK
- Ingen manuel token refresh nødvendig

## Sikkerhed

- **Gem aldrig** `.env` filen i git
- `.env` er i `.gitignore`
- Client Secret skal behandles som password
- Brug kun OAuth clients med minimal nødvendige rettigheder

## License

MIT

## Support

For spørgsmål eller problemer:
1. Tjek dette README grundigt
2. Verificer `.env` konfiguration
3. Se Genesys Cloud dokumentation: https://developer.genesys.cloud/

## Eksempel Output

Når programmet kører med Genesys mode:

```bash
$ npm start

==================================================
Genesys Cloud Rapportgenerator
==================================================

Forbinder til Genesys Cloud (mypurecloud.de)...
Forbindelse til Genesys Cloud etableret
Henter samtaledata for de sidste 30 dage...
Hentet side 1: 100 samtaler
Hentet side 2: 100 samtaler
...
I alt 1543 samtaler hentet
Analyserer samtaler og kunderejser...

[ASCII Visualisering vises her]

Gemmer rapport...
Rapport gemt som: genesys_analysis_2025-10-22_15-30-45.html
Full path: /home/user/coral/node-report-generator/output/reports/genesys_analysis_2025-10-22_15-30-45.html

Proces fuldført!
==================================================
```
