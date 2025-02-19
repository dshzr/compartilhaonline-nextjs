import { NextResponse } from "next/server";
import db from "@/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Busca a apresentação pública
    const apresentacao = await db("apresentacoes")
      .select(
        "apresentacoes.id",
        "apresentacoes.titulo",
        "apresentacoes.descricao",
        "apresentacoes.local",
        "apresentacoes.categoria",
        "apresentacoes.data_evento",
        "apresentacoes.visualizacoes",
        "usuarios.nome as autor_nome"
      )
      .leftJoin("usuarios", "apresentacoes.id_usuario", "usuarios.id")
      .where({
        "apresentacoes.id": params.id,
        "apresentacoes.publica": true
      })
      .first();

    if (!apresentacao) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Apresentação não encontrada" },
        { status: 404 }
      );
    }

    // Busca os slides
    const slides = await db("slides")
      .where({ id_apresentacao: params.id })
      .orderBy("ordem", "asc")
      .select("id", "id_apresentacao", "ordem", "imagem_base64", "nome_arquivo");

    return NextResponse.json({
      sucesso: true,
      apresentacao: {
        ...apresentacao,
        slides,
      },
    });
  } catch (erro: any) {
    console.error("Erro ao buscar apresentação:", erro);
    return NextResponse.json(
      { sucesso: false, mensagem: erro.message },
      { status: 500 }
    );
  }
} 