import { NextResponse } from "next/server";
import db from "@/db";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Verifica se a apresentação existe e é pública
    const apresentacao = await db("apresentacoes")
      .where({
        id: params.id,
        publica: true,
      })
      .first();

    if (!apresentacao) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Apresentação não encontrada" },
        { status: 404 },
      );
    }

    // Incrementa o contador de visualizações
    await db("apresentacoes")
      .where({ id: params.id })
      .increment("visualizacoes", 1);

    return NextResponse.json({
      sucesso: true,
      mensagem: "Visualização registrada com sucesso",
    });
  } catch (erro: any) {
    console.error("Erro ao registrar visualização:", erro);
    return NextResponse.json(
      { sucesso: false, mensagem: erro.message },
      { status: 500 },
    );
  }
}
