/**
 * FLEXCREDI LLC - Documents Controller (US Market)
 * Manages upload, listing, and review of client/partner documents
 * Supports: ID, SSN Card, W-2, Tax Returns, Bank Statements, etc.
 */

const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const EventBus = require('../core/EventBus');

const prisma = new PrismaClient();

// Upload directory
const UPLOADS_DIR = path.join(__dirname, '../uploads/documents');

// Create directory if it doesn't exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Allowed file types (US documents: PDF, images, Office files)
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.doc', '.docx', '.xls', '.xlsx'];

// Maximum file size: 10 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    // Unique name: timestamp-random-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitizedName}${ext}`);
  }
});

const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Validate extension
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new Error(`File type not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`));
  }
  
  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error(`MIME type not allowed: ${file.mimetype}`));
  }
  
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

class DocumentsController {
  
  /**
   * Middleware para upload de arquivo único
   */
  static uploadMiddleware = upload.single('file');
  
  /**
   * Middleware para upload de múltiplos arquivos
   */
  static uploadMultipleMiddleware = upload.array('files', 10); // Máximo 10 arquivos
  
  /**
   * Upload de documento
   * POST /api/documents/upload
   * 
   * Form-data:
   * - file: arquivo (obrigatório)
   * - userId: ID do usuário (obrigatório)
   * - applicationId: ID da aplicação (opcional)
   * - type: tipo do documento (obrigatório)
   */
  async upload(req, res) {
    try {
      // Validar se arquivo foi enviado
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }
      
      const { userId, applicationId, type } = req.body;
      
      // Validações
      if (!userId || !type) {
        // Deletar arquivo se validação falhar
        fs.unlinkSync(req.file.path);
        
        return res.status(400).json({
          success: false,
          error: 'userId and type are required'
        });
      }
      
      // Verificar se usuário existe
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }
      
      // Se applicationId fornecido, verificar se existe
      if (applicationId) {
        const application = await prisma.application.findUnique({
          where: { id: applicationId }
        });
        
        if (!application) {
          fs.unlinkSync(req.file.path);
          return res.status(404).json({
            success: false,
            error: 'Application not found'
          });
        }
      }
      
      console.log(`[DocumentsController] Uploading document: ${req.file.originalname}`);
      
      // Criar registro no banco
      const document = await prisma.document.create({
        data: {
          userId,
          applicationId: applicationId || null,
          type,
          originalName: req.file.originalname,
          fileName: req.file.filename,
          filePath: `/uploads/documents/${req.file.filename}`,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          status: 'PENDING'
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          application: applicationId ? {
            select: {
              id: true,
              clientName: true,
              status: true
            }
          } : false
        }
      });
      
      console.log(`[DocumentsController] Document uploaded: ${document.id}`);
      
      // Emitir evento para análise
      EventBus.emit('document:uploaded', {
        documentId: document.id,
        userId,
        applicationId,
        type
      });
      
