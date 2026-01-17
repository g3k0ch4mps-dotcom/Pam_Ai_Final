# Web Scraper - Technical Documentation

## Architecture Overview

### High-Level Flow

```
User Input (URL)
    ↓
URL Validation
    ↓
Strategy 1: Axios + Cheerio (Fast)
    ├─ Success → Content Validation → Return
    └─ Fail → Strategy 2
         ↓
Strategy 2: Puppeteer (Reliable)
    ├─ Success → Content Validation → Return
    └─ Fail → Retry Logic (up to 3x)
         ↓
Content Validation
    ├─ Meaningful → Return Success
    └─ Not Meaningful → Return Error
```

### Multi-Zone Extraction Architecture

The scraper divides webpages into four distinct zones, each with a priority level:

```
┌─────────────────────────────────────┐
│     NAVIGATION (Priority 3)         │
│  <nav>, <header>, [role="navigation"]│
│  Categories, Services, Menu Items    │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│     MAIN CONTENT (Priority 1)       │
│  <main>, <article>, [role="main"]   │
│  Primary Page Content                │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│     SIDEBAR (Priority 2)             │
│  <aside>, [role="complementary"]     │
│  Pricing, Features, Specifications   │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│     FOOTER (Priority 4)              │
│  <footer>, [role="contentinfo"]      │
│  Contact, Hours, Locations           │
└─────────────────────────────────────┘
```

**Priority Ordering:**
1. Main Content (Priority 1) - Highest
2. Sidebar (Priority 2)
3. Navigation (Priority 3)
4. Footer (Priority 4)
5. Body Fallback (Priority 5) - Only if no zones found

## Implementation Details

### File Structure

```
backend/src/services/
└── urlScraper.service.js
    ├── scrapeWithRetry()           // Main entry with retry logic
    ├── scrapeURL()                 // Core scraping orchestrator
    ├── scrapeWithAxios()           // Strategy 1: Fast (Axios + Cheerio)
    ├── scrapeWithPuppeteer()       // Strategy 2: Reliable (Puppeteer)
    ├── removeAbsoluteNoise()       // Remove ads, tracking (Cheerio)
    ├── extractAllValuableContent() // Multi-zone extraction (Cheerio)
    ├── cleanContent()              // Whitespace normalization
    ├── extractTitle()              // Title extraction
    ├── isContentMeaningful()       // Quality validation
    ├── validateURL()               // URL format validation
    └── getUserFriendlyError()      // Error message translation
```

### Dependencies

```json
{
  "axios": "^1.6.0",
  "cheerio": "^1.0.0-rc.12",
  "puppeteer": "^21.0.0",
  "validator": "^13.11.0"
}
```

### Configuration

**Timeouts:**
- Axios request: 15 seconds
- Puppeteer navigation: 90 seconds
- Page stabilization: 3 seconds

**Retry Logic:**
- Max retries: 2 (3 total attempts)
- Backoff: Exponential (2s, 4s, 8s)
- Max delay: 10 seconds

**Resource Blocking (Puppeteer):**
- Images: ❌ Blocked
- Fonts: ❌ Blocked
- Media: ❌ Blocked
- Stylesheets: ✅ Allowed (needed for visibility detection)
- Scripts: ✅ Allowed (needed for dynamic content)

## Intelligent Filtering Algorithm

### What Gets Removed (Absolute Noise)

**Criteria for removal:**

```javascript
Element is removed if it matches ALL of:
1. Has noise pattern in class/id:
   - "google-ad", "adsense", "advertisement"
   - "tracking", "analytics"
   - "popup", "modal-backdrop"
   - "cookie-consent", "cookie-banner"
   
2. AND has no substantial content:
   - Text length < 50 characters
   - OR display: none / visibility: hidden
   - OR width/height < 10px
```

**Absolute Noise Selectors (Always Removed):**
- `script`, `style`, `noscript`, `iframe`
- `link[rel="stylesheet"]`, `meta`
- `[class*="google-ad"]`, `[id*="google-ad"]`
- `[class*="tracking"]`, `[id*="tracking"]`

### What Gets Kept (Valuable Content)

**Criteria for keeping:**

