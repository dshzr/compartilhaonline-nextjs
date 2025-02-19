"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button, Card, TextInput } from "flowbite-react";
import Link from "next/link";
import {
  HiSearch,
  HiOutlineEye,
  HiOutlineLocationMarker,
  HiOutlineUser,
  HiOutlineCalendar,
} from "react-icons/hi";
import { RiPresentationLine } from "react-icons/ri";
import CategoryFilter from "@/components/CategoryFilter";
import { useCategories } from "@/hooks/useCategories";

interface Apresentacao {
  id: number;
  titulo: string;
  descricao: string | null;
  local: string;
  categoria: string;
  data_evento: string | null;
  autor_nome: string;
  visualizacoes: number;
  publica: boolean;
}

export default function ExplorePage() {
  const [apresentacoes, setApresentacoes] = useState<Apresentacao[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const { categorias, loading: loadingCategorias } = useCategories();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Função para buscar apresentações com filtros
  const fetchApresentacoes = useCallback(async (search?: string, category?: string) => {
    try {
      if (search) {
        setSearchMessage(`Buscando apresentações com: "${search}"`);
      } else {
        setSearchMessage("");
      }

      // Constrói a URL com os parâmetros de busca
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      
      const response = await fetch(`/api/apresentacoes/publicas?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Falha ao buscar apresentações");
      }

      const data = await response.json();
      
      if (data.sucesso) {
        setApresentacoes(data.apresentacoes);
        // Atualiza a mensagem com o número de resultados
        if (search) {
          setSearchMessage(`${data.apresentacoes.length} resultado${data.apresentacoes.length !== 1 ? 's' : ''} para: "${search}"`);
        }
      } else {
        setApresentacoes([]);
        if (search) {
          setSearchMessage(`Nenhum resultado para: "${search}"`);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar apresentações:", error);
      setApresentacoes([]);
      setSearchMessage("Erro ao buscar apresentações");
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, []);

  // Efeito para buscar apresentações iniciais
  useEffect(() => {
    fetchApresentacoes();
  }, [fetchApresentacoes]);

  // Debounce para a pesquisa
  useEffect(() => {
    // Não inicia a pesquisa se o termo estiver vazio
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setSearchMessage("");
      fetchApresentacoes(undefined, selectedCategory || undefined); // Busca todas as apresentações
      return;
    }

    setIsSearching(true);
    
    const timer = setTimeout(() => {
      fetchApresentacoes(searchTerm, selectedCategory || undefined);
      setIsSearching(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [searchTerm, selectedCategory, fetchApresentacoes]);

  // Handler para mudança de categoria
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    // Se tiver termo de busca, inclui na pesquisa
    fetchApresentacoes(searchTerm.trim() || undefined, category || undefined);
  };

  // Verificar se o usuário está logado
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  console.log("Total de apresentações:", apresentacoes.length);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="flex items-center space-x-2 shrink-0">
              <RiPresentationLine className="text-2xl sm:text-3xl text-blue-600" />
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                Compartilha Online
              </span>
            </Link>
            
            <div className="flex-1 w-full sm:max-w-2xl">
              <div className="relative">
                <HiSearch className={`absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 ${
                  isSearching ? 'text-blue-500 animate-pulse' : 'text-gray-400'
                }`} />
                <TextInput
                  type="search"
                  placeholder={isSearching ? "Pesquisando..." : "Buscar apresentações..."}
                  className="pl-10 w-full"
                  sizing="md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="shrink-0">
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button color="blue" size="sm" className="w-full sm:w-auto">
                    <RiPresentationLine className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button color="blue" size="sm" className="w-full sm:w-auto">
                    Entrar
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            Apresentações Públicas
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Explore apresentações compartilhadas pela comunidade
          </p>
          {searchMessage && (
            <p className="mt-3 sm:mt-4 text-sm text-gray-600 animate-fade-in">
              {searchMessage}
            </p>
          )}
        </div>

        <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
          <div className="min-w-max sm:min-w-0">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              categories={categorias}
              loading={loadingCategorias}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {apresentacoes.map((apresentacao) => {
            console.log("Renderizando apresentação:", apresentacao.id);
            return (
              <Card 
                key={apresentacao.id}
                className="hover:shadow-lg transition-all duration-300 h-full"
              >
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full mb-2">
                      {apresentacao.categoria}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                      {apresentacao.titulo}
                    </h3>
                    
                    <div className="space-y-3 text-sm text-gray-500">
                      <div className="flex items-start gap-2">
                        <HiOutlineUser className="h-4 w-4 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{apresentacao.autor_nome}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <HiOutlineLocationMarker className="h-4 w-4 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{apresentacao.local}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <HiOutlineCalendar className="h-4 w-4 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">
                          {apresentacao.data_evento
                            ? new Date(apresentacao.data_evento).toLocaleDateString("pt-BR")
                            : "Data não definida"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <HiOutlineEye className="h-4 w-4 mr-1" />
                      <span>{apresentacao.visualizacoes} visualizações</span>
                    </div>
                    <Link href={`/view/${apresentacao.id}`}>
                      <Button size="sm" color="blue" className="whitespace-nowrap">
                        Ver Apresentação
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {!loading && apresentacoes.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md mx-auto">
              <RiPresentationLine className="mx-auto h-10 sm:h-12 w-10 sm:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">
                {selectedCategory
                  ? "Nenhuma apresentação encontrada nesta categoria"
                  : "Nenhuma apresentação pública disponível"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {selectedCategory
                  ? "Tente selecionar outra categoria"
                  : "As apresentações aparecerão aqui quando forem compartilhadas"}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
