require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  options: '-c search_path=public'
});

async function testConnection() {
  try {
    console.log('Tentando conectar ao Supabase Pooler (IPv4)...');
    await client.connect();
    console.log('✅ Conexão bem-sucedida!');
    
    const res = await client.query('SELECT version()');
    console.log('📊 PostgreSQL Version:', res.rows[0].version);
    
    const tables = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    console.log('📋 Tabelas existentes:', tables.rows.length);
    
    await client.end();
    console.log('✅ Teste completo!');
    return true;
  } catch (err) {
    console.error('❌ Erro:', err.message);
    return false;
  }
}

testConnection();
