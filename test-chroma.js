
const { ChromaClient } = require('chromadb');
const path = require('path');

const chromaPath = './chroma_data';
const absolutePath = path.resolve(chromaPath);

console.log('Testing ChromaDB connection with path:', absolutePath);

async function test() {
    try {
        const client = new ChromaClient({
            path: absolutePath,
        });

        console.log('Client created. Attempting heartbeat...');
        await client.heartbeat();
        console.log('Successfully connected to ChromaDB!');
    } catch (error) {
        console.error('ChromaDB connection failed:', error);
        process.exit(1);
    }
}

test();
