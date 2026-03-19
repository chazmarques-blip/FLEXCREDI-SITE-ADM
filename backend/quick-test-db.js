require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function test() {
  const prisma = new PrismaClient();
  try {
    console.log('Testing database connection...');
    const user = await prisma.user.findUnique({
      where: { email: 'admin@flexcredi.com' }
    });
    console.log('Admin user:', user ? 'EXISTS ✅' : 'NOT FOUND ❌');
    if (user) {
      console.log('Details:', {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        active: user.active
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
