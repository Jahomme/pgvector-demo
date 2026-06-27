"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documents = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.documents = (0, pg_core_1.pgTable)("documents", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    embedding: (0, pg_core_1.vector)("embedding", { dimensions: 768 }),
}, (table) => [
    (0, pg_core_1.index)("embeddingIndex").using("hnsw", table.embedding.op("vector_cosine_ops")),
]);
//# sourceMappingURL=schema.js.map