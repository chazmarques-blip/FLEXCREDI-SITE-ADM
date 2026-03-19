/**
 * Test script to check if admin user exists and can login
 */

require('dotenv').config();
const prisma = require('../core/prisma');
const bcrypt = require('bcrypt');

async function testAdminLogin() {
    try {
        console.log('🔍 Testando login do admin...\n');

        const email = 'admin@flexcredi.com';
        const password = 'FlexCredi2024!';

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
                role: true,
                active: true
            }
        });

        if (!user) {
            console.log('❌ Usuário não encontrado!');
            console.log('💡 Execute: node scripts/create-admin.js');
            return false;
        }

        console.log('✅ Usuário encontrado:');
        console.log('   ID:', user.id);
        console.log('   Email:', user.email);
        console.log('   Nome:', user.name);
        console.log('   Role:', user.role);
        console.log('   Ativo:', user.active);

        // Test password
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (passwordMatch) {
            console.log('\n✅ Senha está correta!');
            console.log('🎉 Login funcionará normalmente.\n');
            return true;
        } else {
            console.log('\n❌ Senha incorreta!');
            console.log('💡 A senha armazenada não corresponde a: ' + password);
            return false;
        }

    } catch (error) {
        console.error('❌ Erro ao testar login:', error.message);
        return false;
    } finally {
        await prisma.$disconnect();
    }
}

// Run test
testAdminLogin()
    .then((success) => {
        process.exit(success ? 0 : 1);
    })
    .catch((error) => {
        console.error('💥 Erro fatal:', error);
        process.exit(1);
    });
