/**
 * FLEXCREDI - Applications Routes
 * Rotas para gerenciar aplicações de crédito
 */

const express = require('express');
const router = express.Router();
const ApplicationsController = require('../controllers/ApplicationsController');

/**
 * POST /api/applications
 * Criar nova aplicação de crédito
 * 
 * Body:
 * - clientName, clientEmail, clientPhone, clientCpf (obrigatórios)
 * - clientAddress, clientCity, clientState, clientZipCode
 * - desiredAmount, purpose, monthlyIncome (obrigatórios)
 * - employmentStatus, employer, occupation
 * - partnerId (obrigatório)
 */
router.post('/', (req, res) => ApplicationsController.create(req, res));

/**
 * GET /api/applications
 * Listar aplicações com filtros e paginação
 * 
 * Query params:
 * - status: PENDING | APPROVED | REJECTED | ACTIVE | COMPLETED
 * - partnerId: ID do parceiro
 * - limit: limite de registros (default: 50)
 * - offset: offset para paginação (default: 0)
 * - sortBy: campo para ordenação (default: createdAt)
 * - sortOrder: asc | desc (default: desc)
 */
router.get('/', (req, res) => ApplicationsController.list(req, res));

/**
 * GET /api/applications/:id
 * Obter detalhes completos de uma aplicação
 * 
 * Includes: partner, user, documents, contract, creditReport, 
 *           receivables, partnerPayments, achPayments
 */
router.get('/:id', (req, res) => ApplicationsController.get(req, res));

/**
 * PUT /api/applications/:id/approve
 * Aprovar aplicação manualmente (admin)
 * 
 * Body:
 * - approvedAmount (obrigatório)
 * - interestRate (obrigatório)
 * - termMonths (obrigatório)
 * - reviewNotes (opcional)
 * - adminId (opcional)
 */
router.put('/:id/approve', (req, res) => ApplicationsController.approve(req, res));

/**
 * PUT /api/applications/:id/reject
 * Rejeitar aplicação
 * 
 * Body:
 * - rejectionReason (obrigatório)
 * - adminId (opcional)
 */
router.put('/:id/reject', (req, res) => ApplicationsController.reject(req, res));

module.exports = router;
