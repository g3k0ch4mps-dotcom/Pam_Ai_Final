const express = require('express');
const teamController = require('../controllers/team.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { checkPermission } = require('../middleware/permission.middleware');

const router = express.Router();

/**
 * All team routes require authentication
 * AND specific permissions
 */
router.use(authenticate);

// List all team members
router.get('/', checkPermission('team.view'), teamController.getTeamMembers);

// Invite/Add a new team member
router.post('/invite', checkPermission('team.invite'), teamController.inviteMember);

// Update a member's role
router.patch('/:id/role', checkPermission('team.update_roles'), teamController.updateMemberRole);

// Remove a member
router.delete('/:id', checkPermission('team.remove'), teamController.removeMember);

module.exports = router;
