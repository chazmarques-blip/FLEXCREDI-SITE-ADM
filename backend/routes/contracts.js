/**
 * FLEXCREDI - Contracts Routes
 * Rotas para gerenciar contratos
 */

const express = require('express');
const router = express.Router();
const ContractsController = require('../controllers/ContractsController');

/**
 * POST /api/contracts/generate
 * Gerar novo contrato a partir de uma aplicação aprovada
 * 
 * Body:
 * - applicationId: string (obrigatório)
 * - effectiveDate: string (opcional, formato: YYYY-MM-DD)
 */
router.post('/generate', (req, res) => ContractsController.generate(req, res));

/**
 * GET /api/contracts
 * Listar contratos com filtros e paginação
 * 
 * Query params:
 * - status: GENERATED | SENT | SIGNED | ACTIVE | COMPLETED | CANCELLED
 * - applicationId: ID da aplicação
 * - partnerId: ID do parceiro
 * - limit: limite de registros (default: 50, max: 100)
 * - offset: offset para paginação (default: 0)
 */
router.get('/', (req, res) => ContractsController.list(req, res));

/**
 * GET /api/contracts/:id
 * Obter detalhes completos de um contrato
 * 
 * Includes: application, user, partner, creditReport
 */
router.get('/:id', (req, res) => ContractsController.get(req, res));

/**
 * GET /api/contracts/:id/download
 * Download do contrato em formato DOCX
 * 
 * Verifica integridade do arquivo (hash SHA-256)
 */
router.get('/:id/download', (req, res) => ContractsController.download(req, res));

/**
 * DELETE /api/contracts/:id
 * Deletar contrato (apenas se status = GENERATED)
 */
router.delete('/:id', (req, res) => ContractsController.delete(req, res));

module.exports = router;
