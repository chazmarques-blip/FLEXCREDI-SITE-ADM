/**
 * FLEXCREDI - Client Authentication Routes
 * Login, register, and session management for client users
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../core/prisma');

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'flexcredi_jwt_secret_2024';
const JWT_EXPIRES_IN = '7d'; // Clients get longer sessions

/**
 * POST /api/client/auth/register
 * Register a new client
 */
router.post('/register', async (req, res) => {
    try {
        const { 
            email, 
            password, 
            fullName, 
            phone,
            ssn,
            address,
            city,
            state,
            zipCode
        } = req.body;

        console.log('[Client Auth] Registration attempt for:', email);

        // Validate required fields
        if (!email || !password || !fullName) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and full name are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.log('[Client Auth] Email already registered:', email);
            return res.status(409).json({
                success: false,
                message: 'Email already registered. Please login or use a different email.'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: fullName,
                phone: phone || null,
                ssn: ssn || null,
                address: address || null,
                city: city || null,
                state: state || null,
                zipCode: zipCode || null,
                role: 'CLIENT',
                active: true,
                emailVerified: false
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });

        console.log('[Client Auth] New client registered:', user.id);

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.name,
                phone: user.phone
            },
            token
        });

    } catch (error) {
        console.error('[Client Auth] Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            error: process.env.NODE_ENV === 'production' ? undefined : error.message
        });
    }
});

/**
 * POST /api/client/auth/login
 * Client login endpoint
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('[Client Auth] Login attempt for:', email);

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                password: true,
                role: true,
                active: true,
                ssn: true,
                address: true,
                city: true,
                state: true,
                zipCode: true,
                monthlyIncome: true,
                employer: true,
                occupation: true,
                createdAt: true,
                _count: {
                    select: {
                        applications: true
                    }
                }
            }
        });

        if (!user) {
            console.log('[Client Auth] User not found:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if account is active
        if (!user.active) {
            console.log('[Client Auth] Account inactive:', email);
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact support.'
            });
        }

        // Verify password (if user has one)
        if (user.password) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                console.log('[Client Auth] Invalid password for:', email);
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }
        } else {
            // User exists but has no password (created via application submission)
            // For now, allow login with any password and prompt to set password
            console.log('[Client Auth] User has no password set, allowing first login:', email);
            
            // Hash and save the provided password
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword }
            });
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        });

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        console.log('[Client Auth] Login successful:', user.id);

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.name,
                phone: user.phone,
                ssn: user.ssn ? `***-**-${user.ssn.slice(-4)}` : null,
                address: user.address,
                city: user.city,
                state: user.state,
                zipCode: user.zipCode,
                monthlyIncome: user.monthlyIncome,
                employer: user.employer,
                occupation: user.occupation,
                applicationsCount: user._count.applications
            },
            token
        });

    } catch (error) {
        console.error('[Client Auth] Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed. Please try again.',
            error: process.env.NODE_ENV === 'production' ? undefined : error.message
        });
    }
});

/**
 * GET /api/client/auth/me
 * Get current user profile
 */
router.get('/me', async (req, res) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Get user
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                ssn: true,
                address: true,
                city: true,
                state: true,
                zipCode: true,
                monthlyIncome: true,
                employer: true,
                occupation: true,
                active: true,
                emailVerified: true,
                createdAt: true,
                applications: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    select: {
                        id: true,
                        status: true,
                        desiredAmount: true,
                        approvedAmount: true,
                        createdAt: true
                    }
                },
                _count: {
                    select: {
                        applications: true,
                        documents: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                ...user,
                ssn: user.ssn ? `***-**-${user.ssn.slice(-4)}` : null,
                fullName: user.name
            }
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        
        console.error('[Client Auth] Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile'
        });
    }
});

/**
 * POST /api/client/auth/logout
 * Client logout (token invalidation would require Redis/DB storage)
 */
router.post('/logout', (req, res) => {
    // For JWT, logout is typically handled client-side by removing the token
    // Server-side invalidation would require a token blacklist
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

module.exports = router;
