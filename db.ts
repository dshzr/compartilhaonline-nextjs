import knex from 'knex';
import config from './knexfile';

const ambiente = process.env.NODE_ENV || 'development';
const configuracao = config[ambiente];

export const db = knex(configuracao);

export default db;
