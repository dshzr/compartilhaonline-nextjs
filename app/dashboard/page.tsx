"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Modal,
  Label,
  TextInput,
  Select,
  FileInput,
} from "flowbite-react";
import CategoryFilter from "@/components/CategoryFilter";
import Link from "next/link";
import {
  HiOutlineLogout,
  HiPlus,
  HiTrash,
  HiOutlineEye,
  HiOutlineLocationMarker,
  HiOutlineUser,
  HiOutlineCalendar,
} from "react-icons/hi";
import { RiPresentationLine } from "react-icons/ri";
import { FaRegHandPaper } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useCategories } from "@/hooks/useCategories";
import { usePresentations } from "@/hooks/usePresentations";

interface NewPresentation {
  titulo: string;
  local: string;
  categoria: string;
  data_evento: string;
  file: File | null;
  publica: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNewPresentationModal, setShowNewPresentationModal] =
    useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPresentation, setNewPresentation] = useState<NewPresentation>({
    titulo: "",
    local: "",
    categoria: "",
    data_evento: "",
    file: null,
    publica: true,
  });
  const { categorias, loading: loadingCategorias } = useCategories();
  const {
    presentations,
    loading,
    fetchPresentations,
    createPresentation,
    deletePresentation,
  } = usePresentations();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    router.push("/login");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Check file extension
      const extension = file.name.split(".").pop()?.toLowerCase();
      const validExtensions = ["ppt", "pptx"];

      if (!validExtensions.includes(extension || "")) {
        alert(
          "Por favor, selecione apenas arquivos PowerPoint (.ppt ou .pptx)",
        );
        e.target.value = ""; // Clear the input
        return;
      }

      // Check file size (max 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB in bytes
      if (file.size > maxSize) {
        alert("O arquivo é muito grande. O tamanho máximo é 100MB.");
        e.target.value = ""; // Clear the input
        return;
      }

      setNewPresentation((prev) => ({ ...prev, file }));
    }
  };

  const handleCreatePresentation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Mostrar loading com SweetAlert2
      Swal.fire({
        title: "Enviando apresentação...",
        html: "Por favor, aguarde enquanto processamos sua apresentação.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Validar arquivo
      if (!newPresentation.file) {
        throw new Error("Por favor, selecione um arquivo PowerPoint");
      }

      const formData = new FormData();
      formData.append("titulo", newPresentation.titulo);
      formData.append("local", newPresentation.local);
      formData.append("categoria", newPresentation.categoria);
      formData.append("data_evento", newPresentation.data_evento);
      formData.append("publica", String(newPresentation.publica));
      formData.append("id_usuario", String(user.id));
      formData.append("file", newPresentation.file!);

      console.log("Enviando dados:", {
        titulo: newPresentation.titulo,
        local: newPresentation.local,
        categoria: newPresentation.categoria,
        data_evento: newPresentation.data_evento,
        publica: newPresentation.publica,
        id_usuario: user.id,
        fileName: newPresentation.file.name,
      });

      const success = await createPresentation(formData);

      if (success) {
        setNewPresentation({
          titulo: "",
          local: "",
          categoria: "",
          data_evento: "",
          file: null,
          publica: true,
        });

        setShowNewPresentationModal(false);
        await Swal.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Apresentação criada com sucesso!",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error("Falha ao criar apresentação");
      }
    } catch (error) {
      console.error("Erro ao criar apresentação:", error);

      await Swal.fire({
        icon: "error",
        title: "Erro!",
        text:
          error instanceof Error
            ? error.message
            : "Erro ao criar apresentação. Por favor, tente novamente.",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setIsSubmitting(false);
      Swal.close();
    }
  };

  const handleDeletePresentation = async (id: number) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: "Tem certeza?",
        text: "A apresentação e todos os seus slides serão excluídos permanentemente!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sim, excluir tudo!",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      });

      if (!isConfirmed) return;

      Swal.fire({
        title: "Excluindo...",
        html: "Removendo apresentação e slides",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const success = await deletePresentation(id);

      if (success) {
        await Swal.fire({
          icon: "success",
          title: "Excluído!",
          text: "A apresentação e todos os seus slides foram removidos com sucesso.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error("Falha ao excluir apresentação");
      }
    } catch (error) {
      console.error("Erro ao excluir apresentação:", error);

      await Swal.fire({
        icon: "error",
        title: "Erro!",
        text:
          error instanceof Error
            ? error.message
            : "Erro ao excluir apresentação. Tente novamente.",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  // Primeiro useEffect para buscar dados do usuário
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Falha ao buscar dados do usuário");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  // Segundo useEffect para buscar apresentações quando tiver usuário
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        await fetchPresentations();
      } catch (error) {
        console.error("Erro ao buscar apresentações:", error);
      }
    };

    fetchData();
  }, [user, fetchPresentations]);

  // useEffect para debug
  useEffect(() => {
    console.log("Estado atual:", {
      presentations,
      user,
      selectedCategory,
    });
  }, [presentations, user, selectedCategory]);

  // Antes de renderizar, vamos garantir que presentations é um array
  const filteredPresentations = React.useMemo(() => {
    if (!presentations || !Array.isArray(presentations)) {
      console.log("Presentations não é um array:", presentations); // Debug
      return [];
    }

    return presentations.filter((presentation) => {
      if (!presentation || !presentation.id_usuario || !user) {
        console.log("Apresentação inválida:", presentation); // Debug
        return false;
      }

      // Garante que só mostra apresentações do usuário atual
      const isOwner = presentation.id_usuario === user.id;
      const matchesCategory =
        !selectedCategory || presentation.categoria === selectedCategory;

      return isOwner && matchesCategory;
    });
  }, [presentations, selectedCategory, user]);

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <RiPresentationLine className="text-2xl text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Compartilha Online
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <FaRegHandPaper className="animate-wave text-xl text-blue-600" />
              <span className="text-gray-700">Olá, {user.nome}!</span>
            </div>
            <Button color="gray" pill size="sm" onClick={handleLogout}>
              <HiOutlineLogout className="mr-2 h-5 w-5" />
              Sair
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Minhas Apresentações
              </h1>
              <p className="mt-1 text-gray-600">
                Gerencie suas apresentações compartilhadas
              </p>
            </div>
            <Button
              color="blue"
              size="lg"
              className="flex items-center gap-2"
              onClick={() => setShowNewPresentationModal(true)}
            >
              <HiPlus className="h-5 w-5" />
              Nova Apresentação
            </Button>
          </div>

          <div className="mt-6">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categorias}
              loading={loadingCategorias}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPresentations.map((presentation) => (
              <Card
                key={presentation.id}
                className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-full flex-col">
                  <div className="flex-grow">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">
                        {presentation.titulo}
                      </h3>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                        {presentation.publica ? "Público" : "Privado"}
                      </span>
                    </div>
                    <div className="space-y-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <HiOutlineLocationMarker className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">{presentation.local}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiOutlineCalendar className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">
                          {presentation.data_evento
                            ? new Date(
                                presentation.data_evento,
                              ).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })
                            : "Data não definida"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiOutlineEye className="h-5 w-5 text-blue-500" />
                        <span className="text-sm">
                          {presentation.visualizacoes} visualizações
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex gap-2">
                      <Button
                        color="red"
                        size="sm"
                        pill
                        onClick={() =>
                          handleDeletePresentation(presentation.id)
                        }
                      >
                        <HiTrash className="h-4 w-4" />
                      </Button>
                      <Button
                        color="blue"
                        size="sm"
                        pill
                        onClick={() =>
                          router.push(`/presentation/${presentation.id}`)
                        }
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-xs text-gray-500">
                      Criado em:{" "}
                      {presentation.created_at
                        ? new Date(presentation.created_at).toLocaleDateString(
                            "pt-BR",
                          )
                        : "Data não disponível"}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Estado vazio */}
        {!loading && filteredPresentations.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-200 bg-white py-16 text-center">
            <RiPresentationLine className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Sem apresentações
            </h3>
            <p className="mt-2 text-gray-500">
              Comece sua jornada criando sua primeira apresentação.
            </p>
            <div className="mt-8">
              <Button
                color="blue"
                size="lg"
                className="mx-auto flex items-center gap-2"
                onClick={() => setShowNewPresentationModal(true)}
              >
                <HiPlus className="h-5 w-5" />
                Nova Apresentação
              </Button>
            </div>
          </div>
        )}

        {/* New Presentation Modal */}
        <Modal
          show={showNewPresentationModal}
          onClose={() => setShowNewPresentationModal(false)}
          size="lg"
        >
          <Modal.Header>Nova Apresentação</Modal.Header>
          <Modal.Body>
            <form
              id="new-presentation-form"
              onSubmit={handleCreatePresentation}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="titulo">Título da Apresentação</Label>
                <TextInput
                  id="titulo"
                  required
                  placeholder="Digite o título"
                  value={newPresentation.titulo}
                  onChange={(e) =>
                    setNewPresentation({
                      ...newPresentation,
                      titulo: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="local">Local do Evento</Label>
                  <TextInput
                    id="local"
                    required
                    placeholder="Digite o local"
                    value={newPresentation.local}
                    onChange={(e) =>
                      setNewPresentation({
                        ...newPresentation,
                        local: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="data_evento">Data do Evento</Label>
                  <TextInput
                    id="data_evento"
                    type="date"
                    required
                    value={newPresentation.data_evento}
                    onChange={(e) =>
                      setNewPresentation({
                        ...newPresentation,
                        data_evento: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  id="categoria"
                  required
                  value={newPresentation.categoria}
                  onChange={(e) =>
                    setNewPresentation({
                      ...newPresentation,
                      categoria: e.target.value,
                    })
                  }
                >
                  <option value="">Selecione uma categoria</option>
                  {loadingCategorias ? (
                    <option disabled>Carregando categorias...</option>
                  ) : (
                    categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.nome}>
                        {categoria.nome}
                      </option>
                    ))
                  )}
                </Select>
              </div>

              <div>
                <Label htmlFor="publica" className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="publica"
                    checked={newPresentation.publica}
                    onChange={(e) =>
                      setNewPresentation({
                        ...newPresentation,
                        publica: e.target.checked,
                      })
                    }
                  />
                  <span>Tornar apresentação pública</span>
                </Label>
              </div>

              <div>
                <Label
                  htmlFor="presentation-file"
                  className="flex flex-col gap-1"
                >
                  <span>Arquivo da Apresentação</span>
                  <span className="text-sm text-gray-500">
                    Aceita apenas arquivos PowerPoint (.ppt, .pptx)
                  </span>
                </Label>
                <FileInput
                  id="presentation-file"
                  required
                  accept=".ppt,.pptx"
                  onChange={handleFileChange}
                  helperText="Tamanho máximo: 100MB"
                  sizing="md"
                  className="mt-1"
                />
                {newPresentation.file && (
                  <p className="mt-2 text-sm text-green-600">
                    Arquivo selecionado: {newPresentation.file.name}
                  </p>
                )}
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex w-full justify-end gap-2">
              <Button
                color="gray"
                onClick={() => setShowNewPresentationModal(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                color="blue"
                type="submit"
                form="new-presentation-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Criando...
                  </>
                ) : (
                  "Criar Apresentação"
                )}
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </main>
    </div>
  );
}
