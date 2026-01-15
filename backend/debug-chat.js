const fetch = require('node-fetch'); // Or native fetch in Node 18+

async function debugChat() {
    const slug = 'mamuza-engineering';
    const url = `http://localhost:3000/api/chat/public/${slug}`;

    console.log(`Debug: Sending request to ${url}...`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: 'what is mamuza' })
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const data = await response.json();
        console.log('Response Body:', JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

debugChat();
