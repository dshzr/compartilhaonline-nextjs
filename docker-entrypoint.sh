#!/bin/sh

# Instala ferramentas de rede
apk add --no-cache netcat-openbsd iputils

# Aguarda o banco de dados estar pronto
echo "Aguardando o banco de dados..."
until ping -c 1 db > /dev/null 2>&1; do
  echo "Aguardando DNS resolver db... (tentando novamente em 5s)"
  sleep 5
done

until nc -z db 5432; do
  echo "Aguardando porta do banco de dados... (tentando novamente em 5s)"
  sleep 5
done

echo "Banco de dados pronto!"

# Tenta executar as migrações
echo "Executando migrações..."
npm run migrate

# Verifica a conexão com o banco
echo "Verificando conexão com o banco..."
node -e "require('./utils/db-check.js').checkDatabaseConnection().then(ok => !ok && process.exit(1))"

if [ $? -ne 0 ]; then
  echo "❌ Falha ao conectar com o banco de dados"
  exit 1
fi

echo "✅ Conexão com o banco estabelecida"

# Inicia a aplicação
echo "Iniciando a aplicação..."
exec "$@" 