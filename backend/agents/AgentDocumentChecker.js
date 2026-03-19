/**
 * FLEXCREDI - AgentDocumentChecker
 * Agente autônomo para validação e análise de documentos
 */

const BaseAgent = require('./BaseAgent');
const fs = require('fs').promises;
const path = require('path');
const EventBus = require('../core/EventBus');

class AgentDocumentChecker extends BaseAgent {
  constructor(config = {}) {
    super('AgentDocumentChecker', {
      enabled: true,
      autoRetry: true,
      maxRetries: 2,
      timeout: 30000,
      ...config
    });

    // Tipos de documento aceitos
    this.documentTypes = {
      ID: ['RG', 'CNH', 'PASSPORT'],
      PROOF_RESIDENCE: ['UTILITY_BILL', 'BANK_STATEMENT', 'LEASE'],
      PROOF_INCOME: ['PAYSLIP', 'TAX_RETURN', 'BANK_STATEMENT'],
      BANK_STATEMENT: ['CURRENT_ACCOUNT', 'SAVINGS_ACCOUNT'],
      TAX_DOCUMENT: ['CPF', 'CNPJ', 'TAX_RETURN'],
      OTHER: ['CONTRACT', 'INVOICE', 'RECEIPT']
    };

    // Regras de validação por tipo
    this.validationRules = {
      ID: {
        minFileSize: 50 * 1024,        // 50 KB
        maxFileSize: 10 * 1024 * 1024, // 10 MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
        requiredFields: ['documentType', 'entityType'],
        checks: ['fileExists', 'fileSize', 'mimeType', 'imageQuality']
      },
      PROOF_RESIDENCE: {
        minFileSize: 30 * 1024,
        maxFileSize: 10 * 1024 * 1024,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
        requiredFields: ['documentType', 'entityType'],
        checks: ['fileExists', 'fileSize', 'mimeType', 'recentDate']
      },
      PROOF_INCOME: {
        minFileSize: 30 * 1024,
        maxFileSize: 10 * 1024 * 1024,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
        requiredFields: ['documentType', 'entityType'],
        checks: ['fileExists', 'fileSize', 'mimeType']
      },
      BANK_STATEMENT: {
        minFileSize: 30 * 1024,
        maxFileSize: 15 * 1024 * 1024,
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        requiredFields: ['documentType', 'entityType'],
        checks: ['fileExists', 'fileSize', 'mimeType', 'recentDate']
      },
      TAX_DOCUMENT: {
        minFileSize: 20 * 1024,
        maxFileSize: 10 * 1024 * 1024,
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
        requiredFields: ['documentType', 'entityType'],
        checks: ['fileExists', 'fileSize', 'mimeType']
      },
      OTHER: {
        minFileSize: 10 * 1024,
        maxFileSize: 20 * 1024 * 1024,
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg',
                          'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                          'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        requiredFields: ['documentType', 'entityType'],
        checks: ['fileExists', 'fileSize', 'mimeType']
      }
    };

    this.setupEventListeners();
  }

  /**
   * Configurar listeners do EventBus
   */
  setupEventListeners() {
    EventBus.on('document:uploaded', async (data) => {
      console.log(`[${this.name}] 📥 Received document:uploaded event`, data);
      
      try {
        // Auto-análise de documentos recém-enviados
        const result = await this.execute({
          documentId: data.documentId,
          filePath: data.filePath,
          documentType: data.documentType,
          entityType: data.entityType,
          entityId: data.entityId,
          autoApprove: this.config.autoApprove || false
        });

        console.log(`[${this.name}] ✓ Document analyzed automatically:`, result);
        
        // Emitir evento de análise completa
        EventBus.emit('document:analyzed', {
          documentId: data.documentId,
          status: result.status,
          issues: result.data.issues || [],
          score: result.data.score || 0,
          autoApproved: result.data.autoApproved || false
        });

      } catch (error) {
        console.error(`[${this.name}] ✗ Auto-analysis failed:`, error.message);
        
        EventBus.emit('document:analysis_failed', {
          documentId: data.documentId,
          error: error.message
        });
      }
    });
  }

