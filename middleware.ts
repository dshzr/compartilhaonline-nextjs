import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Cache para recursos estáticos
  if (request.nextUrl.pathname.startsWith('/api/apresentacoes')) {
    response.headers.set('Cache-Control', 'public, max-age=3600');
  }

  return response;
} 