```javascript
Element is kept if it has ANY of:
1. Substantial text (> 50 characters)
2. Valuable patterns:
   - Phone: \d{3}[-.]?\d{3}[-.]?\d{4}
   - Email: [A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}
   - Price: $\d+, \d+ USD, \d+ EUR
3. Keywords: contact, price, category, feature, service, product
4. Structured content (lists, headings)
5. Visible and non-trivial size
```

### Content Scoring System

Each zone receives a priority score:

| Zone | Priority | Why |
|------|----------|-----|
| Main | 1 | Primary content - highest importance |
| Sidebar | 2 | Supplementary info - often contains pricing/features |
| Navigation | 3 | Categories and services - important for context |
| Footer | 4 | Contact info - valuable but lower priority |
| Body | 5 | Fallback only - used when no zones detected |

**Content Quality Validation:**

```javascript
isContentMeaningful(content) {
  // Minimum length
  if (content.length < 100) return false;
  
  // Variety check (avoid repetitive text)
  const varietyRatio = uniqueWords / totalWords;
  if (varietyRatio < 0.15) return false; // At least 15% unique
  
  // Error page detection
  if (containsOnlyErrorMessages) return false;
  
  return true;
}
```

## Output Format

### Section Markers

```
=== NAVIGATION SECTION ===
[Navigation content]

=== MAIN SECTION ===
[Main content]

=== SIDEBAR SECTION ===
[Sidebar content]

=== FOOTER SECTION ===
[Footer content]
```

### Example Output

```
=== NAVIGATION SECTION ===
Home | Products | Services | About | Contact
Electronics | Robotics | IoT | STEM Education

=== MAIN SECTION ===
Our Products - STEM, Robotics & IoT Components

Arduino Uno R3 - $25.99
Advanced microcontroller board perfect for beginners...

Raspberry Pi 4 - $45.00
Single-board computer with 4GB RAM...

=== SIDEBAR SECTION ===
Price Range: $5 - $100
Categories: 50+ products
Free Shipping: Orders over $50

Featured Categories:
- Microcontrollers
- Sensors & Modules

=== FOOTER SECTION ===
Contact: info@example.com
Phone: +254 700 123 456
Location: Nairobi, Kenya
Hours: Mon-Fri 9AM-6PM
```

## Method Documentation

### scrapeWithRetry(url, maxRetries)

**Purpose:** Main entry point with automatic retry logic

**Parameters:**
- `url` (string): URL to scrape
- `maxRetries` (number): Number of retry attempts (default: 2)

**Returns:** Promise<ScraperResult>

**Flow:**
1. Attempts to scrape URL
2. On failure, waits with exponential backoff
3. Retries up to maxRetries times
4. Returns user-friendly error if all attempts fail

### scrapeURL(url)

**Purpose:** Core scraping orchestrator

**Strategy:**
1. Validates URL format
2. Tries Axios (fast, static sites)
3. Falls back to Puppeteer if Axios fails
4. Validates content quality

**Returns:** Promise<ScraperResult>

### scrapeWithAxios(url)

**Purpose:** Fast scraping for static sites

**Process:**
1. HTTP GET request with browser headers
2. Parse HTML with Cheerio
3. Remove absolute noise
4. Extract multi-zone content
5. Clean and return

**Success Rate:** ~60% of websites
**Average Time:** 2-5 seconds

### scrapeWithPuppeteer(url)

**Purpose:** Reliable scraping for dynamic sites

**Process:**
1. Launch headless Chrome
2. Block unnecessary resources
3. Navigate to URL
4. Wait for page stabilization
5. Execute intelligent extraction in browser context
6. Return cleaned content

**Success Rate:** ~95% of websites
**Average Time:** 10-30 seconds

### extractAllValuableContent($)

**Purpose:** Multi-zone extraction for Cheerio

**Process:**
1. Extract from navigation elements
2. Extract from main content selectors
3. Extract from sidebar elements
4. Extract from footer elements
5. Sort by priority
6. Combine with section markers

**Returns:** String with section markers

### isContentMeaningful(content)

**Purpose:** Validate content quality

**Checks:**
- Minimum length (100 characters)
- Variety ratio (15% unique words)
- Not error page
- Not repetitive text

**Returns:** Boolean

## Testing

### Unit Tests

