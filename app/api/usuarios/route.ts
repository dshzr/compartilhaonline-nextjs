import { NextResponse } from "next/server";
import db from "@/db";
import type { Usuario } from "@/models/Usuario";

// GET: Lista todos os usuários
export async function GET() {
  try {
    const usuarios: Usuario[] = await db('usuarios').select('*');
    return NextResponse.json({ sucesso: true, usuarios });
  } catch (erro: any) {
    return NextResponse.json({ sucesso: false, mensagem: erro.message }, { status: 500 });
  }
}

// POST: Cria um novo usuário
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Exemplo: espera { nome, email, senha, papel? }
    const [novoUsuario] = await db('usuarios')
      .insert({
        nome: body.nome,
        email: body.email,
        senha: body.senha, // lembre-se de hashear a senha em produção
        papel: body.papel || 'usuario',
      })
      .returning('*');
    
    return NextResponse.json({ sucesso: true, usuario: novoUsuario });
  } catch (erro: any) {
    return NextResponse.json({ sucesso: false, mensagem: erro.message }, { status: 500 });
  }
}
