const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testEnumValues() {
  try {
    console.log('🔍 Testing Prisma Enum Values...\n');
    
    // Test ReceivableStatus enum
    console.log('1️⃣ Testing ReceivableStatus enum:');
    try {
      const receivables = await prisma.partnerReceivable.findMany({
        where: { status: { in: ['SCHEDULED', 'PROCESSING'] } }
      });
      console.log(`✅ ReceivableStatus query OK (found ${receivables.length})`);
    } catch (e) {
      console.error(`❌ ReceivableStatus error: ${e.message}`);
    }
    
    // Test AchPaymentStatus enum
    console.log('\n2️⃣ Testing AchPaymentStatus enum:');
    try {
      const achPayments = await prisma.achPayment.findMany({
        where: { status: { in: ['SCHEDULED', 'PENDING', 'PROCESSING'] } }
      });
      console.log(`✅ AchPaymentStatus query OK (found ${achPayments.length})`);
    } catch (e) {
      console.error(`❌ AchPaymentStatus error: ${e.message}`);
      console.error('Valid enum values should be:');
      console.log('  - PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED');
    }
    
    // Test ContractStatus enum
    console.log('\n3️⃣ Testing ContractStatus enum:');
    try {
      const contracts = await prisma.contract.findMany({
        where: { status: 'ACTIVE' }
      });
      console.log(`✅ ContractStatus query OK (found ${contracts.length})`);
    } catch (e) {
      console.error(`❌ ContractStatus error: ${e.message}`);
    }
    
    console.log('\n✅ Enum test completed!');
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEnumValues();
