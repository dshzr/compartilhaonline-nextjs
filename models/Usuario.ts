export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  papel: string;
  created_at?: Date;
  updated_at?: Date;
}
