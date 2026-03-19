const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('Tentando conectar ao Supabase...');
    await client.connect();
    console.log('✅ Conexão bem-sucedida!');
    
    const res = await client.query('SELECT version()');
    console.log('📊 PostgreSQL Version:', res.rows[0].version);
    
    await client.end();
    console.log('✅ Teste completo!');
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

testConnection();
