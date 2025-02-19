import { NextResponse } from "next/server";
import db from "@/db";
import type { Apresentacao } from "@/models/Apresentacao";
import QRCode from "qrcode";

// GET: Lista todas as apresentações
export async function GET() {
  try {
    const apresentacoes: Apresentacao[] = await db('apresentacoes').select('*');
    return NextResponse.json({ sucesso: true, apresentacoes });
  } catch (erro: any) {
    return NextResponse.json({ sucesso: false, mensagem: erro.message }, { status: 500 });
  }
}

// POST: Cria uma nova apresentação com conversão do arquivo PowerPoint
export async function POST(request: Request) {
  try {
    console.log("Recebendo requisição POST em /api/apresentacoes");
    
    // Parse multipart/form-data
    const formData = await request.formData();
    console.log("Dados recebidos:", {
      id_usuario: formData.get("id_usuario"),
      titulo: formData.get("titulo"),
      local: formData.get("local"),
      categoria: formData.get("categoria"),
      data_evento: formData.get("data_evento"),
      publica: formData.get("publica"),
      fileName: formData.get("file")?.['name']
    });
    const id_usuario = formData.get("id_usuario")?.toString();
    const titulo = formData.get("titulo")?.toString();
    const descricao = formData.get("descricao")?.toString();
    const local = formData.get("local")?.toString();
    const categoria = formData.get("categoria")?.toString();
    const data_evento = formData.get("data_evento")?.toString();
    const publica = formData.get("publica")?.toString();
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("Arquivo não enviado.");
    }
    
    // Converte o arquivo PowerPoint para base64
    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = Buffer.from(fileBuffer).toString("base64");
    const fileName = file.name;

    // Gera o QR code antes de criar a apresentação
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
    // Insere a nova apresentação e recebe o ID
    const [id] = await db("apresentacoes")
      .insert({
        id_usuario,
        titulo,
        descricao,
        local,
        categoria,
        data_evento,
        arquivo_base64: fileBase64,
        nome_arquivo: fileName,
        publica: formData.get("publica") === "true",
        visualizacoes: 0,
      })
      .returning("id");

    console.log("Apresentação criada:", {
      id,
      publica: formData.get("publica") === "true"
    });

    // Gera o QR code com o ID da apresentação
    const viewUrl = `${baseUrl}/view/${id}`;
    const qrCodeDataUrl = await QRCode.toDataURL(viewUrl, {
      margin: 1,
      width: 300,
      color: {
        dark: '#000',
        light: '#fff'
      }
    });

    // Atualiza a apresentação com o QR code
    await db("apresentacoes")
      .where({ id: id })
      .update({
        qr_code_base64: qrCodeDataUrl,
      });

    // Chama a API externa para converter o PowerPoint em imagens
    const conversionFormData = new FormData();
    conversionFormData.append("file", file);
    const conversionRes = await fetch("https://ppt-to-image-api-production.up.railway.app/api/convert", {
      method: "POST",
      body: conversionFormData,
    });
    if (!conversionRes.ok) {
      const errorText = await conversionRes.text();
      console.error("Erro na API de conversão:", errorText);
      throw new Error("Falha na conversão do arquivo.");
    }
    const conversionResult = await conversionRes.json();
    console.log("Resultado da conversão:", conversionResult);
    const images = conversionResult.images;
    if (!images || !Array.isArray(images) || images.length === 0) {
      console.error("Erro: Nenhuma imagem gerada. Resultado:", conversionResult);
      throw new Error("Nenhuma imagem foi gerada a partir do arquivo.");
    }

    // Criação dos slides na tabela 'slides' com base nas imagens convertidas
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      await db("slides").insert({
        id_apresentacao: id,
        ordem: i + 1,
        imagem_base64: image.image_base64_uri,
        nome_arquivo: image.name,
      });
    }

    return NextResponse.json({ sucesso: true, apresentacao: { id, qr_code_base64: qrCodeDataUrl } });
  } catch (erro: any) {
    console.error("Erro ao criar apresentação:", erro);
    return NextResponse.json({ sucesso: false, mensagem: erro.message }, { status: 500 });
  }
}
