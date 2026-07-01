import {
  pgTable,
  serial,
  text,
  vector,
  index,
  customType,
} from "drizzle-orm/pg-core";
const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

export const documents = pgTable(
  "documents",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 768 }),
    searchVector: tsvector("search_vector"),
  },
  (table) => [
    index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
    index("searchVectorIndex").using("gin", table.searchVector),
  ],
);
