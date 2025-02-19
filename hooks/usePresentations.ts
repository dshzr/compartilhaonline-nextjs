import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Apresentacao } from "@/models/Apresentacao";
import type { Slide } from "@/models/Slide";

// Estendendo a interface Apresentacao para incluir slides
interface Presentation extends Apresentacao {
  slides: Slide[];
  data_evento: string | null;
  created_at: string;
}

export function usePresentations() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPresentations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setPresentations([]);
        return;
      }

      setLoading(true);
      const response = await fetch("/api/apresentacoes/minhas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store", // Desabilita cache
      });

      if (!response.ok) {
        setPresentations([]);
        throw new Error("Falha ao buscar apresentações");
      }

      const data = await response.json();
      console.log("Dados recebidos da API:", data); // Debug

      if (data.sucesso && Array.isArray(data.apresentacoes)) {
        setPresentations(data.apresentacoes);
      } else {
        setPresentations([]);
      }
    } catch (error) {
      console.error("Erro ao buscar apresentações:", error);
      setPresentations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPresentation = async (formData: FormData) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await fetch("/api/apresentacoes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha ao criar apresentação");
      }

      // Atualiza a lista após criar
      await fetchPresentations();
      return true;
    } catch (error) {
      console.error("Erro ao criar apresentação:", error);
      return false;
    }
  };

  const deletePresentation = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await fetch(`/api/apresentacoes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir apresentação");
      }

      // Atualiza a lista após excluir
      await fetchPresentations();
      return true;
    } catch (error) {
      console.error("Erro ao excluir apresentação:", error);
      return false;
    }
  };

  return {
    presentations,
    loading,
    fetchPresentations,
    createPresentation,
    deletePresentation,
  };
}
