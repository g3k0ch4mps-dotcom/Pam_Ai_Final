const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Validating Puppeteer...');
        console.log('Executable Path:', puppeteer.executablePath());

        console.log('Launching browser...');
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log('Browser launched!');

        const page = await browser.newPage();
        console.log('New page created.');

        await page.goto('https://example.com');
        console.log('Navigated to example.com');

        const title = await page.title();
        console.log('Page Title:', title);

        await browser.close();
        console.log('Browser closed. SUCCESS.');

    } catch (err) {
        console.error('PUPPETEER ERROR:', err);
    }
})();
