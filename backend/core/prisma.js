/**
 * FLEXCREDI - Prisma Client Singleton
 * Single instance to prevent "prepared statement already exists" error
 * Fixed for Supabase/PgBouncer connection pooling
 */

const { PrismaClient } = require('@prisma/client');

// Create a single PrismaClient instance with proper configuration
let prisma;

// Configuration for connection pooling (Supabase uses PgBouncer)
const prismaConfig = {
  log: process.env.NODE_ENV === 'production' 
    ? ['error', 'warn'] 
    : ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
};

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(prismaConfig);
} else {
  // Development mode - use global to prevent multiple instances
  if (!global.__prisma) {
    global.__prisma = new PrismaClient(prismaConfig);
  }
  prisma = global.__prisma;
}

// Connect on first use
prisma.$connect()
  .then(() => console.log('✅ Prisma connected to database'))
  .catch((err) => console.error('❌ Prisma connection error:', err));

// Graceful shutdown
const shutdown = async () => {
  console.log('Disconnecting Prisma...');
  await prisma.$disconnect();
};

process.on('beforeExit', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = prisma;
