# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm ci

# Atualizar browserslist
RUN npx update-browserslist-db@latest

# Copiar todo o código fonte, incluindo os tipos
COPY . .

# Criar diretório de tipos se não existir
RUN mkdir -p types

# Configurar ambiente
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Instalar dependências específicas e seus tipos
RUN npm install --save browser-image-compression
RUN npm install --save-dev @types/qrcode

# Build ignorando warnings
RUN npm run build -- --no-lint

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copiar arquivos necessários
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/types ./types

# Instalar apenas dependências de produção
RUN npm ci --only=production
RUN npm install --save browser-image-compression qrcode

# Configurar ambiente
ENV NODE_ENV=production
EXPOSE ${PORT:-3000}

CMD ["npm", "start"] 