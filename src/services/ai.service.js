const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Added for Gemini
const logger = require('../utils/logger');

// Initialize OpenAI Client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// // START GEMINI CONFIGURATION // //
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
// // END GEMINI CONFIGURATION // //

/**
 * Generate a response using RAG (Retrieval-Augmented Generation)
 * @param {string} question - User's question
 * @param {Array} contextDocs - Array of relevant document objects { content, filename }
 * @param {Object} businessSettings - Business specific settings (name, welcome message)
 */
const generateResponse = async (question, contextDocs, businessSettings) => {
    // Shared Prompt Construction
    const businessName = businessSettings.businessName || 'the business';
    let systemPrompt = `You are a helpful AI assistant for ${businessName}. 
    Your goal is to answer customer questions accurately based ONLY on the provided context.
    
    Rules:
    - If the answer is not in the context, politely say you don't have that information and suggest contacting support.
    - Do not make up facts.
    - Keep answers concise and professional.
    - Tone: Friendly and helpful.`;

    let contextText = "";
    if (contextDocs && contextDocs.length > 0) {
        contextText = contextDocs.map((doc, index) =>
            `[Document ${index + 1} - ${doc.filename}]:\n${doc.content}`
        ).join("\n\n");
    } else {
        contextText = "No specific documents found for this query.";
    }

    const fullPrompt = `${systemPrompt}\n\nContext:\n${contextText}\n\nQuestion: ${question}`;

    // Helper to check if key is valid (not empty and not placeholder)
    const isValidKey = (key) => key && key.length > 10 && !key.includes('your-openai-api-key') && !key.includes('your-gemini-api-key');

    let processingError = null;

    // --- 1. Attempt OpenAI (Primary) ---
    if (isValidKey(process.env.OPENAI_API_KEY)) {
        try {
            logger.info('Attempting AI generation with OpenAI...');
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Context:\n${contextText}\n\nQuestion: ${question}` }
                ],
                temperature: 0.3,
                max_tokens: 500
            });

            const answer = completion.choices[0].message.content;
            return {
                answer,
                provider: 'openai',
                usage: completion.usage
            };

        } catch (openAiError) {
            logger.error(`OpenAI Error: ${openAiError.message}`);
            processingError = openAiError;
            // Continue to fallback...
        }
    } else {
        logger.info('Skipping OpenAI (Key invalid or missing)');
    }

    // --- 2. Attempt Gemini (Fallback or Primary if OpenAI missing) ---
    if (isValidKey(process.env.GEMINI_API_KEY)) {
        try {
            logger.info(processingError ? '⚠️ OpenAI failed. Falling back to Google Gemini...' : 'Attempting AI generation with Gemini...');

            const result = await geminiModel.generateContent(fullPrompt);
            const response = await result.response;
            const answer = response.text();

            return {
                answer,
                provider: 'gemini',
                usage: { total_tokens: 0 }
            };
        } catch (geminiError) {
            logger.error(`Gemini Error: ${geminiError.message}`);
            processingError = geminiError;
        }
    } else {
        logger.info('Skipping Gemini (Key invalid or missing)');
    }

    // --- Final Fallback: Mock/Error ---
    if (process.env.NODE_ENV === 'development') {
        logger.info('⚠️ Using MOCK AI response due to all API failures');
        return {
            answer: "This is a mock response because valid API keys for OpenAI or Gemini were not found or requests failed.",
            provider: 'mock',
            usage: { total_tokens: 0 }
        };
    }

    throw new Error('All AI providers failed or are unconfigured.');
};

module.exports = {
    generateResponse
};