```javascript
// Test multi-zone extraction
describe('extractAllValuableContent', () => {
  it('should extract all zones from complex page', () => {
    const result = scraper.extractAllValuableContent($);
    expect(result).toContain('=== NAVIGATION SECTION ===');
    expect(result).toContain('=== MAIN SECTION ===');
    expect(result).toContain('=== SIDEBAR SECTION ===');
    expect(result).toContain('=== FOOTER SECTION ===');
  });
  
  it('should preserve valuable sidebar content', () => {
    const result = scraper.extractAllValuableContent($);
    expect(result).toContain('Pricing: $499/mo');
    expect(result).not.toContain('google-ad');
  });
});

// Test content validation
describe('isContentMeaningful', () => {
  it('should reject short content', () => {
    expect(scraper.isContentMeaningful('Short')).toBe(false);
  });
  
  it('should accept quality content', () => {
    const goodContent = 'This is a comprehensive article about web development...';
    expect(scraper.isContentMeaningful(goodContent)).toBe(true);
  });
  
  it('should reject repetitive content', () => {
    const repetitive = 'test test test test test';
    expect(scraper.isContentMeaningful(repetitive)).toBe(false);
  });
});
```

### Integration Tests

```bash
# Test with real websites
npm run test:scraper

# Test specific URL
npm run test:scraper -- --url="https://example.com"

# Test multiple URL types
npm run test:scraper:all
```

### Manual Testing

```bash
# Start server
npm run dev

# Test preview endpoint
curl -X POST http://localhost:3000/api/documents/preview-url \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"url": "https://shop.mamuzaengineering.com/products"}'

# Verify response includes:
# - All section markers
# - Valuable content from each zone
# - No ads or tracking scripts
```

## Deployment

### Environment Variables

```bash
# Optional: Custom Puppeteer executable path
PUPPETEER_EXECUTABLE_PATH=/path/to/chrome

# Node environment
NODE_ENV=production

# Puppeteer configuration
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
PUPPETEER_CACHE_DIR=./.cache/puppeteer
```

### Render.com Configuration

```yaml
# render.yaml
services:
  - type: web
    name: backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PUPPETEER_SKIP_CHROMIUM_DOWNLOAD
        value: false
```

**Post-Install Script:**

```json
{
  "scripts": {
    "postinstall": "npx puppeteer browsers install chrome"
  }
}
```

### Docker (Optional)

```dockerfile
FROM node:20-alpine

# Install Chromium for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
```

## Performance Optimization

### Strategy Selection

**Axios (Fast Path):**
- Average time: 2-5 seconds
- Success rate: 60% of websites
- Best for: Static HTML sites, blogs, simple pages
- Resource usage: Low (no browser)

**Puppeteer (Reliable Path):**
- Average time: 10-30 seconds
- Success rate: 95% of websites
- Best for: SPAs, JavaScript-heavy sites, dynamic content
- Resource usage: High (full browser)

### Resource Blocking Benefits

**Without blocking:**
- Load time: 15-30 seconds
- Bandwidth: 5-10 MB per page
- Success rate: 95%

**With blocking:**
- Load time: 5-15 seconds
- Bandwidth: 0.5-2 MB per page
- Success rate: 95% (no change)

**Savings:** 60-80% bandwidth, 2-3x faster

## Monitoring & Logging

### Log Patterns

**Success Logs:**
```
[Scraper] Starting scrape for https://example.com
[Scraper] Axios success - 2345 chars
[Scraper] Puppeteer success - 3456 chars
```

**Warning Logs:**
```
[Scraper] Axios failed, falling back to Puppeteer: timeout
[Scraper] Retry attempt 2/3 for https://example.com
[Scraper] Attempt 2 failed: page.waitForTimeout is not a function
```

**Error Logs:**
```
[Scraper] All retries failed for https://example.com
[Scraper] Invalid URL format
```

### Metrics to Track

1. **Success Rate by Strategy**
   - Axios success rate
   - Puppeteer success rate
   - Overall success rate

2. **Performance Metrics**
   - Average scrape time (Axios)
   - Average scrape time (Puppeteer)
   - Retry rate

3. **Content Quality**
   - Average content length
   - Meaningful content rate
   - Section distribution (nav/main/sidebar/footer)

