/**
 * FLEXCREDI - Partners Routes
 * Rotas para gerenciar parceiros
 */

const express = require('express');
const router = express.Router();
const PartnersController = require('../controllers/PartnersController');

/**
 * POST /api/partners
 * Cadastrar novo parceiro
 * 
 * Body:
 * - companyName, tradeName, cnpj, email, phone (obrigatórios)
 * - address, city, state, zipCode (obrigatórios)
 * - legalRepName, legalRepCpf, legalRepEmail, legalRepPhone (obrigatórios)
 * - bankName, bankBranch, bankAccount, bankAccountType, bankRoutingNumber
 * - monthlyRevenue, monthlyReceivables
 */
router.post('/', (req, res) => PartnersController.create(req, res));

/**
 * GET /api/partners
 * Listar parceiros com filtros e paginação
 * 
 * Query params:
 * - status: PENDING | APPROVED | REJECTED | SUSPENDED
 * - limit: limite de registros (default: 50)
 * - offset: offset para paginação (default: 0)
 * - sortBy: campo para ordenação (default: createdAt)
 * - sortOrder: asc | desc (default: desc)
 */
router.get('/', (req, res) => PartnersController.list(req, res));

/**
 * GET /api/partners/:id
 * Obter detalhes completos de um parceiro
 * 
 * Includes: applications, receivables, payments, documents, _count
 */
router.get('/:id', (req, res) => PartnersController.get(req, res));

/**
 * PUT /api/partners/:id
 * Atualizar dados do parceiro
 * 
 * Body: campos a serem atualizados
 * (exceto: id, status, approvedAt, approvedBy)
 */
router.put('/:id', (req, res) => PartnersController.update(req, res));

/**
 * PUT /api/partners/:id/approve
 * Aprovar parceiro (admin)
 * 
 * Body:
 * - creditLimit (opcional)
 * - adminId (opcional)
 */
router.put('/:id/approve', (req, res) => PartnersController.approve(req, res));

/**
 * PUT /api/partners/:id/reject
 * Rejeitar parceiro
 * 
 * Body:
 * - rejectionReason (obrigatório)
 * - adminId (opcional)
 */
router.put('/:id/reject', (req, res) => PartnersController.reject(req, res));

module.exports = router;
