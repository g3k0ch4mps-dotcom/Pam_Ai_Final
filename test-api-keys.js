require('dotenv').config();
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testOpenAI() {
    console.log('\n--- Testing OpenAI ---');
    if (!process.env.OPENAI_API_KEY) {
        console.log('❌ OPENAI_API_KEY is missing in .env');
        return;
    }

    // Masked key
    const masked = process.env.OPENAI_API_KEY.substring(0, 8) + '...';
    console.log(`Key found: ${masked}`);

    try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Ping" }],
            max_tokens: 5
        });
        console.log('✅ OpenAI Connection Successful!');
        console.log('Response:', completion.choices[0].message.content);
    } catch (error) {
        console.error('❌ OpenAI Error:');
        console.error(error.message);
    }
}

async function testGemini() {
    console.log('\n--- Testing Gemini ---');
    if (!process.env.GEMINI_API_KEY) {
        console.log('❌ GEMINI_API_KEY is missing in .env');
        return;
    }

    const masked = process.env.GEMINI_API_KEY.substring(0, 8) + '...';
    console.log(`Key found: ${masked}`);

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // List of models to try, including user suggestion
        const modelsToTry = [
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-pro",
            "gemini-2.0-flash-exp",
            "gemini-3-flash-preview" // Checking if this exists
        ];

        for (const modelName of modelsToTry) {
            console.log(`\nAttempting model: ${modelName}`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Ping");
                const response = await result.response;
                console.log(`✅ Success with ${modelName}!`);
                console.log('Response:', response.text());

                // Write to file for reliability
                const fs = require('fs');
                fs.writeFileSync('working_model.txt', modelName);

                return; // Stop after first success
            } catch (e) {
                // Formatting error message
                let msg = e.message;
                if (msg.includes(']')) msg = msg.split(']')[1].trim();
                console.log(`❌ Failed with ${modelName}: ${msg}`);
            }
        }

        console.error('\n❌ All Gemini attempts failed. Please ensure the "Generative Language API" is enabled in Google Cloud Console.');

    } catch (error) {
        console.error('❌ Gemini Error:', error.message);
    }
}

async function runTests() {
    await testOpenAI();
    await testGemini();
}

runTests();
