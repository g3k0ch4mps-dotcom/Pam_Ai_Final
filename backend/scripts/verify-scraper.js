const urlScraperService = require('../src/services/urlScraper.service');
const logger = require('../src/utils/logger');

// Mock logger if it doesn't work in this context
if (!logger.info) {
    global.logger = {
        info: console.log,
        warn: console.warn,
        error: console.error
    };
}

async function runTest() {
    const urls = [
        'https://shop.mamuzaengineering.com/product',
        'https://example.com'
    ];

    for (const url of urls) {
        console.log(`\n--- Testing Scraper for: ${url} ---`);
        try {
            const result = await urlScraperService.scrapeWithRetry(url, 1);
            if (result.success) {
                console.log('✅ Success!');
                console.log(`Title: ${result.title}`);
                console.log(`Content Length: ${result.textContent.length} chars`);
                console.log('--- Preview (First 500 chars) ---');
                console.log(result.textContent.substring(0, 500));
                console.log('---------------------------------');
            } else {
                console.log(`❌ Failed: ${result.error}`);
            }
        } catch (error) {
            console.error(`💥 Crash: ${error.message}`);
        }
    }
}

runTest();