  /**
   * Executar validação de documento
   * @param {object} data - Dados do documento
   * @returns {object} Resultado da validação
   */
  async run(data) {
    // Validar entrada
    this.validateInput(data, ['documentId', 'filePath', 'documentType', 'entityType']);

    const { documentId, filePath, documentType, entityType, entityId, autoApprove } = data;

    console.log(`[${this.name}] 🔍 Analyzing document:`, {
      documentId,
      documentType,
      entityType,
      entityId
    });

    // Obter regras de validação
    const rules = this.validationRules[documentType] || this.validationRules.OTHER;

    // Executar checks
    const checkResults = await this.executeChecks(filePath, documentType, rules);

    // Calcular score de confiança (0-100)
    const score = this.calculateConfidenceScore(checkResults);

    // Determinar status e issues
    const { status, issues } = this.determineStatus(checkResults, score);

    // Auto-aprovação se configurado e score alto
    let autoApproved = false;
    if (autoApprove && score >= 85 && status === 'passed') {
      autoApproved = true;
      console.log(`[${this.name}] ✓ Document auto-approved (score: ${score})`);
    }

    const result = {
      documentId,
      status,           // passed, warning, failed
      score,            // 0-100
      checks: checkResults,
      issues,           // Lista de problemas encontrados
      autoApproved,
      analyzedAt: new Date().toISOString(),
      recommendations: this.generateRecommendations(checkResults, score)
    };

    this.validateOutput(result, ['documentId', 'status', 'score', 'checks']);

    return result;
  }

  /**
   * Executar todos os checks necessários
   * @param {string} filePath - Caminho do arquivo
   * @param {string} documentType - Tipo do documento
   * @param {object} rules - Regras de validação
   * @returns {object} Resultados dos checks
   */
  async executeChecks(filePath, documentType, rules) {
    const results = {};

    for (const checkName of rules.checks) {
      try {
        switch (checkName) {
          case 'fileExists':
            results.fileExists = await this.checkFileExists(filePath);
            break;
          case 'fileSize':
            results.fileSize = await this.checkFileSize(filePath, rules.minFileSize, rules.maxFileSize);
            break;
          case 'mimeType':
            results.mimeType = await this.checkMimeType(filePath, rules.allowedMimeTypes);
            break;
          case 'imageQuality':
            results.imageQuality = await this.checkImageQuality(filePath);
            break;
          case 'recentDate':
            results.recentDate = await this.checkRecentDate(filePath);
            break;
          default:
            console.log(`[${this.name}] ⚠️  Unknown check: ${checkName}`);
        }
      } catch (error) {
        console.error(`[${this.name}] ✗ Check ${checkName} failed:`, error.message);
        results[checkName] = {
          passed: false,
          error: error.message,
          severity: 'error'
        };
      }
    }

    return results;
  }

  /**
   * Check 1: Verificar se arquivo existe
   */
  async checkFileExists(filePath) {
    try {
      const absolutePath = path.resolve(filePath);
      await fs.access(absolutePath, fs.constants.F_OK);
      
      return {
        passed: true,
        message: 'File exists',
        severity: 'none'
      };
    } catch (error) {
      return {
        passed: false,
        message: 'File not found',
        severity: 'error'
      };
    }
  }

  /**
   * Check 2: Verificar tamanho do arquivo
   */
  async checkFileSize(filePath, minSize, maxSize) {
    try {
      const absolutePath = path.resolve(filePath);
      const stats = await fs.stat(absolutePath);
      const fileSize = stats.size;

      if (fileSize < minSize) {
        return {
          passed: false,
          message: `File too small (${this.formatBytes(fileSize)}, min: ${this.formatBytes(minSize)})`,
          severity: 'error',
          fileSize
        };
      }

      if (fileSize > maxSize) {
        return {
          passed: false,
          message: `File too large (${this.formatBytes(fileSize)}, max: ${this.formatBytes(maxSize)})`,
          severity: 'error',
          fileSize
        };
      }

      return {
        passed: true,
        message: `File size OK (${this.formatBytes(fileSize)})`,
        severity: 'none',
        fileSize
      };
    } catch (error) {
      return {
        passed: false,
        message: `Error checking file size: ${error.message}`,
        severity: 'error'
      };
    }
  }

  /**
   * Check 3: Verificar MIME type
   */
  async checkMimeType(filePath, allowedTypes) {
    try {
      const absolutePath = path.resolve(filePath);
      const extension = path.extname(absolutePath).toLowerCase();
      
      // Mapeamento simples de extensões para MIME types
      const mimeMap = {
        '.pdf': 'application/pdf',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };

      const detectedMimeType = mimeMap[extension] || 'application/octet-stream';

      if (!allowedTypes.includes(detectedMimeType)) {
        return {
          passed: false,
          message: `Invalid file type (${detectedMimeType}). Allowed: ${allowedTypes.join(', ')}`,
          severity: 'error',
          detectedMimeType,
          allowedTypes
        };
      }

      return {
        passed: true,
        message: `File type OK (${detectedMimeType})`,
        severity: 'none',
        detectedMimeType
      };
    } catch (error) {
      return {
        passed: false,
        message: `Error checking MIME type: ${error.message}`,
        severity: 'error'
      };
    }
  }

