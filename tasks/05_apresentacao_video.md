# Tarefa 5: Gravação do Vídeo de Apresentação

**Objetivo:** Gravar o vídeo (mínimo de 10 minutos) apresentando os conceitos e a demonstração prática.

## Roteiro Sugerido:

- [ ] **Parte 1 (Apresentação e Teoria - ~3 mins):**
  - Apresentar a equipe e o tema escolhido (`pgvector`).
  - Explicar o que são Bancos Vetoriais e embeddings.
- [ ] **Parte 2 (Arquitetura do Projeto - ~2 mins):**
  - Explicar a arquitetura REST escolhida: NestJS recebendo as requisições, chamando o Gemini para vetorização e usando Drizzle ORM para falar com o pgvector.
- [ ] **Parte 3 (Demonstração Prática - ~4 mins):**
  - Mostrar a API rodando no terminal.
  - Abrir o navegador no **Swagger UI** (`http://localhost:3000/api/docs`).
  - Mostrar a interface documentada das rotas e testar o `POST /api/documents` (Ingestão) direto na tela.
  - Abrir o DBeaver/pgAdmin e mostrar como o vetor numérico foi salvo na coluna `embedding`.
  - Voltar ao Swagger, testar o `POST /api/documents/search` fazendo uma pergunta contextual e mostrando a API retornando o documento mais similar através da métrica de Distância de Cosseno.
- [ ] **Parte 4 (Análise Crítica e Conclusão - ~1 min):**
  - Vantagens do pgvector (ACID, extensão de um banco maduro) vs desvantagens.
  - Fechamento.

## Dicas:
- Aumente bem a fonte (zoom) do navegador e do VSCode para que a banca consiga ler a interface do Swagger e as respostas no vídeo.
