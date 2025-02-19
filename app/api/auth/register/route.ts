import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@/db";

export async function POST(request: Request) {
  try {
    const { nome, email, senha } = await request.json();
    console.log('[Register Attempt]', { email, nome, timestamp: new Date().toISOString() });

    // Verifica se já existe um usuário com o mesmo email
    const existingUser = await db("usuarios").where({ email }).first();
    if (existingUser) {
      console.log('[Register Failed] Email already exists:', { email });
      return NextResponse.json(
        { sucesso: false, mensagem: "Email já cadastrado" },
        { status: 409 }
      );
    }

    // Gera o hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    // Cria o novo usuário
    const [novoUsuario] = await db("usuarios")
      .insert({
        nome,
        email,
        senha: hashedPassword,
        papel: 'usuario'
      })
      .returning('*');

    // Remove a senha antes de retornar
    delete novoUsuario.senha;

    // Gera token de acesso JWT
    const token = jwt.sign(
      { id: novoUsuario.id, email: novoUsuario.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    // Gera refresh token JWT
    const refreshToken = jwt.sign(
      { id: novoUsuario.id, email: novoUsuario.email },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    console.log('[Register Success]', { email, userId: novoUsuario.id });
    return NextResponse.json({
      sucesso: true,
      usuario: novoUsuario,
      token,
      refreshToken,
    });
  } catch (erro: any) {
    console.error('[Register Error]', { error: erro.message, stack: erro.stack });
    return NextResponse.json(
      { sucesso: false, mensagem: erro.message },
      { status: 500 }
    );
  }
}