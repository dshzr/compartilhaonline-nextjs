import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  },
  pool: {
    min: 1,
    max: 5
  },
  log: {
    warn(message) {
      console.warn(message);
    },
    error(message) {
      console.error(message);
    },
    deprecate(message) {
      console.log(message);
    },
    debug(message) {
      console.log(message);
    },
  },
  // Configurações específicas do PostgreSQL
  postProcessResponse: (result: any) => {
    return result;
  },
  wrapIdentifier: (value: string, origImpl: (value: string) => string) => {
    return origImpl(value);
  }
});

db.raw('SELECT 1')
  .then(() => {
    console.log('✅ Conexão com o banco estabelecida');
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar com o banco:', err);
  });

export default db;
