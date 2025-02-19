import { Knex } from "knex";
import { categories } from '../utils/categories';

export async function seed(knex: Knex): Promise<void> {
  // Remove entradas existentes
  await knex('categorias').del();

  const categoriasArray = Object.values(categories).map(cat => ({
    nome: cat.name
  }));

  await knex('categorias').insert(categoriasArray);
}
