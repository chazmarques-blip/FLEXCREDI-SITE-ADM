const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    version: '4.1.0-FIXED',
    timestamp: new Date().toISOString() 
  });
});

// Test database connection
app.get('/api/debug/database-test', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    res.json({
      success: true,
      database: {
        connected: true,
        tablesFound: tables.length,
        tables: tables.map(t => t.table_name)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Import fixed admin routes
const adminRoutes = require('./routes/admin.FIXED.js');
app.use('/api/admin', adminRoutes);

// Import other routes
const partnersRoutes = require('./routes/partners');
const applicationsRoutes = require('./routes/applications');

app.use('/api/partners', partnersRoutes);
app.use('/api/applications', applicationsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
  console.log(`🔗 DB Test: http://localhost:${PORT}/api/debug/database-test`);
  console.log(`🔗 Dashboard: http://localhost:${PORT}/api/admin/dashboard`);
});
