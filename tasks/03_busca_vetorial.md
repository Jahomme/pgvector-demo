# Tarefa 3: Busca Vetorial (Vector Search) via API

**Objetivo:** Implementar a lógica principal do trabalho: a busca semântica! Vocês devem calcular a distância de cosseno entre a pergunta do usuário e os vetores armazenados no banco.

## Passos para Implementação:

- [ ] 1. Abra o arquivo `src/documents/documents.service.ts` e localize o método `search`.
- [ ] 2. **Vetorizar a Pergunta:** Assim como na ingestão, use o `this.genAI` para gerar o embedding da string `query` que chegou no método.
- [ ] 3. **Fazer a Busca no Banco:** Descomente o import `import { cosineDistance, desc, sql } from 'drizzle-orm';` no topo do arquivo. Use essas funções do Drizzle para construir uma query `select`.
  *Dica:* O pgvector e o Drizzle permitem que você calcule a distância assim: `cosineDistance(documents.embedding, queryEmbedding)`. 
  *Dica 2:* Você pode calcular o "grau de similaridade" fazendo `1 - distância`.
- [ ] 4. **Ordenar e Limitar:** Na sua query do banco, não esqueça de usar o `.orderBy()` para trazer os itens com **maior similaridade** (ou menor distância) primeiro, e o `.limit(3)` para trazer apenas o top 3.
- [ ] 5. Retorne a lista de resultados da sua query.

## Como Testar:
- [ ] Abra o navegador e acesse **http://localhost:3000/api/docs**.
- [ ] Expanda a rota `POST /api/documents/search` e clique em **Try it out**.
- [ ] No campo Request body, modifique o JSON com uma pergunta e clique em **Execute**:
```json
{
  "query": "Quero um celular bom para tirar fotos, qual você recomenda?"
}
```
- [ ] A API deve retornar os textos que você inseriu na Tarefa 2, ordenados do mais semelhante para o menos semelhante!

**Por que isso é importante?**
Essa será a principal demonstração (Execução de consultas complexas) a ser gravada no vídeo do trabalho. Explicar como vocês montaram a query calculando a distância de cosseno vai garantir a pontuação máxima no critério "Demonstração Prática" e "Domínio do Tema".
