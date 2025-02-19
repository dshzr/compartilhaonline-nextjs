import type { Knex } from "knex";
import dotenv from 'dotenv';

dotenv.config();

const connectionUrl = process.env.DATABASE_URL || undefined;

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: connectionUrl || {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './seeds',
      extension: 'ts',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
    pool: {
      min: 2,
      max: 10,
    },
  }
};

export default config;
