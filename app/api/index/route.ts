import { NextResponse } from "next/server";

export async function GET() {
  // Defina manualmente a lista de endpoints que sua API oferece
  const rotasDisponiveis = [
    {
      rota: "/api",
      descricao: "Rota raiz da API mostrando as rotas disponíveis"
    },
    {
      rota: "/api/status",
      descricao: "Retorna o status da conexão com o banco de dados"
    },
    {
      rota: "/api/usuarios",
      descricao: "Gerencia operações relacionadas aos usuários"
    },
    {
      rota: "/api/apresentacoes",
      descricao: "Gerencia informações das apresentações"
    },
    {
      rota: "/api/slides",
      descricao: "Gerencia os slides das apresentações"
    }
    // Adicione quantas rotas precisar
  ];

  return NextResponse.json({
    sucesso: true,
    rotas: rotasDisponiveis
  });
}
