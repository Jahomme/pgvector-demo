import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { GoogleGenAI } from "@google/genai";
import { IngestDto } from "./dto/documents.dto";
import { DB_CONNECTION } from "../db/db.module";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";
import { cosineDistance, desc, sql } from "drizzle-orm";

@Injectable()
export class DocumentsService {
  private genAI: GoogleGenAI;

  constructor(
    @Inject(DB_CONNECTION)
    private readonly db: PostgresJsDatabase<typeof schema>,
  ) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new InternalServerErrorException(
        "GEMINI_API_KEY não foi encontrada no .env",
      );
    }

    this.genAI = new GoogleGenAI({ apiKey });
  }

  async ingest(body: IngestDto) {
    const { title, content } = body;
    if (!title || !content) {
      throw new Error("Título e conteúdo são obrigatórios");
    }
    const result = await this.genAI.models.embedContent({
      model: "gemini-embedding-2",
      contents: content,
      config: { outputDimensionality: 768 },
    });

    const embedding = result.embeddings[0].values;
    await this.db
      .insert(schema.documents)
      .values({ title, content, embedding });
    return { message: "Embedding inserido com sucesso!" };
  }

  async search(query: string) {
    if (!query) {
      throw new Error("Query é obrigatória");
    }

    const result = await this.genAI.models.embedContent({
      model: "gemini-embedding-2",
      contents: query,
      config: { outputDimensionality: 768 },
    });

    const queryEmbedding = result.embeddings[0].values;
    const similarity = sql<number>`1 - (${cosineDistance(schema.documents.embedding, queryEmbedding)})`;

    const documents = await this.db
      .select({
        id: schema.documents.id,
        title: schema.documents.title,
        content: schema.documents.content,
        similarity,
      })
      .from(schema.documents)
      .orderBy(desc(similarity))
      .limit(5);

    return documents;
  }
}
