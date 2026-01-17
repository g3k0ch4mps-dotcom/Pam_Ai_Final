const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const validator = require('validator');
const logger = require('../utils/logger');

/**
 * URL Scraper Service
 * Implements tiered scraping strategy: Axios (Fast) -> Puppeteer (Robust)
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
            if (axiosResult.success && axiosResult.content.length > 200) {
                logger.info('[Scraper] Axios success');
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
     * Tier 1: Axios + Cheerio
     */
    async scrapeWithAxios(url) {
        const response = await axios.get(url, {
            timeout: 10000, // 10s timeout for fast check
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 BusinessAI/1.0',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            },
            maxRedirects: 5
        });

        const $ = cheerio.load(response.data);

        // Remove clutter
        $('script, style, nav, footer, header, iframe, noscript, svg, button, form, .ad, .advertisement').remove();

        // Extract Title
        const title = $('title').text().trim() || $('h1').first().text().trim() || new URL(url).hostname;

        // Extract Description
        const description = $('meta[name="description"]').attr('content') ||
            $('meta[property="og:description"]').attr('content') || '';

        // Extract Main Content
        let content = '';
        const mainSelectors = ['main', 'article', '#content', '.content', '.post-content', 'body'];

        for (const selector of mainSelectors) {
            const el = $(selector);
            if (el.length > 0) {
                // Get text, replace multiple spaces/newlines with single space
                const text = el.text().replace(/\s+/g, ' ').trim();
                if (text.length > content.length) {
                    content = text;
                }
            }
        }

        return {
            success: true,
            url,
            title: title.substring(0, 500),
            description: description.substring(0, 1000),
            textContent: content.substring(0, 50000), // Limit size
            method: 'axios',
            scrapedAt: new Date()
        };
    }

    /**
     * Tier 2: Puppeteer (Headless Chrome)
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
                    '--single-process' // Critical for minimal resource usage
                ]
            });

            const page = await browser.newPage();

            // INCREASED TIMEOUT: 60s for slow sites
            page.setDefaultNavigationTimeout(60000);

            // Optimization: Block media/fonts
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                const resourceType = req.resourceType();
                if (['image', 'media', 'font', 'stylesheet', 'other'].includes(resourceType)) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 BusinessAI/1.0');

            // NEW STRATEGY: 'domcontentloaded' is much faster than 'networkidle2'
            await page.goto(url, {
                waitUntil: 'domcontentloaded',
                timeout: 60000
            });

            // Wait a small buffer for critical JS to render text
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Extract content in browser context
            const data = await page.evaluate(() => {
                // Cleanup
                const elementsToRemove = ['script', 'style', 'nav', 'footer', 'iframe', 'noscript', 'svg', 'button', 'form'];
                elementsToRemove.forEach(tag => {
                    document.querySelectorAll(tag).forEach(el => el.remove());
                });

                const title = document.title || '';
                let description = '';
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) description = metaDesc.content;

                const bodyText = document.body.innerText || '';
                return { title, description, bodyText };
            });

            const cleanedText = data.bodyText.replace(/\s+/g, ' ').trim();

            return {
                success: true,
                url,
                title: data.title.substring(0, 500),
                description: data.description.substring(0, 1000),
                textContent: cleanedText.substring(0, 50000),
                method: 'puppeteer',
                scrapedAt: new Date()
            };

        } catch (error) {
            throw error; // Let retry wrapper handle it
        } finally {
            if (browser) await browser.close();
        }
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
