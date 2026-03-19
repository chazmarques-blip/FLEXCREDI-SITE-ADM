/**
 * FLEXCREDI - Public API Routes
 * Endpoints públicos para o frontend (sem autenticação)
 * - Submissão de aplicações
 * - Listagem de parceiros
 * - Consulta de status
 */

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ============ PUBLIC APPLICATION ENDPOINTS ============

/**
 * POST /api/public/applications
 * Submit a new credit application from the public website
 */
router.post('/applications', async (req, res) => {
    try {
        console.log('[Public API] New application submission:', req.body);

        const {
            // Client personal info
            clientName,
            clientEmail,
            clientPhone,
            clientSsn,
            clientAddress,
            clientCity,
            clientState,
            clientZipCode,
            
            // Employment & income
            employmentStatus,
            monthlyIncome,
            employer,
            occupation,
            
            // Credit request
            desiredAmount,
            partnerId,
            purpose
        } = req.body;

        // Validate required fields
        if (!clientName || !clientEmail || !clientPhone || !desiredAmount || !purpose) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: clientName, clientEmail, clientPhone, desiredAmount, purpose'
            });
        }

        // Check if user already exists by email
        let user = await prisma.user.findUnique({
            where: { email: clientEmail }
        });

        // If user doesn't exist, create new user
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: clientEmail,
                    name: clientName,
                    phone: clientPhone,
                    document: clientSsn,
                    address: clientAddress,
                    city: clientCity,
                    state: clientState,
                    zipCode: clientZipCode,
                    occupation: occupation,
                    monthlyIncome: parseFloat(monthlyIncome) || null,
                    isActive: true
                }
            });
            console.log('[Public API] New user created:', user.id);
        } else {
            // Update existing user info
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    name: clientName,
                    phone: clientPhone,
                    document: clientSsn || user.document,
                    address: clientAddress || user.address,
                    city: clientCity || user.city,
                    state: clientState || user.state,
                    zipCode: clientZipCode || user.zipCode,
                    occupation: occupation || user.occupation,
                    monthlyIncome: parseFloat(monthlyIncome) || user.monthlyIncome
                }
            });
            console.log('[Public API] User updated:', user.id);
        }

        // Create application
        const application = await prisma.application.create({
            data: {
                userId: user.id,
                partnerId: partnerId || null,
                desiredAmount: parseFloat(desiredAmount),
                purpose: purpose,
                status: 'PENDING',
                
                // Additional data from form
                employmentStatus: employmentStatus,
                employer: employer
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                partner: {
                    select: {
                        id: true,
                        name: true,
                        type: true
                    }
                }
            }
        });

        console.log('[Public API] Application created:', application.id);

        // TODO: Trigger credit analysis agent (if available)
        try {
            if (global.creditAnalyzer && typeof global.creditAnalyzer.analyze === 'function') {
                console.log('[Public API] Triggering credit analysis for application:', application.id);
                // Run analysis in background (don't await)
                global.creditAnalyzer.analyze(application.id).catch(err => {
                    console.error('[Public API] Credit analysis failed:', err);
                });
            }
        } catch (error) {
            console.error('[Public API] Error triggering credit analysis:', error);
        }

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: {
                applicationId: application.id,
                status: application.status,
                client: {
                    name: user.name,
                    email: user.email
                },
                requestedAmount: application.desiredAmount,
                submittedAt: application.createdAt
            }
        });

    } catch (error) {
        console.error('[Public API] Error submitting application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit application',
            error: error.message
        });
    }
});

/**
 * GET /api/public/applications/:id/status
 * Check application status (for tracking)
 */
router.get('/applications/:id/status', async (req, res) => {
    try {
        const { id } = req.params;

        const application = await prisma.application.findUnique({
            where: { id },
            select: {
                id: true,
                status: true,
                desiredAmount: true,
                approvedAmount: true,
                creditScore: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({
            success: true,
            data: application
        });

    } catch (error) {
        console.error('[Public API] Error fetching application status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch application status',
            error: error.message
        });
    }
});

// ============ PUBLIC PARTNERS ENDPOINT ============

/**
 * GET /api/public/partners
 * Get list of approved partners for application form dropdown
 */
router.get('/partners', async (req, res) => {
    try {
        const partners = await prisma.partner.findMany({
            where: {
                status: 'APPROVED', // Only show approved partners
                isActive: true
            },
            select: {
                id: true,
                name: true,
                type: true,
                description: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        res.json({
            success: true,
            data: partners,
            count: partners.length
        });

    } catch (error) {
        console.error('[Public API] Error fetching partners:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch partners',
            error: error.message
        });
    }
});

// ============ PUBLIC HEALTH CHECK ============

/**
 * GET /api/public/health
 * Simple health check for public API
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'FlexCredi Public API',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
