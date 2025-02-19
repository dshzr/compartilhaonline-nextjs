export interface Apresentacao {
  id: number;
  id_usuario: number;
  titulo: string;
  descricao?: string;
  local: string;
  categoria: string;
  subcategoria?: string;
  data_evento: string | null;
  arquivo_base64?: string;
  qr_code_base64: string | null;
  publica: boolean;
  visualizacoes: number;
  created_at: string;
  updated_at?: Date;
  nome_arquivo?: string;
}
