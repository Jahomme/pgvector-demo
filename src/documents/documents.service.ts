import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotImplementedException,
} from "@nestjs/common";
import { db } from "../db";
import { documents } from "../db/schema";
import { GoogleGenAI } from "@google/genai";
import { IngestDto } from "./dto/documents.dto";
import { DB_CONNECTION } from "../db/db.module";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "../db/schema";
// import { cosineDistance, desc, sql } from 'drizzle-orm';

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

    // TODO: Implementar a lógica de conversão da query em embedding e a busca por similaridade
    // Siga as instruções no arquivo tasks/03_busca_vetorial.md

    throw new NotImplementedException(
      "A busca ainda não foi implementada pela dupla!",
    );
  }
}
