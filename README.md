# Compartilha Online

Plataforma para compartilhamento de apresentações PowerPoint.

## Executando com Docker

1. Clone o repositório
2. Copie o arquivo de ambiente:
   ```bash
   cp .env.example .env
   ```
3. Configure as variáveis no `.env`
4. Execute com Docker Compose:
   ```bash
   docker-compose up -d
   ```
5. Execute as migrações:
   ```bash
   docker-compose exec app npm run migrate
   ```

A aplicação estará disponível em http://localhost:3000

## Desenvolvimento local

Se preferir rodar sem Docker:

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o banco de dados PostgreSQL
3. Configure as variáveis de ambiente
4. Execute as migrações:
   ```bash
   npm run migrate
   ```
5. Inicie o servidor:
   ```bash
   npm run dev
   ```

## Tecnologias

- Next.js 13
- TypeScript
- Tailwind CSS
- Flowbite React
- PostgreSQL
- Knex.js
- Docker

## Funcionalidades

- Upload e conversão de apresentações PowerPoint
- Compartilhamento público/privado
- Visualização de slides
- Sistema de categorias
- Busca avançada
- Estatísticas de visualização
- QR Code para compartilhamento

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
