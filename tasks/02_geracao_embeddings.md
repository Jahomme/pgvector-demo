# Tarefa 2: Geração de Embeddings e Inserção de Dados

**Objetivo:** Implementar o método `ingest` no serviço do NestJS para consumir a API do Gemini, gerar *embeddings* (vetores numéricos) a partir de um texto e salvar esse texto + vetor no banco de dados.

## Passos para Implementação:

- [ ] 1. Abra o arquivo `src/documents/documents.service.ts` e localize o método `ingest`.
- [ ] 2. **Gerar o Embedding:** Utilize a API do Gemini (`this.genAI`) para gerar o embedding do parâmetro `content` (geralmente geramos o vetor da descrição maior, não apenas do título).
  *Dica:* Busque na documentação do SDK como usar `getGenerativeModel({ model: 'text-embedding-004' })` e depois o método `embedContent(text)`.
- [ ] 3. **Inserir no Banco:** Utilize a instância do banco `db` e o schema `documents` para fazer um `insert`.
  *Dica:* Você precisará passar o `title`, o `content` e o array de números gerado pelo Gemini para a coluna `embedding`.
- [ ] 4. Retorne algo indicando sucesso, como `{ success: true }` ou o ID do documento inserido.

## Como Testar:
- [ ] Com a API rodando (`npm run start:dev`), abra o navegador e acesse **http://localhost:3000/api/docs**.
- [ ] O Swagger UI estará rodando! Abra a rota `POST /api/documents` e clique em **Try it out**.
- [ ] No campo Request body, modifique o JSON com seu texto de teste e clique em **Execute**.
- [ ] Verifique no seu DBeaver/pgAdmin se uma nova linha foi criada na tabela `documents` com o vetor preenchido!

**Por que isso é importante?**
Isso compõe a parte de "Inserção e modelagem de dados" da sua **Demonstração Prática**. Mostrar o código que vocês mesmos escreveram fazendo a IA interagir com o banco tem muito valor acadêmico.
