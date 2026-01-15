const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const validator = require('validator');
const logger = require('../utils/logger');

/**
 * URL Scraper Service
 * Scrapes web content using Puppeteer to handle SPAs
 */
class URLScraperService {
    constructor() {
        this.maxContentSize = 10 * 1024 * 1024; // 10MB limit
        this.requestTimeout = 30000; // 30 seconds for browser loading
    }

    /**
     * Main method to scrape a URL
     * @param {string} url - The URL to scrape
     * @returns {Promise<Object>} Scraped content
     */
    async scrapeURL(url) {
        let browser = null;
        try {
            // 1. Validate URL format
            if (!this.validateURL(url)) {
                throw new Error('Invalid URL format');
            }

            logger.info(`Launching Puppeteer for ${url}...`);

            // Launch browser
            browser = await puppeteer.launch({
                headless: "new",
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            });

            const page = await browser.newPage();

            // Block resource types to speed up loading
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                const resourceType = req.resourceType();
                if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            // Set user agent
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 BusinessAI/1.0');

            // Navigate
            await page.goto(url, {
                waitUntil: 'networkidle2', // Wait until network is mostly idle
                timeout: this.requestTimeout
            });

            // Get HTML content
            const html = await page.content();
            const title = await page.title();

            // Extract text
            const extracted = this.extractText(html, url, title);

            return {
                success: true,
                url: url,
                title: extracted.title,
                description: extracted.description,
                textContent: extracted.textContent,
                scrapedAt: new Date()
            };

        } catch (error) {
            logger.error(`URL scraping failed for ${url}: ${error.message}`);

            // Fallback object to ensure we return something if possible, or rethrow
            throw new Error(`Failed to scrape URL with Puppeteer: ${error.message}`);
        } finally {
            if (browser) await browser.close();
        }
    }

    validateURL(url) {
        if (!url || typeof url !== 'string') return false;
        return validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true });
    }

    extractText(html, url, pageTitle) {
        try {
            const $ = cheerio.load(html);

            // Remove unwanted elements
            $('script, style, nav, footer, header, iframe, noscript, svg, button, form').remove();

            // Extract title if not provided
            let title = pageTitle || $('title').text().trim();
            if (!title) title = $('h1').first().text().trim();
            if (!title) title = new URL(url).hostname;

            // Extract meta description
            let description = $('meta[name="description"]').attr('content') ||
                $('meta[property="og:description"]').attr('content') || '';

            // Extract main text content
            let textContent = '';

            // Try specific main content areas first
            const mainSelectors = ['main', 'article', '#root', '#app', '.content', '#content', 'body'];

            for (const selector of mainSelectors) {
                if ($(selector).length > 0) {
                    const text = $(selector).text().replace(/\s+/g, ' ').trim();
                    if (text.length > textContent.length) {
                        textContent = text;
                    }
                }
            }

            // Cleanup
            textContent = textContent
                .replace(/\s+/g, ' ')
                .trim();

            const maxTextLength = 50000;
            if (textContent.length > maxTextLength) {
                textContent = textContent.substring(0, maxTextLength) + '...';
            }

            // Ensure we have something
            if (textContent.length < 50) {
                logger.warn(`Scraped content is very short (${textContent.length} chars). Might still be loading or blocked.`);
            }

            return {
                title: title.substring(0, 500),
                description: description.substring(0, 1000),
                textContent: textContent
            };

        } catch (error) {
            logger.error(`Text extraction failed: ${error.message}`);
            // Return bare minimum
            return { title: 'Extraction Failed', description: '', textContent: '' };
        }
    }
}

module.exports = new URLScraperService();
