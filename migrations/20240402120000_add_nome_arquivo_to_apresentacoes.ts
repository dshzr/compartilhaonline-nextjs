import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("apresentacoes", (table) => {
    table.string("nome_arquivo");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("apresentacoes", (table) => {
    table.dropColumn("nome_arquivo");
  });
}
