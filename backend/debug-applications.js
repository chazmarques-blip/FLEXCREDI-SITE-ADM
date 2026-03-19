const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugApplications() {
  try {
    console.log('🔍 Testing Applications Query...\n');
    
    // Test basic count
    console.log('1️⃣ Testing basic count:');
    const count = await prisma.application.count();
    console.log(`✅ Total applications: ${count}`);
    
    // Test with includes (same as ApplicationsController)
    console.log('\n2️⃣ Testing with includes:');
    const apps = await prisma.application.findMany({
      include: {
        partner: {
          select: {
            id: true,
            companyName: true,
            tradeName: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    console.log(`✅ Found ${apps.length} applications with includes`);
    
    console.log('\n✅ Applications query works!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugApplications();
