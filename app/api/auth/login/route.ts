import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@/db";

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();
    console.log('[Login Attempt]', { email, timestamp: new Date().toISOString() });

    // Busca usuário pelo email
    const usuario = await db("usuarios").where({ email }).first();
    if (!usuario) {
      console.log('[Login Failed] User not found:', { email });
      return NextResponse.json(
        { sucesso: false, mensagem: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Compara a senha informada com o hash armazenado usando bcrypt
    const match = await bcrypt.compare(senha, usuario.senha);
    if (!match) {
      console.log('[Login Failed] Invalid password:', { email });
      return NextResponse.json(
        { sucesso: false, mensagem: "Senha incorreta" },
        { status: 401 }
      );
    }

    // Remove a senha antes de retornar
    delete usuario.senha;

    // Gera token de acesso JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // Gera refresh token JWT
    const refreshToken = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    console.log('[Login Success]', { email, userId: usuario.id });
    return NextResponse.json({
      sucesso: true,
      usuario,
      token,
      refreshToken,
    });
  } catch (erro: any) {
    console.error('[Login Error]', { error: erro.message, stack: erro.stack });
    return NextResponse.json(
      { sucesso: false, mensagem: erro.message },
      { status: 500 }
    );
  }
}
