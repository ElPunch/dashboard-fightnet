# AGENTS.md — Fight.net Dashboard

Guidelines for AI agents working on this Fight.net KPI Dashboard codebase.

## Project Overview

Pure HTML/CSS/JS single-page application for tracking KPIs in Aguascalientes fighting sports ecosystem. Runs entirely client-side, offline-capable, no build system required. Uses localStorage for data persistence and Chart.js for visualizations.

## Build/Test/Lint Commands

This project has **no build system**. It consists of static HTML/CSS/JS files that run directly in the browser.

- **No package.json** — no npm/yarn commands
- **No test runner** — no test commands available
- **No linting** — no eslint/prettier configured
- **Development**: Open `index.html` directly in browser or use a local server
- **Manual testing**: Load example data → navigate through all pages → verify charts render

To run locally with a server:
```bash
# Python 3
python -m http.server 8000

# Node.js (if available)
npx serve .

# PHP
php -S localhost:8000
```

## Code Style Guidelines

### JavaScript

- **Module Pattern**: Use IIFE (Immediately Invoked Function Expression) for encapsulation:
  ```javascript
  const ModuleName = (() => {
    // private functions
    function privateFn() {}
    
    // public API
    return { publicFn };
  })();
  ```

- **Naming**: 
  - camelCase for variables/functions (`loadTable`, `calcIngresos`)
  - PascalCase for module constants (`DataManager`, `KPIEngine`)
  - UPPER_SNAKE_CASE for constants (`PREFIX`, `ACCENT_PALETTE`)

- **Comments**: JSDoc style for file headers and complex functions
  ```javascript
  /**
   * filename.js - Fight.net Dashboard
   * Brief description of purpose.
   */
  ```

- **Safety First**: 
  - No `eval()` — use safe parsing functions
  - Handle division by zero: `safeDivide(a, b)` returns 0 if b is 0/NaN
  - Validate data before processing

- **Error Handling**: Return error objects rather than throwing:
  ```javascript
  return { error: 'Descriptive message', labels: [], values: [] };
  ```

- **String Quotes**: Use single quotes for strings (`'string'`)
- **Semicolons**: Required at end of statements
- **Indentation**: 2 spaces

### CSS

- **Variables**: Use CSS custom properties defined in `:root`
  ```css
  :root {
    --primary: #C0392B;
    --secondary: #2C3E50;
    --bg: #F4F5F7;
  }
  ```

- **Naming**: kebab-case for class names (`.kr-card`, `.hero-stat`)
- **Responsive**: Mobile-first with breakpoints at 600px

### HTML

- **Language**: Spanish (`lang="es"`)
- **Charset**: UTF-8 required
- **Meta viewport**: Always include for mobile
- **Structure**: Semantic HTML5 elements

### Data Formats

- **Dates**: Always `YYYY-MM-DD` format
- **Numbers**: Use decimal point (1500.50), NOT commas
- **Storage**: All localStorage keys prefixed with `fightnet_`
- **CSV**: UTF-8 encoding, comma-separated, headers in first row

## File Organization

```
/
├── index.html          # Landing page with tutorial
├── upload.html         # Data entry and CSV import
├── dashboard.html      # KPI visualizations
├── scripts/
│   ├── dataManager.js  # localStorage & CSV handling
│   ├── kpiEngine.js    # KPI calculations
│   ├── charts.js       # Chart.js rendering
│   └── tutorial.js     # Interactive tutorial
├── data_schema.json    # Table schemas
├── example_data/       # Sample CSV files
└── AGENTS.md          # This file
```

## Key Principles

1. **Offline-first**: Everything works without internet after initial load
2. **No dependencies**: Only external dependency is Chart.js (CDN)
3. **Data validation**: Validate all user inputs before storage
4. **Spanish UI**: All user-facing text in Spanish
5. **Modular**: Each script is self-contained via IIFE pattern
6. **Safe math**: Always use `safeNum()`, `safeDivide()` for calculations

## Common Patterns

- Loading data: `DataManager.loadTable('tablename')`
- Computing KPI: `KPIEngine.computeKPI(kpiId, DataManager)`
- Rendering chart: `ChartsManager.renderKPIChart(kpiConfig, result, canvasId)`
- Toast notification: `showToast('message', 'success'|'error')`

## Testing Checklist

When making changes, verify:
- [ ] Tutorial displays and navigates correctly
- [ ] Example data loads without errors
- [ ] CSV import accepts valid files
- [ ] Charts render on dashboard
- [ ] Data persists after page refresh
- [ ] Mobile layout works (resize to <600px)
- [ ] No console errors in browser devtools
