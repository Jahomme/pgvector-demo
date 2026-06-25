# Tarefa 4: Escrita do Relatório Técnico

**Objetivo:** Redigir o documento em PDF (Mínimo de 1.500 palavras) exigido pela disciplina.

## Estrutura Sugerida e Passos:

- [ ] **1. Capa:** Nome(s), matrícula(s) e tema (ex: "pgvector: O PostgreSQL como Banco de Dados Vetorial para IA Generativa").
- [ ] **2. Introdução:** 
  - Explicar o que são embeddings.
  - Motivação para usar bancos vetoriais em aplicações modernas com LLMs (RAG - Retrieval-Augmented Generation).
- [ ] **3. Fundamentação Técnica:**
  - O que é o `pgvector`? Como ele estende o PostgreSQL?
  - Explicar os tipos de distâncias suportados (L2, Cosseno, Produto Interno).
  - Explicar os tipos de índices (IVFFlat vs HNSW).
- [ ] **4. Demonstração Prática:**
  - Inserir trechos de código importantes de `schema.ts`, `ingest.ts` e `search.ts`.
  - Tirar prints do terminal rodando a inserção e a busca.
  - Tirar prints do banco de dados (DBeaver/pgAdmin) mostrando a coluna do tipo `vector`.
- [ ] **5. Análise Crítica:**
  - Por que usar `pgvector` em vez de um banco NoSQL dedicado (como Pinecone ou Milvus)? (R: Aproveitar infraestrutura SQL existente, transações ACID, joins com dados relacionais).
  - Quais as limitações? (R: Performance em escalas massivas pode requerer ferramentas dedicadas).
- [ ] **6. Conclusão e Referências:** Sintetizar aprendizados e citar repositório do pgvector e documentação do Drizzle/Postgres.

**Revisão:**
- [ ] O relatório tem 1.500 palavras?
- [ ] A formatação está adequada e visualmente atrativa?
- [ ] Salvar em formato PDF.
