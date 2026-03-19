/**
 * Script para criar o usuário admin padrão no banco de dados
 * Run: node scripts/create-admin.js
 */

require('dotenv').config();
const prisma = require('../core/prisma');
const bcrypt = require('bcrypt');

async function createAdminUser() {
    try {
        console.log('🔧 Criando usuário admin padrão...\n');

        const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@flexcredi.com';
        const password = process.env.DEFAULT_ADMIN_PASSWORD || 'FlexCredi2024!';
        const name = 'Administrator';

        // Verifica se o usuário já existe
        const existingAdmin = await prisma.user.findUnique({
            where: { email }
        });

        if (existingAdmin) {
            console.log('⚠️  Usuário admin já existe!');
            console.log('   Email:', email);
            console.log('   Nome:', existingAdmin.name);
            console.log('   Status:', existingAdmin.active ? '✅ Ativo' : '❌ Inativo');
            console.log('   Role:', existingAdmin.role);
            console.log('\n💡 Para redefinir a senha, delete o usuário e execute novamente.');
            return;
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 12);

        // Cria o usuário admin
        const admin = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'ADMIN',
                active: true,
                emailVerified: true
            }
        });

        console.log('✅ Usuário admin criado com sucesso!\n');
        console.log('📧 Email:', email);
        console.log('🔑 Senha:', password);
        console.log('👤 Nome:', name);
        console.log('🎭 Role:', admin.role);
        console.log('✨ Status:', admin.active ? 'Ativo' : 'Inativo');
        console.log('\n🔐 IMPORTANTE: Altere a senha padrão após o primeiro login!');
        console.log('🌐 Acesse: https://flexcredi-dashboard.vercel.app/admin/login.html');

    } catch (error) {
        console.error('❌ Erro ao criar usuário admin:', error.message);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Executa o script
createAdminUser()
    .then(() => {
        console.log('\n✨ Script finalizado!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Erro fatal:', error);
        process.exit(1);
    });
