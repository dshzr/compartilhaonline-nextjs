import { NextResponse } from "next/server";

export async function GET() {
  const endpoints = [
    { rota: "/api/auth/signup", descricao: "Cadastro de usuários" },
    { rota: "/api/auth/login", descricao: "Login de usuários" },
    { rota: "/api/usuarios", descricao: "Gerenciamento de usuários" },
    { rota: "/api/apresentacoes", descricao: "Gerenciamento de apresentações" },
    { rota: "/api/slides", descricao: "Gerenciamento de slides" },
    // Adicione outros endpoints conforme necessário
  ];

  return NextResponse.json({ sucesso: true, endpoints });
}
