import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Cria tabela de usuários
  await knex.schema.createTable("usuarios", (table) => {
    table.increments("id").primary();
    table.string("nome").notNullable();
    table.string("email").notNullable().unique();
    table.string("senha").notNullable();
    table.string("papel").defaultTo("usuario");
    table.timestamps(true, true);
  });

  // Cria tabela de apresentações
  await knex.schema.createTable("apresentacoes", (table) => {
    table.increments("id").primary();
    table.integer("id_usuario").unsigned().references("id").inTable("usuarios").onDelete("CASCADE");
    table.string("titulo").notNullable();
    table.string("descricao");
    table.string("local");
    table.string("categoria");
    table.date("data_evento");
    // Armazena o arquivo PowerPoint convertido em base64
    table.text("arquivo_base64");
    // Armazena o QR Code em base64, se gerado
    table.text("qr_code_base64");
    table.boolean("publica").defaultTo(true);
    table.integer("visualizacoes").defaultTo(0);
    table.timestamps(true, true);
  });

  // Cria tabela de slides
  await knex.schema.createTable("slides", (table) => {
    table.increments("id").primary();
    table.integer("id_apresentacao").unsigned().references("id").inTable("apresentacoes").onDelete("CASCADE");
    table.integer("ordem").notNullable();
    // Armazena a imagem do slide em base64
    table.text("imagem_base64").notNullable();
    // Novo campo: nome do arquivo retornado pela API (ex: "slide_12.png")
    table.string("nome_arquivo").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("slides");
  await knex.schema.dropTableIfExists("apresentacoes");
  await knex.schema.dropTableIfExists("usuarios");
}