      res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        data: {
          id: document.id,
          originalName: document.originalName,
          type: document.type,
          fileSize: document.fileSize,
          mimeType: document.mimeType,
          status: document.status,
          uploadedAt: document.createdAt,
          user: document.user,
          application: document.application,
          downloadUrl: `/api/documents/${document.id}/download`
        }
      });
      
    } catch (error) {
      console.error('[DocumentsController] Error uploading document:', error);
      
      // Deletar arquivo em caso de erro
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to upload document',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Listar documentos
   * GET /api/documents
   * 
   * Query params:
   * - userId: filtrar por usuário
   * - applicationId: filtrar por aplicação
   * - type: tipo do documento
   * - status: PENDING | APPROVED | REJECTED | EXPIRED
   * - limit: limite de registros (default: 50, max: 100)
   * - offset: offset para paginação (default: 0)
   */
  async list(req, res) {
    try {
      const {
        userId,
        applicationId,
        type,
        status,
        limit = 50,
        offset = 0
      } = req.query;
      
      // Construir filtros
      const where = {};
      
      if (userId) where.userId = userId;
      if (applicationId) where.applicationId = applicationId;
      if (type) where.type = type;
      if (status) where.status = status;
      
      // Contar total
      const total = await prisma.document.count({ where });
      
      // Buscar documentos
      const documents = await prisma.document.findMany({
        where,
        take: Math.min(parseInt(limit), 100),
        skip: parseInt(offset),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          application: {
            select: {
              id: true,
              clientName: true,
              status: true
            }
          }
        }
      });
      
      res.json({
        success: true,
        data: documents.map(doc => ({
          ...doc,
          downloadUrl: `/api/documents/${doc.id}/download`,
          previewUrl: `/api/documents/${doc.id}/preview`
        })),
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: total > parseInt(offset) + parseInt(limit)
        }
      });
      
    } catch (error) {
      console.error('[DocumentsController] Error listing documents:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to list documents',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Obter detalhes de um documento
   * GET /api/documents/:id
   */
  async get(req, res) {
    try {
      const { id } = req.params;
      
      const document = await prisma.document.findUnique({
        where: { id },
        include: {
          user: true,
          application: {
            include: {
              partner: {
                select: {
                  id: true,
                  companyName: true
                }
              }
            }
          }
        }
      });
      
      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document not found'
        });
      }
      
      res.json({
        success: true,
        data: {
          ...document,
          downloadUrl: `/api/documents/${document.id}/download`,
          previewUrl: `/api/documents/${document.id}/preview`
        }
      });
      
    } catch (error) {
      console.error('[DocumentsController] Error getting document:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get document',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Download de documento
   * GET /api/documents/:id/download
   */
  async download(req, res) {
    try {
      const { id } = req.params;
      
      const document = await prisma.document.findUnique({
        where: { id }
      });
      
      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document not found'
        });
      }
      
      const filePath = path.join(UPLOADS_DIR, document.fileName);
      
      if (!fs.existsSync(filePath)) {
        console.error(`[DocumentsController] File not found on disk: ${filePath}`);
        return res.status(404).json({
          success: false,
          error: 'Document file not found on server'
        });
      }
      
      // Enviar arquivo
      res.setHeader('Content-Type', document.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
      res.setHeader('Content-Length', document.fileSize);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
      console.log(`[DocumentsController] Document downloaded: ${document.id}`);
      
    } catch (error) {
      console.error('[DocumentsController] Error downloading document:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to download document',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Revisar documento (aprovar/rejeitar)
   * PUT /api/documents/:id/review
   * 
   * Body:
   * - status: APPROVED | REJECTED (obrigatório)
   * - reviewNotes: notas da revisão (opcional)
   * - reviewerId: ID do revisor (opcional)
   */
  async review(req, res) {
    try {
      const { id } = req.params;
      const { status, reviewNotes, reviewerId } = req.body;
      
      // Validação
      if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'status must be APPROVED or REJECTED'
        });
      }
      
      const document = await prisma.document.findUnique({
        where: { id }
      });
      
      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document not found'
        });
      }
      
      // Atualizar documento
      const updated = await prisma.document.update({
        where: { id },
        data: {
          status,
          reviewNotes: reviewNotes || null,
          reviewedAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
      
      console.log(`[DocumentsController] Document reviewed: ${id} - ${status}`);
      
      // Emitir evento
      EventBus.emit('document:reviewed', {
        documentId: id,
        status,
        userId: document.userId,
        applicationId: document.applicationId
      });
      
      res.json({
        success: true,
        message: `Document ${status.toLowerCase()} successfully`,
        data: updated
      });
      
    } catch (error) {
      console.error('[DocumentsController] Error reviewing document:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to review document',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
  
  /**
   * Deletar documento
   * DELETE /api/documents/:id
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const document = await prisma.document.findUnique({
        where: { id }
      });
      
      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document not found'
        });
      }
      
      // Deletar arquivo do disco
      const filePath = path.join(UPLOADS_DIR, document.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      // Deletar do banco
      await prisma.document.delete({
        where: { id }
      });
      
      console.log(`[DocumentsController] Document deleted: ${id}`);
      
      res.json({
        success: true,
        message: 'Document deleted successfully'
      });
      
    } catch (error) {
      console.error('[DocumentsController] Error deleting document:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete document',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

// Export both the class and an instance with the middleware
const controller = new DocumentsController();
controller.uploadMiddleware = DocumentsController.uploadMiddleware;

module.exports = controller;
