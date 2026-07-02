# pgvector-demo (Banco de Dados NoSQL)

Este repositório contém a demonstração prática de integração entre o **PostgreSQL (com a extensão pgvector)**, **Drizzle ORM** e a IA Generativa do **Google Gemini**, estruturados através de uma API REST usando **NestJS**.

O objetivo deste projeto é demonstrar como implementar uma Busca Semântica (Vector Search) baseada em cálculo de distância de cosseno para o trabalho da disciplina de Bancos de Dados NoSQL.

## Pré-requisitos
- [Node.js](https://nodejs.org/en/) (v18 ou superior recomendado)
- [Docker](https://www.docker.com/) e Docker Compose instalados

---

## 🚀 Passo a Passo para Subir a Aplicação

### 1. Clonar e Instalar Dependências
Abra o terminal na pasta raiz do projeto e instale as bibliotecas:
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Na raiz do projeto, renomeie o arquivo `.env.example` para `.env` (ou crie um novo arquivo `.env` baseado nele). Adicione a sua chave de API do Google Gemini:
```env
DATABASE_URL=postgresql://admin:password@localhost:5432/vectordb
GEMINI_API_KEY=sua_chave_do_gemini_aqui
```

### 3. Subir o Banco de Dados (PostgreSQL + pgvector)
Inicie o banco de dados via Docker. Isso fará o download da imagem já configurada com o pgvector e deixará o banco rodando em background (porta 5432):
```bash
docker-compose up -d
```

### 4. Criar as Tabelas no Banco (Sincronização)
Use o Drizzle ORM para empurrar a estrutura de tabelas (Schema) para o banco de dados que acabou de subir:
```bash
npx drizzle-kit push
```

### 5. Popular o Banco com Dados de Teste (Seed)
Rode o script de seed para limpar e popular o banco automaticamente com itens de exemplo (celulares, notebooks, fone bluetooth, etc.) e já gerar os respectivos embeddings deles através da API do Gemini:
```bash
npm run db:seed
```

### 6. Iniciar a API NestJS
Por fim, inicie o servidor da API em modo de desenvolvimento:
```bash
npm run start:dev
```

---

## 🧪 Como Testar a API
Com a aplicação rodando, não é necessário usar Postman ou Insomnia. Basta abrir o seu navegador e acessar o **Swagger UI**:

👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

Lá você encontrará a interface interativa com a documentação para testar as rotas de Ingestão (`POST /api/documents`) e de Busca Vetorial (`POST /api/documents/search`).
