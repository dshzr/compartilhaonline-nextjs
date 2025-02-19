import { NextResponse } from "next/server";
import db from "@/db";

export async function GET() {
  try {
    const categorias = await db("categorias")
      .select("*")
      .orderBy("nome", "asc");

    return NextResponse.json({ 
      sucesso: true, 
      categorias 
    });
  } catch (erro: any) {
    console.error("Erro ao buscar categorias:", erro);
    return NextResponse.json(
      { sucesso: false, mensagem: erro.message },
      { status: 500 }
    );
  }
}
