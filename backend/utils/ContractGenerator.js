/**
 * FLEXCREDI - Contract Generator
 * 
 * Gera contratos em DOCX a partir do template com substituição de variáveis.
 * Usa pizzip + docxtemplater para manipular arquivos DOCX.
 */

const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const crypto = require('crypto');
const { mapApplicationToContract, validateContractVariables } = require('./contractVariablesMapper');

const TEMPLATE_PATH = path.join(__dirname, '../templates/contracts/personal-loan-agreement-template.docx');
const CONTRACTS_DIR = path.join(__dirname, '../uploads/contracts');

// Criar diretório se não existir
if (!fs.existsSync(CONTRACTS_DIR)) {
  fs.mkdirSync(CONTRACTS_DIR, { recursive: true });
}

class ContractGenerator {
  
  /**
   * Gera hash SHA-256 de um buffer
   * @param {Buffer} buffer - Buffer do arquivo
   * @returns {string} - Hash em hexadecimal
   */
  static generateHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }
  
  /**
   * Gera número único de contrato
   * @returns {string} - Formato: FL2026001234
   */
  static generateContractNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `FL${year}${random}`;
  }
  
  /**
   * Carrega template DOCX
   * @returns {Buffer} - Buffer do template
   */
  static loadTemplate() {
    if (!fs.existsSync(TEMPLATE_PATH)) {
      throw new Error(`Template not found at: ${TEMPLATE_PATH}`);
    }
    
    return fs.readFileSync(TEMPLATE_PATH, 'binary');
  }
  
  /**
   * Gera contrato DOCX com variáveis substituídas
   * @param {string} applicationId - ID da aplicação
   * @param {Date} effectiveDate - Data de início do contrato
   * @returns {Object} - { buffer, variables, hash, contractNumber }
   */
  static async generateContract(applicationId, effectiveDate = new Date()) {
    try {
      console.log(`[ContractGenerator] Generating contract for application: ${applicationId}`);
      
      // 1. Mapear variáveis da aplicação
      const variables = await mapApplicationToContract(applicationId, effectiveDate);
      
      // 2. Validar variáveis obrigatórias
      const validation = validateContractVariables(variables);
      if (!validation.valid) {
        throw new Error(`Missing required fields: ${validation.missing.join(', ')}`);
      }
      
      console.log('[ContractGenerator] Variables mapped successfully');
      
      // 3. Carregar template
      const templateContent = this.loadTemplate();
      const zip = new PizZip(templateContent);
      
      // 4. Criar instância do Docxtemplater
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: () => '' // Retorna string vazia para variáveis não encontradas
      });
      
      // 5. Substituir variáveis
      doc.setData(variables);
      
      try {
        doc.render();
      } catch (error) {
        console.error('[ContractGenerator] Error rendering template:', error);
        throw new Error(`Template render error: ${error.message}`);
      }
      
      // 6. Gerar buffer do documento
      const buffer = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE'
      });
      
      // 7. Calcular hash do documento
      const hash = this.generateHash(buffer);
      
      // 8. Gerar número do contrato
      const contractNumber = this.generateContractNumber();
      
      console.log(`[ContractGenerator] Contract generated successfully: ${contractNumber}`);
      console.log(`[ContractGenerator] Document hash: ${hash}`);
      console.log(`[ContractGenerator] Document size: ${(buffer.length / 1024).toFixed(2)} KB`);
      
      return {
        buffer,
        variables,
        hash,
        contractNumber,
        fileName: `Loan_Agreement_${contractNumber}.docx`,
        size: buffer.length,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      };
      
    } catch (error) {
      console.error('[ContractGenerator] Error generating contract:', error);
      throw error;
    }
  }
  
  /**
   * Salva contrato em disco
   * @param {Buffer} buffer - Buffer do contrato
   * @param {string} fileName - Nome do arquivo
   * @returns {string} - Caminho completo do arquivo salvo
   */
  static saveContract(buffer, fileName) {
    const filePath = path.join(CONTRACTS_DIR, fileName);
    fs.writeFileSync(filePath, buffer);
    console.log(`[ContractGenerator] Contract saved to: ${filePath}`);
    return filePath;
  }
  
  /**
   * Gera e salva contrato completo
   * @param {string} applicationId - ID da aplicação
   * @param {Date} effectiveDate - Data de início
   * @returns {Object} - Informações do contrato gerado
   */
  static async generateAndSave(applicationId, effectiveDate) {
    const contract = await this.generateContract(applicationId, effectiveDate);
    const filePath = this.saveContract(contract.buffer, contract.fileName);
    
    return {
      ...contract,
      filePath,
      relativePath: `/uploads/contracts/${contract.fileName}`
    };
  }
  
  /**
   * Lê contrato existente do disco
   * @param {string} fileName - Nome do arquivo
   * @returns {Buffer} - Buffer do arquivo
   */
  static readContract(fileName) {
    const filePath = path.join(CONTRACTS_DIR, fileName);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Contract file not found: ${fileName}`);
    }
    
    return fs.readFileSync(filePath);
  }
  
  /**
   * Verifica integridade de um contrato
   * @param {Buffer} buffer - Buffer do contrato
   * @param {string} expectedHash - Hash esperado
   * @returns {boolean} - true se íntegro
   */
  static verifyIntegrity(buffer, expectedHash) {
    const actualHash = this.generateHash(buffer);
    return actualHash === expectedHash;
  }
  
  /**
   * Lista todos os contratos salvos
   * @returns {Array} - Lista de arquivos
   */
  static listContracts() {
    if (!fs.existsSync(CONTRACTS_DIR)) {
      return [];
    }
    
    return fs.readdirSync(CONTRACTS_DIR)
      .filter(file => file.endsWith('.docx'))
      .map(file => ({
        fileName: file,
        filePath: path.join(CONTRACTS_DIR, file),
        size: fs.statSync(path.join(CONTRACTS_DIR, file)).size,
        createdAt: fs.statSync(path.join(CONTRACTS_DIR, file)).birthtime
      }));
  }
}

module.exports = ContractGenerator;
