/**
 * FLEXCREDI - Admin Authentication Routes
 * Login, logout, and session management for admin users
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../core/prisma'); // Use singleton instance

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'flexcredi_jwt_secret_muito_seguro_2024';
const JWT_EXPIRES_IN = '24h';

/**
 * POST /api/admin/login
 * Admin login endpoint
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('[Admin Auth] Login attempt for:', email);

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find admin user
        const adminUser = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true,
                active: true,
                lastLoginAt: true
            }
        });

        if (!adminUser) {
            console.log('[Admin Auth] User not found:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if account is active
        if (!adminUser.active) {
            console.log('[Admin Auth] Account inactive:', email);
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact support.'
            });
        }

        // Check if user is admin
        if (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN') {
            console.log('[Admin Auth] User is not admin:', email);
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, adminUser.password);
        
        if (!isPasswordValid) {
            console.log('[Admin Auth] Invalid password for:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        await prisma.user.update({
            where: { id: adminUser.id },
            data: { lastLoginAt: new Date() }
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                id: adminUser.id,
                email: adminUser.email,
                role: adminUser.role
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        console.log('[Admin Auth] Login successful for:', email);

        // Return success response (don't send password)
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: adminUser.id,
                email: adminUser.email,
                name: adminUser.name,
                role: adminUser.role,
                lastLoginAt: adminUser.lastLoginAt
            }
        });

    } catch (error) {
        console.error('[Admin Auth] Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
});

/**
 * POST /api/admin/logout
 * Admin logout endpoint (client-side token removal mainly)
 */
router.post('/logout', (req, res) => {
    // In a stateless JWT setup, logout is handled client-side
    // But we can log the event
    console.log('[Admin Auth] Logout requested');
    
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

/**
 * GET /api/admin/verify
 * Verify JWT token and return user data
 */
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get updated user data
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                active: true,
                lastLoginAt: true
            }
        });

        if (!user || !user.active || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or inactive user'
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error('[Admin Auth] Token verification error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
});

/**
 * Middleware: Verify admin authentication
 * Use this in routes that require authentication
 */
function requireAuth(req, res, next) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded; // Attach admin data to request
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}

// Export router and middleware
module.exports = router;
module.exports.requireAuth = requireAuth;
