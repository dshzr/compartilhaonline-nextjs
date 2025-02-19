import { NextResponse } from "next/server";
import db from "@/db";

export async function GET(request: Request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL não configurado");
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase();
    const category = searchParams.get("category");

    // Query base
    let query = db("apresentacoes")
      .select(
        "apresentacoes.id",
        "apresentacoes.titulo",
        "apresentacoes.descricao",
        "apresentacoes.local",
        "apresentacoes.categoria",
        "apresentacoes.data_evento",
        "apresentacoes.visualizacoes",
        "usuarios.nome as autor_nome",
      )
      .leftJoin("usuarios", "apresentacoes.id_usuario", "usuarios.id")
      .where("apresentacoes.publica", true);

    // Adiciona filtro de categoria se especificado
    if (category) {
      query = query.where("apresentacoes.categoria", category);
    }

    // Adiciona busca se especificada
    if (search) {
      query = query.where((builder) => {
        builder.where((subBuilder) => {
          subBuilder
            .whereILike("apresentacoes.titulo", `%${search}%`)
            .orWhereILike("apresentacoes.local", `%${search}%`)
            .orWhereILike("apresentacoes.descricao", `%${search}%`)
            .orWhereILike("usuarios.nome", `%${search}%`)
            .orWhereILike("apresentacoes.categoria", `%${search}%`);
        });
      });
    }

    // Log da query para debug
    console.log("Query SQL:", query.toString());

    // Ordena por data de criação
    const apresentacoes = await query.orderBy(
      "apresentacoes.created_at",
      "desc",
    );

    // Log dos resultados para debug
    console.log(`Encontradas ${apresentacoes.length} apresentações`);
    if (apresentacoes.length > 0) {
      console.log("Primeira apresentação:", {
        id: apresentacoes[0].id,
        titulo: apresentacoes[0].titulo,
        local: apresentacoes[0].local,
        autor: apresentacoes[0].autor_nome,
      });
    }

    // Adiciona a URL base aos dados retornados
    const apresentacoesComUrl = apresentacoes.map((ap) => ({
      ...ap,
      url: `${baseUrl}/view/${ap.id}`,
    }));

    return NextResponse.json({
      sucesso: true,
      apresentacoes: apresentacoesComUrl,
    });
  } catch (erro: any) {
    console.error("Erro ao buscar apresentações:", erro);
    return NextResponse.json(
      { sucesso: false, mensagem: erro.message },
      { status: 500 },
    );
  }
}
