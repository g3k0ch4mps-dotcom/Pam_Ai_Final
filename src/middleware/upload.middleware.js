const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-random-original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'text/plain',
        'text/csv',
        'text/markdown'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Allowed formats: PDF, DOCX, TXT, CSV, MD'), false);
    }
};

// Limits
const limits = {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});

// Wrapper to handle errors
const uploadMiddleware = (req, res, next) => {
    const uploadSingle = upload.single('document');

    uploadSingle(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'FILE_TOO_LARGE',
                        message: 'File size exceeds 5MB limit'
                    }
                });
            }
            return res.status(400).json({
                success: false,
                error: {
                    code: 'UPLOAD_ERROR',
                    message: err.message
                }
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_FILE',
                    message: err.message
                }
            });
        }

        // Check if file is present
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'No_FILE',
                    message: 'No file uploaded'
                }
            });
        }
        next();
    });
};

module.exports = uploadMiddleware;
