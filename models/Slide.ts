export interface Slide {
  id: number;
  id_apresentacao: number;
  ordem: number;
  imagem_base64: string;
  nome_arquivo: string;
  created_at?: Date;
  updated_at?: Date;
}
