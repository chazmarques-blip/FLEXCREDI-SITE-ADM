const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function main() {
  try {
    console.log('🔍 Testando conexão Prisma com Supabase...')
    
    // Teste de conexão simples
    await prisma.$connect()
    console.log('✅ Prisma conectado com sucesso!')
    
    // Verificar tabelas
    const result = await prisma.$queryRaw`SELECT current_database(), current_schema()`
    console.log('📊 Database:', result)
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