  /**
   * Check 4: Verificar qualidade da imagem (mock - seria integração com OCR/Vision API)
   */
  async checkImageQuality(filePath) {
    try {
      const absolutePath = path.resolve(filePath);
      const stats = await fs.stat(absolutePath);
      const fileSize = stats.size;

      // Mock: arquivos muito pequenos provavelmente têm baixa qualidade
      if (fileSize < 100 * 1024) {
        return {
          passed: false,
          message: 'Image quality appears low (file size < 100 KB)',
          severity: 'warning',
          qualityScore: 50
        };
      }

      // Mock: assumir boa qualidade para arquivos maiores
      return {
        passed: true,
        message: 'Image quality OK',
        severity: 'none',
        qualityScore: 85
      };
    } catch (error) {
      return {
        passed: false,
        message: `Error checking image quality: ${error.message}`,
        severity: 'warning'
      };
    }
  }

  /**
   * Check 5: Verificar data recente do documento (mock)
   */
  async checkRecentDate(filePath) {
    try {
      // Mock: verificar data de modificação do arquivo
      const absolutePath = path.resolve(filePath);
      const stats = await fs.stat(absolutePath);
      const fileDate = stats.mtime;
      const now = new Date();
      const daysDiff = Math.floor((now - fileDate) / (1000 * 60 * 60 * 24));

      // Documentos devem ter no máximo 90 dias
      if (daysDiff > 90) {
        return {
          passed: false,
          message: `Document appears old (${daysDiff} days). Should be < 90 days.`,
          severity: 'warning',
          daysDiff
        };
      }

      return {
        passed: true,
        message: `Document is recent (${daysDiff} days old)`,
        severity: 'none',
        daysDiff
      };
    } catch (error) {
      return {
        passed: false,
        message: `Error checking document date: ${error.message}`,
        severity: 'warning'
      };
    }
  }

  /**
   * Calcular score de confiança (0-100)
   */
  calculateConfidenceScore(checkResults) {
    const checks = Object.values(checkResults);
    
    if (checks.length === 0) return 0;

    let totalScore = 0;
    let weights = {
      error: 0,      // Check crítico falhou
      warning: 70,   // Check com warning
      none: 100      // Check passou
    };

    for (const check of checks) {
      const severity = check.severity || 'none';
      const weight = check.passed ? weights[severity] : weights.error;
      totalScore += weight;
    }

    const averageScore = totalScore / checks.length;
    return Math.round(averageScore);
  }

  /**
   * Determinar status final e issues
   */
  determineStatus(checkResults, score) {
    const issues = [];
    let hasErrors = false;
    let hasWarnings = false;

    for (const [checkName, result] of Object.entries(checkResults)) {
      if (!result.passed) {
        if (result.severity === 'error') {
          hasErrors = true;
          issues.push({
            check: checkName,
            severity: 'error',
            message: result.message
          });
        } else if (result.severity === 'warning') {
          hasWarnings = true;
          issues.push({
            check: checkName,
            severity: 'warning',
            message: result.message
          });
        }
      }
    }

    let status = 'passed';
    if (hasErrors || score < 50) {
      status = 'failed';
    } else if (hasWarnings || score < 85) {
      status = 'warning';
    }

    return { status, issues };
  }

  /**
   * Gerar recomendações de ação
   */
  generateRecommendations(checkResults, score) {
    const recommendations = [];

    if (score < 50) {
      recommendations.push('Reject document and request new upload');
    } else if (score < 70) {
      recommendations.push('Request manual review by admin');
      recommendations.push('Contact client for clarification');
    } else if (score < 85) {
      recommendations.push('Approve with caution');
      recommendations.push('Optional manual review recommended');
    } else {
      recommendations.push('Auto-approve document');
      recommendations.push('No further action required');
    }

    // Recomendações específicas por check
    for (const [checkName, result] of Object.entries(checkResults)) {
      if (!result.passed && result.severity === 'error') {
        if (checkName === 'fileSize') {
          recommendations.push('Request client to upload correct file size');
        } else if (checkName === 'mimeType') {
          recommendations.push('Request client to upload in correct format (PDF or JPEG)');
        } else if (checkName === 'imageQuality') {
          recommendations.push('Request higher quality scan or photo');
        }
      }
    }

    return recommendations;
  }

  /**
   * Helper: Formatar bytes
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

module.exports = AgentDocumentChecker;
