/**
 * FLEXCREDI - EventBus
 * Sistema de comunicação entre agentes autônomos
 * Padrão: Pub/Sub (Publish/Subscribe)
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class EventBus {
  constructor() {
    this.listeners = {};
    this.eventHistory = [];
    this.maxHistorySize = 1000;
  }

  /**
   * Registrar um listener para um evento
   * @param {string} event - Nome do evento (ex: 'application.created')
   * @param {function} handler - Função callback assíncrona
   */
  on(event, handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    
    this.listeners[event].push(handler);
    console.log(`[EventBus] Listener registered for: ${event} (total: ${this.listeners[event].length})`);
  }

  /**
   * Remover um listener
   * @param {string} event - Nome do evento
   * @param {function} handler - Função callback a remover
   */
  off(event, handler) {
    if (!this.listeners[event]) return;
    
    this.listeners[event] = this.listeners[event].filter(h => h !== handler);
    console.log(`[EventBus] Listener removed from: ${event} (remaining: ${this.listeners[event].length})`);
  }

  /**
   * Emitir um evento
   * @param {string} event - Nome do evento
   * @param {object} data - Dados do evento
   */
  async emit(event, data) {
    const timestamp = new Date();
    
    console.log(`\n[EventBus] 🔔 Event emitted: ${event}`, {
      data: JSON.stringify(data).substring(0, 100) + '...',
      timestamp: timestamp.toISOString()
    });
    
    // Salvar no histórico
    this.eventHistory.push({
      event,
      data,
      timestamp,
      listenersCount: this.listeners[event]?.length || 0
    });
    
    // Limitar tamanho do histórico
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
    
    // Executar listeners
    if (this.listeners[event]) {
      console.log(`[EventBus] Notifying ${this.listeners[event].length} listener(s)...`);
      
      const results = [];
      
      for (const handler of this.listeners[event]) {
        try {
          const startTime = Date.now();
          const result = await handler(data);
          const duration = Date.now() - startTime;
          
          results.push({
            success: true,
            duration,
            result
          });
          
          console.log(`[EventBus] ✓ Listener executed successfully (${duration}ms)`);
        } catch (error) {
          console.error(`[EventBus] ✗ Error in listener for ${event}:`, error.message);
          
          results.push({
            success: false,
            error: error.message,
            stack: error.stack
          });
        }
      }
      
      // Log no banco de dados
      await this.logEvent(event, data, results);
      
      return results;
    } else {
      console.log(`[EventBus] ⚠️  No listeners registered for: ${event}`);
      await this.logEvent(event, data, []);
      return [];
    }
  }

  /**
   * Salvar evento no audit log
   * @param {string} event - Nome do evento
   * @param {object} data - Dados do evento
   * @param {array} results - Resultados da execução dos listeners
   */
  async logEvent(event, data, results) {
    try {
      await prisma.auditLog.create({
        data: {
          action: 'EVENT_EMITTED',
          entity: 'EventBus',
          entityId: event,
          changes: {
            event,
            data,
            results,
            listenersCount: results.length,
            successCount: results.filter(r => r.success).length,
            failureCount: results.filter(r => !r.success).length
          },
          timestamp: new Date()
        }
      });
    } catch (error) {
      console.error('[EventBus] Error logging event:', error.message);
    }
  }

  /**
   * Obter histórico de eventos
   * @param {number} limit - Número de eventos a retornar
   */
  getHistory(limit = 50) {
    return this.eventHistory.slice(-limit);
  }

  /**
   * Obter estatísticas do EventBus
   */
  getStats() {
    const totalListeners = Object.values(this.listeners).reduce((sum, arr) => sum + arr.length, 0);
    const totalEvents = Object.keys(this.listeners).length;
    
    return {
      totalEvents,
      totalListeners,
      eventsWithListeners: Object.entries(this.listeners).map(([event, handlers]) => ({
        event,
        listenersCount: handlers.length
      })),
      historySize: this.eventHistory.length,
      recentEvents: this.getHistory(10)
    };
  }

  /**
   * Limpar todos os listeners (útil para testes)
   */
  clearAll() {
    this.listeners = {};
    console.log('[EventBus] All listeners cleared');
  }

  /**
   * Emitir evento sem aguardar resposta (fire and forget)
   * @param {string} event - Nome do evento
   * @param {object} data - Dados do evento
   */
  emitAsync(event, data) {
    // Não aguarda a execução
    this.emit(event, data).catch(error => {
      console.error(`[EventBus] Error in async emit for ${event}:`, error);
    });
    
    console.log(`[EventBus] Event ${event} emitted asynchronously`);
  }
}

// Singleton instance
const eventBus = new EventBus();

module.exports = eventBus;
