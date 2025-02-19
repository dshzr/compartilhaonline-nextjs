"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, Carousel } from "flowbite-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  HiOutlineLogout,
  HiOutlineDownload,
  HiOutlineShare,
  HiOutlineLocationMarker,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineQrcode,
} from "react-icons/hi";
import { RiPresentationLine } from "react-icons/ri";
import { FaRegHandPaper } from "react-icons/fa";
import Swal from "sweetalert2";
import { lazy } from "react";

// Configurações de página
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Interfaces
interface Slide {
  id: number;
  id_apresentacao: number;
  ordem: number;
  imagem_base64: string;
  nome_arquivo: string;
}

interface Apresentacao {
  id: number;
  titulo: string;
  descricao?: string;
  local?: string;
  categoria?: string;
  data_evento?: string;
  autor_nome: string;
  autor_email: string;
  visualizacoes: number;
  publica: boolean;
  slides: Slide[];
  qr_code_base64: string | null;
  nome_arquivo?: string;
}

// Carrega o QR Code apenas quando necessário
const QRCodeComponent = lazy(() => import("@/components/QRCode"));

export default function PresentationDetails({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [showQRCode, setShowQRCode] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [loading, setLoading] = useState(true);
  const [apresentacao, setApresentacao] = useState<Apresentacao | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Busca a apresentação
        const response = await fetch(`/api/apresentacoes/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          router.push("/dashboard");
          return;
        }

        if (!response.ok) {
          throw new Error("Falha ao carregar apresentação");
        }

        const data = await response.json();
        setApresentacao(data.apresentacao);
      } catch (error) {
        console.error("Erro ao carregar apresentação:", error);

        await Swal.fire({
          icon: "error",
          title: "Erro!",
          text: "Não foi possível carregar a apresentação",
          timer: 2000,
          showConfirmButton: false,
        });

        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, router]);

  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/view/${params.id}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: apresentacao?.titulo || "Apresentação",
          text: "Confira esta apresentação!",
          url: shareUrl,
        });
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
      }
    } else {
      // Fallback para copiar link
      await navigator.clipboard.writeText(shareUrl);
      await Swal.fire({
        icon: "success",
        title: "Link copiado!",
        text: "O link público da apresentação foi copiado para sua área de transferência",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleDownload = async () => {
    // Implementar download do arquivo original
    alert("Funcionalidade de download em desenvolvimento");
  };

  const handleGenerateQRCode = async () => {
    try {
      setShowQRCode(true);

      // Se já tiver QR code, não precisa gerar novamente
      if (apresentacao?.qr_code_base64) {
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`/api/apresentacoes/${params.id}/qrcode`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar QR code");
      }

      const data = await response.json();
      if (data.sucesso && data.qrCode) {
        setApresentacao((prev) =>
          prev
            ? {
                ...prev,
                qr_code_base64: data.qrCode,
              }
            : null,
        );
      } else {
        throw new Error(data.mensagem || "Falha ao gerar QR code");
      }
    } catch (error) {
      console.error("Erro ao gerar QR code:", error);
      await Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Não foi possível gerar o QR code",
        confirmButtonColor: "#3085d6",
      });
      setShowQRCode(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !apresentacao) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <RiPresentationLine className="mb-4 h-16 w-16 text-gray-400" />
        <h1 className="text-xl font-bold text-gray-900">
          Apresentação não encontrada
        </h1>
        <p className="mt-2 text-gray-600">
          {error || "Não foi possível carregar a apresentação"}
        </p>
        <Button
          color="blue"
          className="mt-4"
          onClick={() => router.push("/dashboard")}
        >
          Voltar para o Dashboard
        </Button>
      </div>
    );
  }

  if (isDeleted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <RiPresentationLine className="text-2xl text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Compartilha Online
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <FaRegHandPaper className="animate-wave text-xl text-blue-600" />
              <span className="text-gray-700">Olá, João Silva!</span>
            </div>
            <Button color="gray" pill size="sm">
              <HiOutlineLogout className="mr-2 h-5 w-5" />
              Sair
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {apresentacao.titulo}
              </h1>
              <p className="mt-2 max-w-2xl text-gray-600">
                {apresentacao.descricao}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:flex-nowrap">
              <Button
                color="blue"
                className="w-full md:w-auto"
                onClick={handleShare}
              >
                <HiOutlineShare className="mr-2 h-5 w-5" />
                Compartilhar
              </Button>
              <Button
                color="green"
                className="w-full md:w-auto"
                onClick={handleDownload}
              >
                <HiOutlineDownload className="mr-2 h-5 w-5" />
                Download
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-6 border-t pt-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-50 p-2">
                <HiOutlineLocationMarker className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Local</p>
                <p>{apresentacao.local}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-50 p-2">
                <HiOutlineUser className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Autor</p>
                <p>{apresentacao.autor_nome}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-50 p-2">
                <HiOutlineCalendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Data</p>
                <p>
                  {apresentacao.data_evento
                    ? new Date(apresentacao.data_evento).toLocaleDateString(
                        "pt-BR",
                      )
                    : "Data não definida"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Slides Section */}
          <div className="rounded-lg bg-white shadow-sm lg:col-span-2">
            <div className="border-b p-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Slides da Apresentação
                <span className="ml-2 text-sm text-gray-500">
                  {currentSlide} de {apresentacao.slides.length}
                </span>
              </h2>
            </div>
            <div className="p-4">
              <Card className="overflow-hidden">
                <div className="relative h-[600px] w-full bg-gray-900">
                  <Carousel
                    slideInterval={5000}
                    onSlideChange={setCurrentSlide}
                    className="h-full"
                  >
                    {apresentacao.slides.map((slide, index) => (
                      <div
                        key={index}
                        className="relative flex h-full w-full items-center justify-center p-4"
                      >
                        <Image
                          src={slide.imagem_base64}
                          alt={`Slide ${index + 1}`}
                          fill
                          className="object-contain"
                          priority={index === 0}
                          loading={index === 0 ? "eager" : "lazy"}
                          quality={75}
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
              </Card>
            </div>
          </div>

          {/* QR Code Section - Sempre visível se existir */}
          {apresentacao?.qr_code_base64 && (
            <div className="transition-all duration-300">
              <Card className="sticky top-24">
                <QRCodeComponent
                  qrCodeData={apresentacao.qr_code_base64}
                  apresentacaoId={apresentacao.id}
                />
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
