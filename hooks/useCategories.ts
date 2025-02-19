import { useState, useEffect } from "react";

interface Categoria {
  id: number;
  nome: string;
}

export function useCategories() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("/api/categorias");
        if (!response.ok) {
          throw new Error("Falha ao carregar categorias");
        }

        const data = await response.json();
        if (data.sucesso) {
          setCategorias(data.categorias);
        } else {
          throw new Error(data.mensagem || "Erro ao carregar categorias");
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Erro ao carregar categorias",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, loading, error };
}
