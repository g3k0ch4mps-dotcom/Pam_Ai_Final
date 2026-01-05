const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Added for Gemini
const logger = require('../utils/logger');

// Initialize OpenAI Client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// // START GEMINI CONFIGURATION // //
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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

    try {
        // --- 1. Attempt OpenAI (Primary) ---
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

        // // START GEMINI FALLBACK CODE // //
        try {
            logger.info('⚠️ OpenAI failed. Falling back to Google Gemini...');

            const result = await geminiModel.generateContent(fullPrompt);
            const response = await result.response;
            const answer = response.text();

            return {
                answer,
                provider: 'gemini',
                usage: { total_tokens: 'N/A (Gemini)' }
            };
        } catch (geminiError) {
            logger.error(`Gemini Fallback Error: ${geminiError.message}`);
            // // END GEMINI FALLBACK CODE // //

            // --- Final Fallback: Mock/Error ---
            if (process.env.NODE_ENV === 'development') {
                logger.info('⚠️ Using MOCK AI response due to all API failures');
                return {
                    answer: "This is a mock response because both OpenAI and Gemini failed.",
                    provider: 'mock',
                    usage: { total_tokens: 0 }
                };
            }

            return {
                answer: "I apologize, but I am currently unable to process your request. Please try again later.",
                provider: 'error',
                usage: { total_tokens: 0 }
            };
        }
    }
};

module.exports = {
    generateResponse
};
