# Tarefa 1: Setup e Configuração do Banco de Dados

**Objetivo:** Ter o ambiente rodando com o PostgreSQL + pgvector e configurar o Drizzle ORM para gerenciar o esquema.

## Passos:

- [ ] 1. Subir o container Docker do PostgreSQL com `pgvector` usando o comando: `docker-compose up -d`.
- [ ] 2. Copiar o arquivo `.env.example` e renomear para `.env` e adicionar sua chave de API do Gemini (`GEMINI_API_KEY`).
- [ ] 3. Gerar as migrações do Drizzle ORM baseadas no `src/db/schema.ts` executando o comando `npx drizzle-kit push` (forma mais simples).
- [ ] 4. Rodar a API NestJS usando `npm run start:dev`.
- [ ] 5. Conectar no banco via DBeaver, pgAdmin ou CLI (`psql -U admin -d vectordb`) e verificar se a tabela `documents` foi criada corretamente.

