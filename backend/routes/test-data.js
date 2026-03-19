/**
 * Test Data Routes
 * Cross-domain storage for test clients and applications
 * NOW WITH DATABASE PERSISTENCE! 🎉
 */

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
async function initDatabase() {
  const client = await pool.connect();
  try {
    // Create test_clients table
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_clients (
        id VARCHAR(255) PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create test_applications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_applications (
        id VARCHAR(255) PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Test data tables initialized');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    client.release();
  }
}

// Initialize on startup
initDatabase();

/**
 * GET /api/test-data/clients
 * Retorna todos os clientes de teste (FROM DATABASE)
 */
router.get('/clients', async (req, res) => {
  const client = await pool.connect();
  try {
    console.log('📊 GET /api/test-data/clients - Buscando do banco de dados...');
    
    const result = await client.query('SELECT data FROM test_clients ORDER BY updated_at DESC');
    const testClients = result.rows.map(row => row.data);
    
    console.log(`✅ Retornando ${testClients.length} clientes de teste do database`);
    
    res.json({
      success: true,
      data: testClients,
      count: testClients.length,
      source: 'database'
    });
  } catch (error) {
    console.error('❌ Erro ao buscar clientes de teste:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar clientes de teste',
      details: error.message
    });
  } finally {
    client.release();
  }
});

/**
 * GET /api/test-data/applications
 * Retorna todas as aplicações de teste (FROM DATABASE)
 */
router.get('/applications', async (req, res) => {
  const client = await pool.connect();
  try {
    console.log('📊 GET /api/test-data/applications - Buscando do banco de dados...');
    
    const result = await client.query('SELECT data FROM test_applications ORDER BY updated_at DESC');
    const testApplications = result.rows.map(row => row.data);
    
    console.log(`✅ Retornando ${testApplications.length} aplicações de teste do database`);
    
    res.json({
      success: true,
      data: testApplications,
      count: testApplications.length,
      source: 'database'
    });
  } catch (error) {
    console.error('❌ Erro ao buscar aplicações de teste:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar aplicações de teste',
      details: error.message
    });
  } finally {
    client.release();
  }
});

/**
 * POST /api/test-data/clients
 * Salva um cliente de teste (TO DATABASE)
 */
router.post('/clients', async (req, res) => {
  const dbClient = await pool.connect();
  try {
    let clientData = req.body;
    
    // Handle nested userData structure from frontend
    if (clientData.userData && !clientData.id) {
      clientData = { ...clientData.userData, ...clientData };
    }
    
    if (!clientData.id && !clientData.clientId && !clientData.applicationId) {
      return res.status(400).json({
        success: false,
        error: 'Dados do cliente inválidos - ID não encontrado'
      });
    }
    
    // Use any available ID
    const id = clientData.id || clientData.clientId || clientData.applicationId;
    clientData.id = id;
    
    console.log(`💾 Salvando cliente de teste: ${id}`);
    console.log('📦 Data keys:', Object.keys(clientData));
    if (clientData.documents) {
      console.log('📄 Documents:', Object.keys(clientData.documents).filter(k => clientData.documents[k].uploaded));
    }
    
    // Insert or update
    await dbClient.query(`
      INSERT INTO test_clients (id, data, updated_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (id) 
      DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP
    `, [id, JSON.stringify(clientData)]);
    
    console.log(`✅ Cliente de teste salvo no database: ${id}`);
    
    res.json({
      success: true,
      data: clientData,
      message: 'Cliente de teste salvo com sucesso no database',
      id: id
    });
  } catch (error) {
    console.error('❌ Erro ao salvar cliente de teste:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao salvar cliente de teste',
      details: error.message
    });
  } finally {
    dbClient.release();
  }
});

/**
 * POST /api/test-data/applications
 * Salva uma aplicação de teste (TO DATABASE)
 */
router.post('/applications', async (req, res) => {
  const dbClient = await pool.connect();
  try {
    let applicationData = req.body;
    
    // Handle nested userData structure from frontend
    if (applicationData.userData && !applicationData.id) {
      applicationData = { ...applicationData.userData, ...applicationData };
    }
    
    if (!applicationData.id && !applicationData.applicationId && !applicationData.clientId) {
      return res.status(400).json({
        success: false,
        error: 'Dados da aplicação inválidos - ID não encontrado'
      });
    }
    
    // Use any available ID
    const id = applicationData.id || applicationData.applicationId || applicationData.clientId;
    applicationData.id = id;
    
    console.log(`💾 Salvando aplicação de teste: ${id}`);
    
    // Insert or update
    await dbClient.query(`
      INSERT INTO test_applications (id, data, updated_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (id) 
      DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP
    `, [id, JSON.stringify(applicationData)]);
    
    console.log(`✅ Aplicação de teste salva no database: ${id}`);
    
    res.json({
      success: true,
      data: applicationData,
      message: 'Aplicação de teste salva com sucesso no database',
      id: id
    });
  } catch (error) {
    console.error('❌ Erro ao salvar aplicação de teste:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao salvar aplicação de teste',
      details: error.message
    });
  } finally {
    dbClient.release();
  }
});

/**
 * DELETE /api/test-data/clear
 * Limpa todos os dados de teste (FROM DATABASE)
 */
router.delete('/clear', async (req, res) => {
  const client = await pool.connect();
  try {
    const clientResult = await client.query('SELECT COUNT(*) FROM test_clients');
    const applicationResult = await client.query('SELECT COUNT(*) FROM test_applications');
    
    const clientCount = parseInt(clientResult.rows[0].count);
    const applicationCount = parseInt(applicationResult.rows[0].count);
    
    await client.query('DELETE FROM test_clients');
    await client.query('DELETE FROM test_applications');
    
    console.log(`🗑️ Dados de teste limpos do database: ${clientCount} clientes, ${applicationCount} aplicações`);
    
    res.json({
      success: true,
      message: `Dados de teste limpos: ${clientCount} clientes, ${applicationCount} aplicações`,
      deleted: { clients: clientCount, applications: applicationCount }
    });
  } catch (error) {
    console.error('❌ Erro ao limpar dados de teste:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao limpar dados de teste',
      details: error.message
    });
  } finally {
    client.release();
  }
});

/**
 * GET /api/test-data/stats
 * Retorna estatísticas dos dados de teste (FROM DATABASE)
 */
router.get('/stats', async (req, res) => {
  const client = await pool.connect();
  try {
    const clientResult = await client.query('SELECT COUNT(*) FROM test_clients');
    const applicationResult = await client.query('SELECT COUNT(*) FROM test_applications');
    
    res.json({
      success: true,
      data: {
        clients: parseInt(clientResult.rows[0].count),
        applications: parseInt(applicationResult.rows[0].count),
        lastUpdate: new Date().toISOString(),
        storage: 'database'
      }
    });
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas',
      details: error.message
    });
  } finally {
    client.release();
  }
});

module.exports = router;
