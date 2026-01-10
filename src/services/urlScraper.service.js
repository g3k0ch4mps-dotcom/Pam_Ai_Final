const axios = require('axios');
const cheerio = require('cheerio');
const validator = require('validator');
const logger = require('../utils/logger');

/**
 * URL Scraper Service
 * Scrapes web content with security measures to prevent SSRF attacks
 */
class URLScraperService {
    constructor() {
        // Security: Block private IP ranges
        this.blockedHosts = [
            'localhost',
            '127.0.0.1',
            '0.0.0.0',
            '::1',
            '169.254.169.254' // AWS metadata endpoint
        ];

        // Private IP ranges (CIDR notation patterns)
        this.privateIPPatterns = [
            /^10\./,                    // 10.0.0.0/8
            /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
            /^192\.168\./,              // 192.168.0.0/16
            /^127\./,                   // 127.0.0.0/8
            /^169\.254\./,              // 169.254.0.0/16
            /^fc00:/,                   // IPv6 private
            /^fe80:/                    // IPv6 link-local
        ];

        this.maxContentSize = 5 * 1024 * 1024; // 5MB
        this.requestTimeout = 10000; // 10 seconds
    }

    /**
     * Main method to scrape a URL
     * @param {string} url - The URL to scrape
     * @returns {Promise<Object>} Scraped content
     */
    async scrapeURL(url) {
        try {
            // 1. Validate URL format
            if (!this.validateURL(url)) {
                throw new Error('Invalid URL format');
            }

            // 2. Check URL safety (SSRF prevention)
            if (!this.checkURLSafety(url)) {
                throw new Error('URL is not allowed (security restriction)');
            }

            // 3. Fetch HTML content
            const html = await this.fetchHTML(url);

            // 4. Extract text content
            const extracted = this.extractText(html, url);

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
            throw error;
        }
    }

    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @returns {boolean}
     */
    validateURL(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }

        // Use validator library
        if (!validator.isURL(url, {
            protocols: ['http', 'https'],
            require_protocol: true,
            require_valid_protocol: true
        })) {
            return false;
        }

        return true;
    }

    /**
     * Check URL safety to prevent SSRF attacks
     * @param {string} url - URL to check
     * @returns {boolean}
     */
    checkURLSafety(url) {
        try {
            const urlObj = new URL(url);

            // 1. Only allow HTTP/HTTPS
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                logger.warn(`Blocked non-HTTP(S) protocol: ${urlObj.protocol}`);
                return false;
            }

            // 2. Check hostname against blocklist
            const hostname = urlObj.hostname.toLowerCase();
            if (this.blockedHosts.includes(hostname)) {
                logger.warn(`Blocked hostname: ${hostname}`);
                return false;
            }

            // 3. Check for private IP patterns
            for (const pattern of this.privateIPPatterns) {
                if (pattern.test(hostname)) {
                    logger.warn(`Blocked private IP: ${hostname}`);
                    return false;
                }
            }

            // 4. Additional check: resolve IP and verify it's not private
            // Note: In production, you might want to do DNS resolution check
            // For now, pattern matching should suffice

            return true;

        } catch (error) {
            logger.error(`URL safety check failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Fetch HTML content from URL
     * @param {string} url - URL to fetch
     * @returns {Promise<string>} HTML content
     */
    async fetchHTML(url) {
        try {
            const response = await axios.get(url, {
                timeout: this.requestTimeout,
                maxContentLength: this.maxContentSize,
                maxRedirects: 5,
                headers: {
                    'User-Agent': 'Business-AI-Assistant-Bot/1.0'
                },
                validateStatus: (status) => status >= 200 && status < 300
            });

            // Verify content type is HTML
            const contentType = response.headers['content-type'] || '';
            if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
                throw new Error(`Unsupported content type: ${contentType}`);
            }

            return response.data;

        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timeout - URL took too long to respond');
            }
            if (error.response) {
                throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
            }
            throw new Error(`Failed to fetch URL: ${error.message}`);
        }
    }

    /**
     * Extract text content from HTML
     * @param {string} html - HTML content
     * @param {string} url - Original URL (for context)
     * @returns {Object} Extracted content
     */
    extractText(html, url) {
        try {
            const $ = cheerio.load(html);

            // Remove unwanted elements
            $('script, style, nav, footer, header, iframe, noscript').remove();

            // Extract title
            let title = $('title').text().trim();
            if (!title) {
                title = $('h1').first().text().trim();
            }
            if (!title) {
                title = new URL(url).hostname;
            }

            // Extract meta description
            let description = $('meta[name="description"]').attr('content') || '';
            if (!description) {
                description = $('meta[property="og:description"]').attr('content') || '';
            }

            // Extract main text content
            // Prioritize main content areas
            let textContent = '';

            const mainSelectors = ['main', 'article', '[role="main"]', '.content', '#content'];
            for (const selector of mainSelectors) {
                const mainContent = $(selector).text();
                if (mainContent && mainContent.length > textContent.length) {
                    textContent = mainContent;
                }
            }

            // Fallback to body if no main content found
            if (!textContent || textContent.length < 100) {
                textContent = $('body').text();
            }

            // Clean up text
            textContent = textContent
                .replace(/\s+/g, ' ')  // Normalize whitespace
                .replace(/\n+/g, '\n') // Normalize newlines
                .trim();

            // Limit content size (prevent extremely large documents)
            const maxTextLength = 50000; // ~50KB of text
            if (textContent.length > maxTextLength) {
                textContent = textContent.substring(0, maxTextLength) + '...';
                logger.info(`Content truncated to ${maxTextLength} characters`);
            }

            return {
                title: title.substring(0, 500), // Limit title length
                description: description.substring(0, 1000), // Limit description
                textContent: textContent
            };

        } catch (error) {
            logger.error(`Text extraction failed: ${error.message}`);
            throw new Error('Failed to extract text from HTML');
        }
    }
}

module.exports = new URLScraperService();
