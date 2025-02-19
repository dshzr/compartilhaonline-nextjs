import jwt from 'jsonwebtoken';
import db from '@/db';

interface TokenPayload {
  id: number;
  email: string;
}

export async function verificarToken(token: string) {
  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    // Busca o usuário no banco de dados
    const usuario = await db('usuarios')
      .where({ id: decoded.id })
      .first();

    if (!usuario) {
      return null;
    }

    // Remove a senha antes de retornar
    const { senha: _, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
  } catch (erro) {
    console.error('Erro ao verificar token:', erro);
    return null;
  }
}

export function gerarToken(usuario: { id: number; email: string }) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  );
}

export function gerarRefreshToken(usuario: { id: number; email: string }) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );
} 