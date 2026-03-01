const User = require('../models/User');
const Business = require('../models/Business');
const { hashPassword } = require('../services/auth.service');
const { ROLES } = require('../config/roles');

/**
 * Get Team Members
 * GET /api/business/team
 */
const getTeamMembers = async (req, res) => {
    try {
        const businessId = req.user.businessId;

        // Find all users belonging to this business
        const members = await User.find({ businessId })
            .select('-passwordHash')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: members
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Invite/Add Team Member
 * POST /api/business/team/invite
 */
const inviteMember = async (req, res) => {
    try {
        const { email, firstName, lastName, role } = req.body;
        const businessId = req.user.businessId;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                error: 'User with this email already exists'
            });
        }

        // Validate role
        const allowedRoles = ['business_admin', 'business_staff', 'business_viewer'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ success: false, error: 'Invalid role' });
        }

        // Check business limits (optional but good practice)
        const business = await Business.findById(businessId);
        if (!business) {
            return res.status(404).json({ success: false, error: 'Business not found' });
        }

        const maxMembers = business.subscription?.features?.maxTeamMembers || 1;
        const currentMembers = await User.countDocuments({ businessId });

        if (currentMembers >= maxMembers) {
            return res.status(403).json({
                success: false,
                error: 'Team member limit reached for your current plan'
            });
        }

        // Create user with a temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        const passwordHash = await hashPassword(tempPassword);

        user = await User.create({
            email,
            firstName,
            lastName,
            passwordHash,
            role,
            businessId,
            isEmailVerified: true // Auto-verify for internal invites for now
        });

        // Add to Business teamMembers array for dual consistency
        business.teamMembers.push({
            userId: user._id,
            role: user.role
        });
        await business.save();

        res.status(201).json({
            success: true,
            message: 'Member added successfully',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    role: user.role
                },
                tempPassword // In a real app, this would be sent via email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Update Member Role
 * PATCH /api/business/team/:id/role
 */
const updateMemberRole = async (req, res) => {
    try {
        const { role } = req.body;
        const memberId = req.params.id;
        const businessId = req.user.businessId;

        // Validate role
        const allowedRoles = ['business_admin', 'business_staff', 'business_viewer'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ success: false, error: 'Invalid role' });
        }

        // Find user and ensure they belong to the same business
        const user = await User.findOne({ _id: memberId, businessId });
        if (!user) {
            return res.status(404).json({ success: false, error: 'Member not found in your business' });
        }

        // Update User
        user.role = role;
        await user.save();

        // Update Business teamMembers array
        await Business.updateOne(
            { _id: businessId, 'teamMembers.userId': memberId },
            { $set: { 'teamMembers.$.role': role } }
        );

        res.json({
            success: true,
            message: 'Role updated successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Remove Member
 * DELETE /api/business/team/:id
 */
const removeMember = async (req, res) => {
    try {
        const memberId = req.params.id;
        const businessId = req.user.businessId;

        // Ensure we aren't removing ourselves (optional check)
        if (memberId === req.user.id) {
            return res.status(400).json({ success: false, error: 'You cannot remove yourself' });
        }

        // Find user
        const user = await User.findOne({ _id: memberId, businessId });
        if (!user) {
            return res.status(404).json({ success: false, error: 'Member not found' });
        }

        // "Remove" from business - we can either delete the user or just clear their businessId
        // Given the multi-tenant nature, clearing businessId and marking as inactive might be better
        // but for now let's just delete to be clean if they were specifically created for this business.
        await User.findByIdAndDelete(memberId);

        // Remove from Business array
        await Business.findByIdAndUpdate(businessId, {
            $pull: { teamMembers: { userId: memberId } }
        });

        res.json({
            success: true,
            message: 'Member removed successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getTeamMembers,
    inviteMember,
    updateMemberRole,
    removeMember
};
