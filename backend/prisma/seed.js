/**
 * FLEXCREDI - Seed do Banco de Dados
 * Popula tabelas com dados iniciais para desenvolvimento
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...\n');

  // ═══════════════════════════════════════════════════════════
  // 1. REGRAS DE TAXA DE JUROS
  // ═══════════════════════════════════════════════════════════
  
  console.log('📊 Creating Interest Rate Rules...');
  
  const rules = [
    {
      tier: 'EXCELLENT',
      minScore: 750,
      maxScore: 850,
      interestRate: 8.99,
      maxAmount: 50000,
      maxTermMonths: 60,
      allowWeekly: true,
      allowBiweekly: true,
      allowMonthly: true,
      maxIncomeMultiple: 8.0,
      minIncomeRequired: 3000,
      maxDti: 0.43,
      active: true,
      priority: 5
    },
    {
      tier: 'GOOD',
      minScore: 700,
      maxScore: 749,
      interestRate: 12.99,
      maxAmount: 40000,
      maxTermMonths: 48,
      allowWeekly: false,
      allowBiweekly: true,
      allowMonthly: true,
      maxIncomeMultiple: 6.0,
      minIncomeRequired: 2500,
      maxDti: 0.40,
      active: true,
      priority: 4
    },
    {
      tier: 'FAIR',
      minScore: 650,
      maxScore: 699,
      interestRate: 16.99,
      maxAmount: 30000,
      maxTermMonths: 36,
      allowWeekly: false,
      allowBiweekly: false,
      allowMonthly: true,
      maxIncomeMultiple: 4.0,
      minIncomeRequired: 2000,
      maxDti: 0.38,
      active: true,
      priority: 3
    },
    {
      tier: 'POOR',
      minScore: 600,
      maxScore: 649,
      interestRate: 21.99,
      maxAmount: 20000,
      maxTermMonths: 24,
      allowWeekly: false,
      allowBiweekly: false,
      allowMonthly: true,
      maxIncomeMultiple: 3.0,
      minIncomeRequired: 1500,
      maxDti: 0.35,
      active: true,
      priority: 2
    },
    {
      tier: 'VERY_POOR',
      minScore: 300,
      maxScore: 599,
      interestRate: 27.99,
      maxAmount: 10000,
      maxTermMonths: 12,
      allowWeekly: false,
      allowBiweekly: false,
      allowMonthly: true,
      maxIncomeMultiple: 2.0,
      minIncomeRequired: 1000,
      maxDti: 0.30,
      active: true,
      priority: 1
    }
  ];

  for (const rule of rules) {
    const created = await prisma.interestRateRule.upsert({
      where: { 
        tier: rule.tier 
      },
      update: rule,
      create: rule
    });
    console.log(`  ✓ ${created.tier}: ${created.minScore}-${created.maxScore} @ ${created.interestRate}%`);
  }

  console.log(`\n✅ Created ${rules.length} interest rate rules\n`);

  // ═══════════════════════════════════════════════════════════
  // 2. CONFIGURAÇÕES DO SISTEMA
  // ═══════════════════════════════════════════════════════════
  
  console.log('⚙️  Creating System Settings...');
  
  const settings = [
    {
      key: 'PAYBRIGHT_API_KEY',
      value: 'mock_key_for_development',
      type: 'string',
      description: 'PayBright API Key',
      category: 'integrations'
    },
    {
      key: 'EXPERIAN_CLIENT_ID',
      value: 'mock_client_id',
      type: 'string',
      description: 'Experian API Client ID',
      category: 'integrations'
    },
    {
      key: 'AUTO_APPROVE_THRESHOLD',
      value: '750',
      type: 'number',
      description: 'Score mínimo para aprovação automática',
      category: 'credit_analysis'
    },
    {
      key: 'MANUAL_REVIEW_THRESHOLD',
      value: '650',
      type: 'number',
      description: 'Score mínimo para revisão manual (abaixo = rejeição)',
      category: 'credit_analysis'
    },
    {
      key: 'DEFAULT_FLEXCREDI_FEE',
      value: '0.03',
      type: 'float',
      description: 'Fee padrão FlexCredi (3%)',
      category: 'fees'
    }
  ];

  for (const setting of settings) {
    const created = await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting
    });
    console.log(`  ✓ ${created.key}: ${created.value}`);
  }

  console.log(`\n✅ Created ${settings.length} system settings\n`);

  // ═══════════════════════════════════════════════════════════
  // 3. USUÁRIO ADMIN PADRÃO (para desenvolvimento)
  // ═══════════════════════════════════════════════════════════
  
  console.log('👤 Creating default admin user...');
  
  // Nota: Em produção, usar bcrypt para hash da senha
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@flexcredi.com' },
    update: {},
    create: {
      email: 'admin@flexcredi.com',
      name: 'Admin FlexCredi',
      role: 'ADMIN',
      active: true,
      emailVerified: true
    }
  });
  
  console.log(`  ✓ Admin user: ${adminUser.email}\n`);

  console.log('🎉 Seed completed successfully!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
