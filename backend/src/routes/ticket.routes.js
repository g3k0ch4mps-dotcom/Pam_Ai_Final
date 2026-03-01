const express = require('express');
const ticketController = require('../controllers/ticket.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkPermission } = require('../middleware/permission.middleware');

const router = express.Router();

// All ticket routes require authentication
router.use(authenticate);

router.post('/', checkPermission('tickets.create'), ticketController.createTicket);
router.get('/', checkPermission('tickets.read'), ticketController.getTickets);
router.patch('/:id/assign', checkPermission('tickets.assign'), ticketController.assignTicket);
router.patch('/:id/status', checkPermission('tickets.update'), ticketController.updateTicketStatus);
router.get('/stats', checkPermission('tickets.read'), ticketController.getTicketStats);

module.exports = router;
