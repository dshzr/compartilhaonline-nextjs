import { NextResponse } from "next/server";
import QRCode from "qrcode";
import db from "@/db";
import { verificarToken } from "@/utils/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error("NEXT_PUBLIC_BASE_URL não configurado");
    }

    const token = request.headers.get("Authorization")?.split(" ")[1];
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

    // Gera a URL pública de visualização
    const viewUrl = `${baseUrl}/view/${params.id}`;
    
    // Gera o QR Code
    const qrCode = await QRCode.toDataURL(viewUrl);

    // Atualiza o QR Code no banco
    await db("apresentacoes")
      .where({ id: params.id })
      .update({ qr_code_base64: qrCode });

    return NextResponse.json({
      sucesso: true,
      qrCode,
      url: viewUrl
    });
  } catch (erro: any) {
    console.error("Erro ao gerar QR code:", erro);
    return NextResponse.json(
      { sucesso: false, mensagem: erro.message },
      { status: 500 }
    );
  }
} 