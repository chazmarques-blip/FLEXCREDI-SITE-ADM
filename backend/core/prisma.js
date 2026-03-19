/**
 * FLEXCREDI - Prisma Client Singleton
 * Single instance to prevent "prepared statement already exists" error
 */

const { PrismaClient } = require('@prisma/client');

// Create a single PrismaClient instance with proper configuration
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
} else {
  // Development mode with more logging
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
