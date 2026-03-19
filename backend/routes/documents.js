/**
 * FLEXCREDI - Documents Routes
 * Rotas para gerenciar documentos
 */

const express = require('express');
const router = express.Router();
const DocumentsController = require('../controllers/DocumentsController');

/**
 * POST /api/documents/upload
 * Upload de documento
 * 
 * Form-data (multipart/form-data):
 * - file: arquivo (obrigatório)
 * - userId: ID do usuário (obrigatório)
 * - applicationId: ID da aplicação (opcional)
 * - type: tipo do documento (obrigatório)
 *         ID | PROOF_OF_INCOME | BANK_STATEMENT | TAX_RETURN | 
 *         UTILITY_BILL | BUSINESS_LICENSE | OTHER
 */
router.post('/upload', 
  DocumentsController.uploadMiddleware,
  (req, res) => DocumentsController.upload(req, res)
);

/**
 * GET /api/documents
 * Listar documentos com filtros e paginação
 * 
 * Query params:
 * - userId: ID do usuário
 * - applicationId: ID da aplicação
 * - type: tipo do documento
 * - status: PENDING | APPROVED | REJECTED | EXPIRED
 * - limit: limite de registros (default: 50, max: 100)
 * - offset: offset para paginação (default: 0)
 */
router.get('/', (req, res) => DocumentsController.list(req, res));

/**
 * GET /api/documents/:id
 * Obter detalhes completos de um documento
 * 
 * Includes: user, application, partner
 */
router.get('/:id', (req, res) => DocumentsController.get(req, res));

/**
 * GET /api/documents/:id/download
 * Download do documento
 */
router.get('/:id/download', (req, res) => DocumentsController.download(req, res));

/**
 * PUT /api/documents/:id/review
 * Revisar documento (aprovar/rejeitar)
 * 
 * Body:
 * - status: APPROVED | REJECTED (obrigatório)
 * - reviewNotes: notas da revisão (opcional)
 * - reviewerId: ID do revisor (opcional)
 */
router.put('/:id/review', (req, res) => DocumentsController.review(req, res));

/**
 * DELETE /api/documents/:id
 * Deletar documento
 */
router.delete('/:id', (req, res) => DocumentsController.delete(req, res));

module.exports = router;
