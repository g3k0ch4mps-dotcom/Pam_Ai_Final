const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const csv = require('csv-parser');
const logger = require('../utils/logger');

/**
 * Service to extract text from various file formats
 */
const extractText = async (file) => {
    try {
        const { path: filePath, mimetype } = file;

        switch (mimetype) {
            case 'application/pdf':
                return await extractFromPDF(filePath);

            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return await extractFromDOCX(filePath);

            case 'text/csv':
                return await extractFromCSV(filePath);

            case 'text/plain':
            case 'text/markdown':
                return await extractFromText(filePath);

            default:
                throw new Error(`Unsupported file type: ${mimetype}`);
        }
    } catch (error) {
        logger.error(`Text extraction failed for ${file.originalname}: ${error.message}`);
        throw new Error(`Failed to extract text: ${error.message}`);
    }
};

const extractFromPDF = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
};

const extractFromDOCX = async (filePath) => {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
};

const extractFromText = async (filePath) => {
    return fs.readFileSync(filePath, 'utf8');
};

const extractFromCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(Object.values(data).join(' ')))
            .on('end', () => {
                resolve(results.join('\n'));
            })
            .on('error', (error) => reject(error));
    });
};

module.exports = {
    extractText
};
