const slugify = require('slugify');

/**
 * Generate a unique slug for a document
 * @param {string} name - The name to slugify
 * @param {Model} Model - The Mongoose model to check against
 * @param {string} field - The field name to check (default: 'businessSlug')
 * @returns {Promise<string>} - The unique slug
 */
async function generateUniqueSlug(name, Model, field = 'businessSlug') {
    // 1. Generate initial slug
    let slug = slugify(name, {
        lower: true,
        strict: true,
        trim: true
    });

    // 2. Check existence
    let uniqueSlug = slug;
    let counter = 1;

    while (await Model.findOne({ [field]: uniqueSlug })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
}

module.exports = { generateUniqueSlug };
