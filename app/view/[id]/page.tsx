"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, Carousel } from "flowbite-react";
import Image from "next/image";
import {
  HiOutlineDownload,
  HiOutlineShare,
  HiOutlineLocationMarker,
  HiOutlineUser,
  HiOutlineCalendar,
  HiX,
} from "react-icons/hi";
import { RiPresentationLine } from "react-icons/ri";
import Swal from "sweetalert2";

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
  visualizacoes: number;
  slides: Slide[];
}

export default function ViewPresentation({
  params,
}: {
  params: { id: string };
}) {
  const [apresentacao, setApresentacao] = useState<Apresentacao | null>(null);
  const [selectedSlide, setSelectedSlide] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verifica se há um slide específico na URL
        const urlParams = new URLSearchParams(window.location.search);
        const slideOrdem = parseInt(urlParams.get("slide") || "1");
        setSelectedSlide(slideOrdem);

        const response = await fetch(`/api/apresentacoes/${params.id}/view`);
        if (response.status === 404) {
          throw new Error("Apresentação não encontrada ou não é pública");
        }

        if (!response.ok) {
          throw new Error("Falha ao carregar apresentação");
        }

        const data = await response.json();
        if (!data.sucesso || !data.apresentacao) {
          throw new Error(data.mensagem || "Falha ao carregar apresentação");
        }

        setApresentacao(data.apresentacao);

        // Ajusta o slide inicial baseado no parâmetro da URL
        if (data.apresentacao.slides) {
          const slideIndex = data.apresentacao.slides.findIndex(
            (s: Slide) => s.ordem === slideOrdem,
          );
          // Se encontrou o slide, abre o preview automaticamente
          if (slideIndex >= 0) {
            handlePreviewSlide(
              data.apresentacao.slides[slideIndex],
              slideOrdem,
            );
          }
        }

        // Registra a visualização
        await fetch(`/api/apresentacoes/${params.id}/visualizacao`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Erro ao carregar apresentação:", error);
        Swal.fire({
          icon: "error",
          title: "Erro!",
          text:
            error instanceof Error
              ? error.message
              : "Não foi possível carregar a apresentação",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  // Filtra apenas o slide selecionado, se houver
  const slidesToShow = React.useMemo(() => {
    if (!apresentacao?.slides) return [];
    if (!selectedSlide) return apresentacao.slides;

    return apresentacao.slides.filter((slide) => slide.ordem === selectedSlide);
  }, [apresentacao?.slides, selectedSlide]);

  // Botão para mostrar todos os slides
  const handleShowAllSlides = () => {
    setSelectedSlide(null);
    // Atualiza a URL sem recarregar a página
    window.history.pushState({}, "", `/view/${params.id}`);
  };

  const handleDownloadSlide = async (slide: Slide) => {
    try {
      // Cria um link para download da imagem base64
      const link = document.createElement("a");
      link.href = slide.imagem_base64;
      link.download = slide.nome_arquivo;
      link.click();

      await Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Slide baixado com sucesso!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Erro ao baixar slide:", error);
      await Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Não foi possível baixar o slide",
      });
    }
  };

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
      await navigator.clipboard.writeText(shareUrl);
      await Swal.fire({
        icon: "success",
        title: "Link copiado!",
        text: "O link da apresentação foi copiado para sua área de transferência",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handlePreviewSlide = (slide: Slide, ordem: number) => {
    Swal.fire({
      html: `
        <div class="relative h-[80vh] w-full">
          <img 
            src="${slide.imagem_base64}" 
            alt="Slide ${ordem}" 
            class="h-full w-full object-contain"
          />
        </div>
      `,
      width: "100%",
      padding: 0,
      showConfirmButton: false,
      showCloseButton: true,
      background: "#000",
      position: "center",
      customClass: {
        container: "backdrop-blur-sm",
        closeButton:
          "!text-white !outline-none hover:!text-gray-300 !p-4 !text-xl",
        popup: "!m-0 sm:!my-4 !rounded-none sm:!rounded-lg",
      },
      heightAuto: false,
      grow: "fullscreen",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!apresentacao) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <RiPresentationLine className="mb-4 h-16 w-16 text-gray-400" />
        <h1 className="text-xl font-bold text-gray-900">
          Apresentação não encontrada
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            {apresentacao.titulo}
          </h1>
          <p className="mt-2 text-gray-600">{apresentacao.descricao}</p>

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

        {/* Slides Grid Section */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Slides da Apresentação
                <span className="ml-2 text-sm text-gray-500">
                  {selectedSlide
                    ? `Slide ${selectedSlide} de ${apresentacao.slides.length}`
                    : `${apresentacao.slides.length} slides`}
                </span>
              </h2>
              {selectedSlide && (
                <p className="mt-2 text-sm text-gray-600">
                  Visualizando apenas o slide {selectedSlide}
                </p>
              )}
            </div>
            {selectedSlide && (
              <Button color="gray" size="sm" onClick={handleShowAllSlides}>
                Mostrar Todos os Slides
              </Button>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {slidesToShow.map((slide) => (
              <Card
                key={slide.id}
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                {/* Área da imagem com preview */}
                <div className="relative">
                  {/* Área clicável para preview apenas sobre a imagem */}
                  <div
                    className="absolute inset-0 z-10 cursor-pointer bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-10"
                    onClick={() => handlePreviewSlide(slide, slide.ordem)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="rounded-full bg-black bg-opacity-50 p-2 text-white">
                        Visualizar
                      </span>
                    </div>
                  </div>

                  {/* Imagem do slide */}
                  <div className="relative aspect-video w-full">
                    <Image
                      src={slide.imagem_base64}
                      alt={`Slide ${slide.ordem}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={true}
                    />
                  </div>
                </div>

                {/* Área de informações e botões - fora da área clicável do preview */}
                <div className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      Slide {slide.ordem}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {slide.nome_arquivo}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      color="blue"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownloadSlide(slide)}
                    >
                      <HiOutlineDownload className="mr-2 h-4 w-4" />
                      Baixar
                    </Button>
                    <Button
                      color="blue"
                      size="sm"
                      className="flex-1"
                      onClick={handleShare}
                    >
                      <HiOutlineShare className="mr-2 h-4 w-4" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
