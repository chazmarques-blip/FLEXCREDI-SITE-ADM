/**
 * FLEXCREDI - BaseAgent
 * Classe base para todos os agentes autônomos
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class BaseAgent {
  constructor(name, config = {}) {
    this.name = name;
    this.config = {
      enabled: true,
      autoRetry: true,
      maxRetries: 3,
      retryDelay: 1000, // ms
      timeout: 30000,   // 30s
      ...config
    };
    
    this.active = true;
    this.lastRunAt = null;
    this.runCount = 0;
    this.successCount = 0;
    this.errorCount = 0;
    this.totalDuration = 0;
    
    console.log(`[${this.name}] Agent initialized with config:`, this.config);
  }

  /**
   * Executar o agente
   * @param {object} data - Dados de entrada
   * @returns {object} Resultado da execução
   */
  async execute(data) {
    if (!this.active || !this.config.enabled) {
      console.log(`[${this.name}] Agent is ${!this.active ? 'inactive' : 'disabled'}`);
      return { status: 'skipped', reason: 'Agent not active or disabled' };
    }

    console.log(`\n[${this.name}] ▶️  Starting execution #${this.runCount + 1}`);
    console.log(`[${this.name}] Input:`, JSON.stringify(data).substring(0, 200) + '...');
    
    const startTime = Date.now();
    this.runCount++;
    
    let attempt = 0;
    let lastError = null;

    while (attempt < (this.config.maxRetries || 1)) {
      attempt++;
      
      if (attempt > 1) {
        console.log(`[${this.name}] Retry attempt ${attempt}/${this.config.maxRetries}`);
        await this.delay(this.config.retryDelay * attempt);
      }

      try {
        // Executar com timeout
        const result = await Promise.race([
          this.run(data),
          this.timeout(this.config.timeout)
        ]);
        
        const duration = Date.now() - startTime;
        this.totalDuration += duration;
        this.successCount++;
        this.lastRunAt = new Date();
        
        console.log(`[${this.name}] ✓ Execution successful (${duration}ms)`);
        console.log(`[${this.name}] Result:`, JSON.stringify(result).substring(0, 200) + '...');
        
        // Log de sucesso
        await this.logExecution('SUCCESS', data, result, duration);
        
        return {
          status: 'success',
          data: result,
          duration,
          attempt
        };
        
      } catch (error) {
        lastError = error;
        this.errorCount++;
        
        console.error(`[${this.name}] ✗ Error on attempt ${attempt}:`, error.message);
        
        if (attempt >= (this.config.maxRetries || 1) || !this.config.autoRetry) {
          break;
        }
      }
    }

    // Se chegou aqui, todas as tentativas falharam
    const duration = Date.now() - startTime;
    this.totalDuration += duration;
    this.lastRunAt = new Date();
    
    console.error(`[${this.name}] ❌ Execution failed after ${attempt} attempt(s)`);
    
    // Log de erro
    await this.logExecution('ERROR', data, {
      error: lastError.message,
      stack: lastError.stack,
      attempts: attempt
    }, duration);
    
    throw lastError;
  }

  /**
   * Método abstrato - deve ser implementado pelas subclasses
   * @param {object} data - Dados de entrada
   * @returns {object} Resultado da execução
   */
  async run(data) {
    throw new Error(`run() method must be implemented by ${this.name}`);
  }

  /**
   * Timeout promise
   * @param {number} ms - Timeout em milissegundos
   */
  timeout(ms) {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Agent ${this.name} timed out after ${ms}ms`));
      }, ms);
    });
  }

  /**
   * Delay helper
   * @param {number} ms - Delay em milissegundos
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Salvar log de execução no banco
   * @param {string} status - SUCCESS ou ERROR
   * @param {object} input - Dados de entrada
   * @param {object} output - Dados de saída ou erro
   * @param {number} duration - Duração em ms
   */
  async logExecution(status, input, output, duration) {
    try {
      await prisma.auditLog.create({
        data: {
          action: 'AGENT_EXECUTION',
          entity: this.name,
          changes: {
            status,
            input,
            output,
            duration,
            stats: {
              runCount: this.runCount,
              successCount: this.successCount,
              errorCount: this.errorCount,
              successRate: this.getSuccessRate(),
              avgDuration: this.getAverageDuration()
            }
          },
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error(`[${this.name}] Error logging execution:`, error.message);
    }
  }

  /**
   * Obter status do agente
   */
  getStatus() {
    return {
      name: this.name,
      active: this.active,
      enabled: this.config.enabled,
      lastRunAt: this.lastRunAt,
      stats: {
        runCount: this.runCount,
        successCount: this.successCount,
        errorCount: this.errorCount,
        successRate: this.getSuccessRate(),
        avgDuration: this.getAverageDuration()
      },
      config: this.config
    };
  }

  /**
   * Calcular taxa de sucesso
   */
  getSuccessRate() {
    if (this.runCount === 0) return 0;
    return ((this.successCount / this.runCount) * 100).toFixed(2) + '%';
  }

  /**
   * Calcular duração média
   */
  getAverageDuration() {
    if (this.runCount === 0) return 0;
    return Math.round(this.totalDuration / this.runCount);
  }

  /**
   * Ativar agente
   */
  activate() {
    this.active = true;
    console.log(`[${this.name}] Agent activated`);
  }

  /**
   * Desativar agente
   */
  deactivate() {
    this.active = false;
    console.log(`[${this.name}] Agent deactivated`);
  }

  /**
   * Atualizar configuração
   * @param {object} newConfig - Nova configuração
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log(`[${this.name}] Config updated:`, this.config);
  }

  /**
   * Resetar estatísticas
   */
  resetStats() {
    this.runCount = 0;
    this.successCount = 0;
    this.errorCount = 0;
    this.totalDuration = 0;
    this.lastRunAt = null;
    console.log(`[${this.name}] Stats reset`);
  }

  /**
   * Helper para validar dados de entrada
   * @param {object} data - Dados a validar
   * @param {array} requiredFields - Campos obrigatórios
   */
  validateInput(data, requiredFields = []) {
    const missing = requiredFields.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
    
    return true;
  }

  /**
   * Helper para validar dados de saída
   * @param {object} result - Resultado a validar
   * @param {array} requiredFields - Campos obrigatórios
   */
  validateOutput(result, requiredFields = []) {
    const missing = requiredFields.filter(field => result[field] === undefined);
    
    if (missing.length > 0) {
      throw new Error(`Output missing required fields: ${missing.join(', ')}`);
    }
    
    return true;
  }
}

module.exports = BaseAgent;
