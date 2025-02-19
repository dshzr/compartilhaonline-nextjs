import { NextResponse } from "next/server";
import db from "@/db";
import { verificarToken } from "@/utils/auth";

// Desabilita o cache para esta rota
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL não configurado");
    }

    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Token não fornecido" },
        { status: 401 },
      );
    }

    const usuario = await verificarToken(token);
    if (!usuario) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Token inválido" },
        { status: 401 },
      );
    }

    console.log("ID do usuário:", usuario.id); // Debug

    // Busca apenas as apresentações do usuário
    const apresentacoes = await db("apresentacoes")
      .where({ id_usuario: usuario.id })
      .select("*")
      .orderBy("created_at", "desc");

    console.log("Apresentações encontradas:", apresentacoes); // Debug

    // Busca os slides para cada apresentação
    const apresentacoesComSlides = await Promise.all(
      apresentacoes.map(async (apresentacao) => {
        const slides = await db("slides")
          .where({ id_apresentacao: apresentacao.id })
          .orderBy("ordem", "asc");

        return {
          ...apresentacao,
          slides,
        };
      }),
    );

    // Adiciona a URL base aos dados retornados
    const apresentacoesComUrl = apresentacoesComSlides.map((ap) => ({
      ...ap,
      url: `${baseUrl}/presentation/${ap.id}`,
    }));

    return NextResponse.json({
      sucesso: true,
      apresentacoes: apresentacoesComUrl,
    });
  } catch (erro: any) {
    console.error("Erro completo:", erro); // Debug detalhado
    return NextResponse.json(
      { sucesso: false, mensagem: erro.message },
      { status: 500 },
    );
  }
}
