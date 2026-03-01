const Visitor = require('../models/Visitor');
const logger = require('../utils/logger');

const initializeVisitorSocket = (io) => {
    // Visitor Tracking Namespace
    const visitorNamespace = io.of('/visitor-tracking');

    // Admin/Dashboard Namespace
    const adminNamespace = io.of('/admin');

    visitorNamespace.on('connection', async (socket) => {
        const { businessId, sessionId, currentPage, location } = socket.handshake.auth;

        if (!businessId || !sessionId) {
            return socket.disconnect();
        }

        logger.info(`Visitor connected: ${sessionId} for business ${businessId}`);

        try {
            // Create or update visitor record
            const visitor = await Visitor.findOneAndUpdate(
                { sessionId, businessId },
                {
                    isOnline: true,
                    currentPage,
                    location,
                    lastActive: new Date(),
                    $inc: { totalPageViews: 1 },
                    $push: { visitHistory: { page: currentPage, timestamp: new Date() } }
                },
                { upsert: true, new: true }
            );

            // Join room for the specific business
            socket.join(businessId);

            // Notify admins in the business room
            adminNamespace.to(businessId).emit('visitor-online', visitor);

            socket.on('page-view', async (data) => {
                const { page } = data;
                visitor.currentPage = page;
                visitor.visitHistory.push({ page, timestamp: new Date() });
                visitor.lastActive = new Date();
                await visitor.save();

                adminNamespace.to(businessId).emit('visitor-moved', {
                    sessionId,
                    page,
                    timestamp: new Date()
                });
            });

            socket.on('disconnect', async () => {
                logger.info(`Visitor disconnected: ${sessionId}`);
                await Visitor.findOneAndUpdate(
                    { sessionId, businessId },
                    { isOnline: false, lastActive: new Date() }
                );
                adminNamespace.to(businessId).emit('visitor-offline', sessionId);
            });

        } catch (error) {
            logger.error(`Visitor socket error: ${error.message}`);
        }
    });

    adminNamespace.on('connection', (socket) => {
        const { businessId } = socket.handshake.auth;
        if (businessId) {
            socket.join(businessId);
            logger.info(`Admin connected to business room: ${businessId}`);
        }
    });
};

module.exports = initializeVisitorSocket;
