import { NextResponse } from "next/server";
import db from "@/db";
import type { Slide } from "@/models/Slide";

// GET: Lista todos os slides
export async function GET() {
  try {
    const slides: Slide[] = await db('slides').select('*');
    return NextResponse.json({ sucesso: true, slides });
  } catch (erro: any) {
    return NextResponse.json({ sucesso: false, mensagem: erro.message }, { status: 500 });
  }
}

// POST: Cria um novo slide (assumindo que o corpo envia id_apresentacao, ordem, imagem_base64 e nome_arquivo)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [novoSlide] = await db('slides')
      .insert({
        id_apresentacao: body.id_apresentacao,
        ordem: body.ordem,
        imagem_base64: body.imagem_base64,
        nome_arquivo: body.nome_arquivo,
      })
      .returning('*');
    
    return NextResponse.json({ sucesso: true, slide: novoSlide });
  } catch (erro: any) {
    return NextResponse.json({ sucesso: false, mensagem: erro.message }, { status: 500 });
  }
}