4. **Error Distribution**
   - Timeout errors
   - 403/404 errors
   - Network errors
   - Content quality failures

## Troubleshooting

### Common Issues

#### Issue: Puppeteer fails on Render

**Symptoms:**
```
Error: Could not find Chrome
```

**Solution:**
```bash
# Ensure postinstall script is present
"postinstall": "npx puppeteer browsers install chrome"

# Set environment variables
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false
PUPPETEER_CACHE_DIR=./.cache/puppeteer

# Clear build cache and redeploy
```

#### Issue: Content quality too low

**Symptoms:**
```
Error: Content too short or page appears empty
```

**Solution:**
```javascript
// Adjust quality threshold in isContentMeaningful()
varietyRatio > 0.15 // Lowered from 0.20
minLength > 100     // Lowered from 200
```

#### Issue: Missing sidebar content

**Symptoms:**
- Sidebar content not appearing in extracted text

**Solution:**
```javascript
// Check hasValuableContent() threshold
// Ensure it's detecting content patterns correctly
const hasValue = ($el) => {
  const text = $el.text().trim();
  return text.length > 10; // Adjust if needed
};
```

#### Issue: Too much noise in output

**Symptoms:**
- Ads or tracking scripts in extracted content

**Solution:**
```javascript
// Add more noise patterns to absoluteNoisePatterns
const absoluteNoisePatterns = [
  /\bad[s]?\b/,
  /\bgoogle-ad/,
  /\byour-specific-ad-pattern/  // Add here
];
```

#### Issue: Timeout on slow sites

**Symptoms:**
```
Error: Navigation timeout of 90000 ms exceeded
```

**Solution:**
```javascript
// Increase timeout (use sparingly)
await page.goto(url, {
  waitUntil: 'domcontentloaded',
  timeout: 120000 // Increased to 120s
});
```

## Future Enhancements

### Planned Features

1. **Caching Layer**
   - Cache scraped content for 24 hours
   - Reduce repeated scraping of same URLs
   - Faster response times for cached content

2. **Smart Rate Limiting**
   - Limit scrapes per domain per hour
   - Prevent overwhelming target sites
   - Respect robots.txt directives

3. **Content Diffing**
   - Detect changes in content since last scrape
   - Notify users of updates
   - Version history for scraped content

4. **Advanced Filtering**
   - User-configurable filter rules
   - Domain-specific extraction patterns
   - Machine learning-based content classification

5. **Structured Data Extraction**
   - Detect and parse schema.org markup
   - Extract structured metadata (prices, ratings, etc.)
   - Product information parsing

6. **Screenshot Capture**
   - Save screenshot of scraped page
   - Visual verification of content
   - Thumbnail generation

## API Integration

### Controller Integration

```javascript
// document.controller.js
const urlScraperService = require('../services/urlScraper.service');

const previewUrlContent = async (req, res) => {
  const { url } = req.body;
  
  // Use scraper with retry
  const scrapedData = await urlScraperService.scrapeWithRetry(url, 2);
  
  if (!scrapedData || !scrapedData.success) {
    return res.status(422).json({
      success: false,
      error: {
        code: 'SCRAPE_FAILED',
        message: scrapedData?.error || 'Failed to scrape URL'
      }
    });
  }
  
  // Return preview data
  res.status(200).json({
    success: true,
    data: {
      title: scrapedData.title,
      content: scrapedData.textContent,
      method: scrapedData.method
    }
  });
};
```

## Support

For technical questions or issues:

- **Documentation:** This file
- **Code:** `backend/src/services/urlScraper.service.js`
- **Issues:** GitHub Issues
- **Email:** dev@yourdomain.com

## Changelog

### Version 2.0.0 (Current)
- ✅ Multi-zone extraction (nav, main, sidebar, footer)
- ✅ Intelligent content preservation
- ✅ Context-aware filtering
- ✅ Section markers for organization
- ✅ Enhanced error handling
- ✅ Content quality validation

### Version 1.0.0 (Previous)
- Basic scraping with Puppeteer
- Single-zone extraction
- Aggressive filtering (removed nav/sidebar/footer)
- Limited website support

---

**Last Updated:** January 17, 2026  
**Version:** 2.0.0  
**Maintainer:** Development Team
