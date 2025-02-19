require('dotenv').config({ path: '.env.production' });

module.exports = {
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  },
  pool: {
    min: 1,
    max: 5
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations'
  }
}; 