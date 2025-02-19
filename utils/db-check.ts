import db from '@/db';

export async function checkDatabaseConnection() {
  try {
    await db.raw('SELECT 1');
    console.log('✅ Conexão com o banco de dados estabelecida');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
    return false;
  }
} 