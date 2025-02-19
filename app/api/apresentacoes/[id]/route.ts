import { NextResponse } from "next/server";
import db from "@/db";
import { verificarToken } from "@/utils/auth";

// Desabilita o cache para esta rota também
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Busca a apresentação junto com os dados do usuário (autor)
    const apresentacao = await db("apresentacoes")
      .select(
        "apresentacoes.*",
        "usuarios.nome as autor_nome",
        "usuarios.email as autor_email"
      )
      .leftJoin("usuarios", "apresentacoes.id_usuario", "usuarios.id")
      .where("apresentacoes.id", id)
      .first();

    if (!apresentacao) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Apresentação não encontrada" },
        { status: 404 }
      );
    }

    // Busca os slides
    const slides = await db("slides")
      .where({ id_apresentacao: id })
      .orderBy("ordem", "asc");

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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const token = request.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Token não fornecido" },
        { status: 401 }
      );
    }

    const usuario = await verificarToken(token);
    if (!usuario) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Token inválido" },
        { status: 401 }
      );
    }

    // Verifica se a apresentação pertence ao usuário
    const apresentacao = await db('apresentacoes')
      .where({ id, id_usuario: usuario.id })
      .first();

    if (!apresentacao) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Apresentação não encontrada" },
        { status: 404 }
      );
    }

    // Deleta os slides primeiro (embora o CASCADE já faça isso)
    await db('slides').where({ id_apresentacao: id }).delete();
    
    // Depois deleta a apresentação
    await db('apresentacoes').where({ id }).delete();

    return NextResponse.json({ 
      sucesso: true, 
      mensagem: "Apresentação e slides deletados com sucesso" 
    });
  } catch (erro: any) {
    console.error('Erro ao deletar apresentação:', erro);
    return NextResponse.json(
      { sucesso: false, mensagem: erro.message },
      { status: 500 }
    );
  }
}
