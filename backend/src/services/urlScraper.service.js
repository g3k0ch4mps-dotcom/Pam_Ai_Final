const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const validator = require('validator');
const logger = require('../utils/logger');

/**
 * ULTRA-SMART WEB SCRAPER v2.0
 * 
 * Features:
 * - Multi-zone extraction (nav, main, sidebar, footer)
 * - Intelligent content preservation
 * - Context-aware filtering
 * - Dual strategy (Axios + Puppeteer)
 * - Retry logic with exponential backoff
 */
class URLScraperService {
    constructor() {
        this.maxContentSize = 10 * 1024 * 1024; // 10MB limit
        this.requestTimeout = 30000; // 30 seconds default
    }

    /**
     * Main entry point with retry logic
     * @param {string} url - URL to scrape
     * @param {number} maxRetries - Number of retries
     */
    async scrapeWithRetry(url, maxRetries = 2) {
        for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
            try {
                if (attempt > 1) {
                    logger.info(`[Scraper] Retry attempt ${attempt}/${maxRetries + 1} for ${url}`);
                }
                return await this.scrapeURL(url);
            } catch (error) {
                logger.warn(`[Scraper] Attempt ${attempt} failed: ${error.message}`);

                if (attempt === maxRetries + 1) {
                    return {
                        success: false,
                        error: this.getUserFriendlyError(error),
                        url
                    };
                }

                // Exponential backoff
                const delay = 2000 * Math.pow(2, attempt - 1);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    /**
     * Core scraping logic - Tries Axios first, then Puppeteer
     */
    async scrapeURL(url) {
        // 1. Validate URL
        if (!this.validateURL(url)) {
            throw new Error('Invalid URL format');
        }

        logger.info(`[Scraper] Starting scrape for ${url}`);

        // 2. Try Axios (Tier 1 - Fast)
        try {
            const axiosResult = await this.scrapeWithAxios(url);
            if (axiosResult.success && this.isContentMeaningful(axiosResult.textContent)) {
                logger.info(`[Scraper] Axios success - ${axiosResult.textContent.length} chars`);
                return axiosResult;
            }
        } catch (error) {
            logger.info(`[Scraper] Axios failed, falling back to Puppeteer: ${error.message}`);
        }

        // 3. Fallback to Puppeteer (Tier 2 - Robust)
        logger.info('[Scraper] Falling back to Puppeteer...');
        return await this.scrapeWithPuppeteer(url);
    }

    /**
     * Tier 1: Axios + Cheerio (Fast, static sites)
     */
    async scrapeWithAxios(url) {
        const response = await axios.get(url, {
            timeout: 15000,
            maxRedirects: 5,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 BusinessAI/1.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });

        const $ = cheerio.load(response.data);

        // Remove absolute noise
        this.removeAbsoluteNoise($);

        // Multi-zone extraction
        const content = this.extractAllValuableContent($);

        // Extract title
        const title = this.extractTitle($);

        return {
            success: true,
            url,
            title: title.substring(0, 500),
            description: '',
            textContent: content,
            method: 'axios',
            scrapedAt: new Date()
        };
    }

    /**
     * Tier 2: Puppeteer (Robust, dynamic sites)
     */
    async scrapeWithPuppeteer(url) {
        let browser = null;
        try {
            browser = await puppeteer.launch({
                headless: "new",
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--disable-gpu',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process'
                ]
            });

            const page = await browser.newPage();

            page.setDefaultNavigationTimeout(90000);
            await page.setViewport({ width: 1920, height: 1080 });

            // Block only truly unnecessary resources
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                const resourceType = req.resourceType();
                if (['image', 'font', 'media'].includes(resourceType)) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 BusinessAI/1.0');

            await page.goto(url, {
                waitUntil: 'domcontentloaded',
                timeout: 90000
            });

            // Wait for page to stabilize
            await new Promise(resolve => setTimeout(resolve, 3000));

            // INTELLIGENT EXTRACTION IN BROWSER
            const data = await page.evaluate(() => {

                /**
                 * Check if element is truly noise
                 */
                const isTrueNoise = (element) => {
                    const tag = element.tagName?.toLowerCase() || '';
                    const className = (typeof element.className === 'string' ? element.className : (element.getAttribute?.('class') || '')).toLowerCase();
                    const id = (typeof element.id === 'string' ? element.id : (element.getAttribute?.('id') || '')).toLowerCase();
                    const text = (element.innerText || '').toLowerCase();

                    const absoluteNoisePatterns = [
                        /\bad[s]?\b/, /\bgoogle-ad/, /\bdoublclick/, /\badvertis/,
                        /\badsense/, /\badroll/, /\btracking/, /\banalytics/,
                        /\bpopup/, /\boverlay/, /\bmodal-backdrop/,
                        /\bcookie-consent/, /\bcookie-banner/, /\bgdpr-notice/,
                        /\bshare-button/, /\bsocial-icon/, /\bfollow-icon/,
                        /\bhidden/, /\bdisplay-none/, /\bvisibility-hidden/
                    ];

                    const matchesNoisePattern = absoluteNoisePatterns.some(pattern =>
                        pattern.test(className) || pattern.test(id)
                    );

                    if (matchesNoisePattern) {
                        if (text.length > 50) {
                            return false; // Has real content, keep it
                        }
                        return true;
                    }

                    const style = window.getComputedStyle(element);
                    if (style.display === 'none' || style.visibility === 'hidden') {
                        return true;
                    }

                    const rect = element.getBoundingClientRect();
                    if (rect.width < 10 && rect.height < 10) {
                        return true;
                    }

                    return false;
                };

                /**
                 * Check if element has valuable content
                 */
                const hasValuableContent = (element) => {
                    const text = (element.innerText || '').trim();

                    if (text.length < 10) {
                        return false;
                    }

                    if (text.length > 50) {
                        return true;
                    }

                    const valuablePatterns = [
                        /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone
                        /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, // Email
                        /\$\d+/, /\d+\s*USD/, /\d+\s*EUR/, /price/i,
                        /contact/i, /about/i, /service/i, /product/i,
                        /feature/i, /category/i, /location/i, /hour/i
                    ];

                    return valuablePatterns.some(pattern => pattern.test(text));
                };

                /**
                 * Extract content from all zones
                 */
                const extractAllContent = () => {
                    // Remove absolute noise first
                    document.querySelectorAll('script, style, noscript, iframe, link[rel="stylesheet"], meta').forEach(el => {
                        el.remove();
                    });

                    // Remove elements that are truly noise
                    const allElements = document.querySelectorAll('*');
                    allElements.forEach(el => {
                        if (isTrueNoise(el)) {
                            el.remove();
                        }
                    });

                    const zones = [];

                    // Zone 1: Header/Nav
                    const headers = document.querySelectorAll('header, nav, [role="navigation"]');
                    headers.forEach(header => {
                        if (hasValuableContent(header)) {
                            zones.push({
                                type: 'navigation',
                                content: header.innerText,
                                priority: 3
                            });
                        }
                    });

                    // Zone 2: Main content
                    const mainSelectors = [
                        'main', 'article', '[role="main"]',
                        '.main-content', '.content', '#content',
                        '.post-content', '.entry-content',
                        '.product-content', '.products', '.product-list'
                    ];

                    mainSelectors.forEach(selector => {
                        const element = document.querySelector(selector);
                        if (element && hasValuableContent(element)) {
                            zones.push({
                                type: 'main',
                                content: element.innerText,
                                priority: 1
                            });
                        }
                    });

                    // Zone 3: Sidebars
                    const sidebars = document.querySelectorAll('aside, [role="complementary"], .sidebar, .side-content');
                    sidebars.forEach(sidebar => {
                        if (hasValuableContent(sidebar)) {
                            zones.push({
                                type: 'sidebar',
                                content: sidebar.innerText,
                                priority: 2
                            });
                        }
                    });

                    // Zone 4: Footer
                    const footers = document.querySelectorAll('footer, [role="contentinfo"]');
                    footers.forEach(footer => {
                        if (hasValuableContent(footer)) {
                            zones.push({
                                type: 'footer',
                                content: footer.innerText,
                                priority: 4
                            });
                        }
                    });

                    // Fallback to body if no zones found
                    if (zones.length === 0) {
                        zones.push({
                            type: 'body',
                            content: document.body.innerText,
                            priority: 5
                        });
                    }

                    // Sort by priority
                    zones.sort((a, b) => a.priority - b.priority);

                    // Combine with section markers
                    let combined = '';
                    zones.forEach(zone => {
                        const marker = zone.type.toUpperCase();
                        combined += `\n\n=== ${marker} SECTION ===\n`;
                        combined += zone.content;
                    });

                    return combined;
                };

                /**
                 * Extract title
                 */
                const extractTitle = () => {
                    const sources = [
                        document.querySelector('title')?.innerText,
                        document.querySelector('meta[property="og:title"]')?.content,
                        document.querySelector('meta[name="twitter:title"]')?.content,
                        document.querySelector('h1')?.innerText,
                        document.querySelector('h2')?.innerText
                    ];

                    for (const source of sources) {
                        if (source && source.trim().length > 0) {
                            return source.trim();
                        }
                    }

                    return 'Untitled';
                };

                const content = extractAllContent();
                const title = extractTitle();

                return { title, content };
            });

            await browser.close();

            const cleanedContent = this.cleanContent(data.content);

            return {
                success: true,
                url,
                title: data.title.substring(0, 500),
                description: '',
                textContent: cleanedContent,
                method: 'puppeteer',
                scrapedAt: new Date()
            };

        } catch (error) {
            if (browser) await browser.close();
            throw error;
        }
    }

    /**
     * Remove ONLY absolute noise (for Axios/Cheerio)
     */
    removeAbsoluteNoise($) {
        const absoluteNoiseSelectors = [
            'script', 'style', 'noscript', 'iframe',
            'link[rel="stylesheet"]', 'meta',
            '[class*="google-ad"]', '[class*="adsense"]',
            '[id*="google-ad"]', '[id*="adsense"]',
            '[class*="tracking"]', '[id*="tracking"]',
            '[class*="analytics"]', '[id*="analytics"]'
        ];

        absoluteNoiseSelectors.forEach(selector => {
            $(selector).remove();
        });
    }

    /**
     * Extract ALL valuable content from multiple zones (for Axios/Cheerio)
     */
    extractAllValuableContent($) {
        const zones = [];

        const hasValue = ($el) => {
            const text = $el.text().trim();
            return text.length > 10;
        };

        // Zone 1: Navigation
        $('header, nav, [role="navigation"]').each((i, el) => {
            const $el = $(el);
            if (hasValue($el)) {
                zones.push({
                    type: 'NAVIGATION',
                    content: $el.text(),
                    priority: 3
                });
            }
        });

        // Zone 2: Main content
        const mainSelectors = [
            'main', 'article', '[role="main"]',
            '.main-content', '.content', '#content',
            '.products', '.product-list', '.entry-content'
        ];

        mainSelectors.forEach(selector => {
            const $el = $(selector).first();
            if ($el.length && hasValue($el)) {
                zones.push({
                    type: 'MAIN',
                    content: $el.text(),
                    priority: 1
                });
            }
        });

        // Zone 3: Sidebar
        $('aside, [role="complementary"], .sidebar').each((i, el) => {
            const $el = $(el);
            if (hasValue($el)) {
                zones.push({
                    type: 'SIDEBAR',
                    content: $el.text(),
                    priority: 2
                });
            }
        });

        // Zone 4: Footer
        $('footer, [role="contentinfo"]').each((i, el) => {
            const $el = $(el);
            if (hasValue($el)) {
                zones.push({
                    type: 'FOOTER',
                    content: $el.text(),
                    priority: 4
                });
            }
        });

        // Fallback to body
        if (zones.length === 0) {
            zones.push({
                type: 'BODY',
                content: $('body').text(),
                priority: 5
            });
        }

        // Sort by priority
        zones.sort((a, b) => a.priority - b.priority);

        // Combine with section markers
        let combined = '';
        zones.forEach(zone => {
            combined += `\n\n=== ${zone.type} SECTION ===\n`;
            combined += zone.content;
        });

        return this.cleanContent(combined);
    }

    /**
     * Clean up extracted content
     */
    cleanContent(rawContent) {
        let content = rawContent;

        content = content
            .replace(/\t+/g, ' ')
            .replace(/[ ]+/g, ' ')
            .replace(/\n\s*\n\s*\n+/g, '\n\n')
            .trim();

        return content;
    }

    /**
     * Extract title intelligently
     */
    extractTitle($) {
        const sources = [
            $('title').text(),
            $('meta[property="og:title"]').attr('content'),
            $('meta[name="twitter:title"]').attr('content'),
            $('h1').first().text(),
            $('h2').first().text()
        ];

        for (const source of sources) {
            if (source && source.trim().length > 0) {
                return source.trim();
            }
        }

        return 'Untitled';
    }

    /**
     * Check if content is meaningful
     */
    isContentMeaningful(content) {
        if (!content || content.length < 100) {
            return false;
        }

        const words = content.split(/\s+/);
        const uniqueWords = new Set(words.map(w => w.toLowerCase()));
        const varietyRatio = uniqueWords.size / words.length;

        if (varietyRatio < 0.15) {
            return false;
        }

        const errorPhrases = [
            'page not found',
            'error 404',
            'access denied',
            'forbidden'
        ];

        const lowerContent = content.toLowerCase();
        const hasOnlyErrors = errorPhrases.every(phrase =>
            lowerContent.includes(phrase) && content.length < 200
        );

        return !hasOnlyErrors;
    }

    validateURL(url) {
        if (!url || typeof url !== 'string') return false;
        return validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true });
    }

    getUserFriendlyError(error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('timeout')) return 'Website took too long to respond (Timeout).';
        if (msg.includes('403') || msg.includes('access denied')) return 'Website is blocking automated access (403).';
        if (msg.includes('404')) return 'Page not found (404).';
        if (msg.includes('net::err')) return 'Network error: Unable to reach website.';
        return `Scraping failed: ${error.message}`;
    }
}

module.exports = new URLScraperService();
