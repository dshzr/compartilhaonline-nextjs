#!/bin/sh

# Aguarda o banco de dados estar pronto
echo "Aguardando o banco de dados..."
until nc -z db 5432; do
  sleep 1
done
echo "Banco de dados pronto!"

# Executa as migrações
echo "Executando migrações..."
npm run migrate

# Inicia a aplicação
echo "Iniciando a aplicação..."
exec "$@" 