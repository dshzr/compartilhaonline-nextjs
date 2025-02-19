import { NextResponse } from "next/server";
import db from "@/db"; // Certifique-se que o alias "@" aponta para o diretório raiz

export async function GET() {
  try {
    // Executa uma query simples para testar a conexão
    const resultado = await db.raw("SELECT 1+1 AS resultado");
    
    return NextResponse.json({
      sucesso: true,
      mensagem: "Banco conectado com sucesso!",
      resultado: resultado.rows ? resultado.rows[0].resultado : resultado[0].resultado,
    });
  } catch (erro: any) {
    return NextResponse.json({
      sucesso: false,
      mensagem: "Falha na conexão com o banco de dados",
      erro: erro.message,
    }, { status: 500 });
  }
}
