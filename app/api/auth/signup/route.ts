import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@/db";

const SALT_ROUNDS = 10;

export async function POST(request: Request) {
  try {
    const { nome, email, senha, papel } = await request.json();

    // Verifica se já existe um usuário com o mesmo e-mail
    const usuarioExistente = await db("usuarios").where({ email }).first();
    if (usuarioExistente) {
      return NextResponse.json(
        { sucesso: false, mensagem: "Usuário já cadastrado" },
        { status: 400 }
      );
    }

    // Gera hash da senha
    const senhaHashed = await bcrypt.hash(senha, SALT_ROUNDS);

    // Insere o novo usuário
    const [novoUsuario] = await db("usuarios")
      .insert({
        nome,
        email,
        senha: senhaHashed,
        papel: papel || "usuario",
      })
      .returning("*");

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

    return NextResponse.json({
      sucesso: true,
      usuario: novoUsuario,
      token,
      refreshToken,
    });
  } catch (erro: any) {
    return NextResponse.json(
      { sucesso: false, mensagem: erro.message },
      { status: 500 }
    );
  }
}
