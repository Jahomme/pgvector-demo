import { pgTable, serial, text, vector } from 'drizzle-orm/pg-core';

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  embedding: vector('embedding', { dimensions: 768 }), // O modelo de embedding do Gemini (text-embedding-004) geralmente usa 768 dimensões
});
